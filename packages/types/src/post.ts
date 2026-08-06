import type { Image } from "./common";
import type { User } from "./user";
import type { Vehicle } from "./vehicle";

export type PostType = "photo" | "video" | "build" | "story";

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
  caption?: string;
  images: Image[];
  videoUrl?: string;
  thumbnailUrl?: string;
  linkedVehicle?: Vehicle;
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
