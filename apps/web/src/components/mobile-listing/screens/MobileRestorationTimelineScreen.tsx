"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { RestorationTimelineList } from "@/components/listing/specs/RestorationTimelineList";
import { MobileListingShell } from "../MobileListingShell";
import { MobileRestoredVehicleCard } from "./MobileRestoredVehicleCard";

export function MobileRestorationTimelineScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const restoration = draft.modificationWorkspace.restoration;

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "restored-restomod-custom") {
      router.replace("/mobile-listing/specifications");
    }
  }, [draft.listingTypeId, router]);

  return (
    <MobileListingShell
      stepId="restored-timeline"
      continueDisabled={false}
      continueHref="/mobile-listing/restored/summary"
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <MobileRestoredVehicleCard />
        <RestorationTimelineList
          events={restoration.timelineEvents ?? []}
          onChange={(timelineEvents) =>
            updateWorkspace({
              restoration: { ...restoration, timelineEvents },
            })
          }
        />
      </div>
    </MobileListingShell>
  );
}
