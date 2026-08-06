import type { Metadata } from "next";
import { messageService } from "@carasta/mock-data/services";
import { MessagesClient } from "./MessagesClient";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const conversations = await messageService.getConversations();
  return <MessagesClient conversations={conversations} />;
}
