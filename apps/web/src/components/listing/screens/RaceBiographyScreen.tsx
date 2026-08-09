"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FieldLabel, textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import type { RaceVehicleBiography } from "../types";
import { LISTING_PATHS } from "../listing-route-map";

const BIOGRAPHY_FIELDS: {
  key: keyof RaceVehicleBiography;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "competitionHistory",
    label: "Competition History",
    placeholder: "Overview of events, seasons, and racing programs…",
  },
  {
    key: "notableResults",
    label: "Notable Results",
    placeholder: "Wins, podiums, records, and standout finishes…",
  },
  {
    key: "vehicleHistory",
    label: "Vehicle History",
    placeholder: "Ownership timeline, rebuilds, and preparation milestones…",
  },
  {
    key: "builderNotes",
    label: "Preparation Notes",
    placeholder: "Prep approach, setup philosophy, and technical context…",
  },
  {
    key: "previousTeamsOrDrivers",
    label: "Previous Teams or Drivers",
    placeholder: "Teams, drivers, or programs associated with this car…",
  },
  {
    key: "championships",
    label: "Championships",
    placeholder: "Titles, class championships, or series awards…",
  },
  {
    key: "significantEvents",
    label: "Significant Events",
    placeholder: "Milestone races, debuts, or historically important moments…",
  },
  {
    key: "additionalBackground",
    label: "Additional Background",
    placeholder: "Anything else buyers should know about this race car…",
  },
];

export function RaceBiographyScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const race = draft.modificationWorkspace.race;
  const biography = race.biography;

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "race-track-car") {
      router.replace(LISTING_PATHS.specifications);
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
    <ListingStep
      title="Vehicle Biography"
      description="Tell the competition story buyers need before reviewing race specifications."
    >
      <ListingSection title="Narrative">
        <div className="space-y-4">
          {BIOGRAPHY_FIELDS.map((field) => (
            <div key={field.key}>
              <FieldLabel htmlFor={`bio-${field.key}`}>{field.label}</FieldLabel>
              <textarea
                id={`bio-${field.key}`}
                className={`${textareaClassName} min-h-28`}
                value={biography[field.key] ?? ""}
                onChange={(e) => patchBiography({ [field.key]: e.target.value })}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
      </ListingSection>
    </ListingStep>
  );
}
