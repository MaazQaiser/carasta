"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldHint, FieldLabel, textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import {
  listingReviewHeroUrl,
  listingReviewVehicleTitle,
} from "../listing-review-summary";
import {
  FLOW4_SPARES_COPY,
  SPARES_INCLUDED_OPTIONS,
  raceSparesIncludedPatch,
  shouldShowSparesDescription,
} from "../specs/race-track";
import { LISTING_PATHS } from "../listing-route-map";

/** Phase 1 optional Spares & Support — Yes/No plus one sale-included description. */
export function RaceSparesScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const race = draft.modificationWorkspace.race;
  const identity = race.identity;
  const showDescription = shouldShowSparesDescription(race.sparesIncluded);
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
    draft.details.engine,
    draft.modificationWorkspace.performanceSummary.horsepower
      ? `${draft.modificationWorkspace.performanceSummary.horsepower} hp`
      : "",
    draft.details.transmission,
  ]
    .filter(Boolean)
    .join(" • ");
  const hero = listingReviewHeroUrl(draft);

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
    <ListingStep title={FLOW4_SPARES_COPY.title} description={FLOW4_SPARES_COPY.subtext}>
      <div className="flex max-w-xl items-center gap-3 rounded-2xl bg-muted/60 p-2.5">
        <div className="h-14 w-[80px] shrink-0 overflow-hidden rounded-lg bg-muted">
          {hero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          {subtitle ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <ListingSection>
        <div className="space-y-3">
          <FieldLabel>{FLOW4_SPARES_COPY.question}</FieldLabel>
          <div className="space-y-2">
            {SPARES_INCLUDED_OPTIONS.map((option) => {
              const selected = race.sparesIncluded === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => patchRace(raceSparesIncludedPatch(race, option))}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors",
                    selected
                      ? "border-primary bg-primary/5"
                      : "border-input bg-background hover:bg-muted/40"
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-sm font-semibold", selected && "text-primary")}>
                      {option}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {option === "Yes" ? FLOW4_SPARES_COPY.yesHint : FLOW4_SPARES_COPY.noHint}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2",
                      selected ? "border-primary bg-primary text-primary-foreground" : "border-input"
                    )}
                  >
                    {selected ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </ListingSection>

      {showDescription ? (
        <ListingSection>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor="race-spares-description" className="mb-0">
                {FLOW4_SPARES_COPY.descriptionLabel}
              </FieldLabel>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Required
              </span>
            </div>
            <textarea
              id="race-spares-description"
              className={`${textareaClassName} min-h-36`}
              value={race.sparesDescription ?? ""}
              onChange={(event) => patchRace({ sparesDescription: event.target.value })}
              placeholder={FLOW4_SPARES_COPY.descriptionPrompt}
            />
            <FieldHint>{FLOW4_SPARES_COPY.saleHint}</FieldHint>
          </div>
        </ListingSection>
      ) : null}
    </ListingStep>
  );
}
