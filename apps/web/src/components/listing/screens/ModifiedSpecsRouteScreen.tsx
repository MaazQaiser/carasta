"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useListingBuilder } from "../ListingBuilderContext";
import { MODIFIED_PERFORMANCE_SPECS_CONFIG } from "../specs/modified-performance";
import { PerformanceSummaryCard } from "../specs/PerformanceSummaryCard";
import { SpecsWorkspace } from "../specs/SpecsWorkspace";
import { LISTING_PATHS } from "../listing-route-map";

export function ModifiedSpecsRouteScreen() {
  const router = useRouter();
  const {
    draft,
    updatePerformanceSummary,
    setActiveSpecsCategory,
    toggleEntryExpanded,
    startNewEntry,
    startEditEntry,
    cancelEntryEdit,
    saveEntry,
    deleteEntry,
    duplicateEntry,
  } = useListingBuilder();

  const ws = draft.modificationWorkspace;

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "modified-performance") {
      router.replace(LISTING_PATHS.specifications);
    }
  }, [draft.listingTypeId, router]);

  return (
    <SpecsWorkspace
      config={MODIFIED_PERFORMANCE_SPECS_CONFIG}
      entries={ws.entries}
      activeCategoryId={ws.activeCategoryId}
      expandedEntryIds={ws.expandedEntryIds}
      editingEntryId={ws.editingEntryId}
      onSelectCategory={setActiveSpecsCategory}
      onAddEntry={(categoryId) => {
        startNewEntry(categoryId);
        router.push(LISTING_PATHS.modifiedModAdd);
      }}
      onToggleEntry={toggleEntryExpanded}
      onEditEntry={(entryId) => {
        startEditEntry(entryId);
        router.push(LISTING_PATHS.modifiedModAdd);
      }}
      onDuplicateEntry={duplicateEntry}
      onDeleteEntry={deleteEntry}
      onSaveEntry={saveEntry}
      onCancelEdit={cancelEntryEdit}
      continueHref={LISTING_PATHS.condition}
      header={
        <PerformanceSummaryCard
          value={ws.performanceSummary}
          onChange={updatePerformanceSummary}
        />
      }
    />
  );
}
