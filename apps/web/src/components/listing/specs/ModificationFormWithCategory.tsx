"use client";

import * as React from "react";
import { FieldLabel } from "../fields";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModificationEntryForm } from "./ModificationEntryForm";
import { SHARED_MODIFICATION_CATEGORIES } from "./shared-modification-categories";
import { STANDARD_MODIFICATION_ENTRY_FORM_CONFIG } from "./standard-modification-entry";
import type { EntryFormConfig, ModificationEntry, SpecsCategoryDefinition } from "./types";

/** Category-first wrapper for Stock / Modified / Restoration entry forms. */
export function ModificationFormWithCategory({
  entry,
  onSave,
  onCancel,
  onCategoryChange,
  formConfig = STANDARD_MODIFICATION_ENTRY_FORM_CONFIG,
  categories = SHARED_MODIFICATION_CATEGORIES,
}: {
  entry: ModificationEntry;
  onSave: (entry: ModificationEntry) => void;
  onCancel: () => void;
  onCategoryChange?: (categoryId: string) => void;
  formConfig?: EntryFormConfig;
  categories?: SpecsCategoryDefinition[];
}) {
  const [categoryId, setCategoryId] = React.useState(entry.categoryId);

  React.useEffect(() => {
    setCategoryId(entry.categoryId);
  }, [entry.id, entry.categoryId]);

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Category</FieldLabel>
        <Select
          value={categoryId || undefined}
          onValueChange={(value) => {
            setCategoryId(value);
            onCategoryChange?.(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ModificationEntryForm
        entry={{ ...entry, categoryId }}
        onSave={(next) => onSave({ ...next, categoryId })}
        onCancel={onCancel}
        formConfig={formConfig}
      />
    </div>
  );
}
