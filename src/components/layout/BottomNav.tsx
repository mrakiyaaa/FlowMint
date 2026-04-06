"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Banknote,
  Wallet,
  CreditCard,
  PieChart,
  PiggyBank,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/salary", icon: Banknote, label: "Salary" },
  { href: "/income", icon: Wallet, label: "Income" },
  { href: "/expenses", icon: CreditCard, label: "Expenses" },
  { href: "/totals", icon: PieChart, label: "Totals" },
  { href: "/savings", icon: PiggyBank, label: "Savings" },
  { href: "/automations", icon: Zap, label: "Auto" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-nav-bg backdrop-blur-xl border-t border-card-border safe-area-pb">
      <div className="flex items-center justify-around px-2 py-1.5">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors ${
                active
                  ? "text-accent"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
