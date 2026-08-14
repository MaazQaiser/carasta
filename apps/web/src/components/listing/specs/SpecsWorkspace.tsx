"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ModificationEntry, SpecsFlowConfig } from "./types";
import { SpecsCategoryTabs } from "./SpecsCategoryTabs";
import { SpecsCategoryPanel } from "./SpecsCategoryPanel";
import { normalizeModificationCategoryId } from "./shared-modification-categories";

/**
 * Reusable specifications workspace.
 * Section tabs switch categories; entry CRUD stays shared across flows.
 */
export function SpecsWorkspace({
  config,
  entries,
  activeCategoryId,
  expandedEntryIds,
  editingEntryId,
  onSelectCategory,
  onAddEntry,
  onToggleEntry,
  onEditEntry,
  onDuplicateEntry,
  onDeleteEntry,
  onSaveEntry,
  onCancelEdit,
  header,
  continueHref = "/listing/condition",
  showContinue = false,
  title = "Specifications & Modifications",
  description,
  className,
}: {
  config: SpecsFlowConfig;
  entries: ModificationEntry[];
  activeCategoryId: string;
  expandedEntryIds: string[];
  editingEntryId: string | null;
  onSelectCategory: (categoryId: string) => void;
  onAddEntry: (categoryId: string) => void;
  onToggleEntry: (entryId: string) => void;
  onEditEntry: (entryId: string) => void;
  onDuplicateEntry: (entryId: string) => void;
  onDeleteEntry: (entryId: string) => void;
  onSaveEntry: (entry: ModificationEntry) => void;
  onCancelEdit: () => void;
  header?: ReactNode;
  continueHref?: string;
  /** Shell footer owns Continue by default (mobile-aligned routing). */
  showContinue?: boolean;
  title?: string;
  description?: string;
  className?: string;
}) {
  const normalizedActiveId = normalizeModificationCategoryId(activeCategoryId);
  const activeCategory =
    config.categories.find((category) => category.id === normalizedActiveId) ??
    config.categories[0];

  if (!activeCategory) {
    return null;
  }

  const categoryEntries = entries.filter(
    (entry) => normalizeModificationCategoryId(entry.categoryId) === activeCategory.id
  );

  const entryCounts = config.categories.reduce<Record<string, number>>((acc, category) => {
    acc[category.id] = entries.filter(
      (entry) => normalizeModificationCategoryId(entry.categoryId) === category.id
    ).length;
    return acc;
  }, {});

  return (
    <div className={cn("space-y-4 sm:space-y-6 min-w-0", className)}>
      <div className="min-w-0">
        <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{description ?? config.description}</p>
      </div>

      {header}

      <div className="rounded-2xl border bg-card p-3 sm:p-5 space-y-4 min-w-0">
        <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-3 sm:gap-4 items-start min-w-0">
          <SpecsCategoryTabs
            orientation="vertical"
            className="md:sticky md:top-24 border-0 shadow-none bg-muted/20"
            categories={config.categories}
            activeCategoryId={activeCategory.id}
            entryCounts={entryCounts}
            onSelect={onSelectCategory}
          />

          <div className="min-w-0">
            <SpecsCategoryPanel
              category={activeCategory}
              entries={categoryEntries}
              expandedEntryIds={expandedEntryIds}
              editingEntryId={editingEntryId}
              onAddEntry={() => onAddEntry(activeCategory.id)}
              onToggleEntry={onToggleEntry}
              onEditEntry={onEditEntry}
              onDuplicateEntry={onDuplicateEntry}
              onDeleteEntry={onDeleteEntry}
              onSaveEntry={onSaveEntry}
              onCancelEdit={onCancelEdit}
              formConfig={config.entryForm}
            />
          </div>
        </div>

        {showContinue ? (
          <div className="flex justify-stretch sm:justify-end pt-2 border-t">
            <Button asChild className="w-full sm:w-auto">
              <Link href={continueHref}>
                Continue
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
