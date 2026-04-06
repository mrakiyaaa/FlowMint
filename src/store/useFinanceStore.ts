"use client";

import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type {
  Profile,
  SalaryIncome,
  OtherIncome,
  Expense,
  Saving,
  Automation,
  Notification,
} from "@/types";
import {
  sumSalary,
  sumOtherIncome,
  sumExpenses,
  sumSavings,
  calculateRemaining,
} from "@/utils/calculateTotals";

interface FinanceState {
  salaryIncomes: SalaryIncome[];
  otherIncomes: OtherIncome[];
  expenses: Expense[];
  savings: Saving[];
  automations: Automation[];
  notifications: Notification[];
  profile: Profile | null;
  loading: boolean;

  // Computed getters
  totalSalary: () => number;
  totalOtherIncome: () => number;
  totalExpenses: () => number;
  totalSavings: () => number;
  globalRemaining: () => number;
  unreadCount: () => number;

  // Actions
  fetchAll: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;

  addSalary: (data: Omit<SalaryIncome, "id" | "user_id">) => Promise<void>;
  deleteSalary: (id: string) => Promise<void>;

  addOtherIncome: (data: Omit<OtherIncome, "id" | "user_id">) => Promise<void>;
  deleteOtherIncome: (id: string) => Promise<void>;

  addExpense: (data: Omit<Expense, "id" | "user_id">) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  addSaving: (data: Omit<Saving, "id" | "user_id">) => Promise<string | null>;
  deleteSaving: (id: string) => Promise<void>;

  addAutomation: (data: Omit<Automation, "id" | "user_id">) => Promise<void>;
  toggleAutomation: (id: string, is_active: boolean) => Promise<void>;
  deleteAutomation: (id: string) => Promise<void>;
  runAutomations: () => Promise<void>;

  fetchNotifications: () => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  salaryIncomes: [],
  otherIncomes: [],
  expenses: [],
  savings: [],
  automations: [],
  notifications: [],
  profile: null,
  loading: true,

  totalSalary: () => sumSalary(get().salaryIncomes),
  totalOtherIncome: () => sumOtherIncome(get().otherIncomes),
  totalExpenses: () => sumExpenses(get().expenses),
  totalSavings: () => sumSavings(get().savings),
  globalRemaining: () =>
    calculateRemaining(
      get().totalSalary(),
      get().totalOtherIncome(),
      get().totalExpenses(),
      get().totalSavings()
    ),
  unreadCount: () => get().notifications.filter((n) => !n.is_read).length,

  fetchAll: async () => {
    set({ loading: true });
    const supabase = createClient();
    const [salaries, others, exps, savs, autos, notifs] = await Promise.all([
      supabase.from("salary_incomes").select("*").order("year", { ascending: false }),
      supabase.from("other_incomes").select("*").order("date", { ascending: false }),
      supabase.from("expenses").select("*").order("date", { ascending: false }),
      supabase.from("savings").select("*"),
      supabase.from("automations").select("*"),
      supabase.from("notifications").select("*").order("created_at", { ascending: false }),
    ]);
    set({
      salaryIncomes: salaries.data ?? [],
      otherIncomes: others.data ?? [],
      expenses: exps.data ?? [],
      savings: savs.data ?? [],
      automations: autos.data ?? [],
      notifications: notifs.data ?? [],
      loading: false,
    });
  },

  fetchProfile: async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    set({ profile: data });
  },

  updateProfile: async (updates) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update(updates).eq("id", user.id);
    set((s) => ({ profile: s.profile ? { ...s.profile, ...updates } : null }));
  },

  // Salary
  addSalary: async (data) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: row, error } = await supabase
      .from("salary_incomes")
      .insert({ ...data, user_id: user.id })
      .select()
      .single();
    if (error) { console.error("addSalary:", error.message); return; }
    if (row) set((s) => ({ salaryIncomes: [row, ...s.salaryIncomes] }));
  },
  deleteSalary: async (id) => {
    const supabase = createClient();
    await supabase.from("salary_incomes").delete().eq("id", id);
    set((s) => ({ salaryIncomes: s.salaryIncomes.filter((i) => i.id !== id) }));
  },

  // Other Income
  addOtherIncome: async (data) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: row, error } = await supabase
      .from("other_incomes")
      .insert({ ...data, user_id: user.id })
      .select()
      .single();
    if (error) { console.error("addOtherIncome:", error.message); return; }
    if (row) set((s) => ({ otherIncomes: [row, ...s.otherIncomes] }));
  },
  deleteOtherIncome: async (id) => {
    const supabase = createClient();
    await supabase.from("other_incomes").delete().eq("id", id);
    set((s) => ({ otherIncomes: s.otherIncomes.filter((i) => i.id !== id) }));
  },

  // Expenses
  addExpense: async (data) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: row, error } = await supabase
      .from("expenses")
      .insert({ ...data, user_id: user.id })
      .select()
      .single();
    if (error) { console.error("addExpense:", error.message); return; }
    if (row) set((s) => ({ expenses: [row, ...s.expenses] }));
  },
  deleteExpense: async (id) => {
    const supabase = createClient();
    await supabase.from("expenses").delete().eq("id", id);
    set((s) => ({ expenses: s.expenses.filter((i) => i.id !== id) }));
  },

  // Savings
  addSaving: async (data) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return "Not authenticated";
    const { data: row, error } = await supabase
      .from("savings")
      .insert({ ...data, user_id: user.id })
      .select()
      .single();
    if (error) { console.error("addSaving:", error.message); return error.message; }
    if (row) set((s) => ({ savings: [row, ...s.savings] }));
    return null;
  },
  deleteSaving: async (id) => {
    const supabase = createClient();
    await supabase.from("savings").delete().eq("id", id);
    set((s) => ({ savings: s.savings.filter((i) => i.id !== id) }));
  },

  // Automations
  addAutomation: async (data) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: row, error } = await supabase
      .from("automations")
      .insert({ ...data, user_id: user.id })
      .select()
      .single();
    if (error) { console.error("addAutomation:", error.message); return; }
    if (row) set((s) => ({ automations: [...s.automations, row] }));
  },
  toggleAutomation: async (id, is_active) => {
    const supabase = createClient();
    await supabase.from("automations").update({ is_active }).eq("id", id);
    set((s) => ({
      automations: s.automations.map((a) =>
        a.id === id ? { ...a, is_active } : a
      ),
    }));
  },
  deleteAutomation: async (id) => {
    const supabase = createClient();
    await supabase.from("automations").delete().eq("id", id);
    set((s) => ({ automations: s.automations.filter((a) => a.id !== id) }));
  },

  runAutomations: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const { automations } = get();

    for (const auto of automations) {
      if (!auto.is_active || auto.trigger_month !== currentMonth) continue;

      // Check if already executed this month
      const { data: existing } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", user.id)
        .like("message", `%Automation "${auto.label}"%`)
        .gte("created_at", `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`)
        .limit(1);

      if (existing && existing.length > 0) continue;

      if (auto.action_type === "Save") {
        await supabase.from("savings").insert({
          user_id: user.id,
          title: auto.target,
          amount: auto.amount,
          source: auto.from_source,
        });
      } else {
        await supabase.from("expenses").insert({
          user_id: user.id,
          title: auto.target,
          amount: auto.amount,
          date: new Date().toISOString().split("T")[0],
          month: currentMonth,
          year: currentYear,
          tag: "Automated",
        });
      }

      await supabase.from("notifications").insert({
        user_id: user.id,
        message: `Automation "${auto.label}" executed: ${auto.action_type} LKR ${auto.amount.toLocaleString()} to ${auto.target}`,
        is_read: false,
      });
    }

    // Refresh after running
    await get().fetchAll();
  },

  // Notifications
  fetchNotifications: async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });
    set({ notifications: data ?? [] });
  },
  markAllRead: async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, is_read: true })),
    }));
  },
}));
