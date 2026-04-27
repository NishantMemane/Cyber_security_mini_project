from __future__ import annotations

import sys
from pathlib import Path

import pytest


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

from app import create_app  # noqa: E402


@pytest.fixture()
def client(tmp_path):
    return make_client(tmp_path)


def make_client(tmp_path, extra_config=None):
    config = {
        "TESTING": True,
        "DATABASE": str(tmp_path / "blog.db"),
    }
    if extra_config:
        config.update(extra_config)

    app = create_app(
        config
    )
    return app.test_client()


def test_homepage_returns_seeded_posts(client):
    response = client.get("/")

    assert response.status_code == 200
    body = response.get_json()
    assert body["count"] == 2
    assert body["posts"][0]["title"] == "Top 5 Python Tips for Beginners"
    assert body["posts"][0]["links"] == {
        "vulnerable": "/post/1",
        "secure": "/secure/post/1",
    }


def test_vulnerable_comment_is_stored_raw(client):
    payload = '<script>alert("XSS Attack!")</script>'

    create_response = client.post(
        "/post/1",
        json={"name": "Attacker", "comment": payload},
    )
    fetch_response = client.get("/post/1")

    assert create_response.status_code == 201
    created_comment = create_response.get_json()["comment"]
    assert created_comment["comment"] == payload
    assert "render_preview" not in created_comment

    body = fetch_response.get_json()
    assert body["mode"] == "vulnerable"
    assert body["comments"][0]["comment"] == payload
    assert "render_preview" not in body["comments"][0]


def test_secure_comment_is_stored_raw_and_returns_data_only_json(client):
    payload = '<script>alert("XSS Attack!")</script>'

    response = client.post(
        "/secure/post/1",
        json={"name": "<b>Student</b>", "comment": payload},
    )

    assert response.status_code == 201
    comment = response.get_json()["comment"]
    assert comment["name"] == "<b>Student</b>"
    assert comment["comment"] == payload
    assert "render_preview" not in comment


def test_secure_and_vulnerable_comment_sets_do_not_mix(client):
    client.post("/post/1", json={"name": "A", "comment": "<script>1</script>"})
    client.post("/secure/post/1", json={"name": "B", "comment": "<script>2</script>"})

    vulnerable_body = client.get("/post/1").get_json()
    secure_body = client.get("/secure/post/1").get_json()

    assert len(vulnerable_body["comments"]) == 1
    assert len(secure_body["comments"]) == 1
    assert vulnerable_body["comments"][0]["is_secure"] is False
    assert secure_body["comments"][0]["is_secure"] is True
    assert vulnerable_body["comments"][0]["comment"] == "<script>1</script>"
    assert secure_body["comments"][0]["comment"] == "<script>2</script>"


def test_comment_validation_returns_json_errors(client):
    response = client.post("/post/1", json={"name": "", "comment": "hello"})

    assert response.status_code == 400
    body = response.get_json()
    assert body["error"] == "Bad Request"
    assert body["message"] == "The name field is required."


def test_non_object_json_returns_json_error(client):
    response = client.post("/post/1", json=["not", "an", "object"])

    assert response.status_code == 400
    assert response.get_json()["message"] == "JSON request body must be an object."


def test_malformed_json_returns_specific_error(client):
    response = client.post(
        "/post/1",
        data='{"name": "A", "comment": ',
        content_type="application/json",
    )

    assert response.status_code == 400
    assert response.get_json()["message"] == "Malformed JSON request body."


def test_unsupported_content_type_returns_415(client):
    response = client.post(
        "/post/1",
        data="name=A&comment=hello",
        content_type="text/plain",
    )

    assert response.status_code == 415
    assert response.get_json()["message"] == "Content-Type must be application/json."


def test_non_string_field_returns_json_error(client):
    response = client.post("/post/1", json={"name": ["Admin"], "comment": "hello"})

    assert response.status_code == 400
    assert response.get_json()["message"] == "The name field must be a string."


def test_comment_rate_limit_is_enforced(tmp_path):
    client = make_client(
        tmp_path,
        {
            "COMMENT_RATE_LIMIT": 1,
            "COMMENT_RATE_WINDOW_SECONDS": 60,
        },
    )

    first = client.post("/post/1", json={"name": "A", "comment": "one"})
    second = client.post("/post/1", json={"name": "A", "comment": "two"})

    assert first.status_code == 201
    assert second.status_code == 429
    assert second.get_json()["message"] == "Too many comment submissions. Try again later."


def test_missing_post_returns_json_404(client):
    response = client.get("/post/999")

    assert response.status_code == 404
    assert response.get_json()["message"] == "Post 999 was not found."
