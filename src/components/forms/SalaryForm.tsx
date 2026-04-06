"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useFinanceStore } from "@/store/useFinanceStore";
import { getMonthName } from "@/utils/getMonthName";

interface SalaryFormProps {
  onClose: () => void;
}

export default function SalaryForm({ onClose }: SalaryFormProps) {
  const addSalary = useFinanceStore((s) => s.addSalary);
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setLoading(true);
    await addSalary({
      amount: Number(amount),
      month,
      year: new Date().getFullYear(),
      tag: tag || "Salary",
    });
    setLoading(false);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-muted">Month</label>
        <select
          className="input-base"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {getMonthName(i + 1)}
            </option>
          ))}
        </select>
      </div>
      <Input
        label="Tag"
        placeholder="e.g. Main Job, Freelance"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
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
