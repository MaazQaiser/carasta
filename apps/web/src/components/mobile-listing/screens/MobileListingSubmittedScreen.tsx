"use client";

import * as React from "react";
import Link from "next/link";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { SubmissionSession } from "@/components/listing/services/submission-session";
import { MobileListingShell } from "../MobileListingShell";

export function MobileListingSubmittedScreen() {
  const { draft } = useListingBuilder();
  const [reference, setReference] = React.useState("—");
  const [listingHref, setListingHref] = React.useState("/auctions");
  const vehicleLabel =
    [draft.details.year, draft.details.make, draft.details.model].filter(Boolean).join(" ") ||
    "Your vehicle";

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
        <h1 className="mt-5 text-[27px] font-extrabold text-[#1c1c1e]">Listing Submitted!</h1>
        <p className="mt-2 text-[14px] text-[#636366]">
          Your {vehicleLabel} is now live for buyers in auctions and search.
        </p>
        <p className="mt-3 text-[12px] font-medium text-[#1c1c1e]">
          Listing Reference: <span className="font-mono">{reference}</span>
        </p>
        <div className="mt-10 w-full space-y-3">
          <Link
            href={listingHref}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
          >
            View Buyer Listing
          </Link>
          <Link
            href="/auctions"
            className="flex h-11 w-full items-center justify-center rounded-lg border border-[#1b1464] text-[13px] font-semibold text-[#1b1464]"
          >
            Browse Auctions
          </Link>
          <Link
            href="/mobile-listing/share/external"
            className="flex h-11 w-full items-center justify-center rounded-lg border border-[#e5e5ea] text-[13px] font-semibold text-[#1c1c1e]"
          >
            Share Listing
          </Link>
          <Link href="/mobile-listing/type" className="block text-[12px] text-[#636366] underline">
            Create Another Listing
          </Link>
        </div>
      </div>
    </MobileListingShell>
  );
}
