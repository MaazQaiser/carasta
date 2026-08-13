"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { draftToAuction } from "@/components/listing/services/published-listing-service";
import { submitListingDraft } from "@/components/listing/services/listing-submit";
import { validateListingDraft } from "@/components/listing/services/validation-service";
import { SubmissionLoadingOverlay } from "@/components/listing/SubmissionLoadingOverlay";
import { mapAuctionToBuyerListing } from "@/components/mobile-buyer/map-vehicle-to-buyer";
import { BuyerListingBody } from "@/components/mobile-buyer/screens/MobileBuyerDetailScreen";
import { useListingNotifications } from "@/components/listing/notifications/NotificationProvider";
import { useAuth } from "@/lib/context/auth-context";
import { MOCK_USERS } from "@carasta/mock-data";

export function ListingBuyerViewPreviewScreen() {
  const router = useRouter();
  const { draft, activity, markClean, addActivity } = useListingBuilder();
  const { user } = useAuth();
  const { notify } = useListingNotifications();
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
      notify({
        title: "Missing required items",
        description: "Return to Listing Review and fix required fields before submitting.",
        tone: "error",
      });
      router.push("/listing/preview");
      return;
    }

    submitLockRef.current = true;
    setSubmitting(true);
    window.setTimeout(() => {
      const result = submitListingDraft({
        draft,
        seller,
        activity,
        submittedPath: "/listing/submitted",
      });
      if (!result.ok) {
        submitLockRef.current = false;
        setSubmitting(false);
        router.push("/listing/preview");
        return;
      }
      markClean();
      addActivity("Listing submitted", "submit");
      notify({
        title: "Listing Submitted",
        description: `Reference ${result.reference}`,
        tone: "success",
      });
      router.push("/listing/submitted");
    }, 1400);
  };

  return (
    <>
      <SubmissionLoadingOverlay open={submitting} />
      <div
        className={`space-y-4 ${submitting ? "pointer-events-none select-none opacity-60" : ""}`}
        aria-busy={submitting}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Buyer View Preview</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Preview Mode — this matches the buyer live auction page. Bidding and Buy Now are
              disabled.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {submitting ? (
              <Button type="button" variant="outline" disabled>
                Back to Listing Review
              </Button>
            ) : (
              <Button type="button" variant="outline" asChild>
                <Link href="/listing/preview">Back to Listing Review</Link>
              </Button>
            )}
            <Button type="button" onClick={handleSubmit} disabled={submitting}>
              Submit to Carasta
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
    </>
  );
}
