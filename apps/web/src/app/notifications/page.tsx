import type { Metadata } from "next";
import { notificationService } from "@carasta/mock-data/services";
import { NotificationsClient } from "./NotificationsClient";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const notifications = await notificationService.getNotifications();
  return <NotificationsClient initialNotifications={notifications} />;
}
