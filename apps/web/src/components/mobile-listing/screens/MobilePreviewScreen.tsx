"use client";

import { ChevronRight } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { useCompletion } from "@/components/listing/hooks/useCompletion";
import { ListingReviewIssues } from "@/components/listing/ListingReviewIssues";
import {
  listingReviewAuctionSettingsSummary,
  listingReviewBuildRestorationSummary,
  listingReviewDescriptionSummary,
  listingReviewDocumentsSummary,
  listingReviewHeroUrl,
  listingReviewModificationsSummary,
  listingReviewPhotosSummary,
  listingReviewSpecsLine,
  listingReviewVehicleTitle,
  showListingReviewBuildRestoration,
  showListingReviewModifications,
} from "@/components/listing/listing-review-summary";
import { useMobileListingChrome } from "../MobileListingRuntime";
import { MobileListingShell } from "../MobileListingShell";

export function MobilePreviewScreen() {
  const { draft } = useListingBuilder();
  const { validation } = useCompletion(draft);
  const { navigate } = useMobileListingChrome();
  const title = listingReviewVehicleTitle(draft);
  const hero =
    listingReviewHeroUrl(draft) || "https://picsum.photos/seed/carasta-preview/700/420";
  const condition = draft.condition.overallCondition.trim() || "Condition not set";

  const specsHref =
    draft.listingTypeId === "stock-lightly-modified"
      ? "/mobile-listing/stock/specifications"
      : draft.listingTypeId === "modified-performance"
        ? "/mobile-listing/modified/specifications"
        : draft.listingTypeId === "restored-restomod-custom"
          ? "/mobile-listing/restored/specifications"
          : draft.listingTypeId === "race-track-car"
            ? "/mobile-listing/race/specifications"
            : "/mobile-listing/specifications";

  return (
    <MobileListingShell
      stepId="preview"
      continueDisabled={!validation.isValid}
      continueHref={validation.isValid ? "/mobile-listing/buyer-preview" : undefined}
    >
      <div className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <h1 className="text-[28px] font-extrabold text-[#1c1c1e]">Listing Review</h1>
        <p className="text-[14px] text-[#636366]">
          Make sure everything looks good before continuing to Buyer View Preview.
        </p>

        <ListingReviewIssues validation={validation} draft={draft} mobile />

        <div className="overflow-hidden rounded-xl border border-[#e5e5ea]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero} alt="Vehicle preview" className="aspect-[16/10] w-full object-cover" />
          <div className="p-3">
            <p className="text-[15px] font-semibold text-[#1c1c1e]">{title}</p>
          </div>
        </div>

        <PreviewRow
          label="Vehicle Details"
          value={`${title}${draft.details.trim ? ` ${draft.details.trim}` : ""}`}
          onPress={() => navigate("/mobile-listing/details")}
        />
        <PreviewRow
          label="Specifications"
          value={listingReviewSpecsLine(draft)}
          onPress={() => navigate(specsHref)}
        />

        {showListingReviewModifications(draft) ? (
          <PreviewRow
            label="Modifications"
            value={listingReviewModificationsSummary(draft)}
            onPress={() => navigate(specsHref)}
          />
        ) : null}

        {showListingReviewBuildRestoration(draft) ? (
          <PreviewRow
            label="Build / Restoration"
            value={listingReviewBuildRestorationSummary(draft)}
            onPress={() => navigate(specsHref)}
          />
        ) : null}

        <PreviewRow
          label="Condition"
          value={condition}
          onPress={() => navigate("/mobile-listing/condition")}
        />
        <PreviewRow
          label="Photos"
          value={listingReviewPhotosSummary(draft)}
          onPress={() => navigate("/mobile-listing/photos")}
        />
        <PreviewRow
          label="Documents"
          value={listingReviewDocumentsSummary(draft)}
          onPress={() => navigate("/mobile-listing/photos")}
        />
        <PreviewRow
          label="Description"
          value={listingReviewDescriptionSummary(draft)}
          onPress={() => navigate("/mobile-listing/ai")}
        />
        <PreviewRow
          label="Auction Settings"
          value={listingReviewAuctionSettingsSummary(draft)}
          onPress={() => navigate("/mobile-listing/settings")}
        />
      </div>
    </MobileListingShell>
  );
}

function PreviewRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) {
  if (!onPress) {
    return (
      <div className="rounded-lg border border-[#e5e5ea] p-3">
        <p className="text-[10px] font-semibold uppercase text-[#636366]">{label}</p>
        <p className="mt-1 text-[12px] text-[#1c1c1e]">{value}</p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onPress}
      className="w-full rounded-lg border border-[#e5e5ea] p-3 text-left"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase text-[#636366]">{label}</p>
        <ChevronRight className="h-4 w-4 shrink-0 text-[#636366]" />
      </div>
      <p className="mt-1 text-[12px] text-[#1c1c1e]">{value}</p>
    </button>
  );
}
