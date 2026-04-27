import Link from "next/link";

const footerLinks = [
  { href: "/attack-explained", label: "Security Audit" },
  { href: "/about", label: "Methodology" },
  { href: "/about", label: "Privacy" },
  { href: "/", label: "Archive" },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-surface-container-lowest">
      <div className="mx-auto max-w-[1120px] px-6 lg:px-10 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-purple text-white">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-on-surface">
                Secure<span className="text-brand-purple">Blog</span>
              </span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Technical Methodology: Content integrity verified via
              cryptographic hashing. Zero-trust editorial workflow.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="text-sm text-on-surface-variant hover:text-brand-purple transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-200">
          <p className="text-xs text-outline text-center">
            © {new Date().getFullYear()} SecureBlog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
