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
import { FieldHint, FieldLabel, textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import type { RaceCompetitionProfile } from "../types";
import {
  FLOW4_PRIMARY_USE_COPY,
  PRIMARY_USE_OPTIONS,
  isPrimaryUseOther,
  primaryUseSelection,
  racePrimaryUsePatch,
} from "../specs/race-track";
import { LISTING_PATHS } from "../listing-route-map";

export function RaceSummaryScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const race = draft.modificationWorkspace.race;
  const competition = race.competition;
  const selection = primaryUseSelection(competition);

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
    <ListingStep title={FLOW4_PRIMARY_USE_COPY.title} description={FLOW4_PRIMARY_USE_COPY.question}>
      <ListingSection title={FLOW4_PRIMARY_USE_COPY.fieldLabel}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <FieldLabel>{FLOW4_PRIMARY_USE_COPY.fieldLabel}</FieldLabel>
            <Select
              value={selection.use || undefined}
              onValueChange={(value) => patchCompetition(racePrimaryUsePatch(value, competition))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select primary use" />
              </SelectTrigger>
              <SelectContent>
                {PRIMARY_USE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldHint>{FLOW4_PRIMARY_USE_COPY.streetLegalHint}</FieldHint>
          </div>

          {isPrimaryUseOther(selection.use) ? (
            <div>
              <FieldLabel htmlFor="race-primary-use-other">
                {FLOW4_PRIMARY_USE_COPY.otherLabel}
              </FieldLabel>
              <textarea
                id="race-primary-use-other"
                className={textareaClassName}
                value={competition.primaryUseOther || selection.other}
                onChange={(e) => patchCompetition({ primaryUseOther: e.target.value })}
                placeholder={FLOW4_PRIMARY_USE_COPY.otherPlaceholder}
              />
            </div>
          ) : null}
        </div>
      </ListingSection>
    </ListingStep>
  );
}
