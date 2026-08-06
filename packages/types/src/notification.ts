export type NotificationType =
  | "outbid"
  | "auction-ending"
  | "auction-won"
  | "auction-lost"
  | "comment"
  | "like"
  | "follower"
  | "vehicle-sold"
  | "new-bid"
  | "offer-received"
  | "offer-accepted"
  | "offer-declined"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: {
    auctionId?: string;
    vehicleId?: string;
    postId?: string;
    userId?: string;
    bidAmount?: number;
  };
  createdAt: string;
}
