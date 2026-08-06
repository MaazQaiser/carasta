"use client";

import { useListingBuilder } from "../ListingBuilderContext";
import { RACE_TRACK_SPECS_CONFIG } from "./race-track";
import { RaceProfileHeader } from "./RaceProfileHeader";
import { SpecsWorkspace } from "./SpecsWorkspace";

export function RaceTrackSpecsScreen() {
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
  const race = ws.race;

  return (
    <SpecsWorkspace
      config={RACE_TRACK_SPECS_CONFIG}
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
        <RaceProfileHeader
          value={race}
          onChange={(patch) => {
            if (typeof patch === "function") {
              updateWorkspace({ race: patch(race) });
            } else {
              updateWorkspace({ race: { ...race, ...patch } });
            }
          }}
        />
      }
    />
  );
}
