"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { getMonthName } from "@/utils/getMonthName";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  Banknote,
  Wallet,
  CreditCard,
  PiggyBank,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const {
    salaryIncomes,
    otherIncomes,
    expenses,
    savings,
    loading,
    totalSalary,
    totalOtherIncome,
    totalExpenses,
    totalSavings,
    globalRemaining,
  } = useFinanceStore();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-32 w-full" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-24" />
          ))}
        </div>
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  const summaryCards = [
    {
      label: "Total Salary",
      value: totalSalary(),
      icon: Banknote,
      color: "text-emerald-400",
    },
    {
      label: "Other Income",
      value: totalOtherIncome(),
      icon: Wallet,
      color: "text-blue-400",
    },
    {
      label: "Expenses",
      value: totalExpenses(),
      icon: CreditCard,
      color: "text-red-400",
    },
    {
      label: "Savings",
      value: totalSavings(),
      icon: PiggyBank,
      color: "text-amber-400",
    },
  ];

  // Build monthly chart data
  const monthlyData: Record<
    number,
    { month: string; income: number; expenses: number }
  > = {};
  for (let m = 1; m <= 12; m++) {
    monthlyData[m] = { month: getMonthName(m).slice(0, 3), income: 0, expenses: 0 };
  }
  salaryIncomes.forEach((s) => {
    if (monthlyData[s.month]) monthlyData[s.month].income += s.amount;
  });
  otherIncomes.forEach((o) => {
    if (monthlyData[o.month]) monthlyData[o.month].income += o.amount;
  });
  expenses.forEach((e) => {
    if (monthlyData[e.month]) monthlyData[e.month].expenses += e.amount;
  });
  const chartData = Object.values(monthlyData);

  // Recent transactions (last 5 across all types)
  const recent = [
    ...salaryIncomes.map((s) => ({
      id: s.id,
      title: s.tag || "Salary",
      amount: s.amount,
      type: "income" as const,
      date: `${getMonthName(s.month).slice(0, 3)} ${s.year}`,
    })),
    ...otherIncomes.map((o) => ({
      id: o.id,
      title: o.title,
      amount: o.amount,
      type: "income" as const,
      date: o.date,
    })),
    ...expenses.map((e) => ({
      id: e.id,
      title: e.title,
      amount: e.amount,
      type: "expense" as const,
      date: e.date,
    })),
  ]
    .sort((a, b) => (b.date > a.date ? 1 : -1))
    .slice(0, 5);

  const remaining = globalRemaining();

  return (
    <div className="space-y-6">
      {/* Hero remaining */}
      <Card glow className="text-center py-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          <span className="text-sm text-text-muted font-medium">
            Remaining Balance
          </span>
        </div>
        <p
          className={`font-mono text-4xl font-bold ${
            remaining >= 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {formatCurrency(remaining)}
        </p>
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        {summaryCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-xs text-text-muted">{label}</span>
            </div>
            <p className="font-mono text-lg font-semibold text-text-primary">
              {formatCurrency(value)}
            </p>
          </Card>
        ))}
      </div>

      {/* Bar chart */}
      <Card>
        <h3 className="font-display text-sm font-semibold text-text-primary mb-4">
          Monthly Income vs Expenses
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--text-primary)" }}
              />
              <Bar dataKey="income" fill="#34D399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#F87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent transactions */}
      <Card>
        <h3 className="font-display text-sm font-semibold text-text-primary mb-4">
          Recent Transactions
        </h3>
        {recent.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-6">
            No transactions yet
          </p>
        ) : (
          <div className="space-y-3">
            {recent.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-2 border-b border-card-border/50 last:border-0"
              >
                <div>
                  <p className="text-sm text-text-primary font-medium">
                    {tx.title}
                  </p>
                  <p className="text-xs text-text-muted">{tx.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={tx.type === "income" ? "success" : "warning"}
                  >
                    {tx.type === "income" ? "Income" : "Expense"}
                  </Badge>
                  <span
                    className={`font-mono text-sm font-medium ${
                      tx.type === "income"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
