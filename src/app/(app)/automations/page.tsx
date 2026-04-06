"use client";

import { useState, useEffect } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { getMonthName } from "@/utils/getMonthName";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import AutomationForm from "@/components/forms/AutomationForm";
import { Zap, Plus, Trash2 } from "lucide-react";

export default function AutomationsPage() {
  const {
    automations,
    loading,
    toggleAutomation,
    deleteAutomation,
    runAutomations,
  } = useFinanceStore();
  const [modalOpen, setModalOpen] = useState(false);

  // Run automations on page load
  useEffect(() => {
    if (!loading && automations.length > 0) {
      runAutomations();
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this automation?")) return;
    await deleteAutomation(id);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-48" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Automations
        </h1>
        <Button onClick={() => setModalOpen(true)} size="sm">
          <Plus className="h-4 w-4" />
          Add Automation
        </Button>
      </div>

      {automations.length === 0 ? (
        <Card>
          <EmptyState
            title="No automations"
            description="Set up automated savings or expense rules"
            icon={<Zap className="h-12 w-12" />}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {automations.map((auto) => (
            <Card key={auto.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap
                    className={`h-4 w-4 ${
                      auto.is_active ? "text-accent" : "text-text-muted"
                    }`}
                  />
                  <span className="text-sm font-semibold text-text-primary">
                    {auto.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAutomation(auto.id, !auto.is_active)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      auto.is_active ? "bg-accent" : "bg-bg-tertiary"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        auto.is_active ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(auto.id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="accent">{auto.action_type}</Badge>
                <Badge>From: {auto.from_source}</Badge>
                <Badge>Target: {auto.target}</Badge>
                <Badge variant="warning">
                  {getMonthName(auto.trigger_month)}
                </Badge>
              </div>
              <p className="font-mono text-lg font-semibold text-text-primary">
                {formatCurrency(auto.amount)}
              </p>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Automation"
      >
        <AutomationForm onClose={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
