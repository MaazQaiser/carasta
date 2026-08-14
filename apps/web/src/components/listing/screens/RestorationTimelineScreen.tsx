"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import { RestorationTimelineList } from "../specs/RestorationTimelineList";
import { FLOW3_TIMELINE_COPY } from "../specs/restored-restomod";
import { LISTING_PATHS } from "../listing-route-map";

export function RestorationTimelineScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const restoration = draft.modificationWorkspace.restoration;

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "restored-restomod-custom") {
      router.replace(LISTING_PATHS.specifications);
    }
  }, [draft.listingTypeId, router]);

  return (
    <ListingStep title={FLOW3_TIMELINE_COPY.title} description={FLOW3_TIMELINE_COPY.subtext}>
      <ListingSection>
        <RestorationTimelineList
          events={restoration.timelineEvents ?? []}
          showHeading={false}
          onChange={(timelineEvents) =>
            updateWorkspace({
              restoration: { ...restoration, timelineEvents },
            })
          }
        />
      </ListingSection>
    </ListingStep>
  );
}
