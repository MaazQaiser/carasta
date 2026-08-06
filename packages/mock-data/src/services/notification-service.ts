import type { Notification, NotificationType } from "@carasta/types";
import { MOCK_NOTIFICATIONS } from "../seed/notifications";

function delay(ms = 100): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    await delay();
    return [...MOCK_NOTIFICATIONS].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getUnreadCount(): Promise<number> {
    await delay(50);
    return MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;
  },

  async markAsRead(id: string): Promise<void> {
    await delay(80);
    const n = MOCK_NOTIFICATIONS.find((n) => n.id === id);
    if (n) n.isRead = true;
  },

  async markAllAsRead(): Promise<void> {
    await delay(120);
    MOCK_NOTIFICATIONS.forEach((n) => {
      n.isRead = true;
    });
  },

  /** Append a runtime notification (mock inbox). */
  async create(input: {
    type: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
    metadata?: Notification["metadata"];
  }): Promise<Notification> {
    await delay(40);
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: input.type,
      title: input.title,
      message: input.message,
      isRead: false,
      actionUrl: input.actionUrl,
      metadata: input.metadata,
      createdAt: new Date().toISOString(),
    };
    MOCK_NOTIFICATIONS.unshift(notification);
    return notification;
  },
};
