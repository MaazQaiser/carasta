"use client";

import { useListingBuilder } from "../ListingBuilderContext";
import { RESTORED_RESTOMODE_SPECS_CONFIG } from "./restored-restomod";
import { RestorationProfileHeader } from "./RestorationProfileHeader";
import { SpecsWorkspace } from "./SpecsWorkspace";

export function RestoredRestomodSpecsScreen() {
  const {
    draft,
    updateWorkspace,
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
  const restoration = ws.restoration;

  return (
    <SpecsWorkspace
      config={RESTORED_RESTOMODE_SPECS_CONFIG}
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
        <RestorationProfileHeader
          value={restoration}
          onChange={(patch) =>
            updateWorkspace({
              restoration: { ...restoration, ...patch },
            })
          }
        />
      }
    />
  );
}
