"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import type { RaceVehicleBiography } from "@/components/listing/types";
import { MobileListingShell } from "../MobileListingShell";

const BIOGRAPHY_FIELDS: {
  key: keyof RaceVehicleBiography;
  label: string;
  placeholder: string;
  helper: string;
}[] = [
  {
    key: "competitionHistory",
    label: "Competition History",
    placeholder: "Overview of events, seasons, and racing programs…",
    helper: "Describe championships, seasons, and notable race events.",
  },
  {
    key: "notableResults",
    label: "Notable Results",
    placeholder: "Wins, podiums, records, and standout finishes…",
    helper: "Highlight the results buyers should notice first.",
  },
  {
    key: "vehicleHistory",
    label: "Vehicle History",
    placeholder: "Ownership timeline, rebuilds, and preparation milestones…",
    helper: "Include ownership timeline, rebuilds, and preparation milestones.",
  },
  {
    key: "builderNotes",
    label: "Preparation Notes",
    placeholder: "Prep approach, setup philosophy, and technical context…",
    helper: "Share how the car was prepared and what matters for competition use.",
  },
  {
    key: "previousTeamsOrDrivers",
    label: "Previous Teams or Drivers",
    placeholder: "Teams, drivers, or programs associated with this car…",
    helper: "List teams, drivers, or programs connected to this vehicle.",
  },
  {
    key: "championships",
    label: "Championships",
    placeholder: "Titles, class championships, or series awards…",
    helper: "Note titles, class championships, or series awards.",
  },
  {
    key: "significantEvents",
    label: "Significant Events",
    placeholder: "Milestone races, debuts, or historically important moments…",
    helper: "Call out debuts, milestone races, or historically important moments.",
  },
  {
    key: "additionalBackground",
    label: "Additional Background",
    placeholder: "Anything else buyers should know about this race car…",
    helper: "Add any remaining context that helps buyers evaluate the car.",
  },
];

export function MobileRaceBiographyScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const race = draft.modificationWorkspace.race;
  const biography = race.biography;

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "race-track-car") {
      router.replace("/mobile-listing/specifications");
    }
  }, [draft.listingTypeId, router]);

  const patchBiography = (patch: Partial<RaceVehicleBiography>) => {
    const nextBiography = { ...biography, ...patch };
    updateWorkspace({
      race: {
        ...race,
        biography: nextBiography,
        competition: {
          ...race.competition,
          competitionHistorySummary: nextBiography.competitionHistory,
          notableResults: nextBiography.notableResults,
        },
      },
    });
  };

  return (
    <MobileListingShell
      stepId="race-biography"
      continueDisabled={false}
      continueHref="/mobile-listing/race/specifications"
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            Vehicle Biography
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">
            Tell buyers the car’s racing history, preparation, and standout moments.
          </p>
        </div>

        {BIOGRAPHY_FIELDS.map((field) => (
          <label key={field.key} className="block space-y-1.5">
            <span className="text-[12px] font-semibold text-[#636366]">{field.label}</span>
            <textarea
              value={biography[field.key]}
              onChange={(event) => patchBiography({ [field.key]: event.target.value })}
              placeholder={field.placeholder}
              className="min-h-36 w-full resize-none rounded-lg border border-[#e5e5ea] p-3 text-[13px] leading-relaxed outline-none focus:border-[#1b1464]"
            />
            <span className="block text-[11px] text-[#636366]">{field.helper}</span>
          </label>
        ))}
      </div>
    </MobileListingShell>
  );
}
