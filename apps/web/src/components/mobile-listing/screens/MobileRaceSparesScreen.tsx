"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import {
  FLOW4_SPARES_COPY,
  SPARES_INCLUDED_OPTIONS,
  isRaceSparesComplete,
  raceSparesIncludedPatch,
  shouldShowSparesDescription,
} from "@/components/listing/specs/race-track";
import { MobileListingShell } from "../MobileListingShell";
import { MobileRaceVehicleCard } from "../MobileRaceVehicleCard";

export function MobileRaceSparesScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const race = draft.modificationWorkspace.race;
  const showDescription = shouldShowSparesDescription(race.sparesIncluded);

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

  return (
    <MobileListingShell
      stepId="race-spares"
      continueDisabled={!isRaceSparesComplete(race)}
      continueHref="/mobile-listing/condition"
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <MobileRaceVehicleCard />

        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            {FLOW4_SPARES_COPY.title}
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">
            {FLOW4_SPARES_COPY.subtext}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-[14px] font-semibold text-[#1c1c1e]">
            {FLOW4_SPARES_COPY.question}
          </p>
          <div className="flex flex-col gap-2.5">
            {SPARES_INCLUDED_OPTIONS.map((option) => {
              const selected = race.sparesIncluded === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => patchRace(raceSparesIncludedPatch(race, option))}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors",
                    selected
                      ? "border-[#1b1464] bg-[#f4f5fc]"
                      : "border-[#e5e5ea] bg-white"
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block text-[15px] font-bold",
                        selected ? "text-[#1b1464]" : "text-[#1c1c1e]"
                      )}
                    >
                      {option}
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-snug text-[#636366]">
                      {option === "Yes" ? FLOW4_SPARES_COPY.yesHint : FLOW4_SPARES_COPY.noHint}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2",
                      selected
                        ? "border-[#1b1464] bg-[#1b1464] text-white"
                        : "border-[#c7c7cc] bg-white"
                    )}
                  >
                    {selected ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {showDescription ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[14px] font-bold text-[#1c1c1e]">
                {FLOW4_SPARES_COPY.descriptionLabel}
              </p>
              <span className="rounded-full bg-[#ecebff] px-2 py-0.5 text-[10px] font-semibold text-[#1b1464]">
                Required
              </span>
            </div>
            <textarea
              value={race.sparesDescription ?? ""}
              onChange={(event) => patchRace({ sparesDescription: event.target.value })}
              placeholder={FLOW4_SPARES_COPY.descriptionPrompt}
              className="min-h-36 w-full resize-none rounded-2xl border border-[#e5e5ea] bg-white p-4 text-[13px] leading-relaxed outline-none focus:border-[#1b1464]"
            />
            <p className="text-[12px] leading-relaxed text-[#636366]">
              {FLOW4_SPARES_COPY.saleHint}
            </p>
          </div>
        ) : null}
      </div>
    </MobileListingShell>
  );
}
