"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListingBuilder } from "../ListingBuilderContext";
import {
  FLOW3_BUILD_RESTORATION_COPY,
  RESTORED_RESTOMODE_SPECS_CONFIG,
  getRestorationBuildCategories,
  normalizeRestorationCategoryId,
  shouldShowPartClassification,
} from "../specs/restored-restomod";
import { RestorationProfileHeader } from "../specs/RestorationProfileHeader";
import { SpecsBuildSummary } from "../specs/SpecsBuildSummary";
import { ModificationEntryCard } from "../specs/ModificationEntryCard";
import { LISTING_PATHS } from "../listing-route-map";

export function RestoredSpecsRouteScreen() {
  const router = useRouter();
  const {
    draft,
    updateWorkspace,
    toggleEntryExpanded,
    startNewEntry,
    startEditEntry,
    cancelEntryEdit,
    saveEntry,
    deleteEntry,
    duplicateEntry,
  } = useListingBuilder();

  const ws = draft.modificationWorkspace;
  const categories = getRestorationBuildCategories(ws.restoration.buildType);
  const entryFormConfig = {
    ...RESTORED_RESTOMODE_SPECS_CONFIG.entryForm,
    showPartClassification: shouldShowPartClassification(ws.restoration.buildType),
  };
  const [expanded, setExpanded] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "restored-restomod-custom") {
      router.replace(LISTING_PATHS.specifications);
    }
  }, [draft.listingTypeId, router]);

  const entries = ws.entries.filter((entry) => entry.completed || entry.title.trim());

  const addEntry = (categoryId: string) => {
    updateWorkspace({ activeCategoryId: categoryId });
    startNewEntry(categoryId);
    router.push(LISTING_PATHS.restoredModAdd);
  };

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0">
      <RestorationProfileHeader
        value={ws.restoration}
        onChange={(patch) =>
          updateWorkspace({
            restoration: { ...ws.restoration, ...patch },
          })
        }
      />

      <div className="min-w-0">
        <h2 className="text-lg sm:text-xl font-semibold">{FLOW3_BUILD_RESTORATION_COPY.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {FLOW3_BUILD_RESTORATION_COPY.description}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {categories.map((category) => {
          const open = expanded === category.id;
          const categoryEntries = entries.filter(
            (entry) => normalizeRestorationCategoryId(entry.categoryId) === category.id
          );
          const count = categoryEntries.length;

          return (
            <div key={category.id} className="overflow-hidden rounded-xl border bg-card">
              <button
                type="button"
                onClick={() => {
                  setExpanded(open ? null : category.id);
                  updateWorkspace({ activeCategoryId: category.id });
                }}
                className="flex h-12 w-full items-center gap-2 px-4 text-left"
              >
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                  {category.label}
                </span>
                {count > 0 ? (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#1b1464] px-1.5 text-[10px] font-bold text-white">
                    {count}
                  </span>
                ) : null}
                {open ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </button>

              {open ? (
                <div className="space-y-3 border-t bg-muted/20 p-4">
                  {categoryEntries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {FLOW3_BUILD_RESTORATION_COPY.emptyCategory}
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
                          router.push(LISTING_PATHS.restoredModAdd);
                        }}
                        onDuplicate={() => duplicateEntry(entry.id)}
                        onDelete={() => deleteEntry(entry.id)}
                        onSave={saveEntry}
                        onCancelEdit={cancelEntryEdit}
                        formConfig={entryFormConfig}
                      />
                    ))
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => addEntry(category.id)}
                  >
                    <Plus className="h-4 w-4" />
                    {FLOW3_BUILD_RESTORATION_COPY.addEntry}
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
        onClick={() => addEntry(expanded || categories[0]?.id || "body-chassis")}
      >
        {FLOW3_BUILD_RESTORATION_COPY.addEntry}
      </Button>

      <SpecsBuildSummary
        title="Build Summary"
        categories={categories}
        entries={ws.entries}
        continueHref={LISTING_PATHS.restoredSummary}
        showContinue={false}
        footerNote="Entries are optional by category. Continue when this build record is ready."
        rows={[
          { label: "Entries added", value: String(entries.length) },
          {
            label: "Categories with entries",
            value: String(
              categories.filter((category) =>
                entries.some(
                  (entry) => normalizeRestorationCategoryId(entry.categoryId) === category.id
                )
              ).length
            ),
          },
          ...(ws.restoration.buildSummary?.trim()
            ? [{ label: "Overview", value: ws.restoration.buildSummary.trim() }]
            : []),
        ]}
      />
    </div>
  );
}
