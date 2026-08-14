"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import {
  STOCK_DECISION_COPY,
  STOCK_MODIFICATION_CATEGORIES,
} from "@/components/listing/specs/stock-lightly-modified";
import { getSharedModificationCategoryLabel } from "@/components/listing/specs/shared-modification-categories";
import { MobileListingShell } from "../MobileListingShell";

export function MobileStockSpecsScreen() {
  const router = useRouter();
  const { draft, updateWorkspace, startNewEntry, deleteEntry, startEditEntry } =
    useListingBuilder();
  const ws = draft.modificationWorkspace;
  const hasModifications = ws.hasModifications;
  const entries = ws.entries.filter((entry) => entry.completed || entry.title.trim());

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
    const categoryId =
      ws.activeCategoryId || STOCK_MODIFICATION_CATEGORIES[0]?.id || "engine-performance";
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
      <div className="flex flex-col gap-6 px-6 pt-4 pb-6">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            Specifications &amp; Light Modifications
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">
            {STOCK_DECISION_COPY.sectionSubtext}
          </p>
        </div>

        <section className="rounded-2xl border border-[#e5e5ea] bg-white p-4">
          <h2 className="text-[16px] font-bold leading-snug text-[#1c1c1e]">
            {STOCK_DECISION_COPY.question}
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-[#636366]">
            {STOCK_DECISION_COPY.questionHint}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFactoryOriginal(true)}
              className={cn(
                "h-12 rounded-xl border text-[15px] font-semibold transition-colors",
                hasModifications === false
                  ? "border-[#1b1464] bg-[#f4f5fc] text-[#1b1464]"
                  : "border-[#e5e5ea] bg-white text-[#1c1c1e]"
              )}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setFactoryOriginal(false)}
              className={cn(
                "h-12 rounded-xl border text-[15px] font-semibold transition-colors",
                hasModifications === true
                  ? "border-[#1b1464] bg-[#f4f5fc] text-[#1b1464]"
                  : "border-[#e5e5ea] bg-white text-[#1c1c1e]"
              )}
            >
              No
            </button>
          </div>
        </section>

        {hasModifications === true ? (
          <section className="space-y-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#1c1c1e]">
                {STOCK_DECISION_COPY.lightModsTitle}
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-[#636366]">
                {STOCK_DECISION_COPY.lightModsSubtext}
              </p>
            </div>

            {entries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d1d1d6] px-4 py-8 text-center">
                <p className="text-[15px] font-bold text-[#1c1c1e]">
                  {STOCK_DECISION_COPY.emptyTitle}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#636366]">
                  {STOCK_DECISION_COPY.emptySubtext}
                </p>
                <button
                  type="button"
                  onClick={addModification}
                  className="mt-4 inline-flex h-11 items-center justify-center rounded-xl border border-[#1b1464] bg-white px-4 text-[14px] font-semibold text-[#1b1464]"
                >
                  {STOCK_DECISION_COPY.addCta}
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {entries.map((entry) => {
                    const category =
                      STOCK_MODIFICATION_CATEGORIES.find((item) => item.id === entry.categoryId)
                        ?.label ?? getSharedModificationCategoryLabel(entry.categoryId);
                    return (
                      <div
                        key={entry.id}
                        className="rounded-2xl border border-[#e5e5ea] px-4 py-3"
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
                  className="flex h-11 w-full items-center justify-center gap-1 rounded-xl border border-[#1b1464] bg-white text-[14px] font-semibold text-[#1b1464]"
                >
                  <Plus className="h-4 w-4" />
                  {STOCK_DECISION_COPY.addCta}
                </button>
              </>
            )}
          </section>
        ) : null}
      </div>
    </MobileListingShell>
  );
}
