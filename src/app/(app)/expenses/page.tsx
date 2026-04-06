"use client";

import { useState } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { getMonthName } from "@/utils/getMonthName";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ExpenseForm from "@/components/forms/ExpenseForm";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import type { Expense } from "@/types";

export default function ExpensesPage() {
  const { expenses, totalExpenses, loading, deleteExpense } = useFinanceStore();
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (row: Expense) => {
    if (!confirm("Delete this expense?")) return;
    await deleteExpense(row.id);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-48" />
        <div className="skeleton h-28 w-full" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Expenses
        </h1>
        <Button onClick={() => setModalOpen(true)} size="sm">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <Card glow>
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="h-5 w-5 text-red-400" />
          <span className="text-sm text-text-muted">Total Expenses</span>
        </div>
        <p className="font-mono text-3xl font-bold text-text-primary">
          {formatCurrency(totalExpenses())}
        </p>
      </Card>

      {expenses.length === 0 ? (
        <Card>
          <EmptyState
            title="No expenses"
            description="Add your first expense to start tracking"
            icon={<CreditCard className="h-12 w-12" />}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {expenses.map((item, index) => (
            <Card key={item.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs text-text-muted shrink-0 w-6 text-center">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {item.title}
                    </p>
                    <Badge>{item.tag}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="font-mono font-semibold text-red-400 text-sm">
                      {formatCurrency(item.amount)}
                    </span>
                    <span className="text-xs text-text-muted">
                      {item.date} · {getMonthName(item.month)} {item.year}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(item)}
                className="p-2 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Expense"
      >
        <ExpenseForm onClose={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
