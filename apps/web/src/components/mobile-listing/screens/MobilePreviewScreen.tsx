"use client";

import { ChevronRight } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { useMobileListingChrome } from "../MobileListingRuntime";
import { MobileListingShell } from "../MobileListingShell";

function modificationsSummary(draft: ReturnType<typeof useListingBuilder>["draft"]) {
  const entries = draft.modificationWorkspace.entries.filter(
    (entry) => entry.completed || entry.title.trim()
  );
  if (draft.modificationWorkspace.hasModifications === false || entries.length === 0) {
    return "No modifications reported";
  }
  return `${entries.length} modification${entries.length === 1 ? "" : "s"} added`;
}

export function MobilePreviewScreen() {
  const { draft } = useListingBuilder();
  const { navigate } = useMobileListingChrome();
  const title = [draft.details.year, draft.details.make, draft.details.model]
    .filter(Boolean)
    .join(" ") || "Your vehicle";
  const photoCount = draft.vehiclePhotos.length;
  const hero =
    draft.vehiclePhotos.find((p) => p.previewUrl)?.previewUrl ||
    "https://picsum.photos/seed/carasta-preview/700/420";
  const condition =
    draft.condition.overallCondition.trim() || "Condition not set";
  const description =
    draft.aiDescription.trim() ||
    draft.ownerNotes.trim() ||
    "Pricing description and listing text";
  const notesSummary = draft.ownerNotes.trim()
    ? `${draft.ownerNotes.trim().slice(0, 80)}${draft.ownerNotes.trim().length > 80 ? "…" : ""}`
    : "No owner notes yet";

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
      continueDisabled={false}
      continueHref="/mobile-listing/buyer-preview"
    >
      <div className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <h1 className="text-[28px] font-extrabold text-[#1c1c1e]">Listing Review</h1>
        <div className="overflow-hidden rounded-xl border border-[#e5e5ea]">
          <img
            src={hero}
            alt="Vehicle preview"
            className="aspect-[16/10] w-full object-cover"
          />
          <div className="p-3">
            <p className="text-[12px] font-semibold text-[#1c1c1e]">{title}</p>
          </div>
        </div>
        <PreviewRow
          label="Vehicle Details"
          value={`${title}${draft.details.trim ? ` ${draft.details.trim}` : ""}`}
          onPress={() => navigate("/mobile-listing/details")}
        />
        <PreviewRow
          label="Specifications"
          value={`${draft.details.engine || "Engine TBD"}, ${draft.details.transmission || "Transmission TBD"}, ${draft.details.drivetrain || "Drivetrain TBD"}`}
          onPress={() => navigate(specsHref)}
        />
        <PreviewRow
          label="Modifications"
          value={modificationsSummary(draft)}
          onPress={() => navigate(specsHref)}
        />
        <PreviewRow
          label="Condition"
          value={condition}
          onPress={() => navigate("/mobile-listing/condition")}
        />
        <PreviewRow
          label="Photos"
          value={
            photoCount > 0
              ? `${photoCount} photo${photoCount === 1 ? "" : "s"} uploaded`
              : "No photos uploaded"
          }
          onPress={() => navigate("/mobile-listing/photos")}
        />
        <PreviewRow
          label="Owner's Notes"
          value={notesSummary}
          onPress={() => navigate("/mobile-listing/notes")}
        />
        <PreviewRow label="Description" value={description} />
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
