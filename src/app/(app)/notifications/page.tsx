"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Bell, CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const { notifications, loading, markAllRead } = useFinanceStore();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-48" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Notifications
        </h1>
        {hasUnread && (
          <Button onClick={markAllRead} variant="ghost" size="sm">
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <EmptyState
            title="No notifications"
            description="You're all caught up"
            icon={<Bell className="h-12 w-12" />}
          />
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`flex items-start gap-3 ${
                !notif.is_read ? "border-accent/30" : ""
              }`}
            >
              <div
                className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  notif.is_read ? "bg-text-muted/30" : "bg-accent"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary">{notif.message}</p>
                <p className="text-xs text-text-muted mt-1">
                  {new Date(notif.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
