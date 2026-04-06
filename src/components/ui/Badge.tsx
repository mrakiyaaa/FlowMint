"use client";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variants = {
    default: "bg-bg-tertiary text-text-muted",
    accent: "bg-accent/15 text-accent",
    success: "bg-emerald-500/15 text-emerald-400",
    warning: "bg-amber-500/15 text-amber-400",
  };

  return (
    <span
      className={`pill px-2.5 py-1 text-xs font-medium inline-flex items-center ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
