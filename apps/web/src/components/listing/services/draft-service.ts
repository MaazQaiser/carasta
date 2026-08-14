import type { ListingDraft, ListingMediaItem } from "../types";
import { createModifiedPerformanceWorkspace } from "../specs/modified-performance";
import { createEmptyRestorationState, createEmptyRaceState } from "../specs/options";
import {
  normalizeModificationCategoryId,
  normalizeModificationEntries,
} from "../specs/shared-modification-categories";
import {
  normalizeRestorationCategoryId,
  normalizeRestorationEntries,
} from "../specs/restored-restomod";
import { migrateRestoredListingDraft } from "../listing-type-utils";

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
      secondaryExteriorColor: "",
      interiorColor: "",
      engine: "",
      transmission: "",
      drivetrain: "",
      vin: "",
    },
    vinImportedFields: [],
    condition: {
      vehicleHistory: "",
      accidentHistory: "",
      titleStatus: "",
      serviceRecords: "",
      overallCondition: "",
      ownershipHistory: "",
      generalNotes: "",
      numberOfKeys: "",
      warranty: "",
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
      localPickup: "",
    },
    auctionCoverPhotoId: null,
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
          buildBook: stripMediaUrls(ws.restoration.documentation.buildBook ?? []),
          receiptsAndInvoices: stripMediaUrls(
            ws.restoration.documentation.receiptsAndInvoices ?? []
          ),
          factoryDocuments: stripMediaUrls(ws.restoration.documentation.factoryDocuments ?? []),
          historicalBuildPhotos: stripMediaUrls(
            ws.restoration.documentation.historicalBuildPhotos ?? []
          ),
          certificates: stripMediaUrls(ws.restoration.documentation.certificates ?? []),
          magazineFeatures: stripMediaUrls(ws.restoration.documentation.magazineFeatures ?? []),
          awards: stripMediaUrls(ws.restoration.documentation.awards ?? []),
          judgingSheets: stripMediaUrls(ws.restoration.documentation.judgingSheets ?? []),
          other: stripMediaUrls(ws.restoration.documentation.other ?? []),
        },
        timelineEvents: (ws.restoration.timelineEvents ?? []).map((event) => ({
          ...event,
          photos: stripMediaUrls(event.photos ?? []),
        })),
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
      const race = ws.race;
      const biography = race?.biography ?? {
        competitionHistory: race?.competition?.competitionHistorySummary || "",
        notableResults: race?.competition?.notableResults || "",
        vehicleHistory: "",
        builderNotes: "",
        previousTeamsOrDrivers: "",
        championships: "",
        significantEvents: "",
        additionalBackground: "",
      };
      const beforeType = parsed.draft.listingTypeId;
      parsed.draft = migrateRestoredListingDraft({
        ...parsed.draft,
        details: {
          ...parsed.draft.details,
          secondaryExteriorColor: parsed.draft.details.secondaryExteriorColor ?? "",
        },
        vinImportedFields: parsed.draft.vinImportedFields ?? [],
        condition: {
          ...parsed.draft.condition,
          numberOfKeys: parsed.draft.condition.numberOfKeys ?? "",
          warranty: parsed.draft.condition.warranty ?? "",
        },
        modificationWorkspace: {
          ...ws,
          hasModifications: ws.hasModifications ?? null,
          reviewedFactoryCategoryIds: ws.reviewedFactoryCategoryIds ?? [],
          factorySpecOverrides: ws.factorySpecOverrides ?? {},
          entries:
            parsed.draft.listingTypeId === "restored-restomod-custom"
              ? normalizeRestorationEntries(ws.entries ?? [])
              : normalizeModificationEntries(ws.entries ?? []),
          activeCategoryId:
            parsed.draft.listingTypeId === "restored-restomod-custom"
              ? normalizeRestorationCategoryId(ws.activeCategoryId)
              : normalizeModificationCategoryId(ws.activeCategoryId),
          restoration: {
            ...createEmptyRestorationState(),
            ...ws.restoration,
          },
          race: race
            ? {
                ...createEmptyRaceState(),
                ...race,
                biography,
                competition: {
                  ...createEmptyRaceState().competition,
                  ...race.competition,
                  primaryUseOther: race.competition?.primaryUseOther ?? "",
                },
                buildNarrative: race.buildNarrative ?? "",
                workPerformedBy: race.workPerformedBy ?? "",
                shopBuilder: race.shopBuilder ?? "",
                installedSafetyEquipment: Array.isArray(race.installedSafetyEquipment)
                  ? race.installedSafetyEquipment
                  : [],
                safetyEquipmentNotes: race.safetyEquipmentNotes ?? "",
                safetyServiceDates: {
                  "competition-seat": race.safetyServiceDates?.["competition-seat"] ?? "",
                  harness: race.safetyServiceDates?.harness ?? "",
                  "fire-suppression": race.safetyServiceDates?.["fire-suppression"] ?? "",
                },
                organizedCompetition: race.organizedCompetition ?? "",
                competitionHistoryNarrative: race.competitionHistoryNarrative ?? "",
                documentationTypes: Array.isArray(race.documentationTypes)
                  ? race.documentationTypes
                  : [],
                documentationOther: race.documentationOther ?? "",
                documentationUploads: Array.isArray(race.documentationUploads)
                  ? race.documentationUploads
                  : [],
                sparesIncluded: race.sparesIncluded ?? "",
                sparesDescription: race.sparesDescription ?? "",
                knownRaceTrackIssues: race.knownRaceTrackIssues ?? "",
              }
            : race,
        },
      });
      if (
        beforeType === "restored-restomod-custom" &&
        parsed.draft.listingTypeId === "stock-lightly-modified"
      ) {
        parsed.lastPath = parsed.lastPath
          .replace("/listing/restored/", "/listing/stock/")
          .replace("/mobile-listing/restored/", "/mobile-listing/stock/");
      }
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
