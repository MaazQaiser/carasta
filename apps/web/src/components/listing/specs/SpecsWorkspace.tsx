"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ModificationEntry, SpecsFlowConfig } from "./types";
import { SpecsCategoryTabs } from "./SpecsCategoryTabs";
import { SpecsCategoryPanel } from "./SpecsCategoryPanel";

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
  continueHref = "/listing/history",
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
  className?: string;
}) {
  const activeCategory =
    config.categories.find((category) => category.id === activeCategoryId) ??
    config.categories[0];

  if (!activeCategory) {
    return null;
  }

  const categoryEntries = entries.filter(
    (entry) => entry.categoryId === activeCategory.id
  );

  const entryCounts = config.categories.reduce<Record<string, number>>((acc, category) => {
    acc[category.id] = entries.filter((entry) => entry.categoryId === category.id).length;
    return acc;
  }, {});

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-xl font-semibold">Specifications & Modifications</h2>
        <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
      </div>

      {header}

      <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[220px_minmax(0,1fr)] gap-4 items-start min-w-0">
          <SpecsCategoryTabs
            orientation="vertical"
            className="sm:sticky sm:top-24 border-0 shadow-none bg-muted/20"
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

        <div className="flex justify-end pt-2 border-t">
          <Button asChild>
            <Link href={continueHref}>
              Continue
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
