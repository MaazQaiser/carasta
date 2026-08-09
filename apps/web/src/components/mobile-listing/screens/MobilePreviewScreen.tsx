"use client";

import { ChevronRight } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { useMobileListingChrome } from "../MobileListingRuntime";
import { MobileListingShell } from "../MobileListingShell";

export function MobilePreviewScreen() {
  const { draft } = useListingBuilder();
  const { navigate } = useMobileListingChrome();
  const title = `${draft.details.year || "2018"} ${draft.details.make || "Porsche"} ${draft.details.model || "911 GT3 RS"}`;

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
    <MobileListingShell stepId="preview" continueDisabled={false} continueHref="/mobile-listing/review">
      <div className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <h1 className="text-[28px] font-extrabold text-[#1c1c1e]">Listing Preview</h1>
        <div className="overflow-hidden rounded-xl border border-[#e5e5ea]">
          <img
            src="https://picsum.photos/seed/carasta-preview/700/420"
            alt="Vehicle preview"
            className="aspect-[16/10] w-full object-cover"
          />
          <div className="p-3">
            <p className="text-[12px] font-semibold text-[#1c1c1e]">{title}</p>
            <p className="mt-1 text-[18px] font-extrabold text-[#1b1464]">
              ${draft.saleSettings.buyNowPrice || "125,000"}
            </p>
          </div>
        </div>
        <PreviewRow
          label="Vehicle Details"
          value={`${title} Coupe`}
          onPress={() => navigate("/mobile-listing/details")}
        />
        <PreviewRow
          label="Specifications"
          value={`${draft.details.engine || "4.0L Flat-6"}, ${draft.details.transmission || "7-Speed PDK"}, RWD`}
          onPress={() => navigate(specsHref)}
        />
        <PreviewRow
          label="Condition"
          value="Excellent (no cosmetic or mechanical flaws)"
          onPress={() => navigate("/mobile-listing/condition")}
        />
        <PreviewRow
          label="Photos"
          value={`${draft.vehiclePhotos.length || 12} photos uploaded`}
          onPress={() => navigate("/mobile-listing/photos")}
        />
        <PreviewRow
          label="Owner's Notes"
          value="5 facts attached"
          onPress={() => navigate("/mobile-listing/notes")}
        />
        <PreviewRow label="Description" value="Pricing description and listing text" />
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
