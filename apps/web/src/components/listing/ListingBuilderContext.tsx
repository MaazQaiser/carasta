"use client";

import * as React from "react";
import type {
  ListingConditionHistory,
  ListingDraft,
  ListingMediaItem,
  ListingSaleSettings,
  ListingTypeId,
  ListingVehicleDetails,
} from "./types";
import type {
  ModificationEntry,
  ModificationWorkspaceState,
  PerformanceSummary,
} from "./specs/types";
import { createModifiedPerformanceWorkspace } from "./specs/modified-performance";
import { RESTORED_RESTOMODE_SPECS_CONFIG } from "./specs/restored-restomod";
import { MODIFIED_PERFORMANCE_SPECS_CONFIG } from "./specs/modified-performance";
import { RACE_TRACK_SPECS_CONFIG } from "./specs/race-track";
import { createStockLightlyModifiedWorkspace } from "./specs/stock-lightly-modified";
import type { ListingActivityEvent } from "./services/draft-service";
import { isMeaningfulDraft } from "./services/draft-service";

const emptyDetails: ListingVehicleDetails = {
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
};

const emptyCondition: ListingConditionHistory = {
  vehicleHistory: "",
  accidentHistory: "",
  titleStatus: "",
  serviceRecords: "",
  overallCondition: "",
  ownershipHistory: "",
  generalNotes: "",
};

const emptySaleSettings: ListingSaleSettings = {
  saleType: "",
  reservePrice: "",
  buyNowPrice: "",
  preferredStartDate: "",
  auctionDuration: "",
  shipping: "",
  shippingLocation: "",
};

export const INITIAL_LISTING_DRAFT: ListingDraft = {
  listingTypeId: null,
  vinInput: "",
  details: emptyDetails,
  condition: emptyCondition,
  vehiclePhotos: [],
  modificationPhotos: [],
  documents: [],
  videos: [],
  ownerNotes: "",
  aiDescription: "",
  aiSummary: "",
  saleSettings: emptySaleSettings,
  modificationWorkspace: createModifiedPerformanceWorkspace(),
};

type MediaBucket = "vehiclePhotos" | "modificationPhotos" | "documents" | "videos";

interface ListingBuilderContextValue {
  draft: ListingDraft;
  setListingType: (id: ListingTypeId) => void;
  setVinInput: (vin: string) => void;
  updateDetails: (patch: Partial<ListingVehicleDetails>) => void;
  updateCondition: (patch: Partial<ListingConditionHistory>) => void;
  updateSaleSettings: (patch: Partial<ListingSaleSettings>) => void;
  setOwnerNotes: (notes: string) => void;
  setAiDescription: (value: string) => void;
  setAiSummary: (value: string) => void;
  addMediaItems: (bucket: MediaBucket, items: ListingMediaItem[]) => void;
  removeMediaItem: (bucket: MediaBucket, id: string) => void;
  updatePerformanceSummary: (patch: Partial<PerformanceSummary>) => void;
  setActiveSpecsCategory: (categoryId: string) => void;
  toggleEntryExpanded: (entryId: string) => void;
  startNewEntry: (categoryId: string) => void;
  startEditEntry: (entryId: string) => void;
  cancelEntryEdit: () => void;
  saveEntry: (entry: ModificationEntry) => void;
  deleteEntry: (entryId: string) => void;
  duplicateEntry: (entryId: string) => void;
  updateWorkspace: (patch: Partial<ModificationWorkspaceState>) => void;
  resetDraft: () => void;
  replaceDraft: (draft: ListingDraft) => void;
  activity: import("./services/draft-service").ListingActivityEvent[];
  setActivity: (activity: import("./services/draft-service").ListingActivityEvent[]) => void;
  addActivity: (label: string, type?: string) => void;
  isDirty: boolean;
  markClean: () => void;
}

const ListingBuilderContext = React.createContext<ListingBuilderContextValue | null>(null);

function patchWorkspace(
  prev: ListingDraft,
  patch: Partial<ModificationWorkspaceState> | ((ws: ModificationWorkspaceState) => ModificationWorkspaceState)
): ListingDraft {
  const next =
    typeof patch === "function" ? patch(prev.modificationWorkspace) : { ...prev.modificationWorkspace, ...patch };
  return { ...prev, modificationWorkspace: next };
}

const SEED_ACTIVITY: ListingActivityEvent = {
  id: "seed-created",
  type: "system",
  label: "Vehicle listing started",
  // Stable placeholder — replaced with a real timestamp after mount.
  at: "1970-01-01T00:00:00.000Z",
};

export function ListingBuilderProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = React.useState<ListingDraft>(INITIAL_LISTING_DRAFT);
  const [activity, setActivity] = React.useState<ListingActivityEvent[]>([SEED_ACTIVITY]);
  const [isDirty, setIsDirty] = React.useState(false);

  React.useEffect(() => {
    setActivity((prev) => {
      if (prev.length !== 1 || prev[0]?.id !== "seed-created") return prev;
      if (prev[0].at !== SEED_ACTIVITY.at) return prev;
      return [{ ...prev[0], at: new Date().toISOString() }];
    });
  }, []);

  const touch = (updater: (prev: ListingDraft) => ListingDraft) => {
    setDraft((prev) => {
      const next = updater(prev);
      setIsDirty(true);
      return next;
    });
  };

  const addActivity = (label: string, type = "update") => {
    setActivity((prev) => [
      {
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type,
        label,
        at: new Date().toISOString(),
      },
      ...prev,
    ].slice(0, 40));
  };

  const value: ListingBuilderContextValue = {
    draft,
    activity,
    setActivity,
    addActivity,
    isDirty,
    markClean: () => setIsDirty(false),
    replaceDraft: (next) => {
      setDraft(next);
      setIsDirty(false);
    },
    setListingType: (id) => {
      touch((prev) => {
        if (id === "stock-lightly-modified") {
          return {
            ...prev,
            listingTypeId: id,
            modificationWorkspace: {
              ...createStockLightlyModifiedWorkspace(),
              // Preserve any already-entered vehicle details; reset stock workspace flags.
              entries: [],
            },
          };
        }

        const activeCategoryId =
          id === "restored-restomod-custom"
            ? RESTORED_RESTOMODE_SPECS_CONFIG.categories[0]?.id ?? "build-restoration"
            : id === "modified-performance"
              ? MODIFIED_PERFORMANCE_SPECS_CONFIG.categories[0]?.id ?? "powertrain"
              : id === "race-track-car"
                ? RACE_TRACK_SPECS_CONFIG.categories[0]?.id ?? "chassis-structure"
                : prev.modificationWorkspace.activeCategoryId;

        return {
          ...prev,
          listingTypeId: id,
          modificationWorkspace: {
            ...prev.modificationWorkspace,
            activeCategoryId,
            editingEntryId: null,
          },
        };
      });
      addActivity("Vehicle type set", "type");
    },
    setVinInput: (vin) =>
      touch((prev) => ({
        ...prev,
        vinInput: vin,
        details: { ...prev.details, vin: vin || prev.details.vin },
      })),
    updateDetails: (patch) =>
      touch((prev) => ({ ...prev, details: { ...prev.details, ...patch } })),
    updateCondition: (patch) =>
      touch((prev) => ({ ...prev, condition: { ...prev.condition, ...patch } })),
    updateSaleSettings: (patch) =>
      touch((prev) => ({
        ...prev,
        saleSettings: { ...prev.saleSettings, ...patch },
      })),
    setOwnerNotes: (notes) => touch((prev) => ({ ...prev, ownerNotes: notes })),
    setAiDescription: (aiDescription) => touch((prev) => ({ ...prev, aiDescription })),
    setAiSummary: (aiSummary) => touch((prev) => ({ ...prev, aiSummary })),
    addMediaItems: (bucket, items) => {
      touch((prev) => ({ ...prev, [bucket]: [...prev[bucket], ...items] }));
      addActivity(
        bucket === "vehiclePhotos"
          ? "Photos uploaded"
          : bucket === "documents"
            ? "Documents uploaded"
            : "Media uploaded",
        "media"
      );
    },
    removeMediaItem: (bucket, id) =>
      touch((prev) => ({
        ...prev,
        [bucket]: prev[bucket].filter((item) => item.id !== id),
      })),
    updatePerformanceSummary: (patch) =>
      touch((prev) =>
        patchWorkspace(prev, {
          performanceSummary: { ...prev.modificationWorkspace.performanceSummary, ...patch },
        })
      ),
    setActiveSpecsCategory: (categoryId) =>
      touch((prev) =>
        patchWorkspace(prev, {
          activeCategoryId: categoryId,
          editingEntryId: null,
        })
      ),
    toggleEntryExpanded: (entryId) =>
      touch((prev) =>
        patchWorkspace(prev, (ws) => {
          const open = ws.expandedEntryIds.includes(entryId);
          return {
            ...ws,
            expandedEntryIds: open
              ? ws.expandedEntryIds.filter((id) => id !== entryId)
              : [...ws.expandedEntryIds, entryId],
          };
        })
      ),
    startNewEntry: (categoryId) =>
      touch((prev) => {
        const id = `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const draftEntry = {
          id,
          categoryId,
          title: "",
          description: "",
          typeOfWork: "",
          partsBrand: "",
          manufacturer: "",
          specifications: "",
          workPerformedBy: "",
          completedDuring: "",
          shopBuilder: "",
          installationDate: "",
          dateStatus: "",
          mileage: "",
          originalPartsIncluded: "",
          photos: [],
          receipt: [],
          dynoSheet: [],
          installationInvoice: [],
          warranty: [],
          supportingDocuments: [],
          additionalNotes: "",
          completed: false,
        };
        return patchWorkspace(prev, {
          entries: [...prev.modificationWorkspace.entries, draftEntry],
          editingEntryId: id,
          expandedEntryIds: prev.modificationWorkspace.expandedEntryIds.includes(id)
            ? prev.modificationWorkspace.expandedEntryIds
            : [...prev.modificationWorkspace.expandedEntryIds, id],
          activeCategoryId: categoryId,
        });
      }),
    startEditEntry: (entryId) =>
      touch((prev) =>
        patchWorkspace(prev, {
          editingEntryId: entryId,
          expandedEntryIds: prev.modificationWorkspace.expandedEntryIds.includes(entryId)
            ? prev.modificationWorkspace.expandedEntryIds
            : [...prev.modificationWorkspace.expandedEntryIds, entryId],
        })
      ),
    cancelEntryEdit: () =>
      touch((prev) =>
        patchWorkspace(prev, (ws) => {
          const editing = ws.entries.find((e) => e.id === ws.editingEntryId);
          const entries =
            editing && !editing.completed && !editing.title.trim()
              ? ws.entries.filter((e) => e.id !== editing.id)
              : ws.entries;
          return { ...ws, entries, editingEntryId: null };
        })
      ),
    saveEntry: (entry) => {
      touch((prev) =>
        patchWorkspace(prev, {
          entries: prev.modificationWorkspace.entries.map((e) =>
            e.id === entry.id ? { ...entry, completed: true } : e
          ),
          editingEntryId: null,
          expandedEntryIds: prev.modificationWorkspace.expandedEntryIds.includes(entry.id)
            ? prev.modificationWorkspace.expandedEntryIds
            : [...prev.modificationWorkspace.expandedEntryIds, entry.id],
        })
      );
      addActivity("Specification entry saved", "specs");
    },
    deleteEntry: (entryId) =>
      touch((prev) =>
        patchWorkspace(prev, (ws) => ({
          ...ws,
          entries: ws.entries.filter((e) => e.id !== entryId),
          expandedEntryIds: ws.expandedEntryIds.filter((id) => id !== entryId),
          editingEntryId: ws.editingEntryId === entryId ? null : ws.editingEntryId,
        }))
      ),
    duplicateEntry: (entryId) =>
      touch((prev) =>
        patchWorkspace(prev, (ws) => {
          const source = ws.entries.find((e) => e.id === entryId);
          if (!source) return ws;
          const id = `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
          const copy: ModificationEntry = {
            ...source,
            id,
            title: source.title ? `${source.title} (Copy)` : "",
            completed: false,
            photos: [...source.photos],
            receipt: [...source.receipt],
            dynoSheet: [...source.dynoSheet],
            installationInvoice: [...source.installationInvoice],
            warranty: [...source.warranty],
            supportingDocuments: [...source.supportingDocuments],
          };
          return {
            ...ws,
            entries: [...ws.entries, copy],
            editingEntryId: id,
            expandedEntryIds: [...ws.expandedEntryIds, id],
            activeCategoryId: copy.categoryId,
          };
        })
      ),
    updateWorkspace: (patch) => touch((prev) => patchWorkspace(prev, patch)),
    resetDraft: () => {
      setDraft(INITIAL_LISTING_DRAFT);
      setActivity([{ ...SEED_ACTIVITY, at: new Date().toISOString() }]);
      setIsDirty(false);
    },
  };

  // Keep meaningful-draft helper referenced for future recovery gates.
  void isMeaningfulDraft;

  return (
    <ListingBuilderContext.Provider value={value}>{children}</ListingBuilderContext.Provider>
  );
}

export function useListingBuilder() {
  const ctx = React.useContext(ListingBuilderContext);
  if (!ctx) {
    throw new Error("useListingBuilder must be used within ListingBuilderProvider");
  }
  return ctx;
}
