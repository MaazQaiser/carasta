import type { Post, Club, Story, PaginatedResponse, User, PostCategory } from "@carasta/types";
import { MOCK_POSTS, MOCK_CLUBS, MOCK_STORIES } from "../seed/posts";

function delay(ms = 150): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Mutable in-memory feed so newly created posts appear in subsequent reads. */
const feedPosts: Post[] = [...MOCK_POSTS];

export type CreatePostInput = {
  author: User;
  caption?: string;
  images?: Post["images"];
  videoUrl?: string;
  thumbnailUrl?: string;
  category?: PostCategory;
  type?: Post["type"];
  linkedVehicle?: Post["linkedVehicle"];
  taggedUsers?: User[];
  location?: Post["location"];
  hashtags?: string[];
};

function categoryToType(category?: PostCategory, hasVideo?: boolean): Post["type"] {
  if (hasVideo) return "video";
  switch (category) {
    case "build-update":
    case "restoration":
      return "build";
    case "event":
      return "story";
    default:
      return "photo";
  }
}

export const postService = {
  async getFeed(page = 1, pageSize = 10): Promise<PaginatedResponse<Post>> {
    await delay();
    const total = feedPosts.length;
    const start = (page - 1) * pageSize;
    return { data: feedPosts.slice(start, start + pageSize), total, page, pageSize, hasNextPage: start + pageSize < total };
  },

  async getPost(id: string): Promise<Post | null> {
    await delay(80);
    return feedPosts.find((p) => p.id === id) ?? null;
  },

  async getUserPosts(userId: string): Promise<Post[]> {
    await delay();
    return feedPosts.filter((p) => p.author.id === userId);
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
    return [...feedPosts].sort((a, b) => b.likes - a.likes).slice(0, limit);
  },

  async getTrendingBuilds(limit = 4): Promise<Post[]> {
    await delay(100);
    return feedPosts.filter((p) => p.type === "build").slice(0, limit);
  },

  async createPost(input: CreatePostInput): Promise<Post> {
    await delay(400);
    const images = input.images ?? [];
    const hasVideo = Boolean(input.videoUrl);
    const post: Post = {
      id: `post-${Date.now()}`,
      author: input.author,
      type: input.type ?? categoryToType(input.category, hasVideo),
      category: input.category,
      caption: input.caption?.trim() || undefined,
      images,
      videoUrl: input.videoUrl,
      thumbnailUrl: input.thumbnailUrl,
      linkedVehicle: input.linkedVehicle,
      taggedUsers: input.taggedUsers,
      location: input.location,
      hashtags: input.hashtags ?? [],
      likes: 0,
      isLiked: false,
      comments: [],
      commentCount: 0,
      shares: 0,
      views: 0,
      createdAt: new Date().toISOString(),
    };
    feedPosts.unshift(post);
    return post;
  },

  async toggleLike(postId: string): Promise<{ liked: boolean; count: number }> {
    await delay(100);
    const post = feedPosts.find((p) => p.id === postId);
    if (!post) throw new Error("Post not found");
    const liked = !post.isLiked;
    post.isLiked = liked;
    post.likes += liked ? 1 : -1;
    return { liked, count: post.likes };
  },
};
