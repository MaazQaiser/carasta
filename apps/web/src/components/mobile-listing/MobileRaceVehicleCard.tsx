"use client";

import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import {
  listingReviewHeroUrl,
  listingReviewVehicleTitle,
} from "@/components/listing/listing-review-summary";

export function MobileRaceVehicleCard() {
  const { draft } = useListingBuilder();
  const identity = draft.modificationWorkspace.race.identity;
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
    <div className="flex items-center gap-3 rounded-[14px] bg-[#f2f2f7] p-2.5">
      <div className="h-12 w-[72px] shrink-0 overflow-hidden rounded-lg bg-[#e5e5ea]">
        {hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-bold text-[#1c1c1e]">{title}</p>
        {subtitle ? (
          <p className="mt-0.5 truncate text-[11px] text-[#636366]">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
