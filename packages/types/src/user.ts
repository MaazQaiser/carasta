import type { Image } from "./common";

export type UserRole = "buyer" | "seller" | "admin";

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: Image;
  coverImage?: Image;
  bio?: string;
  location?: string;
  role: UserRole;
  isVerified: boolean;
  isSeller: boolean;
  stats: UserStats;
  joinedAt: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    website?: string;
  };
}

export interface UserStats {
  totalListings: number;
  totalSales: number;
  totalPurchases: number;
  totalBids: number;
  followersCount: number;
  followingCount: number;
  garageCount: number;
  rating?: number;
  reviewCount?: number;
  /** Optional seller response rate (0–100). */
  responseRate?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
