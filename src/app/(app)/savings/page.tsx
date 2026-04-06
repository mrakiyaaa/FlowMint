"use client";

import { useState } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { formatCurrency } from "@/utils/formatCurrency";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import { PiggyBank, Plus, Trash2 } from "lucide-react";

export default function SavingsPage() {
  const { savings, totalSavings, loading, addSaving, deleteSaving } =
    useFinanceStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Enter a title");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setFormLoading(true);
    await addSaving({
      title: title.trim(),
      amount: Number(amount),
      source: "Manual",
    });
    setFormLoading(false);
    setTitle("");
    setAmount("");
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this saving?")) return;
    await deleteSaving(id);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-48" />
        <div className="skeleton h-28 w-full" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Savings
        </h1>
        <Button onClick={() => setModalOpen(true)} size="sm">
          <Plus className="h-4 w-4" />
          Add Saving
        </Button>
      </div>

      <Card glow>
        <div className="flex items-center gap-2 mb-1">
          <PiggyBank className="h-5 w-5 text-amber-400" />
          <span className="text-sm text-text-muted">Total Savings</span>
        </div>
        <p className="font-mono text-3xl font-bold text-text-primary">
          {formatCurrency(totalSavings())}
        </p>
      </Card>

      {savings.length === 0 ? (
        <Card>
          <EmptyState
            title="No savings yet"
            description="Start saving to build your financial future"
            icon={<PiggyBank className="h-12 w-12" />}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {savings.map((saving) => (
            <Card key={saving.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {saving.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="accent">{saving.source}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-semibold text-amber-400">
                  {formatCurrency(saving.amount)}
                </span>
                <button
                  onClick={() => handleDelete(saving.id)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Saving"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Title"
            placeholder="e.g. Emergency Fund"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
            }}
          />
          <Input
            label="Amount (LKR)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            error={error}
          />
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" loading={formLoading} className="flex-1">
              Add Saving
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
