import type { User } from "./user";
import type { Vehicle } from "./vehicle";

export type AuctionStatus = "live" | "upcoming" | "ending-soon" | "completed" | "cancelled";

export interface Bid {
  id: string;
  auctionId: string;
  bidder: User;
  amount: number;
  isAutoBid: boolean;
  createdAt: string;
}

export interface AutoBidRule {
  userId: string;
  maxAmount: number;
  increment: number;
  isActive: boolean;
}

export interface Auction {
  id: string;
  vehicle: Vehicle;
  status: AuctionStatus;
  startingBid: number;
  currentBid: number;
  bidCount: number;
  reserveMet: boolean;
  reservePrice?: number;
  minimumBidIncrement: number;
  startTime: string;
  endTime: string;
  participantCount: number;
  watcherCount: number;
  bids: Bid[];
  leadingBidder?: User;
  winner?: User;
  finalPrice?: number;
  autoShipping: boolean;
  sellerNotes?: string;
  createdAt: string;
}

export interface AuctionFilters {
  status?: AuctionStatus | AuctionStatus[];
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  fuelType?: string;
  transmission?: string;
  location?: string;
}

export type AuctionSortField =
  | "newest"
  | "ending-soon"
  | "highest-bid"
  | "lowest-price"
  | "recently-listed";

export interface AuctionBidPoint {
  time: string;
  amount: number;
  bidder: string;
}

export interface LiveAuctionState {
  auctionId: string;
  currentBid: number;
  bidCount: number;
  participantCount: number;
  timeRemaining: number;
  recentBids: Bid[];
  isActive: boolean;
}
