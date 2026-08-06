import type { Image, Location } from "./common";
import type { User } from "./user";
import type { Vehicle } from "./vehicle";

export type PostType = "photo" | "video" | "build" | "story";

/** Carmunity Create Post category chips (single-select). */
export type PostCategory =
  | "general"
  | "build-update"
  | "restoration"
  | "marketplace-share"
  | "auction-share"
  | "event";

export interface Comment {
  id: string;
  author: User;
  content: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
  createdAt: string;
}

export interface Post {
  id: string;
  author: User;
  type: PostType;
  /** Create Post category — optional for legacy seed posts. */
  category?: PostCategory;
  caption?: string;
  images: Image[];
  videoUrl?: string;
  thumbnailUrl?: string;
  linkedVehicle?: Vehicle;
  taggedUsers?: User[];
  location?: Location | string;
  hashtags: string[];
  likes: number;
  isLiked?: boolean;
  comments: Comment[];
  commentCount: number;
  shares: number;
  views: number;
  isBookmarked?: boolean;
  createdAt: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  coverImage?: Image;
  memberCount: number;
  postCount: number;
  tags: string[];
  isJoined?: boolean;
  createdAt: string;
}

export interface Story {
  id: string;
  author: User;
  mediaUrl: string;
  mediaType: "image" | "video";
  duration: number;
  views: number;
  createdAt: string;
  expiresAt: string;
}
