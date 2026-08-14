"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListingBuilder } from "../ListingBuilderContext";
import { LISTING_PATHS } from "../listing-route-map";
import { MODIFIED_PERFORMANCE_SPECS_CONFIG } from "../specs/modified-performance";
import { MODIFIED_SPECS_COPY } from "../specs/standard-modification-entry";
import { normalizeModificationCategoryId } from "../specs/shared-modification-categories";
import { ModificationEntryCard } from "../specs/ModificationEntryCard";

const CATEGORIES = MODIFIED_PERFORMANCE_SPECS_CONFIG.categories;

export function ModifiedSpecsRouteScreen() {
  const router = useRouter();
  const {
    draft,
    updateWorkspace,
    startNewEntry,
    startEditEntry,
    toggleEntryExpanded,
    duplicateEntry,
    deleteEntry,
    saveEntry,
    cancelEntryEdit,
  } = useListingBuilder();

  const ws = draft.modificationWorkspace;
  const [expanded, setExpanded] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "modified-performance") {
      router.replace(LISTING_PATHS.specifications);
    }
  }, [draft.listingTypeId, router]);

  const entries = ws.entries.filter((entry) => entry.completed || entry.title.trim());

  const addModification = (categoryId: string) => {
    updateWorkspace({ activeCategoryId: categoryId, hasModifications: true });
    startNewEntry(categoryId);
    router.push(LISTING_PATHS.modifiedModAdd);
  };

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0">
      <div className="min-w-0">
        <h2 className="text-lg sm:text-xl font-semibold">{MODIFIED_SPECS_COPY.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{MODIFIED_SPECS_COPY.subtext}</p>
        <p className="text-xs font-medium text-primary mt-2">
          {entries.length} modification{entries.length === 1 ? "" : "s"} added
        </p>
      </div>

      <div className="divide-y rounded-2xl border bg-card">
        {CATEGORIES.map((category) => {
          const open = expanded === category.id;
          const categoryEntries = entries.filter(
            (entry) => normalizeModificationCategoryId(entry.categoryId) === category.id
          );
          const count = categoryEntries.length;

          return (
            <div key={category.id}>
              <button
                type="button"
                onClick={() => {
                  setExpanded(open ? null : category.id);
                  updateWorkspace({ activeCategoryId: category.id });
                }}
                className="flex h-12 w-full items-center justify-between px-4 text-left"
              >
                <span className="text-sm font-semibold">
                  {category.label}
                  {count > 0 ? (
                    <span className="ml-2 text-[10px] font-medium text-muted-foreground">
                      {count} mod{count === 1 ? "" : "s"}
                    </span>
                  ) : null}
                </span>
                {open ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {open ? (
                <div className="space-y-3 border-t bg-muted/20 p-4">
                  {categoryEntries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No modifications in this category yet.
                    </p>
                  ) : (
                    categoryEntries.map((entry) => (
                      <ModificationEntryCard
                        key={entry.id}
                        entry={entry}
                        expanded={ws.expandedEntryIds.includes(entry.id)}
                        editing={false}
                        onToggle={() => toggleEntryExpanded(entry.id)}
                        onEdit={() => {
                          startEditEntry(entry.id);
                          router.push(LISTING_PATHS.modifiedModAdd);
                        }}
                        onDuplicate={() => duplicateEntry(entry.id)}
                        onDelete={() => deleteEntry(entry.id)}
                        onSave={saveEntry}
                        onCancelEdit={cancelEntryEdit}
                        formConfig={MODIFIED_PERFORMANCE_SPECS_CONFIG.entryForm}
                      />
                    ))
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => addModification(category.id)}
                  >
                    <Plus className="h-4 w-4" />
                    Add Modification
                  </Button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        className="w-full"
        onClick={() =>
          addModification(expanded || CATEGORIES[0]?.id || "engine-performance")
        }
      >
        Add Modification
      </Button>
    </div>
  );
}
