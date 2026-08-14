"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldLabel } from "../fields";
import { useListingBuilder } from "../ListingBuilderContext";
import type { ListingVehicleDetails } from "../types";
import { LISTING_PATHS } from "../listing-route-map";
import { ModificationEntryCard } from "./ModificationEntryCard";
import { ModificationFormWithCategory } from "./ModificationFormWithCategory";
import { SpecsBuildSummary } from "./SpecsBuildSummary";
import { SpecsCategoryTabs } from "./SpecsCategoryTabs";
import {
  STOCK_DECISION_COPY,
  STOCK_ENTRY_FORM_CONFIG,
  STOCK_FACTORY_CATEGORIES,
  STOCK_MODIFICATION_CATEGORIES,
  buildFactorySpecSections,
} from "./stock-lightly-modified";
import { getSharedModificationCategoryLabel, normalizeModificationCategoryId } from "./shared-modification-categories";
import { countEntryPhotos } from "./options";

const STOCK_AREA_TABS = [
  { id: "factory", label: "Factory Specs" },
  { id: "modifications", label: "Light Modifications" },
] as const;

export function StockLightlyModifiedSpecsScreen() {
  const router = useRouter();
  const {
    draft,
    updateDetails,
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
  const sections = React.useMemo(
    () => buildFactorySpecSections(draft.details, ws.factorySpecOverrides ?? {}),
    [draft.details, ws.factorySpecOverrides]
  );
  const [activeArea, setActiveArea] = React.useState<"factory" | "modifications">("factory");
  const [activeFactoryId, setActiveFactoryId] = React.useState(
    ws.activeCategoryId || STOCK_FACTORY_CATEGORIES[0]?.id || "powertrain"
  );

  const entries = ws.entries;
  const editingEntry = entries.find((e) => e.id === ws.editingEntryId) ?? null;

  const modCountByCategory = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of entries) {
      if (!entry.title.trim() && !entry.completed) continue;
      map.set(
        normalizeModificationCategoryId(entry.categoryId),
        (map.get(normalizeModificationCategoryId(entry.categoryId)) ?? 0) + 1
      );
    }
    return map;
  }, [entries]);

  const photosUploaded = entries.reduce((sum, e) => sum + countEntryPhotos(e), 0);
  const receiptsUploaded = entries.reduce((sum, e) => sum + e.receipt.length, 0);
  const meaningfulEntries = entries.filter((e) => e.completed || e.title.trim());
  const reviewedCount = new Set([
    ...ws.reviewedFactoryCategoryIds,
    activeFactoryId,
  ]).size;

  const selectFactorySection = (id: string) => {
    setActiveFactoryId(id);
    updateWorkspace({
      activeCategoryId: id,
      reviewedFactoryCategoryIds: ws.reviewedFactoryCategoryIds.includes(id)
        ? ws.reviewedFactoryCategoryIds
        : [...ws.reviewedFactoryCategoryIds, id],
    });
  };

  const updateFactoryField = (
    fieldId: string,
    value: string,
    detailKey?: keyof ListingVehicleDetails
  ) => {
    if (detailKey) {
      updateDetails({ [detailKey]: value });
      return;
    }
    updateWorkspace({
      factorySpecOverrides: {
        ...(ws.factorySpecOverrides ?? {}),
        [fieldId]: value,
      },
    });
  };

  const openAddModification = (categoryId?: string) => {
    const nextCategory = categoryId ?? (ws.activeCategoryId || "engine-performance");
    setActiveArea("modifications");
    updateWorkspace({ hasModifications: true, activeCategoryId: nextCategory });
    startNewEntry(nextCategory);
    router.push(LISTING_PATHS.stockModAdd);
  };

  const setFactoryOriginal = (isOriginal: boolean) => {
    updateWorkspace({ hasModifications: !isOriginal });
    if (isOriginal) setActiveArea("factory");
  };

  const activeFactorySection =
    sections.find((section) => section.id === activeFactoryId) ?? sections[0];
  const factoryEntryCounts = STOCK_FACTORY_CATEGORIES.reduce<Record<string, number>>(
    (acc, category) => {
      acc[category.id] = modCountByCategory.get(category.id) ?? 0;
      return acc;
    },
    {}
  );

  const activeModCategoryId = normalizeModificationCategoryId(
    ws.activeCategoryId || STOCK_MODIFICATION_CATEGORIES[0]?.id
  );
  const entriesInActiveCategory = meaningfulEntries.filter(
    (e) =>
      normalizeModificationCategoryId(e.categoryId) === activeModCategoryId &&
      e.id !== ws.editingEntryId
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-4 sm:gap-6 items-start min-w-0">
      <div className="space-y-4 sm:space-y-6 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Specifications & Modifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {STOCK_DECISION_COPY.sectionSubtext}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {reviewedCount} of {STOCK_FACTORY_CATEGORIES.length} categories reviewed
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

        <div className="rounded-2xl border bg-card p-3 sm:p-5 md:p-6 space-y-4 sm:space-y-5 min-w-0">
          {hasModifications === true ? (
            <SpecsCategoryTabs
              categories={STOCK_AREA_TABS.map((tab) => ({ id: tab.id, label: tab.label }))}
              activeCategoryId={activeArea}
              entryCounts={{
                factory: STOCK_FACTORY_CATEGORIES.length,
                modifications: meaningfulEntries.length,
              }}
              onSelect={(id) => setActiveArea(id as "factory" | "modifications")}
              ariaLabel="Specification areas"
            />
          ) : null}

          {activeArea === "factory" || hasModifications !== true ? (
            <section className="space-y-4 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold text-sm min-w-0">Factory Specifications</h2>
                <Badge variant="outline" className="text-[10px] gap-1 shrink-0">
                  <BadgeCheck className="h-3 w-3 text-primary" />
                  Imported from VIN
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-3 sm:gap-4 items-start">
                <SpecsCategoryTabs
                  orientation="vertical"
                  className="md:sticky md:top-24"
                  categories={STOCK_FACTORY_CATEGORIES}
                  activeCategoryId={activeFactorySection?.id ?? activeFactoryId}
                  entryCounts={factoryEntryCounts}
                  onSelect={selectFactorySection}
                  ariaLabel="Factory specification sections"
                />

                {activeFactorySection ? (
                  <div
                    className={cn(
                      "min-w-0 rounded-xl border overflow-hidden",
                      (factoryEntryCounts[activeFactorySection.id] ?? 0) > 0 && "border-primary/40"
                    )}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 py-3 border-b bg-muted/20">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold text-sm truncate">
                          {activeFactorySection.label}
                        </span>
                        {(factoryEntryCounts[activeFactorySection.id] ?? 0) > 0 ? (
                          <Badge variant="secondary" className="text-[10px] shrink-0">
                            {factoryEntryCounts[activeFactorySection.id]} mod
                            {factoryEntryCounts[activeFactorySection.id] === 1 ? "" : "s"}
                          </Badge>
                        ) : null}
                      </div>
                      {hasModifications === true ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="w-full sm:w-auto shrink-0"
                          onClick={() => openAddModification(activeFactorySection.id)}
                          disabled={Boolean(editingEntry)}
                        >
                          <Plus className="h-4 w-4" />
                          Add Modification
                        </Button>
                      ) : null}
                    </div>
                    <div className="p-3 sm:p-4 space-y-3">
                      {activeFactorySection.fields.map((field) => (
                        <div
                          key={field.id}
                          className="grid gap-1.5 sm:grid-cols-[140px_1fr] sm:items-center"
                        >
                          <FieldLabel className="mb-0">{field.label}</FieldLabel>
                          <Input
                            value={field.value}
                            placeholder="Enter value"
                            onChange={(event) =>
                              updateFactoryField(field.id, event.target.value, field.detailKey)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          ) : (
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
                  Add Modification
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-3 sm:gap-4 items-start">
                <SpecsCategoryTabs
                  orientation="vertical"
                  className="md:sticky md:top-24"
                  categories={STOCK_MODIFICATION_CATEGORIES}
                  activeCategoryId={activeModCategoryId}
                  entryCounts={STOCK_MODIFICATION_CATEGORIES.reduce<Record<string, number>>(
                    (acc, category) => {
                      acc[category.id] = modCountByCategory.get(category.id) ?? 0;
                      return acc;
                    },
                    {}
                  )}
                  onSelect={(id) => updateWorkspace({ activeCategoryId: id })}
                  ariaLabel="Modification sections"
                />

                <div className="min-w-0 space-y-4">
                  {editingEntry ? (
                    <div className="rounded-xl border overflow-hidden">
                      <div className="px-4 sm:px-5 py-3 border-b bg-muted/30">
                        <p className="font-semibold text-sm">
                          {editingEntry.completed || editingEntry.title.trim()
                            ? "Edit Modification"
                            : "Add Modification"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {STOCK_DECISION_COPY.lightModsSubtext}
                        </p>
                      </div>
                      <div className="p-4 sm:p-5">
                        <ModificationFormWithCategory
                          entry={editingEntry}
                          onSave={(entry) => saveEntry(entry)}
                          onCancel={cancelEntryEdit}
                          onCategoryChange={(id) => updateWorkspace({ activeCategoryId: id })}
                        />
                      </div>
                    </div>
                  ) : null}

                  {!editingEntry && entriesInActiveCategory.length === 0 ? (
                    <div className="rounded-xl border border-dashed bg-muted/20 px-5 py-10 text-center h-full min-h-[178px] flex flex-col items-center justify-center">
                      <p className="font-medium text-sm">{STOCK_DECISION_COPY.emptyTitle}</p>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">
                        {STOCK_DECISION_COPY.emptySubtext}
                      </p>
                      <Button
                        type="button"
                        onClick={() => openAddModification(activeModCategoryId)}
                      >
                        <Plus className="h-4 w-4" />
                        Add Modification
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {entriesInActiveCategory.map((entry) => {
                        const categoryLabel =
                          STOCK_MODIFICATION_CATEGORIES.find((c) => c.id === entry.categoryId)
                            ?.label ?? getSharedModificationCategoryLabel(entry.categoryId);
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
                                setActiveArea("modifications");
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
                </div>
              </div>
            </section>
          )}

        </div>
      </div>

      <SpecsBuildSummary
        title="Specifications"
        categories={STOCK_FACTORY_CATEGORIES}
        entries={entries}
        showContinue={false}
        showProgress={false}
        rows={[
          { label: "Categories", value: `${STOCK_FACTORY_CATEGORIES.length} Categories` },
          { label: "Factory Data", value: "✓ Imported" },
          {
            label: "Modifications",
            value: `${meaningfulEntries.length} Added`,
          },
          { label: "Receipts", value: `${receiptsUploaded} Uploaded` },
          { label: "Photos", value: String(photosUploaded) },
        ]}
        footerNote="Edit factory fields above, then add modifications only if needed."
      />
    </div>
  );
}
