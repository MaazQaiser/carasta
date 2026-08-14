"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { useListingBuilder } from "../ListingBuilderContext";
import { LISTING_PATHS } from "../listing-route-map";
import { Flow3SpecsCompletedView } from "../specs/Flow3SpecsCompletedView";

export function RestoredBuildSummaryScreen() {
  const router = useRouter();
  const { draft } = useListingBuilder();

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "restored-restomod-custom") {
      router.replace(LISTING_PATHS.specifications);
    }
  }, [draft.listingTypeId, router]);

  return (
    <div className="mx-auto max-w-xl">
      <Flow3SpecsCompletedView draft={draft} />
    </div>
  );
}
