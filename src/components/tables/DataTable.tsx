"use client";

import { Trash2 } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onDelete?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  loading,
  onDelete,
  emptyTitle = "No data yet",
  emptyDescription = "Add your first entry to get started",
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-12 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="border-b border-card-border">
            <th className="text-left text-xs font-medium text-text-muted py-3 pr-4">
              #
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left text-xs font-medium text-text-muted py-3 pr-4"
              >
                {col.label}
              </th>
            ))}
            {onDelete && (
              <th className="text-right text-xs font-medium text-text-muted py-3">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id}
              className="border-b border-card-border/50 last:border-0 hover:bg-bg-tertiary/50 transition-colors"
            >
              <td className="py-3 pr-4 text-sm text-text-muted font-mono">
                {index + 1}
              </td>
              {columns.map((col) => (
                <td key={col.key} className="py-3 pr-4 text-sm text-text-primary">
                  {col.render
                    ? col.render(row, index)
                    : String((row as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
              {onDelete && (
                <td className="py-3 text-right">
                  <button
                    onClick={() => onDelete(row)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
