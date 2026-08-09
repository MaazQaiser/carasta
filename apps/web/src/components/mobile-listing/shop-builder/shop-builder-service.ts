export type ShopBuilderRecord = {
  id: string;
  name: string;
  city?: string;
  state?: string;
  type: "Shop" | "Builder" | "Company";
  custom?: boolean;
};

const STORAGE_KEY = "carasta.mobile.shopBuilders";

const SEED_SHOPS: ShopBuilderRecord[] = [
  { id: "seed-1", name: "Rothsport Racing", city: "Oregon City", state: "OR", type: "Shop" },
  { id: "seed-2", name: "Singer Vehicle Design", city: "Torrance", state: "CA", type: "Company" },
  { id: "seed-3", name: "Guntherwerks", city: "Portland", state: "OR", type: "Builder" },
  { id: "seed-4", name: "Canepa", city: "Scotts Valley", state: "CA", type: "Shop" },
  { id: "seed-5", name: "Classic Automobiles", city: "Huntington Beach", state: "CA", type: "Shop" },
  { id: "seed-6", name: "Roadstersource", city: "Phoenix", state: "AZ", type: "Company" },
  { id: "seed-7", name: "Momentum Motorcars", city: "Houston", state: "TX", type: "Shop" },
  { id: "seed-8", name: "Patrick Motorsports", city: "Phoenix", state: "AZ", type: "Builder" },
  { id: "seed-9", name: "Flying Lizard Motorsports", city: "Sonoma", state: "CA", type: "Shop" },
  { id: "seed-10", name: "Magnusson Classic Motors", city: "Petaluma", state: "CA", type: "Company" },
];

function canUseStorage() {
  return typeof window !== "undefined";
}

function loadCustom(): ShopBuilderRecord[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ShopBuilderRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCustom(records: ShopBuilderRecord[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export const ShopBuilderService = {
  list(): ShopBuilderRecord[] {
    const custom = loadCustom();
    const byId = new Map<string, ShopBuilderRecord>();
    for (const shop of [...SEED_SHOPS, ...custom]) {
      byId.set(shop.id, shop);
    }
    return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
  },

  search(query: string): ShopBuilderRecord[] {
    const q = query.trim().toLowerCase();
    const all = ShopBuilderService.list();
    if (!q) return all;
    return all.filter((shop) => {
      const haystack = [shop.name, shop.city, shop.state, shop.type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  },

  add(input: {
    name: string;
    city?: string;
    state?: string;
    type?: ShopBuilderRecord["type"];
  }): ShopBuilderRecord {
    const record: ShopBuilderRecord = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: input.name.trim(),
      city: input.city?.trim() || undefined,
      state: input.state?.trim() || undefined,
      type: input.type ?? "Shop",
      custom: true,
    };
    const next = [...loadCustom(), record];
    saveCustom(next);
    return record;
  },
};
