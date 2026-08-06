import type { ListingDraft, ListingMediaItem } from "../types";
import { createModifiedPerformanceWorkspace } from "../specs/modified-performance";

export type AutosaveStatus = "idle" | "saving" | "saved" | "failed";

export interface ListingActivityEvent {
  id: string;
  type: string;
  label: string;
  at: string;
}

export interface PersistedListingDraft {
  version: 1;
  savedAt: string;
  lastPath: string;
  draft: ListingDraft;
  activity: ListingActivityEvent[];
}

const STORAGE_KEY = "carasta.listing.draft.v1";

function createEmptyDraft(): ListingDraft {
  return {
    listingTypeId: null,
    vinInput: "",
    details: {
      year: "",
      make: "",
      model: "",
      trim: "",
      mileage: "",
      exteriorColor: "",
      interiorColor: "",
      engine: "",
      transmission: "",
      drivetrain: "",
      vin: "",
    },
    condition: {
      vehicleHistory: "",
      accidentHistory: "",
      titleStatus: "",
      serviceRecords: "",
      overallCondition: "",
      ownershipHistory: "",
      generalNotes: "",
    },
    vehiclePhotos: [],
    modificationPhotos: [],
    documents: [],
    videos: [],
    ownerNotes: "",
    aiDescription: "",
    aiSummary: "",
    saleSettings: {
      saleType: "",
      reservePrice: "",
      buyNowPrice: "",
      preferredStartDate: "",
      auctionDuration: "",
      shipping: "",
      shippingLocation: "",
    },
    modificationWorkspace: createModifiedPerformanceWorkspace(),
  };
}

function stripMediaUrls(items: ListingMediaItem[]): ListingMediaItem[] {
  return items.map(({ previewUrl: _previewUrl, ...rest }) => ({
    ...rest,
    progress: rest.progress ?? 100,
  }));
}

/** Remove ephemeral blob URLs so drafts can round-trip through localStorage. */
export function sanitizeDraftForStorage(draft: ListingDraft): ListingDraft {
  const ws = draft.modificationWorkspace;
  return {
    ...draft,
    vehiclePhotos: stripMediaUrls(draft.vehiclePhotos),
    modificationPhotos: stripMediaUrls(draft.modificationPhotos),
    documents: stripMediaUrls(draft.documents),
    videos: stripMediaUrls(draft.videos),
    modificationWorkspace: {
      ...ws,
      entries: ws.entries.map((entry) => ({
        ...entry,
        photos: stripMediaUrls(entry.photos),
        receipt: stripMediaUrls(entry.receipt),
        dynoSheet: stripMediaUrls(entry.dynoSheet),
        installationInvoice: stripMediaUrls(entry.installationInvoice),
        warranty: stripMediaUrls(entry.warranty),
        supportingDocuments: stripMediaUrls(entry.supportingDocuments),
      })),
      restoration: {
        ...ws.restoration,
        documentation: {
          buildBook: stripMediaUrls(ws.restoration.documentation.buildBook),
          receipts: stripMediaUrls(ws.restoration.documentation.receipts),
          invoices: stripMediaUrls(ws.restoration.documentation.invoices),
          restorationPhotos: stripMediaUrls(ws.restoration.documentation.restorationPhotos),
          factoryDocuments: stripMediaUrls(ws.restoration.documentation.factoryDocuments),
          certificates: stripMediaUrls(ws.restoration.documentation.certificates),
          historicalDocumentation: stripMediaUrls(
            ws.restoration.documentation.historicalDocumentation
          ),
        },
      },
      race: {
        ...ws.race,
        documentation: {
          logbook: stripMediaUrls(ws.race.documentation.logbook),
          inspectionReports: stripMediaUrls(ws.race.documentation.inspectionReports),
          certificationDocuments: stripMediaUrls(ws.race.documentation.certificationDocuments),
          dynoSheets: stripMediaUrls(ws.race.documentation.dynoSheets),
          raceResults: stripMediaUrls(ws.race.documentation.raceResults),
          setupSheets: stripMediaUrls(ws.race.documentation.setupSheets),
          dataLogs: stripMediaUrls(ws.race.documentation.dataLogs),
          technicalReports: stripMediaUrls(ws.race.documentation.technicalReports),
          photos: stripMediaUrls(ws.race.documentation.photos),
          videos: stripMediaUrls(ws.race.documentation.videos),
        },
        historyEntries: ws.race.historyEntries.map((entry) => ({
          ...entry,
          photos: stripMediaUrls(entry.photos),
        })),
      },
    },
  };
}

export function isMeaningfulDraft(draft: ListingDraft): boolean {
  return Boolean(
    draft.listingTypeId ||
      draft.details.make ||
      draft.details.model ||
      draft.details.year ||
      draft.vinInput ||
      draft.ownerNotes.trim() ||
      draft.aiDescription.trim() ||
      draft.vehiclePhotos.length > 0 ||
      draft.modificationWorkspace.entries.length > 0 ||
      draft.saleSettings.saleType
  );
}

export const DraftService = {
  storageKey: STORAGE_KEY,

  load(): PersistedListingDraft | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PersistedListingDraft;
      if (!parsed?.version || !parsed.draft) return null;
      const ws = parsed.draft.modificationWorkspace;
      parsed.draft = {
        ...parsed.draft,
        modificationWorkspace: {
          ...ws,
          hasModifications: ws.hasModifications ?? null,
          reviewedFactoryCategoryIds: ws.reviewedFactoryCategoryIds ?? [],
          factorySpecOverrides: ws.factorySpecOverrides ?? {},
        },
      };
      return parsed;
    } catch {
      return null;
    }
  },

  save(
    draft: ListingDraft,
    options?: { lastPath?: string; activity?: ListingActivityEvent[] }
  ): PersistedListingDraft {
    const envelope: PersistedListingDraft = {
      version: 1,
      savedAt: new Date().toISOString(),
      lastPath: options?.lastPath ?? "/listing/type",
      draft: sanitizeDraftForStorage(draft),
      activity: options?.activity ?? [],
    };
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    }
    return envelope;
  },

  clear() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  },

  hasDraft(): boolean {
    const saved = this.load();
    return Boolean(saved && isMeaningfulDraft(saved.draft));
  },

  createEmptyDraft,
};
