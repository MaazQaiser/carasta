"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import type { RaceCompetitionProfile } from "@/components/listing/types";
import {
  FLOW4_PRIMARY_USE_COPY,
  PRIMARY_USE_OPTIONS,
  isPrimaryUseOther,
  isRacePrimaryUseComplete,
  primaryUseSelection,
  racePrimaryUsePatch,
} from "@/components/listing/specs/race-track";
import { MobileListingShell } from "../MobileListingShell";
import { MobileOptionList, MobileOptionSheet } from "../MobileOptionSheet";

export function MobileRaceSummaryScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const race = draft.modificationWorkspace.race;
  const competition = race.competition;
  const identity = race.identity;
  const selection = primaryUseSelection(competition);
  const [pickerOpen, setPickerOpen] = React.useState(false);

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "race-track-car") {
      router.replace("/mobile-listing/specifications");
    }
  }, [draft.listingTypeId, router]);

  const patchCompetition = (patch: Partial<RaceCompetitionProfile>) => {
    updateWorkspace({
      race: {
        ...race,
        competition: { ...competition, notes: competition.notes ?? "", ...patch },
      },
    });
  };

  const trim = identity.chassisDesignation || identity.trim || draft.details.trim;
  const vehicleLabel =
    [
      identity.year || draft.details.year,
      identity.make || draft.details.make,
      identity.model || draft.details.model,
      trim,
    ]
      .filter(Boolean)
      .join(" ") || "Race / Track Car";

  return (
    <MobileListingShell
      stepId="race-summary"
      continueDisabled={!isRacePrimaryUseComplete(competition)}
      continueHref="/mobile-listing/race/specifications"
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            {FLOW4_PRIMARY_USE_COPY.title}
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">
            {FLOW4_PRIMARY_USE_COPY.question}
          </p>
        </div>

        <div className="rounded-lg border border-[#e5e5ea] bg-[#fafafa] px-3 py-3">
          <p className="text-[14px] font-semibold text-[#1c1c1e]">{vehicleLabel}</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="block space-y-1.5">
            <span className="text-[12px] font-semibold text-[#636366]">
              {FLOW4_PRIMARY_USE_COPY.fieldLabel}
            </span>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="relative flex h-11 w-full items-center rounded-lg border border-[#e5e5ea] bg-white text-left transition-colors hover:border-[#c7c7cc]"
            >
              <span
                className={
                  selection.use
                    ? "px-3 text-[13px] text-[#1c1c1e]"
                    : "px-3 text-[13px] text-[#9ca3af]"
                }
              >
                {selection.use || "Select primary use"}
              </span>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[#636366]" />
            </button>
            <p className="text-[11px] leading-relaxed text-[#636366]">
              {FLOW4_PRIMARY_USE_COPY.streetLegalHint}
            </p>
          </div>

          {isPrimaryUseOther(selection.use) ? (
            <label className="block space-y-1.5">
              <span className="text-[12px] font-semibold text-[#636366]">
                {FLOW4_PRIMARY_USE_COPY.otherLabel}
              </span>
              <textarea
                value={competition.primaryUseOther || selection.other}
                onChange={(event) => patchCompetition({ primaryUseOther: event.target.value })}
                placeholder={FLOW4_PRIMARY_USE_COPY.otherPlaceholder}
                className="min-h-24 w-full resize-none rounded-lg border border-[#e5e5ea] p-3 text-[13px] leading-relaxed outline-none focus:border-[#1b1464]"
              />
            </label>
          ) : null}
        </div>
      </div>

      {pickerOpen ? (
        <MobileOptionSheet
          open
          title={FLOW4_PRIMARY_USE_COPY.fieldLabel}
          onClose={() => setPickerOpen(false)}
        >
          <MobileOptionList
            options={[...PRIMARY_USE_OPTIONS]}
            value={selection.use}
            onSelect={(value) => {
              patchCompetition(racePrimaryUsePatch(value, competition));
              setPickerOpen(false);
            }}
          />
        </MobileOptionSheet>
      ) : null}
    </MobileListingShell>
  );
}
