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
import {
  listingReviewHeroUrl,
  listingReviewVehicleTitle,
} from "../listing-review-summary";
import { ListingShopBuilderField } from "../shop-builder/ListingShopBuilderField";
import {
  FLOW4_BUILD_COPY,
  RACE_BUILD_PERFORMED_BY_OPTIONS,
  raceBuildPerformedByPatch,
  shouldShowRaceBuildShopBuilder,
} from "../specs/race-track";
import { LISTING_PATHS } from "../listing-route-map";

/** Phase 1 Race / Track Build — narrative only, no modification categories. */
export function RaceSpecsRouteScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const race = draft.modificationWorkspace.race;
  const identity = race.identity;

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

  return (
    <ListingStep title={FLOW4_BUILD_COPY.title} description={FLOW4_BUILD_COPY.subtext}>
      <div className="flex items-center gap-3 rounded-2xl border bg-muted/30 p-3">
        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
          {hero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold">{title}</p>
          {subtitle ? (
            <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <ListingSection>
        <div className="space-y-5">
          <div>
            <FieldLabel htmlFor="race-build-narrative">
              {FLOW4_BUILD_COPY.narrativeLabel}
            </FieldLabel>
            <textarea
              id="race-build-narrative"
              className={`${textareaClassName} min-h-40`}
              value={race.buildNarrative ?? ""}
              onChange={(e) => patchRace({ buildNarrative: e.target.value })}
              placeholder={FLOW4_BUILD_COPY.narrativePlaceholder}
            />
            <FieldHint>{FLOW4_BUILD_COPY.narrativeHelper}</FieldHint>
          </div>

          <div>
            <FieldLabel>{FLOW4_BUILD_COPY.performedByLabel}</FieldLabel>
            <Select
              value={race.workPerformedBy || undefined}
              onValueChange={(value) => patchRace(raceBuildPerformedByPatch(race, value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {RACE_BUILD_PERFORMED_BY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {shouldShowRaceBuildShopBuilder(race.workPerformedBy) ? (
            <ListingShopBuilderField
              label="Shop / Builder"
              value={race.shopBuilder}
              target="race.shopBuilder"
              placeholder="Add Shop / Builder"
              emptyAction={!race.shopBuilder.trim()}
            />
          ) : null}
        </div>
      </ListingSection>
    </ListingStep>
  );
}
