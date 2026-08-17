import type { Auction } from "@carasta/types";

export const HOMEPAGE_UPCOMING_STORAGE_KEY = "carasta.homepage.upcoming-ids";
export const DEFAULT_HOMEPAGE_UPCOMING_IDS = ["a-007", "a-010", "a-013"];

export function readHomepageUpcomingIds(): string[] {
  if (typeof window === "undefined") return DEFAULT_HOMEPAGE_UPCOMING_IDS;
  try {
    const raw = localStorage.getItem(HOMEPAGE_UPCOMING_STORAGE_KEY);
    if (!raw) return DEFAULT_HOMEPAGE_UPCOMING_IDS;
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.every((id) => typeof id === "string")) {
      return parsed.slice(0, 3);
    }
  } catch {
    /* ignore malformed storage */
  }
  return DEFAULT_HOMEPAGE_UPCOMING_IDS;
}

export function writeHomepageUpcomingIds(ids: string[]) {
  localStorage.setItem(HOMEPAGE_UPCOMING_STORAGE_KEY, JSON.stringify(ids.slice(0, 3)));
}

export function pickHomepageUpcoming(all: Auction[], ids = readHomepageUpcomingIds()): Auction[] {
  const byId = new Map(all.map((auction) => [auction.id, auction]));
  const selected = ids
    .map((id) => byId.get(id))
    .filter((auction): auction is Auction => Boolean(auction));
  if (selected.length >= 3) return selected.slice(0, 3);
  const rest = all.filter((auction) => !ids.includes(auction.id));
  return [...selected, ...rest].slice(0, 3);
}
