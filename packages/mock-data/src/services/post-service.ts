import type { Post, Club, Story, PaginatedResponse } from "@carasta/types";
import { MOCK_POSTS, MOCK_CLUBS, MOCK_STORIES } from "../seed/posts";

function delay(ms = 150): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export const postService = {
  async getFeed(page = 1, pageSize = 10): Promise<PaginatedResponse<Post>> {
    await delay();
    const total = MOCK_POSTS.length;
    const start = (page - 1) * pageSize;
    return { data: MOCK_POSTS.slice(start, start + pageSize), total, page, pageSize, hasNextPage: start + pageSize < total };
  },

  async getPost(id: string): Promise<Post | null> {
    await delay(80);
    return MOCK_POSTS.find((p) => p.id === id) ?? null;
  },

  async getUserPosts(userId: string): Promise<Post[]> {
    await delay();
    return MOCK_POSTS.filter((p) => p.author.id === userId);
  },

  async getClubs(page = 1, pageSize = 12): Promise<PaginatedResponse<Club>> {
    await delay();
    const total = MOCK_CLUBS.length;
    const start = (page - 1) * pageSize;
    return { data: MOCK_CLUBS.slice(start, start + pageSize), total, page, pageSize, hasNextPage: false };
  },

  async getStories(): Promise<Story[]> {
    await delay(80);
    return MOCK_STORIES;
  },

  async getCommunityHighlights(limit = 4): Promise<Post[]> {
    await delay(100);
    return MOCK_POSTS.sort((a, b) => b.likes - a.likes).slice(0, limit);
  },

  async getTrendingBuilds(limit = 4): Promise<Post[]> {
    await delay(100);
    return MOCK_POSTS.filter((p) => p.type === "build").slice(0, limit);
  },

  async toggleLike(postId: string): Promise<{ liked: boolean; count: number }> {
    await delay(100);
    const post = MOCK_POSTS.find((p) => p.id === postId);
    if (!post) throw new Error("Post not found");
    const liked = !post.isLiked;
    post.isLiked = liked;
    post.likes += liked ? 1 : -1;
    return { liked, count: post.likes };
  },
};
