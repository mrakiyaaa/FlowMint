"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { Bell, Droplets } from "lucide-react";
import Link from "next/link";

export default function GlobalBalanceChip() {
  const globalRemaining = useFinanceStore((s) => s.globalRemaining);
  const unreadCount = useFinanceStore((s) => s.unreadCount);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-3 bg-nav-bg backdrop-blur-xl border-b border-card-border">
      <Link href="/dashboard" className="flex items-center gap-2">
        <Droplets className="h-6 w-6 text-accent" />
        <span className="font-display text-lg font-bold text-text-primary">
          FlowMint
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <div className="pill bg-bg-tertiary px-4 py-1.5 flex items-center gap-2">
          <span className="text-xs text-text-muted">Remaining</span>
          <span
            className={`font-mono text-sm font-medium ${
              globalRemaining() >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {formatCurrency(globalRemaining())}
          </span>
        </div>

        <Link
          href="/notifications"
          className="relative p-2 rounded-full hover:bg-bg-tertiary transition-colors"
        >
          <Bell className="h-5 w-5 text-text-muted" />
          {unreadCount() > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-accent text-[10px] font-bold text-white flex items-center justify-center">
              {unreadCount()}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
