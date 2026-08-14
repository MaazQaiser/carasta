"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { FLOW3_SPECS_COMPLETED_COPY } from "@/components/listing/specs/restored-restomod";
import { Flow3SpecsCompletedView } from "@/components/listing/specs/Flow3SpecsCompletedView";
import { SHARED_FINISH_SEQUENCE } from "@/components/listing/shared-finish-sequence";
import { MobileListingShell } from "../MobileListingShell";

const CONDITION_HREF = SHARED_FINISH_SEQUENCE[0].mobileHref;

export function MobileRestoredBuildSummaryScreen() {
  const router = useRouter();
  const { draft } = useListingBuilder();

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "restored-restomod-custom") {
      router.replace("/mobile-listing/specifications");
    }
  }, [draft.listingTypeId, router]);

  return (
    <MobileListingShell
      stepId="restored-summary"
      continueHref={CONDITION_HREF}
      continueLabel={FLOW3_SPECS_COMPLETED_COPY.confirmContinue}
    >
      <div className="px-6 pt-4 pb-6">
        <Flow3SpecsCompletedView draft={draft} />
      </div>
    </MobileListingShell>
  );
}
