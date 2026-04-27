# Stored XSS Demo

Flask + SQLite backend with a Next.js frontend for the stored XSS demo from
`backend_design.md`.

The backend exposes JSON endpoints and keeps vulnerable and secure comment
flows side by side. Both flows store raw user intent in SQLite; HTML escaping
belongs at browser render time, not at database-write time.

## Setup

### Backend

```powershell
cd "C:\Users\shree\Desktop\cs mini"
py -m venv .venv
.\.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
python -m flask --app app:create_app run --host 127.0.0.1 --port 5000
```

The SQLite database is created automatically as `blog.db` on startup and seeded
with two sample posts.

### Frontend

```powershell
cd "C:\Users\shree\Desktop\cs mini\frontend"
npm install
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Open `http://127.0.0.1:3000` for the UI. The frontend calls the backend at
`http://127.0.0.1:5000` by default.

## Routes

- `GET /` lists seeded blog posts.
- `GET /post/<post_id>` returns the vulnerable post view data.
- `POST /post/<post_id>` stores a raw vulnerable comment.
- `GET /secure/post/<post_id>` returns the secure post view data.
- `POST /secure/post/<post_id>` stores a raw secure-mode comment.
- `GET /attack-explained` returns a concise explanation of the demo.
- `GET /health` returns a health check.

All write endpoints require `Content-Type: application/json`, reject malformed
JSON, reject non-string `name`/`comment` fields, and apply a small per-process
comment rate limit.

## Quick Demo Calls

```powershell
curl http://127.0.0.1:5000/

curl -X POST http://127.0.0.1:5000/post/1 `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Attacker\",\"comment\":\"<script>alert('XSS Attack!')</script>\"}"

curl -X POST http://127.0.0.1:5000/secure/post/1 `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Student\",\"comment\":\"<script>alert('XSS Attack!')</script>\"}"
```

Both endpoints store the payload exactly as submitted. The difference is the
render policy: the vulnerable page renders comments as raw HTML in a sandboxed
preview, while the secure page relies on React text rendering so user input is
output-encoded when inserted into the DOM.

## Verification

```powershell
cd "C:\Users\shree\Desktop\cs mini"
.\.venv\Scripts\python.exe -m pytest -q -p no:cacheprovider

cd "C:\Users\shree\Desktop\cs mini\frontend"
npm run lint
npm run build
```
