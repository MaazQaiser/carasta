"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import {
  listingReviewHeroUrl,
  listingReviewVehicleTitle,
} from "@/components/listing/listing-review-summary";
import {
  FLOW4_BUILD_COPY,
  RACE_BUILD_PERFORMED_BY_OPTIONS,
  isRaceBuildComplete,
  raceBuildPerformedByPatch,
  shouldShowRaceBuildShopBuilder,
} from "@/components/listing/specs/race-track";
import { MobileListingShell } from "../MobileListingShell";
import { MobileOptionList, MobileOptionSheet } from "../MobileOptionSheet";
import { MobileAddShopBuilderControl } from "../shop-builder/MobileAddShopBuilderControl";
import { useOpenShopBuilder } from "../shop-builder/useOpenShopBuilder";

export function MobileRaceSpecsScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const { openShopBuilder, opening } = useOpenShopBuilder();
  const race = draft.modificationWorkspace.race;
  const identity = race.identity;
  const [pickerOpen, setPickerOpen] = React.useState(false);

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
    <MobileListingShell
      stepId="race-specifications"
      continueDisabled={!isRaceBuildComplete(race)}
      continueHref="/mobile-listing/race/safety"
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
            {FLOW4_BUILD_COPY.title}
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">{FLOW4_BUILD_COPY.subtext}</p>
        </div>

        <div className="space-y-5 rounded-[16px] border border-[#e5e5ea] bg-white p-4">
          <label className="block space-y-2">
            <span className="text-[13px] font-semibold text-[#1c1c1e]">
              {FLOW4_BUILD_COPY.narrativeLabel}
            </span>
            <textarea
              value={race.buildNarrative ?? ""}
              onChange={(event) => patchRace({ buildNarrative: event.target.value })}
              placeholder={FLOW4_BUILD_COPY.narrativePlaceholder}
              className="min-h-40 w-full resize-none rounded-[12px] border border-[#e5e5ea] bg-[#fafafa] p-3 text-[14px] leading-relaxed text-[#1c1c1e] outline-none placeholder:text-[#8e8e93] focus:border-[#1b1464]"
            />
            <p className="text-[12px] leading-relaxed text-[#636366]">
              {FLOW4_BUILD_COPY.narrativeHelper}
            </p>
          </label>

          <div className="block space-y-2">
            <span className="text-[13px] font-semibold text-[#1c1c1e]">
              {FLOW4_BUILD_COPY.performedByLabel}
            </span>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="relative flex h-12 w-full items-center rounded-[12px] border border-[#e5e5ea] bg-white text-left transition-colors hover:border-[#c7c7cc]"
            >
              <span
                className={
                  race.workPerformedBy
                    ? "px-3 text-[14px] text-[#1c1c1e]"
                    : "px-3 text-[14px] text-[#8e8e93]"
                }
              >
                {race.workPerformedBy || "Select"}
              </span>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[#636366]" />
            </button>
          </div>

          {shouldShowRaceBuildShopBuilder(race.workPerformedBy) ? (
            <MobileAddShopBuilderControl
              value={race.shopBuilder}
              onPress={() =>
                openShopBuilder({
                  target: "race.shopBuilder",
                  label: "Shop / Builder",
                })
              }
              busy={opening}
            />
          ) : null}
        </div>
      </div>

      {pickerOpen ? (
        <MobileOptionSheet
          open
          title="Who performed the build or preparation?"
          onClose={() => setPickerOpen(false)}
        >
          <MobileOptionList
            options={[...RACE_BUILD_PERFORMED_BY_OPTIONS]}
            value={race.workPerformedBy}
            onSelect={(value) => {
              patchRace(raceBuildPerformedByPatch(race, value));
              setPickerOpen(false);
            }}
          />
        </MobileOptionSheet>
      ) : null}
    </MobileListingShell>
  );
}
