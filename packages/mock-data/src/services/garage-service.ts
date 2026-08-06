import type { GarageEntry, GarageStats, ListingDraft } from "@carasta/types";
import { MOCK_VEHICLES } from "../seed/vehicles";
import { MOCK_USERS } from "../seed/users";

function delay(ms = 120): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

const me = MOCK_USERS.find((u) => u.id === "user-me")!;

const MOCK_GARAGE_ENTRIES: GarageEntry[] = [
  {
    id: "ge-1",
    userId: "user-me",
    vehicle: MOCK_VEHICLES[6]!,
    type: "owned",
    purchasePrice: 56500,
    purchasedAt: new Date(Date.now() - 2592000000).toISOString(),
    maintenanceHistory: [
      {
        id: "mh-1",
        vehicleId: "v-007",
        type: "Oil Change",
        description: "Synthetic oil change + filter",
        mileageAtService: 21800,
        cost: 180,
        performedAt: new Date(Date.now() - 1296000000).toISOString(),
      },
    ],
    notes: "Daily driver in excellent shape.",
    addedAt: new Date(Date.now() - 2592000000).toISOString(),
  },
  {
    id: "ge-2",
    userId: "user-me",
    vehicle: MOCK_VEHICLES[4]!,
    type: "wishlist",
    maintenanceHistory: [],
    addedAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: "ge-3",
    userId: "user-me",
    vehicle: MOCK_VEHICLES[13]!,
    type: "wishlist",
    maintenanceHistory: [],
    addedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "ge-4",
    userId: "user-me",
    vehicle: MOCK_VEHICLES[2]!,
    type: "auction-win",
    purchasePrice: 127000,
    purchasedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    maintenanceHistory: [],
    notes: "Won on Carasta — awaiting transport.",
    addedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: "ge-5",
    userId: "user-me",
    vehicle: MOCK_VEHICLES[9]!,
    type: "sold",
    purchasePrice: 38000,
    salePrice: 44500,
    purchasedAt: new Date(Date.now() - 400 * 86400000).toISOString(),
    soldAt: new Date(Date.now() - 120 * 86400000).toISOString(),
    maintenanceHistory: [],
    addedAt: new Date(Date.now() - 400 * 86400000).toISOString(),
  },
  {
    id: "ge-6",
    userId: "user-me",
    vehicle: MOCK_VEHICLES[0]!,
    type: "owned",
    purchasePrice: 98000,
    purchasedAt: new Date(Date.now() - 200 * 86400000).toISOString(),
    maintenanceHistory: [
      {
        id: "mh-2",
        vehicleId: "v-001",
        type: "Inspection",
        description: "Pre-purchase inspection + compression test",
        mileageAtService: 52000,
        cost: 450,
        performedAt: new Date(Date.now() - 190 * 86400000).toISOString(),
      },
    ],
    addedAt: new Date(Date.now() - 200 * 86400000).toISOString(),
  },
];

/** Lightweight garage snapshots for other profile users. */
const SELLER_GARAGE: GarageEntry[] = MOCK_USERS.filter((u) => u.isSeller)
  .flatMap((seller, sellerIndex) => {
    const vehicles = MOCK_VEHICLES.filter((v) => v.seller.id === seller.id).slice(0, 3);
    return vehicles.map((vehicle, i) => ({
      id: `ge-${seller.id}-${i}`,
      userId: seller.id,
      vehicle,
      type: (i === 0 ? "owned" : i === 1 ? "sold" : "wishlist") as GarageEntry["type"],
      purchasePrice: vehicle.startingPrice,
      purchasedAt: new Date(Date.now() - (sellerIndex + i + 1) * 86400000 * 30).toISOString(),
      maintenanceHistory: [],
      addedAt: new Date(Date.now() - (sellerIndex + i + 1) * 86400000 * 30).toISOString(),
    }));
  });

const ALL_GARAGE = [...MOCK_GARAGE_ENTRIES, ...SELLER_GARAGE];

const MOCK_DRAFTS: ListingDraft[] = [
  {
    id: "draft-1",
    userId: "user-me",
    step: 3,
    data: { make: "BMW", model: "M2", year: 2020, mileage: 18000, condition: "excellent" },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const garageService = {
  async getGarage(): Promise<GarageEntry[]> {
    await delay();
    return MOCK_GARAGE_ENTRIES;
  },

  async getGarageForUser(userId: string): Promise<GarageEntry[]> {
    await delay();
    return ALL_GARAGE.filter((e) => e.userId === userId);
  },

  async getGarageEntry(id: string): Promise<GarageEntry | null> {
    await delay(80);
    return ALL_GARAGE.find((e) => e.id === id) ?? null;
  },

  async getStats(): Promise<GarageStats> {
    await delay(80);
    const ownedCount = MOCK_GARAGE_ENTRIES.filter((e) => e.type === "owned").length;
    const soldCount = MOCK_GARAGE_ENTRIES.filter((e) => e.type === "sold").length;
    const wishlistCount = MOCK_GARAGE_ENTRIES.filter((e) => e.type === "wishlist").length;
    const auctionWins = MOCK_GARAGE_ENTRIES.filter((e) => e.type === "auction-win").length;
    return {
      totalVehicles: MOCK_GARAGE_ENTRIES.length,
      ownedCount,
      soldCount,
      wishlistCount,
      auctionWins,
      totalInvested: MOCK_GARAGE_ENTRIES.reduce((sum, e) => sum + (e.purchasePrice ?? 0), 0),
      totalReturned: MOCK_GARAGE_ENTRIES.reduce((sum, e) => sum + (e.salePrice ?? 0), 0),
    };
  },

  async getDrafts(): Promise<ListingDraft[]> {
    await delay();
    return MOCK_DRAFTS;
  },

  async saveDraft(draft: Partial<ListingDraft>): Promise<ListingDraft> {
    await delay(200);
    const existing = MOCK_DRAFTS.find((d) => d.id === draft.id);
    if (existing) {
      Object.assign(existing, draft, { updatedAt: new Date().toISOString() });
      return existing;
    }
    const newDraft: ListingDraft = {
      id: `draft-${Date.now()}`,
      userId: me.id,
      step: 1,
      data: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...draft,
    };
    MOCK_DRAFTS.push(newDraft);
    return newDraft;
  },
};
