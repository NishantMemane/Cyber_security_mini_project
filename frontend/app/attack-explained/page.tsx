"use client";

import { useEffect, useState } from "react";
import { fetchAttackExplained, type AttackExplained } from "../lib/api";
import Badge from "../components/Badge";

export default function AttackExplainedPage() {
  const [data, setData] = useState<AttackExplained | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttackExplained()
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1120px] px-6 lg:px-10 py-20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-outline-variant/30 rounded" />
          <div className="h-4 w-full bg-outline-variant/20 rounded" />
          <div className="h-4 w-5/6 bg-outline-variant/20 rounded" />
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="relative bg-gradient-to-b from-vulnerable-light to-surface">
        <div className="mx-auto max-w-[1120px] px-6 lg:px-10 py-20">
          <Badge variant="vulnerable" className="mb-4">Live Demo</Badge>
          <h1 className="text-[40px] font-bold text-on-surface leading-[1.2] tracking-[-0.02em] mb-5 max-w-2xl">
            {data?.title || "Stored XSS Demo"}
          </h1>
          <p className="text-[18px] text-on-surface-variant leading-[1.75] max-w-2xl">
            {data?.summary || "Understanding how stored cross-site scripting works and how to prevent it."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Vulnerable Flow */}
          <div className="bg-vulnerable-light border border-vulnerable/20 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-vulnerable/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-vulnerable-dark">Vulnerable Flow</h2>
            </div>
            <ol className="space-y-4">
              {(data?.vulnerable_flow || []).map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-vulnerable text-white text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Secure Flow */}
          <div className="bg-secure-light border border-secure/20 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-secure/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38A169" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-secure-dark">Secure Flow</h2>
            </div>
            <ol className="space-y-4">
              {(data?.secure_flow || []).map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-secure text-white text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Demo Payload */}
        {data?.safe_demo_payload && (
          <div className="mt-10 bg-neutral-800 rounded-lg p-6">
            <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-[0.05em] mb-3">Safe Demo Payload</h3>
            <code className="text-green-400 font-mono text-sm break-all">{data.safe_demo_payload}</code>
            <p className="text-neutral-400 text-xs mt-3">This payload is displayed as text here. In vulnerable mode, it would execute as JavaScript.</p>
          </div>
        )}

        {/* Educational Strip */}
        <div className="mt-10 bg-surface-container rounded-lg border-l-4 border-brand-purple p-8">
          <h3 className="text-xs font-bold text-brand-purple uppercase tracking-[0.05em] mb-3">Security Checklist</h3>
          <ul className="space-y-2 text-on-surface-variant text-[16px] leading-relaxed">
            <li className="flex items-start gap-2"><span className="text-secure mt-1">✓</span> Always output-encode user data at render time</li>
            <li className="flex items-start gap-2"><span className="text-secure mt-1">✓</span> Use Content-Security-Policy headers</li>
            <li className="flex items-start gap-2"><span className="text-secure mt-1">✓</span> Validate input on both client and server</li>
            <li className="flex items-start gap-2"><span className="text-secure mt-1">✓</span> Use framework auto-escaping (React, Jinja2)</li>
            <li className="flex items-start gap-2"><span className="text-vulnerable mt-1">✗</span> Never use dangerouslySetInnerHTML with user data</li>
          </ul>
        </div>
      </section>
    </>
  );
}
