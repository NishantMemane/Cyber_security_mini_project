import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — SecureBlog",
  description:
    "Editorial clarity in information security. Meet the team behind SecureBlog's security research.",
};

const teamMembers = [
  {
    name: "Nishant Memane",
    role: "Project Member",
    initials: "NM",
    color: "bg-brand-purple",
  },
  {
    name: "Athrva Patil",
    role: "Project Member",
    initials: "AP",
    color: "bg-secure",
  },
  {
    name: "Yash Dalvi",
    role: "Project Member",
    initials: "YD",
    color: "bg-brand-purple-dim",
  },
  {
    name: "Sumeet Makwana",
    role: "Project Member",
    initials: "SM",
    color: "bg-vulnerable",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-surface-container-low to-surface">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-[1120px] px-6 lg:px-10 py-20">
          <span className="text-xs font-bold text-brand-purple uppercase tracking-[0.05em]">
            About Us
          </span>
          <h1 className="text-[40px] font-bold text-on-surface leading-[1.2] tracking-[-0.02em] mt-3 mb-5 max-w-2xl">
            Editorial Clarity in Information Security
          </h1>
          <p className="text-[18px] text-on-surface-variant leading-[1.75] max-w-2xl">
            Demystifying complex cyber threats through rigorous research, clear
            visualization, and actionable insights. We bridge the gap between
            technical depth and executive understanding.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[1120px] px-6 lg:px-10 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Feature 1 */}
          <div className="bg-surface-container-lowest border border-neutral-200 rounded-lg p-8 group hover:border-brand-purple hover:shadow-[0px_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-brand-purple/10 text-brand-purple mb-5 group-hover:bg-brand-purple group-hover:text-white transition-all duration-300">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <span className="text-xs font-bold text-outline uppercase tracking-[0.05em]">
              The Interactive Demo
            </span>
            <h2 className="text-[24px] font-semibold text-on-surface leading-[1.4] mt-2 mb-3">
              Dual-State Visualization
            </h2>
            <p className="text-on-surface-variant text-[16px] leading-relaxed">
              Our proprietary tool allows readers to view security architectures
              in both their vulnerable and secured states. Toggle between
              potential exploit paths and validated remediation strategies in
              real-time, providing an intuitive understanding of complex attack
              surfaces.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-surface-container-lowest border border-neutral-200 rounded-lg p-8 group hover:border-brand-purple hover:shadow-[0px_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-secure/10 text-secure mb-5 group-hover:bg-secure group-hover:text-white transition-all duration-300">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-outline uppercase tracking-[0.05em]">
              Contextual Remediation
            </span>
            <h2 className="text-[24px] font-semibold text-on-surface leading-[1.4] mt-2 mb-3">
              Actionable Architecture
            </h2>
            <p className="text-on-surface-variant text-[16px] leading-relaxed">
              We don&apos;t just report vulnerabilities; we contextualize them
              within specific enterprise architectures. Our remediation guides
              are tailored to varied tech stacks, ensuring that patches and
              structural changes are presented with clear, step-by-step
              implementation logic.
            </p>
          </div>
        </div>

        {/* Sub-features */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="flex items-start gap-4 p-6 bg-surface-container rounded-lg">
            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-brand-purple/10 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6B46C1"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-on-surface mb-1">
                Patch Management
              </h4>
              <p className="text-sm text-on-surface-variant">
                Prioritized patching schedules based on actual exploitability.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-surface-container rounded-lg">
            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-secure/10 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#38A169"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-on-surface mb-1">
                Structural Defense
              </h4>
              <p className="text-sm text-on-surface-variant">
                Network segmentation and zero-trust implementation steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mx-auto max-w-[1120px] px-6 lg:px-10 pb-20">
        <span className="text-xs font-bold text-brand-purple uppercase tracking-[0.05em]">
          Our Experts
        </span>
        <h2 className="text-[30px] font-semibold text-on-surface leading-[1.3] tracking-[-0.01em] mt-2 mb-3">
          Team Behind the Research
        </h2>
        <p className="text-on-surface-variant text-[16px] leading-relaxed mb-10 max-w-xl">
          A multidisciplinary team of cryptography experts, network architects,
          and threat analysts dedicated to editorial integrity.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-surface-container-lowest border border-neutral-200 rounded-lg p-6 text-center group hover:border-brand-purple hover:shadow-[0px_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <div
                className={`inline-flex items-center justify-center h-16 w-16 rounded-full ${member.color} text-white text-lg font-bold mb-4`}
              >
                {member.initials}
              </div>
              <h3 className="text-lg font-semibold text-on-surface">
                {member.name}
              </h3>
              <p className="text-sm text-on-surface-variant mt-1">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
