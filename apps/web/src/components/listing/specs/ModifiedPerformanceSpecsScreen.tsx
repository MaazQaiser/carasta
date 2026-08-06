"use client";

import { useListingBuilder } from "../ListingBuilderContext";
import { MODIFIED_PERFORMANCE_SPECS_CONFIG } from "./modified-performance";
import { PerformanceSummaryCard } from "./PerformanceSummaryCard";
import { SpecsWorkspace } from "./SpecsWorkspace";

export function ModifiedPerformanceSpecsScreen() {
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

  return (
    <SpecsWorkspace
      config={MODIFIED_PERFORMANCE_SPECS_CONFIG}
      entries={ws.entries}
      activeCategoryId={ws.activeCategoryId}
      expandedEntryIds={ws.expandedEntryIds}
      editingEntryId={ws.editingEntryId}
      onSelectCategory={setActiveSpecsCategory}
      onAddEntry={startNewEntry}
      onToggleEntry={toggleEntryExpanded}
      onEditEntry={startEditEntry}
      onDuplicateEntry={duplicateEntry}
      onDeleteEntry={deleteEntry}
      onSaveEntry={saveEntry}
      onCancelEdit={cancelEntryEdit}
      header={
        <PerformanceSummaryCard
          value={ws.performanceSummary}
          onChange={updatePerformanceSummary}
        />
      }
    />
  );
}
