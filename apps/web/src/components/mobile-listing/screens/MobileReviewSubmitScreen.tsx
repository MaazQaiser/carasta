"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MobileListingShell } from "../MobileListingShell";

/** Checklist screen removed — validation lives on Listing Review; submit on Buyer View Preview. */
export function MobileReviewSubmitScreen() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/mobile-listing/buyer-preview");
  }, [router]);

  return (
    <MobileListingShell stepId="review" continueDisabled>
      <div className="px-6 py-10 text-center text-[13px] text-[#636366]">
        Redirecting to Buyer View Preview…
      </div>
    </MobileListingShell>
  );
}
