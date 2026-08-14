"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import {
  listingReviewHeroUrl,
  listingReviewVehicleTitle,
} from "@/components/listing/listing-review-summary";
import {
  FLOW4_COMPETITION_HISTORY_COPY,
  ORGANIZED_COMPETITION_OPTIONS,
  isRaceCompetitionHistoryComplete,
  raceOrganizedCompetitionPatch,
  shouldShowCompetitionHistoryNarrative,
  type OrganizedCompetitionOption,
} from "@/components/listing/specs/race-track";
import { MobileListingShell } from "../MobileListingShell";

export function MobileRaceBiographyScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const race = draft.modificationWorkspace.race;
  const identity = race.identity;
  const showHistory = shouldShowCompetitionHistoryNarrative(race.organizedCompetition);

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "race-track-car") {
      router.replace("/mobile-listing/specifications");
    }
  }, [draft.listingTypeId, router]);

  const patchRace = (patch: Partial<typeof race>) => {
    updateWorkspace({
      race: { ...race, ...patch },
    });
  };

  const title =
    [
      identity.year || draft.details.year,
      identity.make || draft.details.make,
      identity.model || draft.details.model,
      identity.chassisDesignation || identity.trim || draft.details.trim,
    ]
      .filter(Boolean)
      .join(" ") || listingReviewVehicleTitle(draft);

  const subtitle = [
    "Race Car",
    draft.details.engine,
    draft.details.transmission,
  ]
    .filter(Boolean)
    .join(" • ");

  const hero = listingReviewHeroUrl(draft);

  return (
    <MobileListingShell
      stepId="race-biography"
      continueDisabled={!isRaceCompetitionHistoryComplete(race)}
      continueHref="/mobile-listing/race/documentation"
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <div className="flex items-center gap-3 rounded-[14px] border border-[#e5e5ea] bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="h-14 w-[76px] shrink-0 overflow-hidden rounded-lg bg-[#e5e5ea]">
            {hero ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold leading-tight text-[#1c1c1e]">{title}</p>
            {subtitle ? (
              <p className="mt-1 truncate text-[12px] leading-snug text-[#636366]">{subtitle}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            {FLOW4_COMPETITION_HISTORY_COPY.title}
          </h1>
        </div>

        <div className="space-y-5 rounded-[16px] border border-[#e5e5ea] bg-white p-4">
          <div className="space-y-2">
            <span className="text-[13px] font-semibold text-[#1c1c1e]">
              {FLOW4_COMPETITION_HISTORY_COPY.question}
            </span>
            <div className="flex flex-wrap gap-2">
              {ORGANIZED_COMPETITION_OPTIONS.map((option) => {
                const selected = race.organizedCompetition === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      patchRace(
                        raceOrganizedCompetitionPatch(
                          race,
                          option as OrganizedCompetitionOption
                        )
                      )
                    }
                    className={cn(
                      "h-11 min-w-[72px] rounded-[12px] border px-4 text-[14px] font-semibold",
                      selected
                        ? "border-[#1b1464] bg-[#f4f5fc] text-[#1b1464]"
                        : "border-[#e5e5ea] text-[#1c1c1e]"
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <p className="text-[12px] leading-relaxed text-[#636366]">
              {FLOW4_COMPETITION_HISTORY_COPY.disclaimer}
            </p>
          </div>

          {showHistory ? (
            <label className="block space-y-2">
              <span className="text-[13px] font-semibold text-[#1c1c1e]">
                {FLOW4_COMPETITION_HISTORY_COPY.historyLabel}
              </span>
              <textarea
                value={race.competitionHistoryNarrative ?? ""}
                onChange={(event) =>
                  patchRace({ competitionHistoryNarrative: event.target.value })
                }
                placeholder={FLOW4_COMPETITION_HISTORY_COPY.historyPlaceholder}
                className="min-h-40 w-full resize-none rounded-[12px] border border-[#e5e5ea] bg-[#fafafa] p-3 text-[14px] leading-relaxed text-[#1c1c1e] outline-none placeholder:text-[#8e8e93] focus:border-[#1b1464]"
              />
              <p className="text-[12px] leading-relaxed text-[#636366]">
                {FLOW4_COMPETITION_HISTORY_COPY.historyPrompt}
              </p>
            </label>
          ) : null}
        </div>
      </div>
    </MobileListingShell>
  );
}
