from __future__ import annotations

import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from flask import current_app, g


BASE_DIR = Path(__file__).resolve().parent
DEFAULT_DATABASE = BASE_DIR / "blog.db"
SCHEMA_PATH = BASE_DIR / "schema.sql"

SEED_POSTS = (
    {
        "title": "Top 5 Python Tips for Beginners",
        "content": (
            "Start small, read tracebacks carefully, use virtual environments, "
            "write tests early, and learn the standard library before reaching "
            "for extra packages."
        ),
        "author": "Admin",
    },
    {
        "title": "Why Web Security Matters in 2025",
        "content": (
            "Modern web apps move sensitive data through browsers every day. "
            "Input handling, output encoding, and clear trust boundaries are "
            "basic requirements, not optional hardening."
        ),
        "author": "Admin",
    },
)


def utc_timestamp() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def get_db() -> sqlite3.Connection:
    if "db" not in g:
        database_path = Path(current_app.config["DATABASE"])
        database_path.parent.mkdir(parents=True, exist_ok=True)

        connection = sqlite3.connect(database_path)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        g.db = connection

    return g.db


def close_db(_error: BaseException | None = None) -> None:
    connection = g.pop("db", None)
    if connection is not None:
        connection.close()


def init_db() -> None:
    db = get_db()
    with SCHEMA_PATH.open("r", encoding="utf-8") as schema_file:
        db.executescript(schema_file.read())
    seed_posts(db)
    db.commit()


def init_app(app) -> None:
    app.config.setdefault("DATABASE", str(DEFAULT_DATABASE))
    app.teardown_appcontext(close_db)
    with app.app_context():
        init_db()


def seed_posts(db: sqlite3.Connection) -> None:
    existing_post_count = db.execute("SELECT COUNT(*) FROM posts").fetchone()[0]
    if existing_post_count:
        return

    created_at = utc_timestamp()
    db.executemany(
        """
        INSERT INTO posts (title, content, author, created_at)
        VALUES (?, ?, ?, ?)
        """,
        [
            (post["title"], post["content"], post["author"], created_at)
            for post in SEED_POSTS
        ],
    )


def list_posts() -> list[sqlite3.Row]:
    return get_db().execute(
        """
        SELECT id, title, content, author, created_at
        FROM posts
        ORDER BY id ASC
        """
    ).fetchall()


def get_post(post_id: int) -> sqlite3.Row | None:
    return get_db().execute(
        """
        SELECT id, title, content, author, created_at
        FROM posts
        WHERE id = ?
        """,
        (post_id,),
    ).fetchone()


def list_comments(post_id: int, *, is_secure: bool) -> list[sqlite3.Row]:
    return get_db().execute(
        """
        SELECT id, post_id, name, comment, is_secure, created_at
        FROM comments
        WHERE post_id = ? AND is_secure = ?
        ORDER BY created_at ASC, id ASC
        """,
        (post_id, int(is_secure)),
    ).fetchall()


def add_comment(
    post_id: int,
    *,
    name: str,
    comment: str,
    is_secure: bool,
) -> sqlite3.Row:
    db = get_db()
    cursor = db.execute(
        """
        INSERT INTO comments (post_id, name, comment, is_secure, created_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        (post_id, name, comment, int(is_secure), utc_timestamp()),
    )
    db.commit()

    return db.execute(
        """
        SELECT id, post_id, name, comment, is_secure, created_at
        FROM comments
        WHERE id = ?
        """,
        (cursor.lastrowid,),
    ).fetchone()
