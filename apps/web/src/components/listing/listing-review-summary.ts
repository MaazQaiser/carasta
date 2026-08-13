import type { ListingDraft } from "./types";
import { getRestorationBuildTypeLabel } from "./specs/restored-restomod";

export function listingReviewVehicleTitle(draft: ListingDraft): string {
  const { year, make, model } = draft.details;
  return [year, make, model].filter(Boolean).join(" ") || "Your vehicle";
}

export function listingReviewSpecsLine(draft: ListingDraft): string {
  const { engine, transmission, drivetrain } = draft.details;
  return [engine || "Engine TBD", transmission || "Transmission TBD", drivetrain || "Drivetrain TBD"].join(
    ", "
  );
}

export function listingReviewModificationsSummary(draft: ListingDraft): string {
  if (draft.modificationWorkspace.hasModifications === false) {
    return "No modifications reported.";
  }
  const count = draft.modificationWorkspace.entries.filter(
    (entry) => entry.completed || entry.title.trim()
  ).length;
  if (count === 0) return "No modifications reported.";
  return `${count} modification${count === 1 ? "" : "s"} added`;
}

/** Whether to show the Modifications summary card (not Flow #3 Build/Restoration). */
export function showListingReviewModifications(draft: ListingDraft): boolean {
  return draft.listingTypeId !== "restored-restomod-custom";
}

/** Concise Flow #3 Build / Restoration summary — not a dump of every entry. */
export function listingReviewBuildRestorationSummary(draft: ListingDraft): string {
  const resto = draft.modificationWorkspace.restoration;
  const buildLabel = getRestorationBuildTypeLabel(resto.buildType) || "Build type not set";
  const entryCount = draft.modificationWorkspace.entries.filter(
    (e) => e.completed || e.title.trim()
  ).length;
  const level = resto.factoryCorrect.restorationLevel.trim();
  const status = resto.factoryCorrect.completionStatus.trim();
  const shop =
    resto.factoryCorrect.restorationShop.trim() || resto.factoryCorrect.builder.trim();

  const bits = [
    buildLabel,
    level || null,
    status || null,
    shop ? `Shop/builder: ${shop}` : null,
    entryCount > 0
      ? `${entryCount} restoration categor${entryCount === 1 ? "y" : "ies"} recorded`
      : "No restoration categories recorded yet",
  ].filter(Boolean);

  return bits.join(" · ");
}

export function showListingReviewBuildRestoration(draft: ListingDraft): boolean {
  return draft.listingTypeId === "restored-restomod-custom";
}

export function listingReviewPhotosSummary(draft: ListingDraft): string {
  const n = draft.vehiclePhotos.length;
  if (n === 0) return "No photos uploaded";
  return `${n} photo${n === 1 ? "" : "s"} uploaded`;
}

export function listingReviewDocumentsSummary(draft: ListingDraft): string {
  const n = draft.documents.length;
  if (n === 0) return "No documents attached";
  return `${n} file${n === 1 ? "" : "s"} attached`;
}

export function listingReviewDescriptionSummary(draft: ListingDraft): string {
  const text = draft.aiDescription.trim() || draft.ownerNotes.trim();
  if (!text) return "No description yet";
  return text.length > 100 ? `${text.slice(0, 100)}…` : text;
}

export function listingReviewAuctionSettingsSummary(draft: ListingDraft): string {
  const { buyNowPrice, reservePrice } = draft.saleSettings;
  if (buyNowPrice) {
    const n = Number(buyNowPrice.replace(/[^\d.]/g, ""));
    const formatted = Number.isFinite(n) && n > 0 ? `$${n.toLocaleString("en-US")}` : `$${buyNowPrice}`;
    return `Buy It Now — ${formatted}`;
  }
  if (reservePrice) {
    const n = Number(reservePrice.replace(/[^\d.]/g, ""));
    const formatted = Number.isFinite(n) && n > 0 ? `$${n.toLocaleString("en-US")}` : `$${reservePrice}`;
    return `Reserve — ${formatted}`;
  }
  return "Auction settings not set";
}

export function listingReviewHeroUrl(draft: ListingDraft): string | undefined {
  const coverId = draft.auctionCoverPhotoId;
  if (coverId) {
    const cover = draft.vehiclePhotos.find((p) => p.id === coverId && p.previewUrl);
    if (cover?.previewUrl) return cover.previewUrl;
  }
  return draft.vehiclePhotos.find((p) => p.previewUrl)?.previewUrl;
}
