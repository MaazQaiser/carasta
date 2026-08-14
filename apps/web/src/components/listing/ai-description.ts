import type { ListingDraft } from "./types";

export const AI_DESCRIPTION_COPY = {
  title: "AI Description",
  subtext: "Generate a listing description.",
  editTitle: "Edit Description",
  editSubtext: "Customize the AI-generated copy to your liking.",
  footnote: "Note: AI description is based on your vehicle details and owner notes.",
  draftLabel: "Draft description",
  emptyHint:
    "Generate a description from your saved listing details and Owner’s Notes. You can edit anything before continuing.",
  maxLength: 2000,
  minLength: 100,
} as const;

function vehicleLabel(draft: ListingDraft): string {
  const { year, make, model, trim } = draft.details;
  return [year, make, model, trim].filter(Boolean).join(" ") || "This vehicle";
}

function qualifySellerClaim(text: string, lead = "The seller states"): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const alreadyQualified = /^(seller (states|reports|notes)|reported as|according to the seller)/i.test(
    trimmed
  );
  if (alreadyQualified) return trimmed;
  return `${lead} ${trimmed.replace(/\.$/, "")}.`;
}

/**
 * Builds a seller-editable listing description from saved draft fields + Owner’s Notes.
 * Does not invent performance, accident-free, or value claims. Seller-reported
 * condition/history language stays qualified (e.g. “seller states”, “reported as”).
 */
export function generateListingAiDescription(draft: ListingDraft): {
  summary: string;
  description: string;
} {
  const vehicle = vehicleLabel(draft);
  const d = draft.details;
  const c = draft.condition;
  const paragraphs: string[] = [];

  const identityBits = [
    d.mileage ? `${d.mileage.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} miles` : null,
    d.exteriorColor
      ? d.secondaryExteriorColor
        ? `${d.exteriorColor} / ${d.secondaryExteriorColor} exterior`
        : `${d.exteriorColor} exterior`
      : null,
    d.interiorColor ? `${d.interiorColor} interior` : null,
    d.engine || null,
    d.transmission || null,
    d.drivetrain || null,
  ].filter(Boolean);

  paragraphs.push(
    identityBits.length
      ? `${vehicle} is listed with the following saved details: ${identityBits.join("; ")}.`
      : `${vehicle} is presented using the details saved in this listing.`
  );

  const conditionLine = qualifySellerClaim(
    c.overallCondition,
    "Regarding overall condition, the seller states"
  );
  if (conditionLine) paragraphs.push(conditionLine);

  const titleLine = c.titleStatus.trim()
    ? `Title status on this listing is recorded as ${c.titleStatus.trim()}.`
    : null;
  if (titleLine) paragraphs.push(titleLine);

  const historyLine = qualifySellerClaim(
    c.accidentHistory || c.vehicleHistory,
    "As reported by the seller"
  );
  if (historyLine) paragraphs.push(historyLine);

  const ownershipLine = qualifySellerClaim(
    c.ownershipHistory,
    "Ownership history is described by the seller as"
  );
  if (ownershipLine) paragraphs.push(ownershipLine);

  const keys = c.numberOfKeys.trim();
  if (keys) {
    paragraphs.push(
      keys === "None"
        ? "The listing indicates no keys are included."
        : `The listing indicates ${keys} key${keys === "1" ? "" : "s"} included.`
    );
  }

  const warrantyLine = qualifySellerClaim(c.warranty, "Warranty notes from the seller");
  if (warrantyLine) paragraphs.push(warrantyLine);

  if (draft.listingTypeId === "race-track-car") {
    const race = draft.modificationWorkspace.race;
    const issuesLine = qualifySellerClaim(
      race.knownRaceTrackIssues ?? "",
      "Known race / track issues are disclosed by the seller as"
    );
    if (issuesLine) paragraphs.push(issuesLine);
    if (race.sparesIncluded === "Yes" && race.sparesDescription?.trim()) {
      const sparesLine = qualifySellerClaim(
        race.sparesDescription,
        "Spares and support equipment included with the sale are described by the seller as"
      );
      if (sparesLine) paragraphs.push(sparesLine);
    }
  }

  const notes = draft.ownerNotes.trim();
  if (notes) {
    paragraphs.push(
      `From the seller’s notes: ${notes.slice(0, 600)}${notes.length > 600 ? "…" : ""}`
    );
  }

  paragraphs.push(
    "Buyers should verify all claims independently. This description is drafted from saved listing data and Owner’s Notes and does not strengthen unsupported assertions."
  );

  const description = paragraphs.join("\n\n").slice(0, AI_DESCRIPTION_COPY.maxLength);
  const summary = `Generated from ${vehicle} listing data and Owner’s Notes. Seller-reported claims stay qualified — review and edit before saving.`;

  return { summary, description };
}

export function isAiDescriptionReady(text: string): boolean {
  return text.trim().length >= AI_DESCRIPTION_COPY.minLength;
}
