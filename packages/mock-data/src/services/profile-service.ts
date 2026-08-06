import type { Auction, GarageEntry, Post, User } from "@carasta/types";
import { MOCK_AUCTIONS } from "../seed/auctions";
import { MOCK_POSTS } from "../seed/posts";
import { MOCK_USERS } from "../seed/users";
import { MOCK_VEHICLES } from "../seed/vehicles";
import { garageService } from "./garage-service";

function delay(ms = 100): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

const me = MOCK_USERS.find((u) => u.id === "user-me")!;

export type ProfileBid = {
  id: string;
  auction: Auction;
  amount: number;
  isLeading: boolean;
  placedAt: string;
};

export type ProfilePurchase = {
  id: string;
  vehicleTitle: string;
  vehicleId: string;
  imageUrl?: string;
  amount: number;
  purchasedAt: string;
};

export type ProfileTabData = {
  garage: GarageEntry[];
  listings: Auction[];
  bids: ProfileBid[];
  purchases: ProfilePurchase[];
  saved: GarageEntry[];
  followers: User[];
  following: User[];
  posts: Post[];
};

function listingsForUser(userId: string): Auction[] {
  return MOCK_AUCTIONS.filter((a) => a.vehicle.seller.id === userId);
}

function bidsForUser(userId: string): ProfileBid[] {
  const rows: ProfileBid[] = [];
  for (const auction of MOCK_AUCTIONS) {
    for (const bid of auction.bids) {
      if (bid.bidder.id === userId) {
        rows.push({
          id: bid.id,
          auction,
          amount: bid.amount,
          isLeading: auction.leadingBidder?.id === userId,
          placedAt: bid.createdAt,
        });
      }
    }
  }

  if (userId === "user-me" && rows.length === 0) {
    const live = MOCK_AUCTIONS.filter((a) => a.status === "live" || a.status === "ending-soon").slice(0, 3);
    live.forEach((auction, i) => {
      rows.push({
        id: `profile-bid-${i + 1}`,
        auction,
        amount: auction.currentBid - auction.minimumBidIncrement,
        isLeading: false,
        placedAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
      });
    });
  }

  return rows.sort((a, b) => +new Date(b.placedAt) - +new Date(a.placedAt));
}

function purchasesForUser(userId: string, garage: GarageEntry[]): ProfilePurchase[] {
  const wins = garage
    .filter((e) => e.type === "auction-win" || e.type === "owned")
    .slice(0, 4)
    .map((e) => ({
      id: `purchase-${e.id}`,
      vehicleTitle: e.vehicle.title,
      vehicleId: e.vehicle.id,
      imageUrl: e.vehicle.images[0]?.url,
      amount: e.purchasePrice ?? e.vehicle.startingPrice,
      purchasedAt: e.purchasedAt ?? e.addedAt,
    }));

  if (wins.length > 0) return wins;

  if (userId === "user-me") {
    return [
      {
        id: "purchase-1",
        vehicleTitle: MOCK_VEHICLES[4]!.title,
        vehicleId: MOCK_VEHICLES[4]!.id,
        imageUrl: MOCK_VEHICLES[4]!.images[0]?.url,
        amount: 42000,
        purchasedAt: new Date(Date.now() - 90 * 86400000).toISOString(),
      },
      {
        id: "purchase-2",
        vehicleTitle: MOCK_VEHICLES[11]!.title,
        vehicleId: MOCK_VEHICLES[11]!.id,
        imageUrl: MOCK_VEHICLES[11]!.images[0]?.url,
        amount: 28500,
        purchasedAt: new Date(Date.now() - 180 * 86400000).toISOString(),
      },
    ];
  }

  return [];
}

function followersForUser(userId: string): User[] {
  return MOCK_USERS.filter((u) => u.id !== userId && u.id !== "user-admin").slice(0, 6);
}

function followingForUser(userId: string): User[] {
  return MOCK_USERS.filter((u) => u.id !== userId && u.id !== "user-admin")
    .slice()
    .reverse()
    .slice(0, 5);
}

export const profileService = {
  async getProfileTabs(userId: string): Promise<ProfileTabData> {
    await delay();
    const garage = await garageService.getGarageForUser(userId);
    let listings = listingsForUser(userId);

    if (userId === me.id && listings.length === 0) {
      const sample = MOCK_AUCTIONS.find((a) => a.status === "live") ?? MOCK_AUCTIONS[0]!;
      listings = [
        {
          ...sample,
          id: "profile-listing-1",
          vehicle: { ...MOCK_VEHICLES[6]!, seller: me, status: "in-auction" },
          bidCount: 7,
          currentBid: 58200,
          startingBid: 52000,
        },
      ];
    }

    const posts = MOCK_POSTS.filter((p) => p.author.id === userId);

    return {
      garage,
      listings,
      bids: bidsForUser(userId),
      purchases: purchasesForUser(userId, garage),
      saved: garage.filter((e) => e.type === "wishlist"),
      followers: followersForUser(userId),
      following: followingForUser(userId),
      posts,
    };
  },
};
