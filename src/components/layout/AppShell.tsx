"use client";

import { useEffect, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import GlobalBalanceChip from "./GlobalBalanceChip";
import { useFinanceStore } from "@/store/useFinanceStore";

export default function AppShell({ children }: { children: ReactNode }) {
  const fetchAll = useFinanceStore((s) => s.fetchAll);
  const fetchProfile = useFinanceStore((s) => s.fetchProfile);

  useEffect(() => {
    fetchAll();
    fetchProfile();
  }, [fetchAll, fetchProfile]);

  return (
    <div className="flex min-h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="lg:hidden">
          <GlobalBalanceChip />
        </div>
        <main className="flex-1 px-5 py-6 pb-24 lg:pb-6 lg:px-8 max-w-5xl w-full mx-auto">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
