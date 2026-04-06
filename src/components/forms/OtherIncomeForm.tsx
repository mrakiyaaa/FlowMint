"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useFinanceStore } from "@/store/useFinanceStore";

interface OtherIncomeFormProps {
  onClose: () => void;
}

export default function OtherIncomeForm({ onClose }: OtherIncomeFormProps) {
  const addOtherIncome = useFinanceStore((s) => s.addOtherIncome);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Enter a title");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setLoading(true);
    const d = new Date(date);
    await addOtherIncome({
      title: title.trim(),
      amount: Number(amount),
      date,
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    });
    setLoading(false);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        placeholder="e.g. Freelance project"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setError("");
        }}
      />
      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
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
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          Add Income
        </Button>
      </div>
    </form>
  );
}
