"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Gavel, TrendingUp, Trophy, MessageSquare, Heart, UserPlus, Car, Shield, Check, CheckCheck } from "lucide-react";
import type { Notification, NotificationType } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatRelativeTime } from "@/lib/utils";

interface Props { initialNotifications: Notification[] }

const TYPE_CONFIG: Record<NotificationType, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  outbid: { icon: TrendingUp, color: "text-red-500 bg-red-50 dark:bg-red-950" },
  "auction-ending": { icon: Gavel, color: "text-orange-500 bg-orange-50 dark:bg-orange-950" },
  "auction-won": { icon: Trophy, color: "text-yellow-500 bg-yellow-50 dark:bg-yellow-950" },
  "auction-lost": { icon: Gavel, color: "text-muted-foreground bg-muted" },
  "auction-ended": { icon: Gavel, color: "text-muted-foreground bg-muted" },
  "reserve-met": { icon: Check, color: "text-green-500 bg-green-50 dark:bg-green-950" },
  "bid-submitted": { icon: Gavel, color: "text-bid bg-amber-50 dark:bg-amber-950" },
  comment: { icon: MessageSquare, color: "text-blue-500 bg-blue-50 dark:bg-blue-950" },
  like: { icon: Heart, color: "text-pink-500 bg-pink-50 dark:bg-pink-950" },
  follower: { icon: UserPlus, color: "text-purple-500 bg-purple-50 dark:bg-purple-950" },
  "vehicle-sold": { icon: Car, color: "text-green-500 bg-green-50 dark:bg-green-950" },
  "new-bid": { icon: Gavel, color: "text-bid bg-amber-50 dark:bg-amber-950" },
  "offer-received": { icon: Car, color: "text-blue-500 bg-blue-50 dark:bg-blue-950" },
  "offer-accepted": { icon: Check, color: "text-green-500 bg-green-50 dark:bg-green-950" },
  "offer-declined": { icon: Car, color: "text-red-500 bg-red-50 dark:bg-red-950" },
  system: { icon: Shield, color: "text-muted-foreground bg-muted" },
};

const FILTER_TABS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "auction", label: "Auctions" },
  { value: "social", label: "Social" },
  { value: "system", label: "System" },
];

function filterNotifications(notifications: Notification[], filter: string): Notification[] {
  if (filter === "all") return notifications;
  if (filter === "auction") {
    return notifications.filter((n) =>
      ["outbid", "auction-ending", "auction-won", "auction-lost", "auction-ended", "reserve-met", "bid-submitted", "new-bid"].includes(n.type)
    );
  }
  if (filter === "social") return notifications.filter((n) => ["comment", "like", "follower"].includes(n.type));
  if (filter === "system") return notifications.filter((n) => ["vehicle-sold", "system", "offer-received", "offer-accepted", "offer-declined"].includes(n.type));
  return notifications;
}

export function NotificationsClient({ initialNotifications }: Props) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filtered = filterNotifications(notifications, filter);

  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

  return (
    <div className="mx-auto max-w-2xl px-4 lg:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && <p className="text-sm text-muted-foreground mt-0.5">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead} className="gap-1.5">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors border shrink-0",
              filter === tab.value ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border hover:border-primary/50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="font-semibold mb-1">No notifications</p>
          <p className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => {
            const config = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.system;
            const Icon = config.icon;
            return (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-2xl border transition-colors cursor-pointer hover:bg-accent",
                  !n.isRead && "bg-muted/50 border-primary/20"
                )}
                onClick={() => markRead(n.id)}
              >
                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0", config.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm", !n.isRead && "font-semibold")}>{n.title}</p>
                    {!n.isRead && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(n.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
