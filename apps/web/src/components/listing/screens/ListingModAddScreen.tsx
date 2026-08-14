"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ListingStep } from "../ListingStep";
import { useListingBuilder } from "../ListingBuilderContext";
import { ModificationFormWithCategory } from "../specs/ModificationFormWithCategory";
import { ModificationEntryForm } from "../specs/ModificationEntryForm";
import { STANDARD_MODIFICATION_ENTRY_FORM_CONFIG } from "../specs/standard-modification-entry";
import {
  RESTORED_RESTOMODE_SPECS_CONFIG,
  getRestorationBuildCategories,
  shouldShowPartClassification,
} from "../specs/restored-restomod";
import { RACE_TRACK_SPECS_CONFIG } from "../specs/race-track";
import { SHARED_MODIFICATION_CATEGORIES } from "../specs/shared-modification-categories";
import { LISTING_PATHS } from "../listing-route-map";
import type { ListingTypeId } from "../types";
import type { SpecsCategoryDefinition } from "../specs/types";

const BACK_BY_TYPE: Record<ListingTypeId, string> = {
  "stock-lightly-modified": LISTING_PATHS.stockSpecs,
  "modified-performance": LISTING_PATHS.modifiedSpecs,
  "restored-restomod-custom": LISTING_PATHS.restoredSpecs,
  "race-track-car": LISTING_PATHS.raceSpecs,
};

function formConfigForType(
  typeId: ListingTypeId | null,
  restorationBuildType?: string | null,
  partClassification?: string
) {
  switch (typeId) {
    case "stock-lightly-modified":
    case "modified-performance":
      return STANDARD_MODIFICATION_ENTRY_FORM_CONFIG;
    case "restored-restomod-custom":
      return {
        ...RESTORED_RESTOMODE_SPECS_CONFIG.entryForm,
        showPartClassification:
          shouldShowPartClassification(restorationBuildType) || Boolean(partClassification),
      };
    case "race-track-car":
      return RACE_TRACK_SPECS_CONFIG.entryForm;
    default:
      return STANDARD_MODIFICATION_ENTRY_FORM_CONFIG;
  }
}

function usesCategoryPicker(typeId: ListingTypeId | null) {
  return typeId !== "race-track-car";
}

function categoriesForType(
  typeId: ListingTypeId | null,
  restorationBuildType?: string | null
): SpecsCategoryDefinition[] {
  if (typeId === "restored-restomod-custom") {
    return getRestorationBuildCategories(restorationBuildType);
  }
  return SHARED_MODIFICATION_CATEGORIES;
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

  const restorationBuildType = draft.modificationWorkspace.restoration.buildType;
  const formConfig = formConfigForType(
    typeId,
    restorationBuildType,
    editingEntry.partClassification
  );

  return (
    <ListingStep
      title={editingEntry.title.trim() ? "Edit Modification" : "Add Modification"}
      description="Document the work, then save to return to specifications."
    >
      <div className="max-w-2xl">
        {usesCategoryPicker(typeId) ? (
          <ModificationFormWithCategory
            entry={editingEntry}
            formConfig={formConfig}
            categories={categoriesForType(typeId, restorationBuildType)}
            onSave={(entry) => {
              saveEntry(entry);
              router.push(backHref);
            }}
            onCancel={() => {
              cancelEntryEdit();
              router.push(backHref);
            }}
          />
        ) : (
          <ModificationEntryForm
            entry={editingEntry}
            formConfig={formConfig}
            onSave={(entry) => {
              saveEntry(entry);
              router.push(backHref);
            }}
            onCancel={() => {
              cancelEntryEdit();
              router.push(backHref);
            }}
          />
        )}
      </div>
    </ListingStep>
  );
}
