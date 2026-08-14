"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ListingDraft } from "../types";
import { FLOW3_SPECS_COMPLETED_COPY } from "./restored-restomod";
import { flow3SpecsCompletedRows } from "../listing-review-summary";

export function Flow3SpecsCompletedView({
  draft,
  className,
}: {
  draft: ListingDraft;
  className?: string;
}) {
  const rows = flow3SpecsCompletedRows(draft);
  const summary = draft.modificationWorkspace.restoration.buildSummary.trim();

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="flex items-center gap-3 rounded-2xl bg-[#eaf8ee] px-4 py-3.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#34c759]">
          <Check className="h-4 w-4 text-white" strokeWidth={3} />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-bold leading-tight text-[#248a3d]">
            {FLOW3_SPECS_COMPLETED_COPY.bannerTitle}
          </p>
          <p className="mt-0.5 text-[12px] leading-snug text-[#3d9a5c]">
            {FLOW3_SPECS_COMPLETED_COPY.bannerSubtitle}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e5e5ea] bg-white px-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-4 border-b border-[#f2f2f7] py-3.5 last:border-b-0"
          >
            <span className="shrink-0 pt-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8e8e93]">
              {row.label}
            </span>
            <span className="flex min-w-0 items-center justify-end gap-2 text-right">
              <span className="text-[14px] font-bold leading-snug text-[#1c1c1e]">{row.value}</span>
              {row.badge ? (
                <span className="shrink-0 rounded-md bg-[#ecebff] px-2 py-0.5 text-[10px] font-semibold text-[#1b1464]">
                  {row.badge}
                </span>
              ) : null}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h2 className="text-[20px] font-bold text-[#1c1c1e]">
          {FLOW3_SPECS_COMPLETED_COPY.buildSummaryHeading}
        </h2>
        <div className="rounded-2xl bg-[#f4f5fc] px-4 py-4 text-[14px] leading-relaxed text-[#1c1c1e]">
          {summary || (
            <span className="text-[#8e8e93]">{FLOW3_SPECS_COMPLETED_COPY.emptyBuildSummary}</span>
          )}
        </div>
      </div>
    </div>
  );
}
