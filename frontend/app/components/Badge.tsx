interface BadgeProps {
  variant: "secure" | "vulnerable" | "info" | "neutral";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  secure: "bg-secure text-white",
  vulnerable: "bg-vulnerable text-white",
  info: "bg-brand-purple/10 text-brand-purple",
  neutral: "bg-neutral-200 text-neutral-700",
};

export default function Badge({
  variant,
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-[9999px] text-[13px] font-semibold uppercase tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
