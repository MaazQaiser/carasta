"use client";

import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import {
  listingReviewHeroUrl,
  listingReviewVehicleTitle,
} from "@/components/listing/listing-review-summary";
import { getRestorationBuildTypeLabel } from "@/components/listing/specs/restored-restomod";

export function MobileRestoredVehicleCard() {
  const { draft } = useListingBuilder();
  const title = listingReviewVehicleTitle(draft);
  const hero = listingReviewHeroUrl(draft);
  const buildLabel =
    getRestorationBuildTypeLabel(
      draft.modificationWorkspace.restoration.buildType,
      draft.modificationWorkspace.restoration.restomodSubcategory
    ) || "Restored";
  const subtitle = [
    buildLabel,
    draft.details.engine,
    draft.details.transmission,
    draft.details.exteriorColor,
  ]
    .filter(Boolean)
    .join(" • ");

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
        <p className="mt-0.5 truncate text-[11px] text-[#636366]">{subtitle}</p>
      </div>
    </div>
  );
}
