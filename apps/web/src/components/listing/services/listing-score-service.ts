import type { ListingDraft } from "../types";
import { evaluateListingCompletion, type CompletionReport } from "./completion-engine";
import { specsEntryHref } from "../listing-route-map";

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
 */
export function evaluateListingScore(draft: ListingDraft): ListingScoreReport {
  const completion = evaluateListingCompletion(draft);
  let score = completion.overallPercent;

  // Quality adjustments (still data-driven from draft state).
  if (draft.vehiclePhotos.length >= 8) score = Math.min(100, score + 4);
  if (draft.documents.length >= 2) score = Math.min(100, score + 3);
  if (draft.ownerNotes.trim().length >= 200) score = Math.min(100, score + 3);
  if (draft.aiDescription.trim().length >= 200) score = Math.min(100, score + 2);
  if (draft.modificationPhotos.length > 0) score = Math.min(100, score + 2);

  if (draft.vehiclePhotos.length === 0) score = Math.max(0, score - 8);
  if (!draft.ownerNotes.trim()) score = Math.max(0, score - 4);

  const recommendations: ListingScoreRecommendation[] = [];

  if (draft.vehiclePhotos.length < 6) {
    recommendations.push({
      id: "photos",
      label: "Add more photos",
      href: "/listing/photos",
      impact: "high",
    });
  }
  if (draft.documents.length === 0) {
    recommendations.push({
      id: "receipts",
      label: "Upload receipts / documents",
      href: "/listing/photos",
      impact: "medium",
    });
  }
  if (draft.ownerNotes.trim().length < 80) {
    recommendations.push({
      id: "notes",
      label: "Complete owner notes",
      href: "/listing/notes",
      impact: "high",
    });
  }
  if (draft.aiDescription.trim().length < 80) {
    recommendations.push({
      id: "ai",
      label: "Improve AI description",
      href: "/listing/ai",
      impact: "medium",
    });
  }
  if (
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
  if (!draft.saleSettings.saleType || !draft.saleSettings.reservePrice) {
    recommendations.push({
      id: "settings",
      label: "Finish sale settings",
      href: "/listing/settings",
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
