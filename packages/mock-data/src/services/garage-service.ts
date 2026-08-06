import type { GarageEntry, GarageStats, ListingDraft } from "@carasta/types";
import { MOCK_VEHICLES } from "../seed/vehicles";
import { MOCK_USERS } from "../seed/users";

function delay(ms = 120): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

const me = MOCK_USERS[6]!;

const MOCK_GARAGE_ENTRIES: GarageEntry[] = [
  {
    id: "ge-1",
    userId: "user-me",
    vehicle: MOCK_VEHICLES[6]!,
    type: "owned",
    purchasePrice: 56500,
    purchasedAt: new Date(Date.now() - 2592000000).toISOString(),
    maintenanceHistory: [
      { id: "mh-1", vehicleId: "v-007", type: "Oil Change", description: "Synthetic oil change + filter", mileageAtService: 21800, cost: 180, performedAt: new Date(Date.now() - 1296000000).toISOString() },
    ],
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
];

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

  async getGarageEntry(id: string): Promise<GarageEntry | null> {
    await delay(80);
    return MOCK_GARAGE_ENTRIES.find((e) => e.id === id) ?? null;
  },

  async getStats(): Promise<GarageStats> {
    await delay(80);
    return {
      totalVehicles: 3,
      ownedCount: 1,
      soldCount: 0,
      wishlistCount: 2,
      auctionWins: 1,
      totalInvested: 56500,
      totalReturned: 0,
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
      userId: "user-me",
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
