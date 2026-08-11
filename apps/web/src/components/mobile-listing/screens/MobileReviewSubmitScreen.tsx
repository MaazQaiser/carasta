"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import {
  createListingReference,
  SubmissionSession,
} from "@/components/listing/services/submission-session";
import { PublishedListingService } from "@/components/listing/services/published-listing-service";
import { DraftService } from "@/components/listing/services/draft-service";
import { useAuth } from "@/lib/context/auth-context";
import { MOCK_USERS } from "@carasta/mock-data";
import { MobileListingShell } from "../MobileListingShell";

const RECOMMENDED_PHOTOS = 20;

export function MobileReviewSubmitScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { draft, activity, markClean, addActivity } = useListingBuilder();
  const [submitting, setSubmitting] = React.useState(false);
  const checks = ["Vehicle Details", "Specifications", "Photos", "Documents", "Description"];
  const photoCount = draft.vehiclePhotos.length;
  const needsMorePhotos = photoCount < RECOMMENDED_PHOTOS;

  const submit = () => {
    if (submitting) return;
    setSubmitting(true);
    const reference = createListingReference();
    const submittedAt = new Date().toISOString();
    const seller =
      user ?? MOCK_USERS.find((u) => u.id === "user-me") ?? MOCK_USERS[0]!;

    window.setTimeout(() => {
      const published = PublishedListingService.publish(draft, seller, reference);
      SubmissionSession.save({
        reference,
        submittedAt,
        auctionId: published.auction.id,
        vehicleId: published.auction.vehicle.id,
      });
      DraftService.save(draft, { lastPath: "/mobile-listing/submitted", activity });
      markClean();
      addActivity("Listing submitted", "submit");
      setSubmitting(false);
      router.push("/mobile-listing/submitted");
    }, 1200);
  };

  return (
    <MobileListingShell stepId="review" continueDisabled>
      <div className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#1c1c1e]">Review &amp; Submit</h1>
          <p className="mt-2 text-[14px] text-[#636366]">
            Make sure everything looks good before submitting. Your listing will appear in
            marketplace auctions for buyers.
          </p>
        </div>
        {checks.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-lg border border-[#e5e5ea] px-3 py-3 text-[13px]"
          >
            <CheckCircle2 className="h-4 w-4 text-[#52b870]" />
            {item}
          </div>
        ))}
        {needsMorePhotos ? (
          <div className="rounded-lg bg-[#fff6dd] p-3 text-[12px] text-[#8b6500]">
            {photoCount} of {RECOMMENDED_PHOTOS} recommended photos uploaded.
            <br />
            Add more photos to improve your listing.
          </div>
        ) : null}
        <button
          type="button"
          disabled={submitting}
          onClick={submit}
          className="mt-2 h-11 rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white disabled:opacity-70"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting Listing
            </span>
          ) : (
            "Submit Listing"
          )}
        </button>
      </div>
    </MobileListingShell>
  );
}
