import Link from "next/link";
import Badge from "./Badge";
import type { Post } from "../lib/api";

interface PostCardProps {
  post: Post;
  index?: number;
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article
      className="group relative bg-surface-container-lowest border border-neutral-200 rounded-lg overflow-hidden transition-all duration-300 hover:border-brand-purple hover:shadow-[0px_8px_30px_rgba(0,0,0,0.08)]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-brand-purple to-brand-purple-dim" />

      <div className="p-6">
        {/* Category Tag */}
        <Badge variant="info" className="mb-4">
          Security
        </Badge>

        {/* Title */}
        <h2 className="text-xl font-semibold text-on-surface mb-3 leading-tight group-hover:text-brand-purple transition-colors duration-200">
          {post.title}
        </h2>

        {/* Content excerpt */}
        <p className="text-on-surface-variant text-[16px] leading-relaxed mb-5 line-clamp-3">
          {post.content}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-brand-purple-light flex items-center justify-center">
              <span className="text-xs font-bold text-brand-purple">
                {post.author[0]}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-on-surface">
                {post.author}
              </p>
              <p className="text-xs text-outline">{formattedDate}</p>
            </div>
          </div>

          {/* View Links */}
          <div className="flex items-center gap-2">
            <Link
              href={`/post/${post.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-vulnerable hover:text-vulnerable-dark transition-colors"
              title="View in Vulnerable Mode"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Vuln
            </Link>
            <span className="text-neutral-300">|</span>
            <Link
              href={`/secure/post/${post.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-secure hover:text-secure-dark transition-colors"
              title="View in Secure Mode"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Secure
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
