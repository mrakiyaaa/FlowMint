"use client";

import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export default function Card({ children, className = "", glow }: CardProps) {
  return (
    <div
      className={`card-base p-5 ${glow ? "shadow-[0_0_24px_var(--accent-glow)]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
