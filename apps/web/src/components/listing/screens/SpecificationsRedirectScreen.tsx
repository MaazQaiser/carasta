"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useListingBuilder } from "../ListingBuilderContext";
import { LISTING_PATHS, specsEntryHref } from "../listing-route-map";
import { SpecificationsPlaceholderScreen } from "./SpecificationsPlaceholderScreen";

/** Legacy `/listing/specifications` — redirects to type-specific specs entry. */
export function SpecificationsRedirectScreen() {
  const router = useRouter();
  const { draft } = useListingBuilder();

  React.useEffect(() => {
    if (!draft.listingTypeId) {
      router.replace(LISTING_PATHS.type);
      return;
    }
    router.replace(specsEntryHref(draft.listingTypeId));
  }, [draft.listingTypeId, router]);

  if (!draft.listingTypeId) {
    return <SpecificationsPlaceholderScreen />;
  }

  return (
    <div className="rounded-2xl border bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground">
      Redirecting to type-specific specifications…
    </div>
  );
}
