"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LISTING_SUBMITTED_COPY } from "../listing-submitted-copy";
import { SubmissionSession } from "../services/submission-session";

export function ListingSubmittedScreen() {
  const [reference, setReference] = React.useState<string>("—");
  const [listingHref, setListingHref] = React.useState("/profile?tab=listings");

  React.useEffect(() => {
    const session = SubmissionSession.load();
    if (session?.reference) {
      setReference(session.reference);
    }
    if (session?.vehicleId) {
      setListingHref(`/m/listings/v/${session.vehicleId}`);
    } else if (session?.auctionId) {
      setListingHref(`/m/listings/v/${session.auctionId}`);
    } else {
      setListingHref("/profile?tab=listings");
    }
  }, []);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-10 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="mb-2 text-3xl font-bold">{LISTING_SUBMITTED_COPY.title}</h1>
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-amber-700">
        {LISTING_SUBMITTED_COPY.statusLabel}
      </p>
      <div className="mb-6 space-y-3 text-muted-foreground leading-relaxed">
        {LISTING_SUBMITTED_COPY.paragraphs.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>
      <p className="mb-8 text-sm font-medium">
        Listing Reference: <span className="font-mono">{reference}</span>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" asChild>
          <Link href={listingHref}>{LISTING_SUBMITTED_COPY.viewListing}</Link>
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/listing/type">{LISTING_SUBMITTED_COPY.createAnother}</Link>
        </Button>
      </div>
    </div>
  );
}
