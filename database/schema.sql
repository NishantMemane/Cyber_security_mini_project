CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    comment TEXT NOT NULL,
    is_secure INTEGER NOT NULL DEFAULT 0 CHECK (is_secure IN (0, 1)),
    created_at TEXT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_comments_post_mode_created
    ON comments (post_id, is_secure, created_at, id);
