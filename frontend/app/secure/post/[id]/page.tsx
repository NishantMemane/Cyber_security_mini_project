"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchSecurePost, type PostDetailResponse } from "../../../lib/api";
import Badge from "../../../components/Badge";
import CommentSection from "../../../components/CommentSection";

export default function SecurePostPage() {
  const params = useParams();
  const postId = Number(params.id);
  const [data, setData] = useState<PostDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;
    fetchSecurePost(postId)
      .then((d) => { setData(d); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [postId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1120px] px-6 lg:px-10 py-20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-outline-variant/30 rounded-[9999px]" />
          <div className="h-10 w-3/4 bg-outline-variant/30 rounded" />
          <div className="h-4 w-full bg-outline-variant/20 rounded" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-[1120px] px-6 lg:px-10 py-20 text-center">
        <h2 className="text-2xl font-bold text-on-surface mb-2">Failed to load post</h2>
        <p className="text-on-surface-variant mb-6">{error}</p>
        <Link href="/" className="px-4 py-2 rounded bg-brand-purple text-white text-sm font-semibold">Back to Home</Link>
      </div>
    );
  }

  const { post, comments, security_note } = data;

  return (
    <div className="mx-auto max-w-[1120px] px-6 lg:px-10 py-12">
      <nav className="flex items-center gap-2 text-sm text-outline mb-8">
        <Link href="/" className="hover:text-brand-purple transition-colors">Home</Link>
        <span>/</span>
        <span className="text-on-surface-variant">{post.title}</span>
      </nav>

      {/* Secure Banner */}
      <div className="bg-secure-light border border-secure/20 rounded-lg p-5 mb-8 flex items-start gap-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38A169" strokeWidth="2" className="flex-shrink-0 mt-0.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <div>
          <h4 className="font-semibold text-secure-dark text-sm mb-1">✓ Secure Mode Active</h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">{security_note}</p>
          <Link href={`/post/${post.id}`} className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-vulnerable hover:text-vulnerable-dark transition-colors">Switch to Vulnerable Mode →</Link>
        </div>
      </div>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="secure">Secure</Badge>
          <Badge variant="info">Security</Badge>
        </div>
        <h1 className="text-[40px] font-bold text-on-surface leading-[1.2] tracking-[-0.02em] mb-4">{post.title}</h1>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-brand-purple-light flex items-center justify-center">
            <span className="text-sm font-bold text-brand-purple">{post.author[0]}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface">{post.author}</p>
            <p className="text-xs text-outline">{new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>
      </header>

      {/* XSS Educational Content */}
      <article className="mb-12 space-y-6">
        <p className="text-[18px] text-on-surface-variant leading-[1.75]">{post.content}</p>

        <div className="bg-surface-container rounded-lg border-l-4 border-secure p-6">
          <h3 className="text-xs font-bold text-secure uppercase tracking-[0.05em] mb-2">Defense Strategy</h3>
          <p className="text-on-surface-variant text-[16px] leading-relaxed">
            Context-aware output encoding neutralizes executable intent. Characters like &lt;, &gt;, &amp;, &quot;, and &apos; are converted to HTML entities before rendering. Modern frameworks like React employ auto-escaping by default.
          </p>
        </div>

        <div className="bg-neutral-800 rounded-lg p-5 font-mono text-sm text-green-400 overflow-x-auto">
          <div className="text-neutral-500 mb-2">{"// HTML Entity Encoding"}</div>
          <div>&lt; → <span className="text-yellow-300">&amp;lt;</span></div>
          <div>&gt; → <span className="text-yellow-300">&amp;gt;</span></div>
          <div>&amp; → <span className="text-yellow-300">&amp;amp;</span></div>
          <div>&quot; → <span className="text-yellow-300">&amp;quot;</span></div>
          <div>&apos; → <span className="text-yellow-300">&amp;#x27;</span></div>
        </div>
      </article>

      <CommentSection postId={post.id} comments={comments} isSecure={true} />
    </div>
  );
}
