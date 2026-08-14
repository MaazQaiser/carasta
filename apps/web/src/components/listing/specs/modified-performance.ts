import type { SpecsFlowConfig, ModificationWorkspaceState } from "./types";
import { createEmptyPerformanceSummary, createEmptyRestorationState, createEmptyRaceState } from "./options";
import { SHARED_MODIFICATION_CATEGORIES } from "./shared-modification-categories";
import {
  MODIFIED_SPECS_COPY,
  STANDARD_MODIFICATION_ENTRY_FORM_CONFIG,
} from "./standard-modification-entry";

/** Modified / Performance specifications & modifications config. */
export const MODIFIED_PERFORMANCE_SPECS_CONFIG: SpecsFlowConfig = {
  id: "modified-performance",
  label: "Modified / Performance",
  description: MODIFIED_SPECS_COPY.subtext,
  showPerformanceSummary: true,
  entryForm: STANDARD_MODIFICATION_ENTRY_FORM_CONFIG,
  categories: SHARED_MODIFICATION_CATEGORIES,
};

export function createModifiedPerformanceWorkspace(): ModificationWorkspaceState {
  const firstCategoryId =
    MODIFIED_PERFORMANCE_SPECS_CONFIG.categories[0]?.id ?? "engine-performance";
  return {
    performanceSummary: createEmptyPerformanceSummary(),
    restoration: createEmptyRestorationState(),
    race: createEmptyRaceState(),
    entries: [],
    activeCategoryId: firstCategoryId,
    expandedEntryIds: [],
    editingEntryId: null,
    hasModifications: null,
    reviewedFactoryCategoryIds: [],
    factorySpecOverrides: {},
  };
}
