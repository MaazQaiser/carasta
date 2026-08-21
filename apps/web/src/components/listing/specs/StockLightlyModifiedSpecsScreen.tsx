"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListingBuilder } from "../ListingBuilderContext";
import { LISTING_PATHS } from "../listing-route-map";
import { ModificationEntryCard } from "./ModificationEntryCard";
import {
  STOCK_DECISION_COPY,
  STOCK_ENTRY_FORM_CONFIG,
  STOCK_MODIFICATION_CATEGORIES,
} from "./stock-lightly-modified";
import { getSharedModificationCategoryLabel, normalizeModificationCategoryId } from "./shared-modification-categories";


export function StockLightlyModifiedSpecsScreen() {
  const router = useRouter();
  const {
    draft,
    updateWorkspace,
    startNewEntry,
    startEditEntry,
    cancelEntryEdit,
    saveEntry,
    deleteEntry,
    duplicateEntry,
    toggleEntryExpanded,
  } = useListingBuilder();

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "stock-lightly-modified") {
      router.replace(LISTING_PATHS.specifications);
    }
  }, [draft.listingTypeId, router]);

  const ws = draft.modificationWorkspace;
  const hasModifications = ws.hasModifications;

  const entries = ws.entries;
  const editingEntry = entries.find((e) => e.id === ws.editingEntryId) ?? null;
  const meaningfulEntries = entries.filter((e) => e.completed || e.title.trim());

  const activeModCategoryId = normalizeModificationCategoryId(
    ws.activeCategoryId || STOCK_MODIFICATION_CATEGORIES[0]?.id
  );

  const setFactoryOriginal = (isOriginal: boolean) => {
    updateWorkspace({ hasModifications: !isOriginal });
  };

  const openAddModification = (categoryId?: string) => {
    const nextCategory = categoryId ?? (ws.activeCategoryId || "engine-performance");
    updateWorkspace({ hasModifications: true, activeCategoryId: nextCategory });
    startNewEntry(nextCategory);
    router.push(LISTING_PATHS.stockModAdd);
  };

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          Specifications &amp; Light Modifications
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {STOCK_DECISION_COPY.sectionSubtext}
        </p>
      </div>

      <section className="rounded-2xl border bg-card p-4 sm:p-5 space-y-3">
        <div>
          <h2 className="text-sm font-semibold">{STOCK_DECISION_COPY.question}</h2>
          <p className="text-sm text-muted-foreground mt-1">{STOCK_DECISION_COPY.questionHint}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <Button
            type="button"
            variant={hasModifications === false ? "default" : "outline"}
            onClick={() => setFactoryOriginal(true)}
          >
            Yes
          </Button>
          <Button
            type="button"
            variant={hasModifications === true ? "default" : "outline"}
            onClick={() => setFactoryOriginal(false)}
          >
            No
          </Button>
        </div>
      </section>

      {hasModifications === false ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
          {STOCK_DECISION_COPY.stockSelected}
        </div>
      ) : null}

      {hasModifications === true ? (
        <section className="space-y-4 min-w-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="font-semibold text-sm">{STOCK_DECISION_COPY.lightModsTitle}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {STOCK_DECISION_COPY.lightModsSubtext}
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full sm:w-auto shrink-0"
              onClick={() => openAddModification()}
              disabled={Boolean(editingEntry)}
            >
              <Plus className="h-4 w-4" />
              Add Light Modification
            </Button>
          </div>

          {meaningfulEntries.length === 0 && !editingEntry ? (
            <div className="rounded-xl border border-dashed bg-muted/20 px-5 py-10 text-center flex flex-col items-center justify-center">
              <p className="font-medium text-sm">{STOCK_DECISION_COPY.emptyTitle}</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                {STOCK_DECISION_COPY.emptySubtext}
              </p>
              <Button type="button" onClick={() => openAddModification(activeModCategoryId)}>
                <Plus className="h-4 w-4" />
                Add Light Modification
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {meaningfulEntries.map((entry) => {
                const categoryLabel =
                  STOCK_MODIFICATION_CATEGORIES.find((c) => c.id === entry.categoryId)?.label ??
                  getSharedModificationCategoryLabel(entry.categoryId);
                return (
                  <div key={entry.id} className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
                      {categoryLabel}
                    </p>
                    <ModificationEntryCard
                      entry={entry}
                      expanded={ws.expandedEntryIds.includes(entry.id)}
                      editing={false}
                      onToggle={() => toggleEntryExpanded(entry.id)}
                      onEdit={() => {
                        startEditEntry(entry.id);
                        router.push(LISTING_PATHS.stockModAdd);
                      }}
                      onDuplicate={() => duplicateEntry(entry.id)}
                      onDelete={() => deleteEntry(entry.id)}
                      onSave={saveEntry}
                      onCancelEdit={cancelEntryEdit}
                      formConfig={STOCK_ENTRY_FORM_CONFIG}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
