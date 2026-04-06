"use client";

import { useState } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { getMonthName } from "@/utils/getMonthName";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/tables/DataTable";
import OtherIncomeForm from "@/components/forms/OtherIncomeForm";
import { Wallet, Plus } from "lucide-react";
import type { OtherIncome } from "@/types";

export default function IncomePage() {
  const { otherIncomes, totalOtherIncome, loading, deleteOtherIncome } =
    useFinanceStore();
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (row: OtherIncome) => {
    if (!confirm("Delete this income entry?")) return;
    await deleteOtherIncome(row.id);
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "date", label: "Date" },
    {
      key: "month",
      label: "Month",
      render: (row: OtherIncome) => getMonthName(row.month),
    },
    {
      key: "year",
      label: "Year",
      render: (row: OtherIncome) => (
        <span className="font-mono">{row.year}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (row: OtherIncome) => (
        <span className="font-mono font-medium text-blue-400">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Other Incomes
        </h1>
        <Button onClick={() => setModalOpen(true)} size="sm">
          <Plus className="h-4 w-4" />
          Add Income
        </Button>
      </div>

      <Card glow>
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="h-5 w-5 text-blue-400" />
          <span className="text-sm text-text-muted">Total Other Income</span>
        </div>
        <p className="font-mono text-3xl font-bold text-text-primary">
          {loading ? "..." : formatCurrency(totalOtherIncome())}
        </p>
      </Card>

      <Card>
        <DataTable
          columns={columns}
          data={otherIncomes}
          loading={loading}
          onDelete={handleDelete}
          emptyTitle="No other income"
          emptyDescription="Add your first income source"
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Other Income"
      >
        <OtherIncomeForm onClose={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
