"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import { formatCurrency } from "@/utils/formatCurrency";
import Card from "@/components/ui/Card";
import {
  Banknote,
  Wallet,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Sparkles,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function TotalsPage() {
  const {
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
        <div className="skeleton h-10 w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-24" />
          ))}
        </div>
        <div className="skeleton h-72" />
      </div>
    );
  }

  const salary = totalSalary();
  const otherIncome = totalOtherIncome();
  const allIncome = salary + otherIncome;
  const exp = totalExpenses();
  const sav = totalSavings();
  const remaining = globalRemaining();

  const breakdownCards = [
    {
      label: "Total Salary Income",
      value: salary,
      icon: Banknote,
      color: "text-emerald-400",
    },
    {
      label: "Total Other Income",
      value: otherIncome,
      icon: Wallet,
      color: "text-blue-400",
    },
    {
      label: "Total All Income",
      value: allIncome,
      icon: TrendingUp,
      color: "text-cyan-400",
    },
    {
      label: "Total Expenses",
      value: exp,
      icon: CreditCard,
      color: "text-red-400",
    },
    {
      label: "Total Savings",
      value: sav,
      icon: PiggyBank,
      color: "text-amber-400",
    },
  ];

  const pieData = [
    { name: "Income", value: allIncome, color: "#34D399" },
    { name: "Expenses", value: exp, color: "#F87171" },
    { name: "Savings", value: sav, color: "#FBBF24" },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-text-primary">
        Financial Totals
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {breakdownCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-xs text-text-muted">{label}</span>
            </div>
            <p className="font-mono text-2xl font-bold text-text-primary">
              {formatCurrency(value)}
            </p>
          </Card>
        ))}

        <Card glow>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-xs text-text-muted font-medium">
              Remaining Balance
            </span>
          </div>
          <p
            className={`font-mono text-2xl font-bold ${
              remaining >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {formatCurrency(remaining)}
          </p>
          <p className="text-xs text-text-muted mt-1">
            All Income - Expenses - Savings
          </p>
        </Card>
      </div>

      {pieData.length > 0 && (
        <Card>
          <h3 className="font-display text-sm font-semibold text-text-primary mb-4">
            Distribution
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  dataKey="value"
                  paddingAngle={3}
                  stroke="none"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
