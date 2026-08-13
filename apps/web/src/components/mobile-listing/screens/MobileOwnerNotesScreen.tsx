"use client";

import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import {
  OWNER_NOTES_COPY,
  ownerNotesPlaceholder,
} from "@/components/listing/owner-notes-copy";
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
      <div className="flex flex-col gap-5 px-6 pb-6 pt-4">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            {OWNER_NOTES_COPY.title}
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">{OWNER_NOTES_COPY.subtext}</p>
        </div>
        <textarea
          value={value}
          onChange={(event) =>
            setOwnerNotes(event.target.value.slice(0, OWNER_NOTES_COPY.maxLength))
          }
          maxLength={OWNER_NOTES_COPY.maxLength}
          placeholder={ownerNotesPlaceholder(draft)}
          className="min-h-60 w-full resize-none rounded-lg border border-[#e5e5ea] p-3 text-[13px] leading-relaxed outline-none focus:border-[#1b1464] focus:ring-2 focus:ring-[#1b1464]/15"
        />
        <p className="text-right text-[11px] text-[#636366]">
          {value.length} / {OWNER_NOTES_COPY.maxLength}
        </p>
      </div>
    </MobileListingShell>
  );
}
