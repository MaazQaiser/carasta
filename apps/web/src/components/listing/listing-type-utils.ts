import type { ListingDraft, ListingTypeId, ModificationWorkspaceState } from "./types";
import { createModifiedPerformanceWorkspace } from "./specs/modified-performance";
import { createRestoredRestomodWorkspace } from "./specs/restored-restomod";
import { createRaceTrackWorkspace } from "./specs/race-track";
import { createStockLightlyModifiedWorkspace } from "./specs/stock-lightly-modified";

/** Fresh adaptive workspace for the selected listing type. Shared vehicle data stays on the draft root. */
export function createWorkspaceForListingType(
  id: ListingTypeId
): ModificationWorkspaceState {
  switch (id) {
    case "stock-lightly-modified":
      return createStockLightlyModifiedWorkspace();
    case "modified-performance":
      return createModifiedPerformanceWorkspace();
    case "restored-restomod-custom":
      return createRestoredRestomodWorkspace();
    case "race-track-car":
      return createRaceTrackWorkspace();
  }
}

function hasFilled(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some(hasFilled);
  }
  return Boolean(value);
}

/**
 * Category-specific adaptive answers that must be confirmed before clearing on type change.
 * Shared fields (VIN, details, condition, media, notes, sale settings) are not included.
 */
export function hasCategorySpecificListingAnswers(draft: ListingDraft): boolean {
  const ws = draft.modificationWorkspace;
  if (ws.entries.length > 0) return true;
  if (ws.hasModifications !== null) return true;
  if (ws.reviewedFactoryCategoryIds.length > 0) return true;
  if (Object.values(ws.factorySpecOverrides).some((v) => String(v ?? "").trim())) return true;
  if (hasFilled(ws.performanceSummary)) return true;
  if (hasFilled(ws.restoration)) return true;
  if (ws.race.historyEntries.length > 0) return true;
  if (hasFilled(ws.race.identity)) return true;
  if (hasFilled(ws.race.competition)) return true;
  if (hasFilled(ws.race.safety)) return true;
  if (hasFilled(ws.race.setup)) return true;
  if (hasFilled(ws.race.biography)) return true;
  if (hasFilled(ws.race.documentation)) return true;
  return false;
}
