"use client";

import { useEffect, useState } from "react";
import { fetchPosts, type Post } from "./lib/api";
import PostCard from "./components/PostCard";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts()
      .then((data) => {
        setPosts(data.posts);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface via-surface-container-low to-brand-purple-light/20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-brand-purple-dim/10 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1120px] px-6 lg:px-10 py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[9999px] bg-brand-purple/10 text-brand-purple text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-purple animate-pulse" />
              Stored XSS Demo Platform
            </div>

            <h1 className="text-[40px] font-bold text-on-surface leading-[1.2] tracking-[-0.02em] mb-5">
              A digital curator&apos;s guide to{" "}
              <span className="text-brand-purple">web security</span>.
            </h1>

            <p className="text-[18px] text-on-surface-variant leading-[1.75] mb-8">
              Exploring the intersection of rigorous analysis and elegant
              technical solutions. See stored XSS in action, compare vulnerable
              and secured rendering side-by-side.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#posts"
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-brand-purple text-white text-sm font-semibold hover:bg-brand-purple-hover transition-all duration-200 shadow-[0_4px_14px_rgba(107,70,193,0.3)] hover:shadow-[0_6px_20px_rgba(107,70,193,0.4)]"
              >
                Explore Articles
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="/attack-explained"
                className="inline-flex items-center gap-2 px-6 py-3 rounded border border-neutral-200 text-on-surface text-sm font-semibold hover:border-brand-purple hover:text-brand-purple transition-all duration-200"
              >
                View XSS Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section id="posts" className="mx-auto max-w-[1120px] px-6 lg:px-10 py-20">
        <div className="mb-10">
          <span className="text-xs font-bold text-brand-purple uppercase tracking-[0.05em]">
            Latest Articles
          </span>
          <h2 className="text-[30px] font-semibold text-on-surface leading-[1.3] tracking-[-0.01em] mt-2">
            Security Research & Insights
          </h2>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="bg-surface-container rounded-lg p-6 animate-pulse"
              >
                <div className="h-5 w-20 bg-outline-variant/30 rounded-[9999px] mb-4" />
                <div className="h-6 w-3/4 bg-outline-variant/30 rounded mb-3" />
                <div className="h-4 w-full bg-outline-variant/20 rounded mb-2" />
                <div className="h-4 w-2/3 bg-outline-variant/20 rounded mb-5" />
                <div className="h-px bg-neutral-200 mb-4" />
                <div className="flex justify-between">
                  <div className="h-8 w-32 bg-outline-variant/20 rounded" />
                  <div className="h-8 w-24 bg-outline-variant/20 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-vulnerable-light border border-vulnerable/20 rounded-lg p-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-vulnerable/10 mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E53E3E"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-vulnerable-dark mb-2">
              Connection Error
            </h3>
            <p className="text-sm text-on-surface-variant mb-4">
              {error}. Make sure the Flask backend is running on port 5000.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded bg-vulnerable text-white text-sm font-semibold hover:bg-vulnerable-dark transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Educational Strip */}
      <section className="mx-auto max-w-[1120px] px-6 lg:px-10 pb-20">
        <div className="bg-surface-container rounded-lg border-l-4 border-brand-purple p-8">
          <h3 className="text-xs font-bold text-brand-purple uppercase tracking-[0.05em] mb-3">
            Key Takeaway
          </h3>
          <p className="text-on-surface-variant text-[16px] leading-relaxed">
            Both endpoints store the payload exactly as submitted. The
            difference is the intended render policy: a vulnerable HTML client
            injects returned comment values without encoding, while a secure
            HTML client output-encodes at the moment it renders into the DOM.
          </p>
        </div>
      </section>
    </>
  );
}
