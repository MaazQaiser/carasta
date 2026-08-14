import type { ListingDraft } from "../types";
import { LISTING_STEPS, getListingTypeById } from "../config";
import {
  LISTING_PATHS,
  MIN_LISTING_PHOTOS,
  specsEntryHref,
} from "../listing-route-map";
import {
  isRaceBuildComplete,
  isRaceCompetitionHistoryComplete,
  isRaceDocumentationComplete,
  isRacePrimaryUseComplete,
} from "../specs/race-track";

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
    return (
      isRacePrimaryUseComplete(ws.race.competition) &&
      isRaceBuildComplete(ws.race) &&
      isRaceCompetitionHistoryComplete(ws.race) &&
      isRaceDocumentationComplete(ws.race)
    );
  }
  return false;
}

/**
 * Listing Completion Engine — evaluates every shared listing type.
 * Weights live here so UI stays presentation-only.
 */
export function evaluateListingCompletion(draft: ListingDraft): CompletionReport {
  const raceIdentity = draft.modificationWorkspace.race.identity;
  const isRace = draft.listingTypeId === "race-track-car";
  const year = isRace ? raceIdentity.year || draft.details.year : draft.details.year;
  const make = isRace ? raceIdentity.make || draft.details.make : draft.details.make;
  const model = isRace ? raceIdentity.model || draft.details.model : draft.details.model;

  const detailsMissing: string[] = [];
  if (!year) detailsMissing.push("Year");
  if (!make) detailsMissing.push("Make");
  if (!model) detailsMissing.push("Model");
  if (!isRace) {
    if (!draft.details.trim) detailsMissing.push("Trim");
    if (!draft.details.mileage) detailsMissing.push("Mileage");
  }
  if (draft.listingTypeId === "restored-restomod-custom") {
    if (!draft.modificationWorkspace.restoration.buildType) {
      detailsMissing.push("Build type");
    }
    if (!draft.modificationWorkspace.restoration.mileageStatus) {
      detailsMissing.push("Mileage status");
    }
    if (!draft.modificationWorkspace.restoration.buildStatus) {
      detailsMissing.push("Build status");
    }
    if (!draft.modificationWorkspace.restoration.workPerformedBy) {
      detailsMissing.push("Work performed by");
    }
  }

  const categories: CompletionCategory[] = [
    {
      id: "type",
      label: "Vehicle Type",
      href: LISTING_PATHS.type,
      weight: 10,
      done: Boolean(draft.listingTypeId),
      requiredMissing: draft.listingTypeId ? [] : ["Vehicle type"],
      warnings: [],
    },
    {
      id: "identify",
      label: "Identify Vehicle",
      href: LISTING_PATHS.identify,
      weight: 5,
      done: Boolean(draft.details.vin || draft.vinInput),
      requiredMissing: [],
      warnings: draft.details.vin || draft.vinInput ? [] : ["VIN not provided (optional)"],
    },
    {
      id: "details",
      label: "Vehicle Details",
      href: LISTING_PATHS.details,
      weight: 15,
      done: detailsMissing.length === 0,
      requiredMissing: detailsMissing,
      warnings: [],
    },
    {
      id: "specifications",
      label: "Specifications",
      href: specsEntryHref(draft.listingTypeId),
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
      href: LISTING_PATHS.condition,
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
      href: LISTING_PATHS.photos,
      weight: 15,
      done: draft.vehiclePhotos.length >= MIN_LISTING_PHOTOS,
      requiredMissing: [
        ...(draft.vehiclePhotos.length < MIN_LISTING_PHOTOS
          ? [`At least ${MIN_LISTING_PHOTOS} vehicle photos`]
          : []),
      ],
      warnings: draft.videos.length === 0 ? ["Videos are optional but recommended"] : [],
    },
    {
      id: "documents",
      label: "Documents",
      href: LISTING_PATHS.photos,
      weight: 5,
      done: draft.documents.length > 0,
      requiredMissing: [],
      warnings: draft.documents.length === 0 ? ["No documents uploaded"] : [],
    },
    {
      id: "notes",
      label: "Owner Notes",
      href: LISTING_PATHS.notes,
      weight: 10,
      done: Boolean(draft.ownerNotes.trim()),
      requiredMissing: draft.ownerNotes.trim() ? [] : ["Owner notes"],
      warnings: [],
    },
    {
      id: "ai",
      label: "AI Description",
      href: LISTING_PATHS.ai,
      weight: 5,
      done: draft.aiDescription.trim().length >= 100,
      requiredMissing:
        draft.aiDescription.trim().length >= 100
          ? []
          : ["AI description (min 100 characters)"],
      warnings: [],
    },
    {
      id: "settings",
      label: "Auction Settings",
      href: LISTING_PATHS.settings,
      weight: 10,
      done: Boolean(draft.saleSettings.buyNowPrice || draft.saleSettings.reservePrice),
      requiredMissing: [
        ...(!draft.saleSettings.buyNowPrice && !draft.saleSettings.reservePrice
          ? ["Buy Now or Reserve Price"]
          : []),
      ],
      warnings: [],
    },
  ];

  const totalWeight = categories.reduce((sum, c) => sum + c.weight, 0);
  const earned = categories.reduce((sum, c) => sum + (c.done ? c.weight : 0), 0);
  const overallPercent = totalWeight === 0 ? 0 : Math.round((earned / totalWeight) * 100);

  const missingRequiredFields = categories.flatMap((c) => c.requiredMissing);
  const missingPhotos = [
    ...(draft.vehiclePhotos.length < MIN_LISTING_PHOTOS
      ? [`At least ${MIN_LISTING_PHOTOS} vehicle photos`]
      : []),
  ];
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
