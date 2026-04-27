"use client";

import { useState } from "react";
import { submitComment, type Comment } from "../lib/api";

interface CommentSectionProps {
  postId: number;
  comments: Comment[];
  isSecure: boolean;
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
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCommentContent = (text: string) => {
    if (isSecure) {
      return <p className="text-on-surface-variant text-[16px] leading-relaxed">{text}</p>;
    }

    return (
      <div>
        <iframe
          title="Vulnerable raw HTML comment preview"
          sandbox="allow-scripts allow-modals"
          srcDoc={buildVulnerableCommentDocument(text)}
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
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded bg-surface-container-lowest border border-neutral-200 text-on-surface text-sm focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all resize-y"
              placeholder={
                isSecure
                  ? "Your comment (output-encoded at render time)"
                  : "Your comment (try: <script>alert('XSS')</script>)"
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

function buildVulnerableCommentDocument(comment: string) {
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
  <body>${comment}</body>
</html>`;
}
