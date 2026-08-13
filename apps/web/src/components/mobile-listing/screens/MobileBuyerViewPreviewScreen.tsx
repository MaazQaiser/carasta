"use client";

import * as React from "react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { draftToAuction } from "@/components/listing/services/published-listing-service";
import { mapAuctionToBuyerListing } from "@/components/mobile-buyer/map-vehicle-to-buyer";
import { BuyerListingBody } from "@/components/mobile-buyer/screens/MobileBuyerDetailScreen";
import { useAuth } from "@/lib/context/auth-context";
import { MOCK_USERS } from "@carasta/mock-data";
import { MobileListingShell } from "../MobileListingShell";

/**
 * Shows the seller the live buyer auction layout for their draft,
 * with bidding / Buy Now disabled (Preview Mode).
 */
export function MobileBuyerViewPreviewScreen() {
  const { draft } = useListingBuilder();
  const { user } = useAuth();
  const seller =
    user ?? MOCK_USERS.find((u) => u.id === "user-me") ?? MOCK_USERS[0]!;

  const { listing, auction } = React.useMemo(() => {
    const previewAuction = draftToAuction(draft, seller, "PREVIEW");
    const liveLooking = {
      ...previewAuction,
      status: "live" as const,
      vehicle: {
        ...previewAuction.vehicle,
        status: "in-auction" as const,
      },
    };
    return {
      auction: liveLooking,
      listing: {
        ...mapAuctionToBuyerListing(liveLooking),
        listingStatusLabel: "Preview",
      },
    };
  }, [draft, seller]);

  return (
    <MobileListingShell
      stepId="buyer-preview"
      continueHref="/mobile-listing/review"
      continueLabel="Submit to Carasta"
      backLabel="Back to Listing Review"
      hideSaveDraftExit
    >
      <BuyerListingBody
        listing={listing}
        auction={auction}
        galleryBase="/mobile-listing/buyer-preview"
        sellerHref="/mobile-listing/buyer-preview"
        previewMode
        shareEnabled={false}
      />
    </MobileListingShell>
  );
}
