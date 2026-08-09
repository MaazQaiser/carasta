"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useListingBuilder } from "../ListingBuilderContext";
import { RESTORED_RESTOMODE_SPECS_CONFIG } from "../specs/restored-restomod";
import { RestorationProfileHeader } from "../specs/RestorationProfileHeader";
import { SpecsWorkspace } from "../specs/SpecsWorkspace";
import { LISTING_PATHS } from "../listing-route-map";

export function RestoredSpecsRouteScreen() {
  const router = useRouter();
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

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "restored-restomod-custom") {
      router.replace(LISTING_PATHS.specifications);
    }
  }, [draft.listingTypeId, router]);

  return (
    <SpecsWorkspace
      config={RESTORED_RESTOMODE_SPECS_CONFIG}
      entries={ws.entries}
      activeCategoryId={ws.activeCategoryId}
      expandedEntryIds={ws.expandedEntryIds}
      editingEntryId={ws.editingEntryId}
      onSelectCategory={setActiveSpecsCategory}
      onAddEntry={(categoryId) => {
        startNewEntry(categoryId);
        router.push(LISTING_PATHS.restoredModAdd);
      }}
      onToggleEntry={toggleEntryExpanded}
      onEditEntry={(entryId) => {
        startEditEntry(entryId);
        router.push(LISTING_PATHS.restoredModAdd);
      }}
      onDuplicateEntry={duplicateEntry}
      onDeleteEntry={deleteEntry}
      onSaveEntry={saveEntry}
      onCancelEdit={cancelEntryEdit}
      continueHref={LISTING_PATHS.condition}
      header={
        <RestorationProfileHeader
          value={ws.restoration}
          onChange={(patch) =>
            updateWorkspace({
              restoration: { ...ws.restoration, ...patch },
            })
          }
        />
      }
    />
  );
}
