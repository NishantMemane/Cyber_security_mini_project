"use client";

import { useState, useEffect } from "react";
import { submitComment, type Comment } from "../lib/api";

interface CommentSectionProps {
  postId: number;
  comments: Comment[];
  isSecure: boolean;
}

const SAMPLE_PAYLOADS = [
  {
    label: "🌐 Domain Redirect",
    description: "Redirects victim to another site",
    payload: `<script>window.top.location.href = "https://example.com/hacked"</script>`,
  },
  {
    label: "🍪 Cookie Theft & Defacement",
    description: "Exposes session cookies and defaces UI",
    payload: `<script>document.body.innerHTML = '<div style="background:#ff1100;color:white;position:fixed;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:bold;z-index:9999;flex-direction:column;font-family:sans-serif;"><h1>💥 YOU HAVE BEEN HACKED!</h1><p>Sending stolen cookies to attacker server...</p><p style="color:#ffcccc;font-size:14px;">' + INJECTED_COOKIES + '</p></div>';</script>`,
  },
  {
    label: "🖼️ Image onerror Defacement",
    description: "Bypasses script-tag filters to alter UI",
    payload: `<img src="x" onerror="document.body.innerHTML='<h1 style=\\'color:red;text-align:center;margin-top:20px;font-family:sans-serif;\\'>XSS via Image onerror!</h1>'; document.body.style.background='black';">`,
  },
  {
    label: "🔺 SVG onload Redirect",
    description: "Executes via SVG element to redirect",
    payload: `<svg onload="window.top.location.href='https://example.com/svg-hacked'"></svg>`,
  },
];

// Inject fake demo cookies so the cookie-theft payload has something to steal
function injectDemoCookies() {
  if (typeof document !== "undefined") {
    document.cookie = "session_token=abc123xyz_demo; path=/";
    document.cookie = "user_id=victim_42; path=/";
  }
}

function getCookiesString(): string {
  if (typeof document !== "undefined") {
    return document.cookie || "session_token=abc123xyz_demo; user_id=victim_42";
  }
  return "session_token=abc123xyz_demo; user_id=victim_42";
}

export default function CommentSection({
  postId,
  comments: initialComments,
  isSecure,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activePayload, setActivePayload] = useState<string | null>(null);
  const [cookieString, setCookieString] = useState("session_token=abc123xyz_demo; user_id=victim_42");

  useEffect(() => {
    injectDemoCookies();
    setCookieString(getCookiesString());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim() || !comment.trim()) {
      setError("Both name and comment are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitComment(postId, name, comment, isSecure);
      setComments((prev) => [...prev, result.comment]);
      setName("");
      setComment("");
      setActivePayload(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayloadClick = (payload: string, label: string) => {
    setComment(payload);
    setActivePayload(label);
  };

  const renderCommentContent = (text: string) => {
    if (isSecure) {
      return <p className="text-on-surface-variant text-[16px] leading-relaxed">{text}</p>;
    }

    return (
      <div>
        <iframe
          title="Vulnerable raw HTML comment preview"
          sandbox="allow-scripts allow-modals allow-top-navigation"
          srcDoc={buildVulnerableCommentDocument(text, cookieString)}
          className="block h-28 w-full rounded border border-vulnerable/20 bg-white"
        />
        {text.includes("<") && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-vulnerable">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            This sandbox renders the comment as raw HTML
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="mt-12">
      <h3 className="text-[24px] font-semibold text-on-surface mb-6">
        Discussion{" "}
        <span className="text-outline text-lg font-normal">
          ({comments.length})
        </span>
      </h3>

      {/* Comments list */}
      <div className="space-y-4 mb-10">
        {comments.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-on-surface-variant">No comments yet. Be the first to contribute.</p>
          </div>
        ) : (
          comments.map((c, i) => (
            <div
              key={c.id}
              className="bg-surface-container-lowest border border-neutral-200 rounded-lg p-5 animate-[fadeIn_0.3s_ease-out]"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-brand-purple-light flex items-center justify-center">
                  <span className="text-xs font-bold text-brand-purple">
                    {c.name[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    {c.name}
                  </p>
                  <p className="text-xs text-outline">
                    {new Date(c.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {isSecure && (
                  <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-secure bg-secure-light px-2 py-0.5 rounded-[9999px]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Auto-escaped
                  </span>
                )}
              </div>
              {renderCommentContent(c.comment)}
            </div>
          ))
        )}
      </div>

      {/* Sample Payloads — Vulnerable Mode Only */}
      {!isSecure && (
        <div className="mb-6 rounded-lg border border-vulnerable/30 bg-vulnerable-light/40 p-5">
          <div className="flex items-center gap-2 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-vulnerable">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider text-vulnerable">
              Try a Sample Attack Payload
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mb-4">
            Click any payload below to auto-fill the comment field, then submit to see the attack execute in real time.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SAMPLE_PAYLOADS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handlePayloadClick(p.payload, p.label)}
                className={`text-left px-4 py-3 rounded-lg border text-sm transition-all
                  ${activePayload === p.label
                    ? "border-vulnerable bg-vulnerable/10 text-vulnerable font-semibold"
                    : "border-vulnerable/30 bg-white hover:border-vulnerable hover:bg-vulnerable/5 text-on-surface"
                  }`}
              >
                <div className="font-semibold mb-0.5">{p.label}</div>
                <div className="text-xs text-on-surface-variant">{p.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comment form */}
      <div className="bg-surface-container rounded-lg p-6 border border-outline-variant">
        <h4 className="text-lg font-semibold text-on-surface mb-4">
          Leave a Comment
        </h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="comment-name"
              className="block text-sm font-medium text-on-surface-variant mb-1.5"
            >
              Name
            </label>
            <input
              id="comment-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-surface-container-lowest border border-neutral-200 text-on-surface text-sm focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
              placeholder="Your name"
              maxLength={80}
            />
          </div>
          <div>
            <label
              htmlFor="comment-text"
              className="block text-sm font-medium text-on-surface-variant mb-1.5"
            >
              Comment
            </label>
            <textarea
              id="comment-text"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setActivePayload(null);
              }}
              rows={4}
              className="w-full px-4 py-2.5 rounded bg-surface-container-lowest border border-neutral-200 text-on-surface text-sm focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all resize-y"
              placeholder={
                isSecure
                  ? "Your comment (output-encoded at render time)"
                  : "Your comment (try: <script>document.body.style.background='red'</script>)"
              }
              maxLength={5000}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-vulnerable-light border border-vulnerable/20 rounded text-sm text-vulnerable-dark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-secure-light border border-secure/20 rounded text-sm text-secure-dark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Comment submitted successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-brand-purple text-white text-sm font-semibold hover:bg-brand-purple-hover focus:ring-2 focus:ring-brand-purple/30 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Comment"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

function buildVulnerableCommentDocument(comment: string, cookies: string) {
  // Replace INJECTED_COOKIES placeholder with actual cookie string
  // so cookie-theft payloads display real data in the alert
  const injectedComment = comment.replace("INJECTED_COOKIES", JSON.stringify(cookies));

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 14px;
        color: #494453;
        font: 16px/1.6 Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        overflow-wrap: anywhere;
      }
    </style>
  </head>
  <body>${injectedComment}</body>
</html>`;
}