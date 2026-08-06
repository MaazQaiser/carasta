"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListingBuilder } from "../ListingBuilderContext";
import { SubmissionSession } from "../services/submission-session";

export function ListingSubmittedScreen() {
  const { draft } = useListingBuilder();
  const [reference, setReference] = React.useState<string>("—");
  const [listingHref, setListingHref] = React.useState("/profile?tab=listings");
  const vehicleLabel =
    [draft.details.year, draft.details.make, draft.details.model].filter(Boolean).join(" ") ||
    "Your vehicle";

  React.useEffect(() => {
    const session = SubmissionSession.load();
    if (session?.reference) {
      setReference(session.reference);
    }
    if (session?.vehicleId) {
      setListingHref(`/vehicles/${session.vehicleId}`);
    } else {
      setListingHref("/profile?tab=listings");
    }
  }, []);

  return (
    <div className="mx-auto max-w-lg py-10 flex flex-col items-center text-center">
      <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-6">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold mb-3">Listing Successfully Submitted</h1>
      <p className="text-muted-foreground mb-2">
        {vehicleLabel} is live on your profile Listings tab. Share it to reach more of the
        community.
      </p>
      <p className="text-sm font-medium mb-8">
        Listing Reference: <span className="font-mono">{reference}</span>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" variant="outline" asChild>
          <Link href={listingHref}>View Listing</Link>
        </Button>
        <Button type="button" variant="secondary" asChild>
          <Link href="/profile?tab=listings">View on Profile</Link>
        </Button>
        <Button type="button" asChild>
          <Link href="/listing/share">
            <Share2 className="h-4 w-4" />
            Share Listing
          </Link>
        </Button>
        <Button type="button" variant="ghost" asChild>
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
