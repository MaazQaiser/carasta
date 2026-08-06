import type { Message, Conversation } from "@carasta/types";
import { MOCK_USERS } from "./users";
import { MOCK_VEHICLES } from "./vehicles";

const me = MOCK_USERS[6]!;
const u1 = MOCK_USERS[0]!;
const u2 = MOCK_USERS[1]!;
const u3 = MOCK_USERS[2]!;

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    participants: [me, u1],
    linkedVehicle: { id: MOCK_VEHICLES[0]!.id, title: MOCK_VEHICLES[0]!.title, images: MOCK_VEHICLES[0]!.images, startingPrice: MOCK_VEHICLES[0]!.startingPrice },
    lastMessage: {
      id: "m-1-3",
      conversationId: "conv-1",
      sender: u1,
      type: "text",
      content: "Yes, the service history is complete. I can share the full records before the auction ends.",
      isRead: false,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
    unreadCount: 2,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "conv-2",
    participants: [me, u3],
    linkedVehicle: { id: MOCK_VEHICLES[1]!.id, title: MOCK_VEHICLES[1]!.title, images: MOCK_VEHICLES[1]!.images, startingPrice: MOCK_VEHICLES[1]!.startingPrice },
    lastMessage: {
      id: "m-2-2",
      conversationId: "conv-2",
      sender: me,
      type: "text",
      content: "Is there any flexibility on the buy-it-now price?",
      isRead: true,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "conv-3",
    participants: [me, u2],
    lastMessage: {
      id: "m-3-1",
      conversationId: "conv-3",
      sender: u2,
      type: "text",
      content: "Hey! I noticed you were looking at the NSX-R. I might know where another one is.",
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    unreadCount: 1,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  "conv-1": [
    { id: "m-1-1", conversationId: "conv-1", sender: me, type: "vehicle-reference", linkedVehicle: { id: MOCK_VEHICLES[0]!.id, title: MOCK_VEHICLES[0]!.title, images: MOCK_VEHICLES[0]!.images, startingPrice: MOCK_VEHICLES[0]!.startingPrice }, isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: "m-1-2", conversationId: "conv-1", sender: me, type: "text", content: "Hi Alex! I'm interested in the 911. Can you tell me more about the service history?", isRead: true, createdAt: new Date(Date.now() - 86000000).toISOString() },
    { id: "m-1-3", conversationId: "conv-1", sender: u1, type: "text", content: "Yes, the service history is complete. I can share the full records before the auction ends.", isRead: false, createdAt: new Date(Date.now() - 1800000).toISOString() },
  ],
  "conv-2": [
    { id: "m-2-1", conversationId: "conv-2", sender: me, type: "text", content: "Hi Marco, beautiful F8. Is there any flexibility on the reserve?", isRead: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
    { id: "m-2-2", conversationId: "conv-2", sender: me, type: "text", content: "Is there any flexibility on the buy-it-now price?", isRead: true, createdAt: new Date(Date.now() - 7200000).toISOString() },
  ],
  "conv-3": [
    { id: "m-3-1", conversationId: "conv-3", sender: u2, type: "text", content: "Hey! I noticed you were looking at the NSX-R. I might know where another one is.", isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  ],
};
