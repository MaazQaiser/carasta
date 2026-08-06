"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EntryFormConfig, ModificationEntry, SpecsCategoryDefinition } from "./types";
import { ModificationEntryCard } from "./ModificationEntryCard";

export function SpecsCategoryPanel({
  category,
  entries,
  expandedEntryIds,
  editingEntryId,
  onAddEntry,
  onToggleEntry,
  onEditEntry,
  onDuplicateEntry,
  onDeleteEntry,
  onSaveEntry,
  onCancelEdit,
  formConfig,
}: {
  category: SpecsCategoryDefinition;
  entries: ModificationEntry[];
  expandedEntryIds: string[];
  editingEntryId: string | null;
  onAddEntry: () => void;
  onToggleEntry: (entryId: string) => void;
  onEditEntry: (entryId: string) => void;
  onDuplicateEntry: (entryId: string) => void;
  onDeleteEntry: (entryId: string) => void;
  onSaveEntry: (entry: ModificationEntry) => void;
  onCancelEdit: () => void;
  formConfig?: EntryFormConfig;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-base">{category.label}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
            {category.description ? ` · ${category.description}` : ""}
          </p>
        </div>
        <Button
          type="button"
          onClick={onAddEntry}
          disabled={Boolean(editingEntryId)}
        >
          <Plus className="h-4 w-4" />
          Add Entry
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-12 text-center">
          <p className="text-sm font-medium">No entries yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add the first modification for {category.label}.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <ModificationEntryCard
              key={entry.id}
              entry={entry}
              expanded={expandedEntryIds.includes(entry.id)}
              editing={editingEntryId === entry.id}
              onToggle={() => onToggleEntry(entry.id)}
              onEdit={() => onEditEntry(entry.id)}
              onDuplicate={() => onDuplicateEntry(entry.id)}
              onDelete={() => onDeleteEntry(entry.id)}
              onSave={onSaveEntry}
              onCancelEdit={onCancelEdit}
              formConfig={formConfig}
            />
          ))}
        </div>
      )}
    </div>
  );
}
