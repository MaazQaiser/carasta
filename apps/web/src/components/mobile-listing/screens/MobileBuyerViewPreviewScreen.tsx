"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { draftToAuction } from "@/components/listing/services/published-listing-service";
import { submitListingDraft } from "@/components/listing/services/listing-submit";
import { validateListingDraft } from "@/components/listing/services/validation-service";
import { SubmissionLoadingOverlay } from "@/components/listing/SubmissionLoadingOverlay";
import { mapAuctionToBuyerListing } from "@/components/mobile-buyer/map-vehicle-to-buyer";
import { BuyerListingBody } from "@/components/mobile-buyer/screens/MobileBuyerDetailScreen";
import { useAuth } from "@/lib/context/auth-context";
import { MOCK_USERS } from "@carasta/mock-data";
import { MobileListingShell } from "../MobileListingShell";

/**
 * Shows the seller the live buyer auction layout for their draft,
 * with bidding / Buy Now disabled (Preview Mode).
 * Submit re-validates required fields; warnings never block.
 */
export function MobileBuyerViewPreviewScreen() {
  const router = useRouter();
  const { draft, activity, markClean, addActivity } = useListingBuilder();
  const { user } = useAuth();
  const [submitting, setSubmitting] = React.useState(false);
  const submitLockRef = React.useRef(false);
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

  const handleSubmit = () => {
    if (submitLockRef.current || submitting) return;
    const validation = validateListingDraft(draft);
    if (!validation.isValid) {
      router.push("/mobile-listing/preview");
      return;
    }
    submitLockRef.current = true;
    setSubmitting(true);
    window.setTimeout(() => {
      const result = submitListingDraft({
        draft,
        seller,
        activity,
        submittedPath: "/mobile-listing/submitted",
      });
      if (!result.ok) {
        submitLockRef.current = false;
        setSubmitting(false);
        router.push("/mobile-listing/preview");
        return;
      }
      markClean();
      addActivity("Listing submitted", "submit");
      router.push("/mobile-listing/submitted");
    }, 1400);
  };

  return (
    <>
      <SubmissionLoadingOverlay open={submitting} />
      <MobileListingShell
        stepId="buyer-preview"
        continueDisabled={submitting}
        backDisabled={submitting}
        continueLabel="Submit to Carasta"
        backLabel="Back to Listing Review"
        hideSaveDraftExit
        onContinue={handleSubmit}
      >
        <div
          className={submitting ? "pointer-events-none select-none opacity-60" : undefined}
          aria-busy={submitting}
        >
          <BuyerListingBody
            listing={listing}
            auction={auction}
            galleryBase="/mobile-listing/buyer-preview"
            sellerHref="/mobile-listing/buyer-preview"
            previewMode
            shareEnabled={false}
          />
        </div>
      </MobileListingShell>
    </>
  );
}
