"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ListingStep } from "../ListingStep";
import { useListingBuilder } from "../ListingBuilderContext";
import { ModificationEntryForm } from "../specs/ModificationEntryForm";
import {
  STOCK_ENTRY_FORM_CONFIG,
} from "../specs/stock-lightly-modified";
import { MODIFIED_PERFORMANCE_SPECS_CONFIG } from "../specs/modified-performance";
import { RESTORED_RESTOMODE_SPECS_CONFIG } from "../specs/restored-restomod";
import { RACE_TRACK_SPECS_CONFIG } from "../specs/race-track";
import { LISTING_PATHS } from "../listing-route-map";
import type { ListingTypeId } from "../types";

const BACK_BY_TYPE: Record<ListingTypeId, string> = {
  "stock-lightly-modified": LISTING_PATHS.stockSpecs,
  "modified-performance": LISTING_PATHS.modifiedSpecs,
  "restored-restomod-custom": LISTING_PATHS.restoredSpecs,
  "race-track-car": LISTING_PATHS.raceSpecs,
};

function formConfigForType(typeId: ListingTypeId | null) {
  switch (typeId) {
    case "stock-lightly-modified":
      return STOCK_ENTRY_FORM_CONFIG;
    case "modified-performance":
      return MODIFIED_PERFORMANCE_SPECS_CONFIG.entryForm;
    case "restored-restomod-custom":
      return RESTORED_RESTOMODE_SPECS_CONFIG.entryForm;
    case "race-track-car":
      return RACE_TRACK_SPECS_CONFIG.entryForm;
    default:
      return STOCK_ENTRY_FORM_CONFIG;
  }
}

/** Nested modification add/edit form for type-specific routes. */
export function ListingModAddScreen() {
  const router = useRouter();
  const { draft, saveEntry, cancelEntryEdit } = useListingBuilder();
  const typeId = draft.listingTypeId;
  const backHref = typeId ? BACK_BY_TYPE[typeId] : LISTING_PATHS.details;
  const editingEntry =
    draft.modificationWorkspace.entries.find(
      (e) => e.id === draft.modificationWorkspace.editingEntryId
    ) ?? null;

  React.useEffect(() => {
    if (!editingEntry) {
      router.replace(backHref);
    }
  }, [backHref, editingEntry, router]);

  if (!editingEntry) {
    return (
      <ListingStep title="Add Modification" description="Loading…">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </ListingStep>
    );
  }

  return (
    <ListingStep
      title={editingEntry.title.trim() ? "Edit Modification" : "Add Modification"}
      description="Document the work, then save to return to specifications."
    >
      <div className="max-w-2xl">
        <ModificationEntryForm
          entry={editingEntry}
          formConfig={formConfigForType(typeId)}
          onSave={(entry) => {
            saveEntry(entry);
            router.push(backHref);
          }}
          onCancel={() => {
            cancelEntryEdit();
            router.push(backHref);
          }}
        />
      </div>
    </ListingStep>
  );
}
