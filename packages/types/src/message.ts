import type { Image } from "./common";
import type { User } from "./user";
import type { Vehicle } from "./vehicle";

export type MessageType = "text" | "image" | "offer" | "vehicle-reference" | "system";

export interface Message {
  id: string;
  conversationId: string;
  sender: User;
  type: MessageType;
  content?: string;
  imageUrl?: string;
  linkedVehicle?: Pick<Vehicle, "id" | "title" | "images" | "startingPrice">;
  offerAmount?: number;
  offerStatus?: "pending" | "accepted" | "declined" | "countered";
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  linkedVehicle?: Pick<Vehicle, "id" | "title" | "images" | "startingPrice">;
  createdAt: string;
  updatedAt: string;
}
