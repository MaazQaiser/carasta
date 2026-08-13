"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import {
  STOCK_MODIFICATION_CATEGORIES,
} from "@/components/listing/specs/stock-lightly-modified";
import { MobileListingShell } from "../MobileListingShell";

export function MobileStockSpecsScreen() {
  const router = useRouter();
  const { draft, updateWorkspace, startNewEntry, deleteEntry, startEditEntry } =
    useListingBuilder();
  const ws = draft.modificationWorkspace;
  const hasModifications = ws.hasModifications;
  const entries = ws.entries.filter((entry) => entry.completed || entry.title.trim());

  // Guard: other listing types should not use this screen.
  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "stock-lightly-modified") {
      router.replace("/mobile-listing/specifications");
    }
  }, [draft.listingTypeId, router]);

  const canContinue = hasModifications !== null;

  const setFactoryOriginal = (isOriginal: boolean) => {
    updateWorkspace({ hasModifications: !isOriginal });
  };

  const addModification = () => {
    const categoryId = ws.activeCategoryId || STOCK_MODIFICATION_CATEGORIES[0]?.id || "powertrain";
    updateWorkspace({ hasModifications: true, activeCategoryId: categoryId });
    startNewEntry(categoryId);
    router.push("/mobile-listing/stock/modifications/add");
  };

  const editModification = (entryId: string) => {
    startEditEntry(entryId);
    router.push(`/mobile-listing/stock/modifications/add?id=${entryId}`);
  };

  return (
    <MobileListingShell
      stepId="stock-specifications"
      continueDisabled={!canContinue}
      continueHref={canContinue ? "/mobile-listing/condition" : undefined}
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <div>
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            Specifications &amp; Light Modifications
          </h1>
          <p className="mt-2 text-[14px] text-[#636366]">
            Confirm whether this vehicle is stock or if it has been lightly modified.
          </p>
        </div>

        <section className="rounded-xl border border-[#e5e5ea] p-4">
          <h2 className="text-[15px] font-bold text-[#1c1c1e]">Is this vehicle stock?</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFactoryOriginal(true)}
              className={[
                "h-11 rounded-lg border text-[13px] font-semibold",
                hasModifications === false
                  ? "border-[#1b1464] bg-[#f4f5fc] text-[#1b1464]"
                  : "border-[#e5e5ea] text-[#1c1c1e]",
              ].join(" ")}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setFactoryOriginal(false)}
              className={[
                "h-11 rounded-lg border text-[13px] font-semibold",
                hasModifications === true
                  ? "border-[#1b1464] bg-[#f4f5fc] text-[#1b1464]"
                  : "border-[#e5e5ea] text-[#1c1c1e]",
              ].join(" ")}
            >
              No
            </button>
          </div>
        </section>

        {hasModifications === false ? (
          <div className="rounded-xl bg-[#f4f5fc] px-4 py-3 text-[13px] text-[#1b1464]">
            Stock vehicle selected - no modifications will be able to be added
          </div>
        ) : null}

        {hasModifications === true ? (
          <section className="space-y-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#1c1c1e]">Light Modifications</h2>
              <p className="text-[12px] text-[#636366]">
                Add modifications by category with details and documents
              </p>
            </div>

            {entries.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#d1d1d6] px-4 py-8 text-center">
                <p className="text-[14px] font-semibold text-[#1c1c1e]">No modifications added</p>
                <p className="mt-1 text-[12px] text-[#636366]">
                  Add wheels, exhaust, window tint, wrap, etc.
                </p>
                <button
                  type="button"
                  onClick={addModification}
                  className="mt-4 h-10 rounded-lg border border-[#1b1464] px-4 text-[13px] font-semibold text-[#1b1464]"
                >
                  Add Light Modification
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {entries.map((entry) => {
                    const category =
                      STOCK_MODIFICATION_CATEGORIES.find((item) => item.id === entry.categoryId)
                        ?.label ?? "Other";
                    return (
                      <div
                        key={entry.id}
                        className="rounded-xl border border-[#e5e5ea] px-3 py-3"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#636366]">
                          {category}
                        </p>
                        <p className="mt-0.5 truncate text-[14px] font-semibold text-[#1c1c1e]">
                          {entry.title || "Untitled modification"}
                        </p>
                        {entry.description ? (
                          <p className="mt-1 line-clamp-2 text-[12px] text-[#636366]">
                            {entry.description}
                          </p>
                        ) : null}
                        <div className="mt-3 flex items-center gap-2">
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
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={addModification}
                  className="flex h-11 w-full items-center justify-center gap-1 rounded-lg border border-dashed border-[#1b1464] text-[13px] font-semibold text-[#1b1464]"
                >
                  <Plus className="h-4 w-4" />
                  Add another modification
                </button>
              </>
            )}
          </section>
        ) : null}
      </div>
    </MobileListingShell>
  );
}
