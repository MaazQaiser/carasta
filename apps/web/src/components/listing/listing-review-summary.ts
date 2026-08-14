import type { ListingDraft } from "./types";
import {
  FLOW3_DOCUMENTATION_GROUPS,
  getRestorationBuildTypeLabel,
} from "./specs/restored-restomod";
import { countRestorationDocuments, normalizeMileageStatus } from "./specs/options";
import { documentationTypeLabels, installedSafetyLabels, primaryUseDisplayLabel } from "./specs/race-track";

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
  return (
    draft.listingTypeId !== "restored-restomod-custom" &&
    draft.listingTypeId !== "race-track-car"
  );
}

/** Concise Flow #3 Build / Restoration summary — not a dump of every entry. */
export function listingReviewBuildRestorationSummary(draft: ListingDraft): string {
  const resto = draft.modificationWorkspace.restoration;
  const buildLabel =
    getRestorationBuildTypeLabel(resto.buildType, resto.restomodSubcategory) ||
    "Build type not set";
  const entryCount = draft.modificationWorkspace.entries.filter(
    (e) => e.completed || e.title.trim()
  ).length;
  const level = resto.factoryCorrect.restorationLevel.trim();
  const status = resto.buildStatus.trim() || resto.factoryCorrect.completionStatus.trim();
  const shop =
    resto.shopBuilder.trim() ||
    resto.factoryCorrect.restorationShop.trim() ||
    resto.factoryCorrect.builder.trim();

  const bits = [
    buildLabel,
    level || null,
    status || null,
    shop ? `Shop/builder: ${shop}` : null,
    entryCount > 0
      ? `${entryCount} restoration ${entryCount === 1 ? "entry" : "entries"} recorded`
      : "No restoration entries recorded yet",
  ].filter(Boolean);

  return bits.join(" · ");
}

export function showListingReviewBuildRestoration(draft: ListingDraft): boolean {
  return draft.listingTypeId === "restored-restomod-custom";
}

export function listingReviewPrimaryUseSummary(draft: ListingDraft): string {
  return primaryUseDisplayLabel(draft.modificationWorkspace.race.competition) || "Primary use not set";
}

export function showListingReviewPrimaryUse(draft: ListingDraft): boolean {
  return draft.listingTypeId === "race-track-car";
}

export function listingReviewRaceBuildSummary(draft: ListingDraft): string {
  const race = draft.modificationWorkspace.race;
  const narrative = race.buildNarrative?.trim();
  if (!narrative) return "Build description not set";
  const who = race.workPerformedBy?.trim();
  const shop = race.shopBuilder?.trim();
  return [narrative.length > 100 ? `${narrative.slice(0, 100)}…` : narrative, who, shop]
    .filter(Boolean)
    .join(" · ");
}

export function listingReviewSafetySummary(draft: ListingDraft): string {
  const race = draft.modificationWorkspace.race;
  const labels = installedSafetyLabels(race);
  const notes = race.safetyEquipmentNotes?.trim();
  if (!labels.length && !notes) return "None selected (optional)";
  return [labels.join(", ") || null, notes ? "Notes added" : null].filter(Boolean).join(" · ");
}

export function listingReviewCompetitionHistorySummary(draft: ListingDraft): string {
  const race = draft.modificationWorkspace.race;
  const answer = race.organizedCompetition?.trim();
  if (!answer) return "Not set";
  if (answer !== "Yes") return answer;
  const narrative = race.competitionHistoryNarrative?.trim();
  if (!narrative) return "Yes — history not added (optional)";
  return `Yes · ${narrative.length > 100 ? `${narrative.slice(0, 100)}…` : narrative}`;
}

export function listingReviewDocumentationSummary(draft: ListingDraft): string {
  const race = draft.modificationWorkspace.race;
  const labels = documentationTypeLabels(race.documentationTypes);
  if (!labels.length) return "Not set";
  const other = race.documentationOther?.trim();
  const uploads = race.documentationUploads?.length ?? 0;
  return [
    labels.join(", "),
    other || null,
    uploads > 0 ? `${uploads} file${uploads === 1 ? "" : "s"} uploaded` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function listingReviewSparesSummary(draft: ListingDraft): string {
  const race = draft.modificationWorkspace.race;
  const answer = race.sparesIncluded?.trim();
  if (!answer) return "Not added (optional)";
  if (answer !== "Yes") return "No spares included with the sale";
  const description = race.sparesDescription?.trim();
  if (!description) return "Yes — describe what is included";
  return `Yes · ${description.length > 100 ? `${description.slice(0, 100)}…` : description}`;
}

export function listingReviewKnownIssuesSummary(draft: ListingDraft): string {
  const issues = draft.modificationWorkspace.race.knownRaceTrackIssues?.trim();
  if (!issues) return "Not disclosed (optional)";
  return issues.length > 100 ? `${issues.slice(0, 100)}…` : issues;
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

export function formatListingMileage(mileage: string): string {
  const digits = mileage.replace(/[^\d]/g, "");
  if (!digits) return mileage.trim() || "—";
  const n = Number(digits);
  if (!Number.isFinite(n)) return mileage;
  return `${n.toLocaleString("en-US")} mi`;
}

export function mileageStatusBadgeLabel(status: string): string | null {
  const normalized = normalizeMileageStatus(status);
  if (!normalized) return null;
  if (normalized === "Odometer Replaced") return "Replaced";
  return normalized;
}

export function flow3TimelineSummary(draft: ListingDraft): string | null {
  const events = draft.modificationWorkspace.restoration.timelineEvents ?? [];
  if (!events.length) return null;
  return `${events.length} event${events.length === 1 ? "" : "s"}`;
}

export function flow3DocumentationCountsLabel(draft: ListingDraft): string {
  const docs = draft.modificationWorkspace.restoration.documentation;
  const parts = FLOW3_DOCUMENTATION_GROUPS.map((group) => {
    const count = docs[group.id]?.length ?? 0;
    return count > 0 ? `${group.label} ${count}` : null;
  }).filter(Boolean);
  if (parts.length) return parts.join(" · ");
  const total = countRestorationDocuments(docs);
  return total > 0 ? `${total} file${total === 1 ? "" : "s"}` : "None added";
}

export type Flow3SpecsCompletedRow = {
  label: string;
  value: string;
  badge?: string;
};

export function flow3SpecsCompletedRows(draft: ListingDraft): Flow3SpecsCompletedRow[] {
  const details = draft.details;
  const resto = draft.modificationWorkspace.restoration;
  const buildLabel =
    getRestorationBuildTypeLabel(resto.buildType, resto.restomodSubcategory) || "Not set";
  const styleType = [details.trim, buildLabel].filter(Boolean).join(", ") || "—";
  const statusBits = [
    resto.buildStatus || resto.factoryCorrect.completionStatus || null,
    resto.completionYear || null,
  ].filter(Boolean);
  const builder =
    resto.shopBuilder.trim() ||
    resto.factoryCorrect.restorationShop.trim() ||
    resto.factoryCorrect.builder.trim() ||
    resto.workPerformedBy.trim() ||
    "—";
  const colours = [details.exteriorColor, details.interiorColor].filter(Boolean).join(" / ") || "—";
  const entryCount = draft.modificationWorkspace.entries.filter(
    (entry) => entry.completed || entry.title.trim()
  ).length;
  const timeline = flow3TimelineSummary(draft);
  const mileageBadge = mileageStatusBadgeLabel(resto.mileageStatus);

  const rows: Flow3SpecsCompletedRow[] = [
    { label: "Vehicle", value: listingReviewVehicleTitle(draft) },
    { label: "Style & Type", value: styleType },
    {
      label: "Build Status",
      value: statusBits.join(" · ") || "Not set",
    },
    {
      label: "Mileage",
      value: formatListingMileage(details.mileage),
      badge: mileageBadge || undefined,
    },
    { label: "Colours", value: colours },
    { label: "Builder", value: builder },
    {
      label: "Restoration Entries",
      value:
        entryCount > 0
          ? `${entryCount} restoration ${entryCount === 1 ? "entry" : "entries"}`
          : "None added",
    },
    { label: "Documentation", value: flow3DocumentationCountsLabel(draft) },
  ];

  if (timeline) {
    rows.push({ label: "Timeline", value: timeline });
  }

  return rows;
}
