"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { FieldHint, FieldLabel, textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import {
  FLOW4_COMPETITION_HISTORY_COPY,
  ORGANIZED_COMPETITION_OPTIONS,
  raceOrganizedCompetitionPatch,
  shouldShowCompetitionHistoryNarrative,
  type OrganizedCompetitionOption,
} from "../specs/race-track";
import { LISTING_PATHS } from "../listing-route-map";

/** Phase 1 Competition History — required Yes/No/Unknown, optional single narrative if Yes. */
export function RaceBiographyScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const race = draft.modificationWorkspace.race;
  const showHistory = shouldShowCompetitionHistoryNarrative(race.organizedCompetition);

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "race-track-car") {
      router.replace(LISTING_PATHS.specifications);
    }
  }, [draft.listingTypeId, router]);

  const patchRace = (patch: Partial<typeof race>) => {
    updateWorkspace({
      race: { ...race, ...patch },
    });
  };

  return (
    <ListingStep
      title={FLOW4_COMPETITION_HISTORY_COPY.title}
      description={FLOW4_COMPETITION_HISTORY_COPY.disclaimer}
    >
      <ListingSection>
        <div>
          <FieldLabel>{FLOW4_COMPETITION_HISTORY_COPY.question}</FieldLabel>
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
                    "h-9 rounded-lg border px-3 text-sm font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-input bg-background text-foreground hover:bg-muted"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </ListingSection>

      {showHistory ? (
        <ListingSection>
          <div>
            <FieldLabel htmlFor="race-competition-history">
              {FLOW4_COMPETITION_HISTORY_COPY.historyLabel}
            </FieldLabel>
            <textarea
              id="race-competition-history"
              className={`${textareaClassName} min-h-40`}
              value={race.competitionHistoryNarrative ?? ""}
              onChange={(event) =>
                patchRace({ competitionHistoryNarrative: event.target.value })
              }
              placeholder={FLOW4_COMPETITION_HISTORY_COPY.historyPlaceholder}
            />
            <FieldHint>{FLOW4_COMPETITION_HISTORY_COPY.historyPrompt}</FieldHint>
          </div>
        </ListingSection>
      ) : null}
    </ListingStep>
  );
}
