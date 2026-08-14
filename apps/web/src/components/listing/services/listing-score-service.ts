import type { ListingDraft } from "../types";
import { evaluateListingCompletion, type CompletionReport } from "./completion-engine";
import { LISTING_PATHS, specsEntryHref } from "../listing-route-map";
import {
  isRaceCompetitionHistoryComplete,
  isRaceDocumentationComplete,
  RACE_DOCUMENTATION_NONE_ID,
} from "../specs/race-track";

export interface ListingScoreRecommendation {
  id: string;
  label: string;
  href: string;
  impact: "high" | "medium" | "low";
}

export interface ListingScoreReport {
  score: number;
  completion: CompletionReport;
  recommendations: ListingScoreRecommendation[];
}

/**
 * Reusable listing score service — not hardcoded in UI components.
 * Score is derived from weighted completion + quality boosts/penalties.
 * Race scores reward transparency and completeness, not vehicle characteristics.
 * Do not reward/penalize competing vs not competing, factory/spec cars with no
 * modifications, or sellers who correctly select None for documentation.
 */
export function evaluateListingScore(draft: ListingDraft): ListingScoreReport {
  const completion = evaluateListingCompletion(draft);
  let score = completion.overallPercent;
  const isRace = draft.listingTypeId === "race-track-car";
  const race = draft.modificationWorkspace.race;

  if (draft.vehiclePhotos.length >= 8) score = Math.min(100, score + 4);
  if (draft.vehiclePhotos.length >= 20) score = Math.min(100, score + 2);
  if (draft.videos.length > 0) score = Math.min(100, score + 2);
  if (draft.documents.length >= 2) score = Math.min(100, score + 3);
  if (draft.ownerNotes.trim().length >= 200) score = Math.min(100, score + 3);
  if (draft.aiDescription.trim().length >= 200) score = Math.min(100, score + 2);
  if (draft.modificationPhotos.length > 0 && !isRace) score = Math.min(100, score + 2);

  if (isRace) {
    if ((race.buildNarrative ?? "").trim().length >= 80) score = Math.min(100, score + 3);
    if ((race.workPerformedBy ?? "").trim() || (race.shopBuilder ?? "").trim()) {
      score = Math.min(100, score + 2);
    }
    if (isRaceCompetitionHistoryComplete(race)) score = Math.min(100, score + 2);
    if (isRaceDocumentationComplete(race)) score = Math.min(100, score + 2);
    if (
      (race.installedSafetyEquipment ?? []).length > 0 ||
      (race.safetyEquipmentNotes ?? "").trim()
    ) {
      score = Math.min(100, score + 2);
    }
    if ((race.knownRaceTrackIssues ?? "").trim()) score = Math.min(100, score + 2);
    if (race.sparesIncluded === "Yes" && (race.sparesDescription ?? "").trim()) {
      score = Math.min(100, score + 2);
    }
  }

  if (draft.vehiclePhotos.length === 0) score = Math.max(0, score - 8);
  if (!draft.ownerNotes.trim()) score = Math.max(0, score - 4);

  const recommendations: ListingScoreRecommendation[] = [];

  if (draft.vehiclePhotos.length < 6) {
    recommendations.push({
      id: "photos",
      label: isRace
        ? "Add more photos (cockpit, cage, safety equipment, and current condition)"
        : "Add more photos",
      href: LISTING_PATHS.photos,
      impact: "high",
    });
  }

  const selectedNone =
    isRace && (race.documentationTypes ?? []).includes(RACE_DOCUMENTATION_NONE_ID);
  if (draft.documents.length === 0 && !selectedNone) {
    recommendations.push({
      id: "receipts",
      label: "Upload receipts / documents",
      href: LISTING_PATHS.photos,
      impact: "medium",
    });
  }
  if (draft.ownerNotes.trim().length < 80) {
    recommendations.push({
      id: "notes",
      label: "Complete owner notes",
      href: LISTING_PATHS.notes,
      impact: "high",
    });
  }
  if (draft.aiDescription.trim().length < 80) {
    recommendations.push({
      id: "ai",
      label: "Improve AI description",
      href: LISTING_PATHS.ai,
      impact: "medium",
    });
  }
  if (
    !isRace &&
    draft.modificationWorkspace.entries.length === 0 &&
    draft.listingTypeId &&
    draft.listingTypeId !== "stock-lightly-modified"
  ) {
    recommendations.push({
      id: "docs-support",
      label: "Add supporting specification entries",
      href: specsEntryHref(draft.listingTypeId),
      impact: "medium",
    });
  }
  if (isRace && !(race.buildNarrative ?? "").trim()) {
    recommendations.push({
      id: "race-build",
      label: "Complete the race / track build description",
      href: LISTING_PATHS.raceSpecs,
      impact: "high",
    });
  }
  if (!draft.saleSettings.buyNowPrice && !draft.saleSettings.reservePrice) {
    recommendations.push({
      id: "settings",
      label: "Finish auction settings",
      href: LISTING_PATHS.settings,
      impact: "high",
    });
  }

  return {
    score: Math.round(score),
    completion,
    recommendations: recommendations.slice(0, 5),
  };
}

export const ListingScoreService = {
  evaluate: evaluateListingScore,
};
