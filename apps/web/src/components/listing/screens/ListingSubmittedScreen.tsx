"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="mx-auto max-w-lg py-10 flex flex-col items-center text-center">
      <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-6">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold mb-3">Listing Submitted</h1>
      <p className="text-muted-foreground mb-2 leading-relaxed">
        Your vehicle has been submitted to Carasta for review. We&apos;ll review your listing and
        reach out if we have any questions. Once your auction start date has been selected,
        we&apos;ll notify you. You can view your pending listing anytime in the{" "}
        <span className="font-medium text-foreground">Auctions</span> tab on your profile.
      </p>
      <p className="text-sm font-medium mb-8">
        Listing Reference: <span className="font-mono">{reference}</span>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" asChild>
          <Link href={listingHref}>View Buyer Listing</Link>
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/profile?tab=listings">View on Profile</Link>
        </Button>
        <Button type="button" variant="ghost" asChild>
          <Link href="/listing/type">Create Another Listing</Link>
        </Button>
      </div>
    </div>
  );
}
