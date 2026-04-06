"use client";

import { useState } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { getMonthName } from "@/utils/getMonthName";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/tables/DataTable";
import ExpenseForm from "@/components/forms/ExpenseForm";
import { CreditCard, Plus } from "lucide-react";
import type { Expense } from "@/types";

export default function ExpensesPage() {
  const { expenses, totalExpenses, loading, deleteExpense } =
    useFinanceStore();
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (row: Expense) => {
    if (!confirm("Delete this expense?")) return;
    await deleteExpense(row.id);
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "date", label: "Date" },
    {
      key: "month",
      label: "Month",
      render: (row: Expense) => getMonthName(row.month),
    },
    {
      key: "year",
      label: "Year",
      render: (row: Expense) => <span className="font-mono">{row.year}</span>,
    },
    {
      key: "amount",
      label: "Amount",
      render: (row: Expense) => (
        <span className="font-mono font-medium text-red-400">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: "tag",
      label: "Tag",
      render: (row: Expense) => <Badge>{row.tag}</Badge>,
    },
  ];

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
          {loading ? "..." : formatCurrency(totalExpenses())}
        </p>
      </Card>

      <Card>
        <DataTable
          columns={columns}
          data={expenses}
          loading={loading}
          onDelete={handleDelete}
          emptyTitle="No expenses"
          emptyDescription="Add your first expense to start tracking"
        />
      </Card>

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
