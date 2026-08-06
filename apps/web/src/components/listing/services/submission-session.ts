/** Session helpers for post-submit listing / share flow (UI-only). */

const STORAGE_KEY = "carasta.listing.submission";

export type ListingSubmissionSession = {
  reference: string;
  submittedAt: string;
  shareCaption?: string;
  destination?: string;
  sharedAt?: string;
  /** Auction id created when Listing Builder publishes to the profile Listings tab. */
  auctionId?: string;
  vehicleId?: string;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function createListingReference() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CRA-${stamp.slice(-4)}${rand}`;
}

export const SubmissionSession = {
  load(): ListingSubmissionSession | null {
    if (!canUseStorage()) return null;
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as ListingSubmissionSession;
    } catch {
      return null;
    }
  },

  save(session: ListingSubmissionSession) {
    if (!canUseStorage()) return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  },

  patch(patch: Partial<ListingSubmissionSession>) {
    const current = SubmissionSession.load() ?? {
      reference: createListingReference(),
      submittedAt: new Date().toISOString(),
    };
    SubmissionSession.save({ ...current, ...patch });
  },

  clear() {
    if (!canUseStorage()) return;
    window.sessionStorage.removeItem(STORAGE_KEY);
  },
};

export function defaultShareCaption(vehicleLabel: string) {
  return `Just listed my ${vehicleLabel} on Carasta. Check it out!`;
}
