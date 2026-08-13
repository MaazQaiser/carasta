"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { draftToAuction } from "@/components/listing/services/published-listing-service";
import { mapAuctionToBuyerListing } from "@/components/mobile-buyer/map-vehicle-to-buyer";
import { BuyerListingBody } from "@/components/mobile-buyer/screens/MobileBuyerDetailScreen";
import { useAuth } from "@/lib/context/auth-context";
import { MOCK_USERS } from "@carasta/mock-data";

export function ListingBuyerViewPreviewScreen() {
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Buyer View Preview</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Preview Mode — this is how buyers will see your listing. Bidding and Buy Now are
            disabled.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" asChild>
            <Link href="/listing/preview">Back to Listing Review</Link>
          </Button>
          <Button type="button" asChild>
            <Link href="/listing/review">Submit to Carasta</Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-[440px] overflow-hidden rounded-[28px] border bg-background shadow-sm">
        <BuyerListingBody
          listing={listing}
          auction={auction}
          galleryBase="/listing/buyer-preview"
          sellerHref="/listing/buyer-preview"
          previewMode
          shareEnabled={false}
        />
      </div>
    </div>
  );
}
