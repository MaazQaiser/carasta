import type { Message, Conversation } from "@carasta/types";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "../seed/messages";

function delay(ms = 120): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export const messageService = {
  async getConversations(): Promise<Conversation[]> {
    await delay();
    return MOCK_CONVERSATIONS.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    await delay();
    return MOCK_MESSAGES[conversationId] ?? [];
  },

  async getUnreadCount(): Promise<number> {
    await delay(50);
    return MOCK_CONVERSATIONS.reduce((sum, c) => sum + c.unreadCount, 0);
  },
};
