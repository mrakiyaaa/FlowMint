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
import SalaryForm from "@/components/forms/SalaryForm";
import { Banknote, Plus } from "lucide-react";
import type { SalaryIncome } from "@/types";

export default function SalaryPage() {
  const { salaryIncomes, totalSalary, loading, deleteSalary } =
    useFinanceStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (row: SalaryIncome) => {
    if (!confirm("Delete this salary entry?")) return;
    setDeleting(row.id);
    await deleteSalary(row.id);
    setDeleting(null);
  };

  const columns = [
    {
      key: "amount",
      label: "Amount",
      render: (row: SalaryIncome) => (
        <span className="font-mono font-medium text-emerald-400">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: "month",
      label: "Month",
      render: (row: SalaryIncome) => getMonthName(row.month),
    },
    {
      key: "year",
      label: "Year",
      render: (row: SalaryIncome) => (
        <span className="font-mono">{row.year}</span>
      ),
    },
    {
      key: "tag",
      label: "Tag",
      render: (row: SalaryIncome) => <Badge variant="accent">{row.tag}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Salary Incomes
        </h1>
        <Button onClick={() => setModalOpen(true)} size="sm">
          <Plus className="h-4 w-4" />
          Add Income
        </Button>
      </div>

      <Card glow>
        <div className="flex items-center gap-2 mb-1">
          <Banknote className="h-5 w-5 text-emerald-400" />
          <span className="text-sm text-text-muted">Total Salary</span>
        </div>
        <p className="font-mono text-3xl font-bold text-text-primary">
          {loading ? "..." : formatCurrency(totalSalary())}
        </p>
      </Card>

      <Card>
        <DataTable
          columns={columns}
          data={salaryIncomes}
          loading={loading}
          onDelete={handleDelete}
          emptyTitle="No salary entries"
          emptyDescription="Add your first salary income to get started"
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Salary Income"
      >
        <SalaryForm onClose={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
