"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useListingBuilder } from "../ListingBuilderContext";
import { RACE_TRACK_SPECS_CONFIG } from "../specs/race-track";
import { SpecsWorkspace } from "../specs/SpecsWorkspace";
import { LISTING_PATHS } from "../listing-route-map";

/** Race specifications & modifications (after summary + biography). */
export function RaceSpecsRouteScreen() {
  const router = useRouter();
  const {
    draft,
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
    if (draft.listingTypeId && draft.listingTypeId !== "race-track-car") {
      router.replace(LISTING_PATHS.specifications);
    }
  }, [draft.listingTypeId, router]);

  return (
    <SpecsWorkspace
      config={RACE_TRACK_SPECS_CONFIG}
      entries={ws.entries}
      activeCategoryId={ws.activeCategoryId}
      expandedEntryIds={ws.expandedEntryIds}
      editingEntryId={ws.editingEntryId}
      onSelectCategory={setActiveSpecsCategory}
      onAddEntry={(categoryId) => {
        startNewEntry(categoryId);
        router.push(LISTING_PATHS.raceModAdd);
      }}
      onToggleEntry={toggleEntryExpanded}
      onEditEntry={(entryId) => {
        startEditEntry(entryId);
        router.push(LISTING_PATHS.raceModAdd);
      }}
      onDuplicateEntry={duplicateEntry}
      onDeleteEntry={deleteEntry}
      onSaveEntry={saveEntry}
      onCancelEdit={cancelEntryEdit}
      continueHref={LISTING_PATHS.condition}
    />
  );
}
