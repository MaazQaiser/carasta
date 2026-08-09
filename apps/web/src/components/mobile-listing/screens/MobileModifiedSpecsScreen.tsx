"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { MODIFIED_PERFORMANCE_SPECS_CONFIG } from "@/components/listing/specs/modified-performance";
import { MobileListingShell } from "../MobileListingShell";

const CATEGORIES = MODIFIED_PERFORMANCE_SPECS_CONFIG.categories;

export function MobileModifiedSpecsScreen() {
  const router = useRouter();
  const {
    draft,
    updateWorkspace,
    startNewEntry,
    startEditEntry,
    deleteEntry,
  } = useListingBuilder();
  const ws = draft.modificationWorkspace;
  const [expanded, setExpanded] = React.useState<string | null>(
    ws.activeCategoryId || CATEGORIES[0]?.id || null
  );

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "modified-performance") {
      router.replace("/mobile-listing/specifications");
    }
  }, [draft.listingTypeId, router]);

  const entries = ws.entries.filter((entry) => entry.completed || entry.title.trim());

  const countByCategory = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of entries) {
      map.set(entry.categoryId, (map.get(entry.categoryId) ?? 0) + 1);
    }
    return map;
  }, [entries]);

  const addModification = (categoryId: string) => {
    updateWorkspace({ activeCategoryId: categoryId, hasModifications: true });
    startNewEntry(categoryId);
    router.push("/mobile-listing/modified/modifications/add");
  };

  const editModification = (entryId: string) => {
    startEditEntry(entryId);
    router.push(`/mobile-listing/modified/modifications/add?id=${entryId}`);
  };

  return (
    <MobileListingShell
      stepId="modified-specifications"
      continueDisabled={false}
      continueHref="/mobile-listing/condition"
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <div>
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            Specifications &amp; Modifications
          </h1>
          <p className="mt-2 text-[14px] text-[#636366]">
            Add unlimited modifications across the Modified / Performance categories.
          </p>
          <p className="mt-1 text-[12px] font-medium text-[#1b1464]">
            {entries.length} modification{entries.length === 1 ? "" : "s"} added
          </p>
        </div>

        <div className="divide-y divide-[#e5e5ea] rounded-xl border border-[#e5e5ea]">
          {CATEGORIES.map((category) => {
            const open = expanded === category.id;
            const categoryEntries = entries.filter((entry) => entry.categoryId === category.id);
            const count = countByCategory.get(category.id) ?? 0;

            return (
              <div key={category.id}>
                <button
                  type="button"
                  onClick={() => {
                    setExpanded(open ? null : category.id);
                    updateWorkspace({ activeCategoryId: category.id });
                  }}
                  className="flex h-12 w-full items-center justify-between px-3 text-left"
                >
                  <span className="text-[13px] font-semibold text-[#1c1c1e]">
                    {category.label}
                    {count > 0 ? (
                      <span className="ml-2 text-[10px] font-medium text-[#7b78a3]">
                        {count} mod{count === 1 ? "" : "s"}
                      </span>
                    ) : null}
                  </span>
                  {open ? (
                    <ChevronDown className="h-4 w-4 text-[#636366]" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-[#636366]" />
                  )}
                </button>

                {open ? (
                  <div className="space-y-3 border-t border-[#e5e5ea] bg-[#fafafa] p-3">
                    {categoryEntries.length === 0 ? (
                      <p className="text-[12px] text-[#636366]">
                        No modifications in this category yet.
                      </p>
                    ) : (
                      categoryEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="rounded-lg border border-[#e5e5ea] bg-white px-3 py-2"
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#636366]">
                            {category.label}
                          </p>
                          <p className="mt-0.5 truncate text-[13px] font-semibold text-[#1c1c1e]">
                            {entry.title || entry.description || "Untitled modification"}
                          </p>
                          {(() => {
                            const detail =
                              entry.description && entry.description !== entry.title
                                ? entry.description
                                : entry.partsBrand || entry.additionalNotes;
                            return detail ? (
                              <p className="mt-1 line-clamp-2 text-[11px] text-[#636366]">
                                {detail}
                              </p>
                            ) : null;
                          })()}
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => editModification(entry.id)}
                              className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#e5e5ea] px-2.5 text-[12px] font-semibold text-[#1c1c1e]"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteEntry(entry.id)}
                              className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#e5e5ea] px-2.5 text-[12px] font-semibold text-[#d34a4a]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                    <button
                      type="button"
                      onClick={() => addModification(category.id)}
                      className="flex h-10 w-full items-center justify-center gap-1 rounded-lg border border-[#1b1464] text-[12px] font-semibold text-[#1b1464]"
                    >
                      <Plus className="h-4 w-4" />
                      Add Modification
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() =>
            addModification(ws.activeCategoryId || CATEGORIES[0]?.id || "powertrain")
          }
          className="flex h-11 items-center justify-center rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
        >
          Add Modification
        </button>
      </div>
    </MobileListingShell>
  );
}
