import type { ListingDraft, ListingTypeId, ModificationWorkspaceState } from "./types";
import { createModifiedPerformanceWorkspace } from "./specs/modified-performance";
import {
  createRestoredRestomodWorkspace,
  normalizeRestorationBuild,
  normalizeRestorationCategoryId,
  normalizeRestorationDocumentation,
  normalizeRestorationEntries,
  normalizeRestorationTimelineEvents,
} from "./specs/restored-restomod";
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

/** Move preserved/survivor drafts onto Stock / Lightly Modified and canonicalize restomod subs. */
export function migrateRestoredListingDraft(draft: ListingDraft): ListingDraft {
  const ws = draft.modificationWorkspace;
  const restoration = ws.restoration;
  if (!restoration) return draft;

  const normalized = normalizeRestorationBuild(restoration);
  if (draft.listingTypeId === "restored-restomod-custom" && normalized.rerouteToStock) {
    return {
      ...draft,
      listingTypeId: "stock-lightly-modified",
      modificationWorkspace: {
        ...createStockLightlyModifiedWorkspace(),
        hasModifications: false,
        factorySpecOverrides: ws.factorySpecOverrides ?? {},
      },
    };
  }

  if (draft.listingTypeId !== "restored-restomod-custom") {
    return {
      ...draft,
      modificationWorkspace: {
        ...ws,
        restoration: {
          ...restoration,
          buildType: normalized.buildType,
          restomodSubcategory: normalized.restomodSubcategory,
          documentation: normalizeRestorationDocumentation(restoration.documentation),
          timelineEvents: normalizeRestorationTimelineEvents(restoration.timelineEvents),
        },
      },
    };
  }

  return {
    ...draft,
    modificationWorkspace: {
      ...ws,
      entries: normalizeRestorationEntries(ws.entries),
      activeCategoryId: normalizeRestorationCategoryId(ws.activeCategoryId),
      restoration: {
        ...restoration,
        buildType: normalized.buildType,
        restomodSubcategory: normalized.restomodSubcategory,
        documentation: normalizeRestorationDocumentation(restoration.documentation),
        timelineEvents: normalizeRestorationTimelineEvents(restoration.timelineEvents),
      },
    },
  };
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
  if (hasFilled(ws.race.buildNarrative)) return true;
  if (hasFilled(ws.race.workPerformedBy)) return true;
  if (hasFilled(ws.race.shopBuilder)) return true;
  if ((ws.race.installedSafetyEquipment ?? []).length > 0) return true;
  if (hasFilled(ws.race.safetyEquipmentNotes)) return true;
  if (hasFilled(ws.race.safetyServiceDates)) return true;
  if (hasFilled(ws.race.organizedCompetition)) return true;
  if (hasFilled(ws.race.competitionHistoryNarrative)) return true;
  if ((ws.race.documentationTypes ?? []).length > 0) return true;
  if (hasFilled(ws.race.documentationOther)) return true;
  if ((ws.race.documentationUploads ?? []).length > 0) return true;
  if (hasFilled(ws.race.sparesIncluded)) return true;
  if (hasFilled(ws.race.sparesDescription)) return true;
  if (hasFilled(ws.race.knownRaceTrackIssues)) return true;
  return false;
}
