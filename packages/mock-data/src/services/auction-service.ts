import type { Auction, AuctionFilters, AuctionSortField, Bid, PaginatedResponse, User } from "@carasta/types";
import { MOCK_AUCTIONS } from "../seed/auctions";
import { MOCK_USERS } from "../seed/users";

export class BidError extends Error {}

function delay(ms = 200): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Matches the "ending soon" tab badge definition: explicitly-flagged auctions
 *  plus any live auction closing within the next 3 hours. */
function isEndingSoon(a: Auction): boolean {
  return a.status === "ending-soon" || (a.status === "live" && new Date(a.endTime).getTime() - Date.now() < 3 * 3600000);
}

function applyFilters(auctions: Auction[], filters: AuctionFilters): Auction[] {
  return auctions.filter((a) => {
    if (filters.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      const matchesStatus = statuses.some((s) => (s === "ending-soon" ? isEndingSoon(a) : a.status === s));
      if (!matchesStatus) return false;
    }
    if (filters.make && a.vehicle.spec.make.toLowerCase() !== filters.make.toLowerCase()) return false;
    if (filters.model && !a.vehicle.spec.model.toLowerCase().includes(filters.model.toLowerCase())) return false;
    if (filters.yearMin && a.vehicle.spec.year < filters.yearMin) return false;
    if (filters.yearMax && a.vehicle.spec.year > filters.yearMax) return false;
    if (filters.priceMin && a.currentBid < filters.priceMin) return false;
    if (filters.priceMax && a.currentBid > filters.priceMax) return false;
    if (filters.mileageMax && a.vehicle.spec.mileage > filters.mileageMax) return false;
    if (filters.fuelType && a.vehicle.spec.fuelType !== filters.fuelType) return false;
    if (filters.transmission && a.vehicle.spec.transmission !== filters.transmission) return false;
    return true;
  });
}

function applySort(auctions: Auction[], sort: AuctionSortField): Auction[] {
  return [...auctions].sort((a, b) => {
    switch (sort) {
      case "ending-soon":
        return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
      case "highest-bid":
        return b.currentBid - a.currentBid;
      case "lowest-price":
        return a.currentBid - b.currentBid;
      case "newest":
      case "recently-listed":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });
}

export const auctionService = {
  async getAuctions(params: {
    filters?: AuctionFilters;
    sort?: AuctionSortField;
    page?: number;
    pageSize?: number;
  } = {}): Promise<PaginatedResponse<Auction>> {
    await delay(150);
    const { filters = {}, sort = "ending-soon", page = 1, pageSize = 12 } = params;
    let data = applyFilters(MOCK_AUCTIONS, filters);
    data = applySort(data, sort);
    const total = data.length;
    const start = (page - 1) * pageSize;
    return { data: data.slice(start, start + pageSize), total, page, pageSize, hasNextPage: start + pageSize < total };
  },

  async getAuction(id: string): Promise<Auction | null> {
    await delay(100);
    return MOCK_AUCTIONS.find((a) => a.id === id) ?? null;
  },

  async getAuctionForVehicle(vehicleId: string): Promise<Auction | null> {
    await delay(80);
    return MOCK_AUCTIONS.find((a) => a.vehicle.id === vehicleId) ?? null;
  },

  async getLiveAuctions(): Promise<Auction[]> {
    await delay(100);
    return MOCK_AUCTIONS.filter((a) => a.status === "live");
  },

  async getUpcomingAuctions(): Promise<Auction[]> {
    await delay(100);
    return MOCK_AUCTIONS.filter((a) => a.status === "upcoming");
  },

  async getEndingSoon(): Promise<Auction[]> {
    await delay(100);
    return MOCK_AUCTIONS.filter(isEndingSoon);
  },

  async getCompletedAuctions(page = 1, pageSize = 12): Promise<PaginatedResponse<Auction>> {
    await delay(150);
    const data = MOCK_AUCTIONS.filter((a) => a.status === "completed");
    const total = data.length;
    const start = (page - 1) * pageSize;
    return { data: data.slice(start, start + pageSize), total, page, pageSize, hasNextPage: start + pageSize < total };
  },

  async placeBid(auctionId: string, amount: number, bidder?: User): Promise<Bid> {
    await delay(300);

    const auction = MOCK_AUCTIONS.find((a) => a.id === auctionId);
    if (!auction) throw new BidError("Auction not found.");
    if (auction.status !== "live" && auction.status !== "ending-soon") {
      throw new BidError("This auction is no longer accepting bids.");
    }

    const minBid = auction.currentBid + auction.minimumBidIncrement;
    if (!Number.isFinite(amount) || amount < minBid) {
      throw new BidError(`Your bid must be at least ${minBid}.`);
    }
    if (auction.leadingBidder && bidder && auction.leadingBidder.id === bidder.id) {
      throw new BidError("You are already the highest bidder.");
    }

    const me = bidder ?? MOCK_USERS.find((u) => u.id === "user-me") ?? MOCK_USERS[6]!;
    const bid: Bid = {
      id: `bid-${Date.now()}`,
      auctionId,
      bidder: me,
      amount,
      isAutoBid: false,
      createdAt: new Date().toISOString(),
    };

    // Mutate the shared mock record so subsequent fetches (list, detail, live room) stay in sync.
    auction.currentBid = amount;
    auction.bidCount += 1;
    auction.leadingBidder = me;
    auction.bids = [bid, ...auction.bids];
    if (auction.reservePrice && amount >= auction.reservePrice) auction.reserveMet = true;

    return bid;
  },

  /** Mark an auction completed when the countdown reaches zero (client-driven mock). */
  async completeAuction(auctionId: string): Promise<Auction | null> {
    await delay(80);
    const auction = MOCK_AUCTIONS.find((a) => a.id === auctionId);
    if (!auction) return null;
    if (auction.status === "completed" || auction.status === "cancelled") return auction;

    const sold = !auction.reservePrice || auction.reserveMet;
    auction.status = "completed";
    auction.finalPrice = auction.currentBid;
    if (sold && auction.leadingBidder) {
      auction.winner = auction.leadingBidder;
    }
    return auction;
  },

  async getFeaturedAuctions(limit = 6): Promise<Auction[]> {
    await delay(100);
    const live = MOCK_AUCTIONS.filter((a) => a.status === "live");
    return live.sort((a, b) => b.watcherCount - a.watcherCount).slice(0, limit);
  },
};
