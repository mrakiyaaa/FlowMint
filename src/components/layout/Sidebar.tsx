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
  Bell,
  User,
  Droplets,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/salary", icon: Banknote, label: "Salary" },
  { href: "/income", icon: Wallet, label: "Other Income" },
  { href: "/expenses", icon: CreditCard, label: "Expenses" },
  { href: "/totals", icon: PieChart, label: "Totals" },
  { href: "/savings", icon: PiggyBank, label: "Savings" },
  { href: "/automations", icon: Zap, label: "Automations" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-card-bg border-r border-card-border p-5">
      <Link href="/dashboard" className="flex items-center gap-2 mb-8">
        <Droplets className="h-7 w-7 text-accent" />
        <span className="font-display text-xl font-bold text-text-primary">
          FlowMint
        </span>
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-accent/10 text-accent"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
