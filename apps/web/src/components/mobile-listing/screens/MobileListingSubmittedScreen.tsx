"use client";

import * as React from "react";
import Link from "next/link";
import { LISTING_SUBMITTED_COPY } from "@/components/listing/listing-submitted-copy";
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
        <h1 className="mt-5 text-[27px] font-extrabold text-[#1c1c1e]">
          {LISTING_SUBMITTED_COPY.title}
        </h1>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-[#8b6500]">
          {LISTING_SUBMITTED_COPY.statusLabel}
        </p>
        <div className="mt-3 max-w-[320px] space-y-3 text-[14px] leading-relaxed text-[#636366]">
          {LISTING_SUBMITTED_COPY.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <p className="mt-4 text-[12px] font-medium text-[#1c1c1e]">
          Listing Reference: <span className="font-mono">{reference}</span>
        </p>
        <div className="mt-10 w-full space-y-3">
          <Link
            href={listingHref}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
          >
            {LISTING_SUBMITTED_COPY.viewListing}
          </Link>
          <Link
            href="/mobile-listing/type"
            className="block text-[12px] text-[#636366] underline"
          >
            {LISTING_SUBMITTED_COPY.createAnother}
          </Link>
        </div>
      </div>
    </MobileListingShell>
  );
}
