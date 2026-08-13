"use client";

import * as React from "react";
import Link from "next/link";
import { SubmissionSession } from "@/components/listing/services/submission-session";
import { MobileListingShell } from "../MobileListingShell";

export function MobileListingSubmittedScreen() {
  const [reference, setReference] = React.useState("—");
  const [listingHref, setListingHref] = React.useState("/profile?tab=listings");

  React.useEffect(() => {
    const session = SubmissionSession.load();
    if (session?.reference) setReference(session.reference);
    if (session?.vehicleId) {
      setListingHref(`/m/listings/v/${session.vehicleId}`);
    } else if (session?.auctionId) {
      setListingHref(`/m/listings/v/${session.auctionId}`);
    }
  }, []);

  return (
    <MobileListingShell stepId="submitted" hideFooter>
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#52b870] text-2xl text-white">
          ✓
        </div>
        <h1 className="mt-5 text-[27px] font-extrabold text-[#1c1c1e]">Listing Submitted</h1>
        <p className="mt-3 max-w-[320px] text-[14px] leading-relaxed text-[#636366]">
          Your vehicle has been submitted to Carasta for review. We&apos;ll review your listing and
          reach out if we have any questions. Once your auction start date has been selected,
          we&apos;ll notify you. You can view your pending listing anytime in the{" "}
          <span className="font-semibold text-[#1c1c1e]">Auctions</span> tab on your profile.
        </p>
        <p className="mt-4 text-[12px] font-medium text-[#1c1c1e]">
          Listing Reference: <span className="font-mono">{reference}</span>
        </p>
        <div className="mt-10 w-full space-y-3">
          <Link
            href={listingHref}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
          >
            View Buyer Listing
          </Link>
          <Link href="/mobile-listing/type" className="block text-[12px] text-[#636366] underline">
            Create Another Listing
          </Link>
        </div>
      </div>
    </MobileListingShell>
  );
}
