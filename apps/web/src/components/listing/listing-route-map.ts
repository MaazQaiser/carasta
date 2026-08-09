import type { ListingDraft, ListingTypeId } from "./types";

export const LISTING_BASE = "/listing";

/** Canonical web paths mirroring mobile listing routes. */
export const LISTING_PATHS = {
  type: `${LISTING_BASE}/type`,
  identify: `${LISTING_BASE}/identify`,
  identifyManual: `${LISTING_BASE}/identify/manual`,
  details: `${LISTING_BASE}/details`,
  specifications: `${LISTING_BASE}/specifications`,
  stockSpecs: `${LISTING_BASE}/stock/specifications`,
  stockModAdd: `${LISTING_BASE}/stock/modifications/add`,
  modifiedSpecs: `${LISTING_BASE}/modified/specifications`,
  modifiedModAdd: `${LISTING_BASE}/modified/modifications/add`,
  restoredSpecs: `${LISTING_BASE}/restored/specifications`,
  restoredModAdd: `${LISTING_BASE}/restored/modifications/add`,
  raceSummary: `${LISTING_BASE}/race/summary`,
  raceBiography: `${LISTING_BASE}/race/biography`,
  raceSpecs: `${LISTING_BASE}/race/specifications`,
  raceModAdd: `${LISTING_BASE}/race/modifications/add`,
  raceCompetition: `${LISTING_BASE}/race/competition`,
  condition: `${LISTING_BASE}/condition`,
  photos: `${LISTING_BASE}/photos`,
  notes: `${LISTING_BASE}/notes`,
  ai: `${LISTING_BASE}/ai`,
  settings: `${LISTING_BASE}/settings`,
  preview: `${LISTING_BASE}/preview`,
  review: `${LISTING_BASE}/review`,
  submitted: `${LISTING_BASE}/submitted`,
  share: `${LISTING_BASE}/share`,
  shareExternal: `${LISTING_BASE}/share/external`,
  shareCommunity: `${LISTING_BASE}/share/community`,
  shareConfirmation: `${LISTING_BASE}/share/confirmation`,
  shopBuilder: `${LISTING_BASE}/shop-builder`,
  shopBuilderAdd: `${LISTING_BASE}/shop-builder/add`,
} as const;

const MIN_PHOTOS = 20;

/** After details — type-specific specs entry (race starts at summary). */
export function afterDetailsHref(typeId: ListingTypeId | null | undefined): string {
  switch (typeId) {
    case "stock-lightly-modified":
      return LISTING_PATHS.stockSpecs;
    case "modified-performance":
      return LISTING_PATHS.modifiedSpecs;
    case "restored-restomod-custom":
      return LISTING_PATHS.restoredSpecs;
    case "race-track-car":
      return LISTING_PATHS.raceSummary;
    default:
      return LISTING_PATHS.specifications;
  }
}

/** Specs entry for redirects from legacy `/listing/specifications`. */
export function specsEntryHref(typeId: ListingTypeId | null | undefined): string {
  return afterDetailsHref(typeId);
}

/** Preview “Edit specifications” deep-link (race → specs, not summary). */
export function specsEditHref(typeId: ListingTypeId | null | undefined): string {
  switch (typeId) {
    case "stock-lightly-modified":
      return LISTING_PATHS.stockSpecs;
    case "modified-performance":
      return LISTING_PATHS.modifiedSpecs;
    case "restored-restomod-custom":
      return LISTING_PATHS.restoredSpecs;
    case "race-track-car":
      return LISTING_PATHS.raceSpecs;
    default:
      return LISTING_PATHS.specifications;
  }
}

/** Back from condition — type-specific specs parent. */
export function backFromCondition(typeId: ListingTypeId | null | undefined): string {
  switch (typeId) {
    case "stock-lightly-modified":
      return LISTING_PATHS.stockSpecs;
    case "modified-performance":
      return LISTING_PATHS.modifiedSpecs;
    case "restored-restomod-custom":
      return LISTING_PATHS.restoredSpecs;
    case "race-track-car":
      return LISTING_PATHS.raceSpecs;
    default:
      return LISTING_PATHS.specifications;
  }
}

/** Progress step id for a pathname (maps branched URLs onto LISTING_STEPS). */
export function resolveListingProgressStepId(pathname: string): string | null {
  const path = pathname.split("?")[0] || pathname;

  if (path.startsWith(LISTING_PATHS.shopBuilder)) return null;
  if (path.startsWith(LISTING_PATHS.submitted) || path.startsWith(LISTING_PATHS.share)) {
    return null;
  }

  if (path === LISTING_PATHS.type || path.startsWith(`${LISTING_PATHS.type}/`)) return "type";
  if (path.startsWith(LISTING_PATHS.identify)) return "identify";
  if (path === LISTING_PATHS.details || path.startsWith(`${LISTING_PATHS.details}/`)) {
    return "details";
  }

  if (
    path.startsWith(`${LISTING_BASE}/stock/`) ||
    path.startsWith(`${LISTING_BASE}/modified/`) ||
    path.startsWith(`${LISTING_BASE}/restored/`) ||
    path.startsWith(`${LISTING_BASE}/race/`) ||
    path.startsWith(LISTING_PATHS.specifications)
  ) {
    return "specifications";
  }

  if (path.startsWith(LISTING_PATHS.condition) || path.startsWith(`${LISTING_BASE}/history`)) {
    return "history";
  }
  if (path.startsWith(LISTING_PATHS.photos)) return "photos";
  if (path.startsWith(LISTING_PATHS.notes)) return "notes";
  if (path.startsWith(LISTING_PATHS.ai)) return "ai";
  if (path.startsWith(LISTING_PATHS.settings)) return "settings";
  if (path.startsWith(LISTING_PATHS.preview)) return "preview";
  if (path.startsWith(LISTING_PATHS.review)) return "review";

  return null;
}

export function isNestedListingFlow(pathname: string): boolean {
  const path = pathname.split("?")[0] || pathname;
  return (
    path.includes("/modifications/add") ||
    path.startsWith(LISTING_PATHS.shopBuilder)
  );
}

export function isTypeSpecificSpecsPath(pathname: string): boolean {
  const path = pathname.split("?")[0] || pathname;
  return (
    path.startsWith(`${LISTING_BASE}/stock/`) ||
    path.startsWith(`${LISTING_BASE}/modified/`) ||
    path.startsWith(`${LISTING_BASE}/restored/`) ||
    path.startsWith(`${LISTING_BASE}/race/`) ||
    path.startsWith(LISTING_PATHS.specifications)
  );
}

function pathEquals(pathname: string, target: string) {
  const path = pathname.split("?")[0] || pathname;
  return path === target || path.startsWith(`${target}/`);
}

export function isDetailsValid(draft: ListingDraft): boolean {
  const typeId = draft.listingTypeId;
  const raceIdentity = draft.modificationWorkspace.race.identity;
  const restoration = draft.modificationWorkspace.restoration;

  if (typeId === "race-track-car") {
    return Boolean(
      (raceIdentity.year || draft.details.year) &&
        (raceIdentity.make || draft.details.make) &&
        (raceIdentity.model || draft.details.model)
    );
  }

  const core = Boolean(
    draft.details.year &&
      draft.details.make &&
      draft.details.model &&
      draft.details.trim &&
      draft.details.mileage
  );

  if (typeId === "restored-restomod-custom") {
    return core && Boolean(restoration.buildType && restoration.mileageStatus);
  }

  return core;
}

/** Whether Continue should be enabled for the current path (mobile-aligned gates). */
export function canContinueOnPath(pathname: string, draft: ListingDraft): boolean {
  const path = pathname.split("?")[0] || pathname;

  if (pathEquals(path, LISTING_PATHS.type)) return Boolean(draft.listingTypeId);
  if (pathEquals(path, LISTING_PATHS.identify) && !path.includes("/manual")) return false;
  if (pathEquals(path, LISTING_PATHS.identifyManual)) return true;
  if (pathEquals(path, LISTING_PATHS.details)) return isDetailsValid(draft);

  if (pathEquals(path, LISTING_PATHS.stockSpecs)) {
    return draft.modificationWorkspace.hasModifications !== null;
  }
  if (
    pathEquals(path, LISTING_PATHS.modifiedSpecs) ||
    pathEquals(path, LISTING_PATHS.restoredSpecs) ||
    pathEquals(path, LISTING_PATHS.raceSummary) ||
    pathEquals(path, LISTING_PATHS.raceBiography) ||
    pathEquals(path, LISTING_PATHS.raceSpecs)
  ) {
    return true;
  }

  if (pathEquals(path, LISTING_PATHS.condition)) return true;
  if (pathEquals(path, LISTING_PATHS.photos)) {
    return draft.vehiclePhotos.length >= MIN_PHOTOS;
  }
  if (pathEquals(path, LISTING_PATHS.notes)) return Boolean(draft.ownerNotes.trim());
  if (pathEquals(path, LISTING_PATHS.ai)) return Boolean(draft.aiDescription.trim());
  if (pathEquals(path, LISTING_PATHS.settings)) return true;
  if (pathEquals(path, LISTING_PATHS.preview)) return true;

  return true;
}

export function getContinueHref(
  pathname: string,
  draft: ListingDraft
): string | undefined {
  if (!canContinueOnPath(pathname, draft)) return undefined;

  const path = pathname.split("?")[0] || pathname;
  const typeId = draft.listingTypeId;

  if (pathEquals(path, LISTING_PATHS.type)) return LISTING_PATHS.identify;
  if (pathEquals(path, LISTING_PATHS.identifyManual)) return LISTING_PATHS.details;
  if (pathEquals(path, LISTING_PATHS.details)) return afterDetailsHref(typeId);

  if (pathEquals(path, LISTING_PATHS.stockSpecs)) return LISTING_PATHS.condition;
  if (pathEquals(path, LISTING_PATHS.modifiedSpecs)) return LISTING_PATHS.condition;
  if (pathEquals(path, LISTING_PATHS.restoredSpecs)) return LISTING_PATHS.condition;
  if (pathEquals(path, LISTING_PATHS.raceSummary)) return LISTING_PATHS.raceBiography;
  if (pathEquals(path, LISTING_PATHS.raceBiography)) return LISTING_PATHS.raceSpecs;
  if (pathEquals(path, LISTING_PATHS.raceSpecs)) return LISTING_PATHS.condition;

  if (pathEquals(path, LISTING_PATHS.condition)) return LISTING_PATHS.photos;
  if (pathEquals(path, LISTING_PATHS.photos)) return LISTING_PATHS.notes;
  if (pathEquals(path, LISTING_PATHS.notes)) return LISTING_PATHS.ai;
  if (pathEquals(path, LISTING_PATHS.ai)) return LISTING_PATHS.settings;
  if (pathEquals(path, LISTING_PATHS.settings)) return LISTING_PATHS.preview;
  if (pathEquals(path, LISTING_PATHS.preview)) return LISTING_PATHS.review;

  return undefined;
}

export function getBackHref(
  pathname: string,
  listingTypeId: ListingTypeId | null | undefined
): string | null {
  const path = pathname.split("?")[0] || pathname;

  if (pathEquals(path, LISTING_PATHS.shopBuilderAdd)) return LISTING_PATHS.shopBuilder;
  if (pathEquals(path, LISTING_PATHS.stockModAdd)) return LISTING_PATHS.stockSpecs;
  if (pathEquals(path, LISTING_PATHS.modifiedModAdd)) return LISTING_PATHS.modifiedSpecs;
  if (pathEquals(path, LISTING_PATHS.restoredModAdd)) return LISTING_PATHS.restoredSpecs;
  if (pathEquals(path, LISTING_PATHS.raceModAdd)) return LISTING_PATHS.raceSpecs;

  if (pathEquals(path, LISTING_PATHS.type)) return "/";
  if (pathEquals(path, LISTING_PATHS.identify) && !path.includes("/manual")) {
    return LISTING_PATHS.type;
  }
  if (pathEquals(path, LISTING_PATHS.identifyManual)) return LISTING_PATHS.identify;
  if (pathEquals(path, LISTING_PATHS.details)) return LISTING_PATHS.identify;

  if (pathEquals(path, LISTING_PATHS.stockSpecs)) return LISTING_PATHS.details;
  if (pathEquals(path, LISTING_PATHS.modifiedSpecs)) return LISTING_PATHS.details;
  if (pathEquals(path, LISTING_PATHS.restoredSpecs)) return LISTING_PATHS.details;
  if (pathEquals(path, LISTING_PATHS.raceSummary)) return LISTING_PATHS.details;
  if (pathEquals(path, LISTING_PATHS.raceBiography)) return LISTING_PATHS.raceSummary;
  if (pathEquals(path, LISTING_PATHS.raceSpecs)) return LISTING_PATHS.raceBiography;
  if (pathEquals(path, LISTING_PATHS.raceCompetition)) return LISTING_PATHS.details;

  if (pathEquals(path, LISTING_PATHS.condition) || path.startsWith(`${LISTING_BASE}/history`)) {
    return backFromCondition(listingTypeId);
  }
  if (pathEquals(path, LISTING_PATHS.photos)) return LISTING_PATHS.condition;
  if (pathEquals(path, LISTING_PATHS.notes)) return LISTING_PATHS.photos;
  if (pathEquals(path, LISTING_PATHS.ai)) return LISTING_PATHS.notes;
  if (pathEquals(path, LISTING_PATHS.settings)) return LISTING_PATHS.ai;
  if (pathEquals(path, LISTING_PATHS.preview)) return LISTING_PATHS.settings;
  if (pathEquals(path, LISTING_PATHS.review)) return LISTING_PATHS.preview;

  return null;
}

export const MIN_LISTING_PHOTOS = MIN_PHOTOS;
