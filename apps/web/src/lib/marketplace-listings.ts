import type { Auction, AuctionFilters, AuctionSortField, Bid, User, Vehicle } from "@carasta/types";
import { PublishedListingService } from "@/components/listing/services/published-listing-service";

/** Ending-soon window used by browse filters (matches typical auction UI). */
const ENDING_SOON_MS = 24 * 60 * 60 * 1000;

function auctionIds(auctions: Auction[]) {
  return new Set(auctions.map((a) => a.id));
}

function vehicleIds(vehicles: Vehicle[]) {
  return new Set(vehicles.map((v) => v.id));
}

function matchesStatus(auction: Auction, status: AuctionFilters["status"]): boolean {
  if (!status) return true;
  const statuses = Array.isArray(status) ? status : [status];
  if (statuses.includes(auction.status)) return true;
  if (statuses.includes("ending-soon") && auction.status === "live") {
    const remaining = new Date(auction.endTime).getTime() - Date.now();
    return remaining > 0 && remaining <= ENDING_SOON_MS;
  }
  return false;
}

export function auctionMatchesFilters(auction: Auction, filters: AuctionFilters = {}): boolean {
  if (!matchesStatus(auction, filters.status)) return false;

  const { vehicle } = auction;
  if (filters.make && vehicle.spec.make.toLowerCase() !== filters.make.toLowerCase()) {
    return false;
  }
  if (filters.model && vehicle.spec.model.toLowerCase() !== filters.model.toLowerCase()) {
    return false;
  }
  if (filters.yearMin != null && vehicle.spec.year < filters.yearMin) return false;
  if (filters.yearMax != null && vehicle.spec.year > filters.yearMax) return false;
  if (filters.priceMin != null && auction.currentBid < filters.priceMin) return false;
  if (filters.priceMax != null && auction.currentBid > filters.priceMax) return false;
  if (filters.mileageMax != null && vehicle.spec.mileage > filters.mileageMax) return false;
  if (
    filters.fuelType &&
    String(vehicle.spec.fuelType ?? "").toLowerCase() !== filters.fuelType.toLowerCase()
  ) {
    return false;
  }
  if (
    filters.transmission &&
    String(vehicle.spec.transmission ?? "").toLowerCase() !== filters.transmission.toLowerCase()
  ) {
    return false;
  }
  if (
    filters.location &&
    !`${vehicle.location.city} ${vehicle.location.state}`
      .toLowerCase()
      .includes(filters.location.toLowerCase())
  ) {
    return false;
  }
  return true;
}

export function sortAuctions(auctions: Auction[], sort?: AuctionSortField): Auction[] {
  const next = [...auctions];
  switch (sort) {
    case "newest":
    case "recently-listed":
      return next.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "highest-bid":
      return next.sort((a, b) => b.currentBid - a.currentBid);
    case "lowest-price":
      return next.sort((a, b) => a.currentBid - b.currentBid);
    case "ending-soon":
    default:
      return next.sort(
        (a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
      );
  }
}

/** Prepend seller-published auctions (localStorage) ahead of mock catalog results. */
export function mergePublishedAuctions(
  seed: Auction[],
  options: { filters?: AuctionFilters; sort?: AuctionSortField } = {}
): Auction[] {
  const published = PublishedListingService.load()
    .map((r) => r.auction)
    .filter((auction) => auctionMatchesFilters(auction, options.filters ?? {}));

  const seen = auctionIds(published);
  const merged = [...published, ...seed.filter((a) => !seen.has(a.id))];
  return sortAuctions(merged, options.sort);
}

/** Prepend published vehicles for search / compare surfaces. */
export function mergePublishedVehicles(seed: Vehicle[], query?: string): Vehicle[] {
  const q = query?.trim().toLowerCase() ?? "";
  let published = PublishedListingService.load().map((r) => r.auction.vehicle);

  if (q) {
    published = published.filter((v) => {
      const haystack = [
        v.title,
        v.spec.make,
        v.spec.model,
        v.spec.trim,
        v.spec.year,
        v.location.city,
        v.location.state,
        v.listingType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  const seen = vehicleIds(published);
  return [...published, ...seed.filter((v) => !seen.has(v.id))];
}

export function searchPublishedAuctions(query: string, limit = 8): Auction[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PublishedListingService.load()
    .filter((r) => {
      const a = r.auction;
      const text = [
        a.vehicle.title,
        a.vehicle.spec.make,
        a.vehicle.spec.model,
        String(a.vehicle.spec.year),
        r.reference,
      ]
        .join(" ")
        .toLowerCase();
      return text.includes(q);
    })
    .map((r) => r.auction)
    .slice(0, limit);
}

/** Persist an updated auction back into the published store (for bids, etc.). */
export function updatePublishedAuction(auction: Auction): boolean {
  const records = PublishedListingService.load();
  const index = records.findIndex(
    (r) => r.auction.id === auction.id || r.auction.vehicle.id === auction.vehicle.id
  );
  if (index < 0) return false;
  const next = [...records];
  next[index] = { ...next[index]!, auction };
  PublishedListingService.saveAll(next);
  return true;
}

/** Place a bid against a seller-published auction stored in localStorage. */
export function placePublishedBid(
  auctionId: string,
  amount: number,
  bidder?: User
): { bid: Bid; auction: Auction } {
  const record = PublishedListingService.resolve(auctionId);
  if (!record) {
    throw new Error("Auction not found.");
  }

  const auction = record.auction;
  if (auction.status === "completed" || auction.status === "cancelled") {
    throw new Error("This auction is no longer accepting bids.");
  }

  const minBid = auction.currentBid + auction.minimumBidIncrement;
  if (amount < minBid) {
    throw new Error(`Your bid must be at least ${minBid}.`);
  }
  if (bidder && auction.leadingBidder?.id === bidder.id) {
    throw new Error("You are already the highest bidder.");
  }

  const resolvedBidder: User =
    bidder ??
    ({
      id: "guest",
      username: "guest",
      displayName: "Guest",
      email: "guest@carasta.local",
      role: "buyer",
      isSeller: false,
      isVerified: false,
      joinedAt: new Date().toISOString(),
      stats: {
        totalListings: 0,
        totalSales: 0,
        totalPurchases: 0,
        totalBids: 0,
        followersCount: 0,
        followingCount: 0,
        garageCount: 0,
      },
    } satisfies User);

  const bid: Bid = {
    id: `bid-pub-${Date.now()}`,
    auctionId: auction.id,
    bidder: resolvedBidder,
    amount,
    isAutoBid: false,
    createdAt: new Date().toISOString(),
  };

  const reserveMet =
    auction.reserveMet ||
    (auction.reservePrice != null ? amount >= auction.reservePrice : auction.reserveMet);

  const updated: Auction = {
    ...auction,
    currentBid: amount,
    bidCount: auction.bidCount + 1,
    reserveMet,
    leadingBidder: bid.bidder,
    bids: [bid, ...auction.bids],
    participantCount: Math.max(
      auction.participantCount,
      new Set([bid.bidder.id, ...auction.bids.map((b) => b.bidder.id)]).size
    ),
  };

  updatePublishedAuction(updated);
  return { bid, auction: updated };
}
