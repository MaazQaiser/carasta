import type { User } from "@carasta/types";
import { MOCK_USERS } from "../seed/users";

function delay(ms = 100): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export const userService = {
  async getUser(id: string): Promise<User | null> {
    await delay();
    return MOCK_USERS.find((u) => u.id === id) ?? null;
  },

  async getUserByUsername(username: string): Promise<User | null> {
    await delay();
    return MOCK_USERS.find((u) => u.username === username) ?? null;
  },

  async getCurrentUser(): Promise<User> {
    await delay(50);
    return MOCK_USERS[6]!;
  },

  async searchUsers(query: string): Promise<User[]> {
    await delay(120);
    const q = query.toLowerCase();
    return MOCK_USERS.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.displayName.toLowerCase().includes(q)
    ).slice(0, 10);
  },

  async getSuggestedUsers(limit = 5): Promise<User[]> {
    await delay();
    return MOCK_USERS.filter((u) => u.id !== "user-me").slice(0, limit);
  },

  async getCreators(limit = 10): Promise<User[]> {
    await delay();
    return MOCK_USERS.filter((u) => u.stats.followersCount > 100).sort((a, b) => b.stats.followersCount - a.stats.followersCount).slice(0, limit);
  },
};
