"use client";

import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-text-muted">
        {icon ?? <Inbox className="h-12 w-12" />}
      </div>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-muted max-w-xs">{description}</p>
      )}
    </div>
  );
}
