"use client";

import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { MobileListingShell } from "../MobileListingShell";

export function MobileOwnerNotesScreen() {
  const { draft, setOwnerNotes } = useListingBuilder();
  const value = draft.ownerNotes;

  return (
    <MobileListingShell
      stepId="notes"
      continueDisabled={!value.trim()}
      continueHref={value.trim() ? "/mobile-listing/ai" : undefined}
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">Owner&apos;s Notes</h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">Tell buyers anything not covered elsewhere.</p>
        </div>
        <textarea
          value={value}
          onChange={(event) => setOwnerNotes(event.target.value)}
          maxLength={2000}
          placeholder="Share ownership history, maintenance, imperfections, modifications, or anything buyers should know."
          className="min-h-60 w-full resize-none rounded-lg border border-[#e5e5ea] p-3 text-[13px] leading-relaxed outline-none focus:border-[#1b1464] focus:ring-2 focus:ring-[#1b1464]/15"
        />
        <p className="text-right text-[11px] text-[#636366]">{value.length} / 2000</p>
      </div>
    </MobileListingShell>
  );
}
