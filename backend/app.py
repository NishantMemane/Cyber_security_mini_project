from __future__ import annotations

from collections import deque
from collections.abc import Mapping
from time import monotonic
from typing import Any

from flask import Flask, abort, current_app, jsonify, request, url_for
from flask_cors import CORS
from werkzeug.exceptions import BadRequest, HTTPException

import sys
from pathlib import Path

# Add the parent directory to sys.path so we can import from the database folder
sys.path.append(str(Path(__file__).resolve().parent.parent))

from database.database import (
    add_comment,
    get_post as db_get_post,
    init_app as init_database,
    list_comments,
    list_posts,
)


MAX_NAME_LENGTH = 80
MAX_COMMENT_LENGTH = 5_000


def create_app(test_config: dict[str, Any] | None = None) -> Flask:
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])
    app.config.from_mapping(
        COMMENT_RATE_LIMIT=30,
        COMMENT_RATE_WINDOW_SECONDS=60,
    )
    app.json.sort_keys = False

    if test_config:
        app.config.update(test_config)

    init_database(app)
    comment_rate_buckets: dict[str, deque[float]] = {}

    @app.errorhandler(HTTPException)
    def handle_http_exception(error: HTTPException):
        return jsonify(
            error=error.name,
            message=error.description,
            status_code=error.code,
        ), error.code

    @app.get("/health")
    def health():
        return jsonify(status="ok")

    @app.get("/")
    def index():
        posts = [serialize_post(post) for post in list_posts()]
        return jsonify(count=len(posts), posts=posts)

    @app.get("/post/<int:post_id>")
    def vulnerable_post(post_id: int):
        post = require_post(post_id)
        comments = [
            serialize_comment(comment)
            for comment in list_comments(post_id, is_secure=False)
        ]
        return jsonify(
            mode="vulnerable",
            post=serialize_post(post),
            comments=comments,
            security_note=(
                "Comments in this mode are stored raw. A browser client would "
                "be vulnerable if it injected these values into HTML without "
                "output encoding."
            ),
        )

    @app.post("/post/<int:post_id>")
    def create_vulnerable_comment(post_id: int):
        require_post(post_id)
        name, comment = read_comment_payload()
        enforce_comment_rate_limit(comment_rate_buckets)
        created_comment = add_comment(
            post_id,
            name=name,
            comment=comment,
            is_secure=False,
        )
        return created_response(
            created_comment,
            mode="vulnerable",
            location=url_for("vulnerable_post", post_id=post_id),
        )

    @app.get("/secure/post/<int:post_id>")
    def secure_post(post_id: int):
        post = require_post(post_id)
        comments = [
            serialize_comment(comment)
            for comment in list_comments(post_id, is_secure=True)
        ]
        return jsonify(
            mode="secure",
            post=serialize_post(post),
            comments=comments,
            security_note=(
                "Comments in this mode are stored raw. HTML clients must "
                "output-encode these values at render time."
            ),
        )

    @app.post("/secure/post/<int:post_id>")
    def create_secure_comment(post_id: int):
        require_post(post_id)
        name, comment = read_comment_payload()
        enforce_comment_rate_limit(comment_rate_buckets)
        created_comment = add_comment(
            post_id,
            name=name,
            comment=comment,
            is_secure=True,
        )
        return created_response(
            created_comment,
            mode="secure",
            location=url_for("secure_post", post_id=post_id),
        )

    @app.get("/attack-explained")
    def attack_explained():
        return jsonify(
            title="Stored XSS Demo",
            summary=(
                "Stored cross-site scripting happens when untrusted input is "
                "saved and later rendered as executable HTML or JavaScript for "
                "other visitors."
            ),
            vulnerable_flow=[
                "POST /post/<id> stores name and comment exactly as submitted.",
                "GET /post/<id> returns the raw comment data for vulnerable rendering.",
                "A browser template that marks that value safe would execute script tags.",
            ],
            secure_flow=[
                "POST /secure/post/<id> validates the payload and stores raw user intent.",
                "HTML clients must output-encode the returned text before inserting it into the DOM.",
                "The vulnerable and secure comment sets are isolated by the is_secure flag.",
            ],
            safe_demo_payload='<script>alert("XSS Attack!")</script>',
        )

    return app


def require_post(post_id: int):
    post = db_get_post(post_id)
    if post is None:
        abort(404, description=f"Post {post_id} was not found.")
    return post


def read_comment_payload() -> tuple[str, str]:
    if not request.is_json:
        abort(415, description="Content-Type must be application/json.")

    try:
        payload = request.get_json()
    except BadRequest:
        abort(400, description="Malformed JSON request body.")

    if not isinstance(payload, Mapping):
        abort(400, description="JSON request body must be an object.")

    name = string_field(payload, "name").strip()
    comment = string_field(payload, "comment").strip()

    if not name:
        abort(400, description="The name field is required.")
    if not comment:
        abort(400, description="The comment field is required.")
    if len(name) > MAX_NAME_LENGTH:
        abort(400, description=f"The name field cannot exceed {MAX_NAME_LENGTH} characters.")
    if len(comment) > MAX_COMMENT_LENGTH:
        abort(
            400,
            description=f"The comment field cannot exceed {MAX_COMMENT_LENGTH} characters.",
        )

    return name, comment


def string_field(payload: Mapping[str, Any], key: str) -> str:
    value = payload.get(key)
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    abort(400, description=f"The {key} field must be a string.")


def enforce_comment_rate_limit(rate_buckets: dict[str, deque[float]]) -> None:
    limit = int(current_app.config.get("COMMENT_RATE_LIMIT", 0))
    if limit <= 0:
        return

    window_seconds = int(current_app.config.get("COMMENT_RATE_WINDOW_SECONDS", 60))
    now = monotonic()
    key = request.remote_addr or "unknown"
    bucket = rate_buckets.setdefault(key, deque())

    while bucket and now - bucket[0] >= window_seconds:
        bucket.popleft()

    if len(bucket) >= limit:
        abort(429, description="Too many comment submissions. Try again later.")

    bucket.append(now)


def created_response(comment, *, mode: str, location: str):
    body = {
        "message": "Comment created.",
        "mode": mode,
        "comment": serialize_comment(comment),
    }

    return jsonify(body), 201, {"Location": location}


def serialize_post(post) -> dict[str, Any]:
    return {
        "id": post["id"],
        "title": post["title"],
        "content": post["content"],
        "author": post["author"],
        "created_at": post["created_at"],
        "links": {
            "vulnerable": url_for("vulnerable_post", post_id=post["id"]),
            "secure": url_for("secure_post", post_id=post["id"]),
        },
    }


def serialize_comment(comment) -> dict[str, Any]:
    return {
        "id": comment["id"],
        "post_id": comment["post_id"],
        "name": comment["name"],
        "comment": comment["comment"],
        "is_secure": bool(comment["is_secure"]),
        "created_at": comment["created_at"],
    }


if __name__ == "__main__":
    create_app().run(debug=True)
