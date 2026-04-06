"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useFinanceStore } from "@/store/useFinanceStore";
import { getMonthName } from "@/utils/getMonthName";

interface AutomationFormProps {
  onClose: () => void;
}

export default function AutomationForm({ onClose }: AutomationFormProps) {
  const addAutomation = useFinanceStore((s) => s.addAutomation);
  const [label, setLabel] = useState("");
  const [actionType, setActionType] = useState<"Save" | "Expense">("Save");
  const [fromSource, setFromSource] = useState<"Salary" | "Other Income">("Salary");
  const [amount, setAmount] = useState("");
  const [triggerMonth, setTriggerMonth] = useState(new Date().getMonth() + 1);
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setError("Enter a label");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (!target.trim()) {
      setError("Enter a target");
      return;
    }
    setLoading(true);
    await addAutomation({
      label: label.trim(),
      action_type: actionType,
      from_source: fromSource,
      amount: Number(amount),
      trigger_month: triggerMonth,
      target: target.trim(),
      is_active: true,
    });
    setLoading(false);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Label"
        placeholder="e.g. Monthly savings"
        value={label}
        onChange={(e) => {
          setLabel(e.target.value);
          setError("");
        }}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-muted">Action Type</label>
        <select
          className="input-base"
          value={actionType}
          onChange={(e) => setActionType(e.target.value as "Save" | "Expense")}
        >
          <option value="Save">Save</option>
          <option value="Expense">Expense</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-muted">From Source</label>
        <select
          className="input-base"
          value={fromSource}
          onChange={(e) =>
            setFromSource(e.target.value as "Salary" | "Other Income")
          }
        >
          <option value="Salary">Salary</option>
          <option value="Other Income">Other Income</option>
        </select>
      </div>
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
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-muted">Trigger Month</label>
        <select
          className="input-base"
          value={triggerMonth}
          onChange={(e) => setTriggerMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {getMonthName(i + 1)}
            </option>
          ))}
        </select>
      </div>
      <Input
        label={actionType === "Save" ? "Savings Title" : "Expense Title/Tag"}
        placeholder={
          actionType === "Save" ? "e.g. Emergency Fund" : "e.g. Rent"
        }
        value={target}
        onChange={(e) => {
          setTarget(e.target.value);
          setError("");
        }}
        error={error}
      />
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          Add Automation
        </Button>
      </div>
    </form>
  );
}
