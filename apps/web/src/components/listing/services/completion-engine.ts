import type { ListingDraft } from "../types";
import { LISTING_STEPS, getListingTypeById } from "../config";

export type CompletionCategoryId =
  | "type"
  | "details"
  | "identify"
  | "specifications"
  | "condition"
  | "photos"
  | "documents"
  | "notes"
  | "ai"
  | "settings"
  | "preview"
  | "review";

export interface CompletionCategory {
  id: CompletionCategoryId;
  label: string;
  href: string;
  weight: number;
  done: boolean;
  requiredMissing: string[];
  warnings: string[];
}

export interface CompletionReport {
  overallPercent: number;
  categories: CompletionCategory[];
  missingRequiredFields: string[];
  missingPhotos: string[];
  missingDocuments: string[];
  incompleteSections: { id: string; label: string; href: string }[];
}

function specsDone(draft: ListingDraft): boolean {
  const ws = draft.modificationWorkspace;
  if (!draft.listingTypeId) return false;
  if (draft.listingTypeId === "stock-lightly-modified") {
    // Answered modification question; if Yes, at least one saved modification.
    if (ws.hasModifications === null) return false;
    if (ws.hasModifications === false) return true;
    return ws.entries.some((e) => e.completed || e.title.trim());
  }
  if (draft.listingTypeId === "modified-performance") {
    return Boolean(
      ws.entries.some((e) => e.completed || e.title.trim()) ||
        ws.performanceSummary.horsepower ||
        ws.performanceSummary.currentEngine
    );
  }
  if (draft.listingTypeId === "restored-restomod-custom") {
    return Boolean(
      ws.restoration.buildType ||
        ws.entries.some((e) => e.completed || e.title.trim()) ||
        ws.restoration.identityType
    );
  }
  if (draft.listingTypeId === "race-track-car") {
    return Boolean(
      ws.race.competition.competitionLevel ||
        ws.race.competition.primaryDiscipline ||
        ws.race.historyEntries.length > 0 ||
        ws.entries.some((e) => e.completed || e.title.trim())
    );
  }
  return false;
}

/**
 * Listing Completion Engine — evaluates every shared listing type.
 * Weights live here so UI stays presentation-only.
 */
export function evaluateListingCompletion(draft: ListingDraft): CompletionReport {
  const detailsMissing: string[] = [];
  if (!draft.details.year) detailsMissing.push("Year");
  if (!draft.details.make) detailsMissing.push("Make");
  if (!draft.details.model) detailsMissing.push("Model");

  const categories: CompletionCategory[] = [
    {
      id: "type",
      label: "Vehicle Type",
      href: "/listing/type",
      weight: 10,
      done: Boolean(draft.listingTypeId),
      requiredMissing: draft.listingTypeId ? [] : ["Vehicle type"],
      warnings: [],
    },
    {
      id: "identify",
      label: "Identify Vehicle",
      href: "/listing/identify",
      weight: 5,
      done: Boolean(draft.details.vin || draft.vinInput),
      requiredMissing: [],
      warnings: draft.details.vin || draft.vinInput ? [] : ["VIN not provided (optional)"],
    },
    {
      id: "details",
      label: "Vehicle Details",
      href: "/listing/details",
      weight: 15,
      done: detailsMissing.length === 0,
      requiredMissing: detailsMissing,
      warnings: [],
    },
    {
      id: "specifications",
      label: "Specifications",
      href: "/listing/specifications",
      weight: 15,
      done: specsDone(draft),
      requiredMissing:
        draft.listingTypeId && !specsDone(draft)
          ? ["Specifications & modifications"]
          : [],
      warnings: [],
    },
    {
      id: "condition",
      label: "Condition & History",
      href: "/listing/history",
      weight: 10,
      done: Boolean(
        draft.condition.overallCondition ||
          draft.condition.titleStatus ||
          draft.condition.vehicleHistory
      ),
      requiredMissing: [],
      warnings:
        draft.condition.overallCondition || draft.condition.titleStatus
          ? []
          : ["Condition details incomplete"],
    },
    {
      id: "photos",
      label: "Photos",
      href: "/listing/photos",
      weight: 15,
      done: draft.vehiclePhotos.length >= 3,
      requiredMissing: draft.vehiclePhotos.length === 0 ? ["Vehicle photos"] : [],
      warnings:
        draft.vehiclePhotos.length > 0 && draft.vehiclePhotos.length < 3
          ? ["Add at least 3 vehicle photos"]
          : [],
    },
    {
      id: "documents",
      label: "Documents",
      href: "/listing/photos",
      weight: 5,
      done: draft.documents.length > 0,
      requiredMissing: [],
      warnings: draft.documents.length === 0 ? ["No documents uploaded"] : [],
    },
    {
      id: "notes",
      label: "Owner Notes",
      href: "/listing/notes",
      weight: 10,
      done: draft.ownerNotes.trim().length >= 40,
      requiredMissing: draft.ownerNotes.trim() ? [] : ["Owner notes"],
      warnings:
        draft.ownerNotes.trim() && draft.ownerNotes.trim().length < 40
          ? ["Owner notes are brief"]
          : [],
    },
    {
      id: "ai",
      label: "AI Description",
      href: "/listing/ai",
      weight: 5,
      done: draft.aiDescription.trim().length >= 40,
      requiredMissing: [],
      warnings: draft.aiDescription.trim() ? [] : ["AI description not saved"],
    },
    {
      id: "settings",
      label: "Sale Settings",
      href: "/listing/settings",
      weight: 10,
      done: Boolean(draft.saleSettings.saleType && draft.saleSettings.reservePrice),
      requiredMissing: [
        ...(!draft.saleSettings.saleType ? ["Sale type"] : []),
        ...(!draft.saleSettings.reservePrice ? ["Reserve price"] : []),
      ],
      warnings: [],
    },
  ];

  const totalWeight = categories.reduce((sum, c) => sum + c.weight, 0);
  const earned = categories.reduce((sum, c) => sum + (c.done ? c.weight : 0), 0);
  const overallPercent = totalWeight === 0 ? 0 : Math.round((earned / totalWeight) * 100);

  const missingRequiredFields = categories.flatMap((c) => c.requiredMissing);
  const missingPhotos =
    draft.vehiclePhotos.length === 0
      ? ["Vehicle photos"]
      : draft.vehiclePhotos.length < 3
        ? ["Additional vehicle photos"]
        : [];
  const missingDocuments = draft.documents.length === 0 ? ["Supporting documents"] : [];
  const incompleteSections = categories
    .filter((c) => !c.done)
    .map((c) => ({ id: c.id, label: c.label, href: c.href }));

  return {
    overallPercent,
    categories,
    missingRequiredFields,
    missingPhotos,
    missingDocuments,
    incompleteSections,
  };
}

export function getDraftMetaSummary(draft: ListingDraft) {
  const type = getListingTypeById(draft.listingTypeId);
  const vehicle = [draft.details.year, draft.details.make, draft.details.model]
    .filter(Boolean)
    .join(" ");
  return {
    vehicleTypeLabel: type?.label ?? "Not selected",
    vehicleLabel: vehicle || "Untitled vehicle",
    stepCount: LISTING_STEPS.length,
  };
}
