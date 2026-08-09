"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldLabel, textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import type { RaceCompetitionProfile } from "../types";
import {
  COMPETITION_LEVEL_OPTIONS,
  RACE_CLASS_OPTIONS,
  RACE_DISCIPLINE_OPTIONS,
  RACE_ELIGIBILITY_OPTIONS,
  RACE_LOGBOOK_STATUS_OPTIONS,
  RACE_SANCTIONING_BODY_OPTIONS,
  RACE_SERIES_OPTIONS,
  RACE_TECHNICAL_INSPECTION_OPTIONS,
} from "../specs/options";
import { LISTING_PATHS } from "../listing-route-map";

type PickerKey = keyof Pick<
  RaceCompetitionProfile,
  | "primaryDiscipline"
  | "secondaryDiscipline"
  | "sanctioningBody"
  | "series"
  | "competitionClass"
  | "competitionLevel"
  | "currentEligibility"
  | "technicalInspection"
  | "logbookStatus"
>;

const PICKER_CONFIG: Record<
  PickerKey,
  { label: string; options: readonly string[] }
> = {
  primaryDiscipline: { label: "Primary Discipline", options: RACE_DISCIPLINE_OPTIONS },
  secondaryDiscipline: { label: "Secondary Discipline", options: RACE_DISCIPLINE_OPTIONS },
  sanctioningBody: { label: "Sanctioning Body", options: RACE_SANCTIONING_BODY_OPTIONS },
  series: { label: "Series", options: RACE_SERIES_OPTIONS },
  competitionClass: { label: "Class", options: RACE_CLASS_OPTIONS },
  competitionLevel: { label: "Competition Level", options: COMPETITION_LEVEL_OPTIONS },
  currentEligibility: { label: "Current Eligibility", options: RACE_ELIGIBILITY_OPTIONS },
  technicalInspection: {
    label: "Technical Inspection",
    options: RACE_TECHNICAL_INSPECTION_OPTIONS,
  },
  logbookStatus: { label: "Logbook Status", options: RACE_LOGBOOK_STATUS_OPTIONS },
};

export function RaceSummaryScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const race = draft.modificationWorkspace.race;
  const competition = race.competition;

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "race-track-car") {
      router.replace(LISTING_PATHS.specifications);
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

  return (
    <ListingStep
      title="Competition Profile"
      description="Document how and where this race / track car competes."
    >
      <ListingSection title="Competition">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(Object.keys(PICKER_CONFIG) as PickerKey[]).map((key) => {
            const config = PICKER_CONFIG[key];
            return (
              <div key={key}>
                <FieldLabel>{config.label}</FieldLabel>
                <Select
                  value={competition[key] || undefined}
                  onValueChange={(v) => patchCompetition({ [key]: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${config.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {config.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="race-comp-notes">Notes</FieldLabel>
            <textarea
              id="race-comp-notes"
              className={textareaClassName}
              value={competition.notes ?? ""}
              onChange={(e) => patchCompetition({ notes: e.target.value })}
              placeholder="Additional competition context…"
            />
          </div>
        </div>
      </ListingSection>
    </ListingStep>
  );
}
