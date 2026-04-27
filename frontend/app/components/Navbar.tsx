"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/attack-explained", label: "XSS Demo" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] border-b border-neutral-200 bg-surface-container-lowest/80 backdrop-blur-[10px]">
      <div className="mx-auto flex h-full max-w-[1120px] items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-purple text-white transition-transform group-hover:scale-105">
            <svg
              width="20"
              height="20"
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
          <span className="text-xl font-bold text-on-surface tracking-tight">
            Secure<span className="text-brand-purple">Blog</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-brand-purple bg-brand-purple-light/50"
                    : "text-on-surface-variant hover:text-brand-purple hover:bg-surface-container"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-brand-purple" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-5 bg-on-surface transition-all duration-200 ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-on-surface transition-all duration-200 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-on-surface transition-all duration-200 ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-surface-container-lowest/95 backdrop-blur-md animate-[slideUp_0.2s_ease-out]">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-brand-purple bg-brand-purple-light/50"
                      : "text-on-surface-variant hover:text-brand-purple hover:bg-surface-container"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
