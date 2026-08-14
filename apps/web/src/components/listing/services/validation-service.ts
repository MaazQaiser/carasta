import type { ListingDraft } from "../types";
import { LISTING_STEPS } from "../config";
import {
  afterDetailsHref,
  LISTING_PATHS,
  MIN_LISTING_PHOTOS,
  specsEntryHref,
} from "../listing-route-map";
import {
  isRaceBuildComplete,
  isRaceCompetitionHistoryComplete,
  isRaceDocumentationComplete,
  isRacePrimaryUseComplete,
  isRaceSparesComplete,
  shouldShowDocumentationOther,
} from "../specs/race-track";
import { isFactoryCorrectOriginalityComplete } from "../specs/restored-restomod";

export type ValidationSeverity = "required" | "optional" | "warning" | "information" | "error";

export interface ValidationIssue {
  id: string;
  stepId: string;
  href: string;
  field?: string;
  message: string;
  severity: ValidationSeverity;
}

export interface ValidationReport {
  issues: ValidationIssue[];
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  information: ValidationIssue[];
  stepsWithErrors: string[];
  isValid: boolean;
}

type Rule = (draft: ListingDraft) => ValidationIssue | null;

function raceYear(draft: ListingDraft) {
  return draft.modificationWorkspace.race.identity.year || draft.details.year;
}
function raceMake(draft: ListingDraft) {
  return draft.modificationWorkspace.race.identity.make || draft.details.make;
}
function raceModel(draft: ListingDraft) {
  return draft.modificationWorkspace.race.identity.model || draft.details.model;
}

const RULES: Rule[] = [
  (draft) =>
    draft.listingTypeId
      ? null
      : {
          id: "type-required",
          stepId: "type",
          href: LISTING_PATHS.type,
          field: "listingTypeId",
          message: "Select a vehicle type to continue.",
          severity: "error",
        },
  (draft) => {
    const year =
      draft.listingTypeId === "race-track-car" ? raceYear(draft) : draft.details.year;
    return year
      ? null
      : {
          id: "year-required",
          stepId: "details",
          href: LISTING_PATHS.details,
          field: "year",
          message: "Year is required.",
          severity: "error",
        };
  },
  (draft) => {
    const make =
      draft.listingTypeId === "race-track-car" ? raceMake(draft) : draft.details.make;
    return make
      ? null
      : {
          id: "make-required",
          stepId: "details",
          href: LISTING_PATHS.details,
          field: "make",
          message: "Make is required.",
          severity: "error",
        };
  },
  (draft) => {
    const model =
      draft.listingTypeId === "race-track-car" ? raceModel(draft) : draft.details.model;
    return model
      ? null
      : {
          id: "model-required",
          stepId: "details",
          href: LISTING_PATHS.details,
          field: "model",
          message: "Model is required.",
          severity: "error",
        };
  },
  (draft) => {
    if (draft.listingTypeId === "race-track-car") return null;
    return draft.details.trim
      ? null
      : {
          id: "trim-required",
          stepId: "details",
          href: LISTING_PATHS.details,
          field: "trim",
          message: "Trim is required.",
          severity: "error",
        };
  },
  (draft) => {
    if (draft.listingTypeId === "race-track-car") return null;
    return draft.details.mileage
      ? null
      : {
          id: "mileage-required",
          stepId: "details",
          href: LISTING_PATHS.details,
          field: "mileage",
          message: "Mileage is required.",
          severity: "error",
        };
  },
  (draft) => {
    if (draft.listingTypeId !== "restored-restomod-custom") return null;
    return draft.modificationWorkspace.restoration.buildType
      ? null
      : {
          id: "build-type-required",
          stepId: "details",
          href: LISTING_PATHS.details,
          field: "buildType",
          message: "Build type is required for restored listings.",
          severity: "error",
        };
  },
  (draft) => {
    if (draft.listingTypeId !== "restored-restomod-custom") return null;
    return draft.modificationWorkspace.restoration.mileageStatus
      ? null
      : {
          id: "mileage-status-required",
          stepId: "details",
          href: LISTING_PATHS.details,
          field: "mileageStatus",
          message: "Mileage status is required for restored listings.",
          severity: "error",
        };
  },
  (draft) => {
    if (draft.listingTypeId !== "restored-restomod-custom") return null;
    return draft.modificationWorkspace.restoration.buildStatus
      ? null
      : {
          id: "build-status-required",
          stepId: "details",
          href: LISTING_PATHS.details,
          field: "buildStatus",
          message: "Build status is required for restored listings.",
          severity: "error",
        };
  },
  (draft) => {
    if (draft.listingTypeId !== "restored-restomod-custom") return null;
    return draft.modificationWorkspace.restoration.workPerformedBy
      ? null
      : {
          id: "work-performed-by-required",
          stepId: "details",
          href: LISTING_PATHS.details,
          field: "workPerformedBy",
          message: "Work performed by is required for restored listings.",
          severity: "error",
        };
  },
  (draft) => {
    if (draft.listingTypeId !== "restored-restomod-custom") return null;
    const resto = draft.modificationWorkspace.restoration;
    if (resto.buildType !== "factory-correct-restoration") return null;
    return isFactoryCorrectOriginalityComplete(resto.factoryCorrect)
      ? null
      : {
          id: "factory-correct-originality-required",
          stepId: "specifications",
          href: LISTING_PATHS.restoredSpecs,
          field: "factoryCorrect",
          message: "Answer Yes, No, or Unknown for each originality item.",
          severity: "error",
        };
  },
  (draft) => {
    if (draft.listingTypeId !== "stock-lightly-modified") return null;
    return draft.modificationWorkspace.hasModifications !== null
      ? null
      : {
          id: "stock-factory-original-required",
          stepId: "specifications",
          href: LISTING_PATHS.stockSpecs,
          field: "hasModifications",
          message: "Confirm whether the vehicle is stock.",
          severity: "error",
        };
  },
  (draft) => {
    if (draft.listingTypeId !== "race-track-car") return null;
    return isRacePrimaryUseComplete(draft.modificationWorkspace.race.competition)
      ? null
      : {
          id: "race-primary-use-required",
          stepId: "specifications",
          href: LISTING_PATHS.raceSummary,
          field: "primaryDiscipline",
          message: "Primary use is required.",
          severity: "error",
        };
  },
  (draft) => {
    if (draft.listingTypeId !== "race-track-car") return null;
    return isRaceBuildComplete(draft.modificationWorkspace.race)
      ? null
      : {
          id: "race-build-narrative-required",
          stepId: "specifications",
          href: LISTING_PATHS.raceSpecs,
          field: "buildNarrative",
          message: "Tell buyers about the race / track build to continue.",
          severity: "error",
        };
  },
  (draft) => {
    if (draft.listingTypeId !== "race-track-car") return null;
    return isRaceCompetitionHistoryComplete(draft.modificationWorkspace.race)
      ? null
      : {
          id: "race-organized-competition-required",
          stepId: "specifications",
          href: LISTING_PATHS.raceBiography,
          field: "organizedCompetition",
          message: "Say whether this vehicle has competed in organized competition.",
          severity: "error",
        };
  },
  (draft) => {
    if (draft.listingTypeId !== "race-track-car") return null;
    const race = draft.modificationWorkspace.race;
    if (isRaceDocumentationComplete(race)) return null;
    const needsOther =
      shouldShowDocumentationOther(race.documentationTypes) &&
      !race.documentationOther?.trim();
    return {
      id: "race-documentation-required",
      stepId: "specifications",
      href: LISTING_PATHS.raceDocumentation,
      field: needsOther ? "documentationOther" : "documentationTypes",
      message: needsOther
        ? "Describe the other race / track documentation."
        : "Select race / track documentation, or None.",
      severity: "error",
    };
  },
  (draft) => {
    if (draft.listingTypeId !== "race-track-car") return null;
    return isRaceSparesComplete(draft.modificationWorkspace.race)
      ? null
      : {
          id: "race-spares-description-required",
          stepId: "specifications",
          href: LISTING_PATHS.raceSpares,
          field: "sparesDescription",
          message: "Describe the spares and support equipment included with the sale.",
          severity: "error",
        };
  },
  (draft) =>
    draft.vehiclePhotos.length >= MIN_LISTING_PHOTOS
      ? null
      : {
          id: "photos-required",
          stepId: "photos",
          href: LISTING_PATHS.photos,
          field: "vehiclePhotos",
          message: `Add at least ${MIN_LISTING_PHOTOS} vehicle photos.`,
          severity: "error",
        },
  // Videos are optional (max enforced on upload).
  (draft) =>
    draft.ownerNotes.trim()
      ? null
      : {
          id: "notes-required",
          stepId: "notes",
          href: LISTING_PATHS.notes,
          field: "ownerNotes",
          message: "Owner notes are required to continue.",
          severity: "error",
        },
  (draft) =>
    draft.aiDescription.trim().length >= 100
      ? null
      : {
          id: "ai-required",
          stepId: "ai",
          href: LISTING_PATHS.ai,
          field: "aiDescription",
          message: "Add an AI description of at least 100 characters.",
          severity: "error",
        },
  (draft) =>
    draft.saleSettings.buyNowPrice || draft.saleSettings.reservePrice
      ? null
      : {
          id: "pricing-required",
          stepId: "settings",
          href: LISTING_PATHS.settings,
          field: "reservePrice",
          message: "Set a Buy Now price or Reserve Price before submit.",
          severity: "error",
        },
  (draft) =>
    draft.details.vin || draft.vinInput
      ? null
      : {
          id: "vin-info",
          stepId: "identify",
          href: LISTING_PATHS.identify,
          field: "vin",
          message: "VIN decoding is optional and never blocks the listing.",
          severity: "information",
        },
  (draft) =>
    draft.documents.length > 0
      ? null
      : {
          id: "docs-optional",
          stepId: "photos",
          href: LISTING_PATHS.photos,
          field: "documents",
          message: "Supporting documents are optional but recommended.",
          severity: "optional",
        },
  (draft) =>
    draft.listingTypeId
      ? null
      : {
          id: "specs-entry-hint",
          stepId: "specifications",
          href: LISTING_PATHS.specifications,
          message: "Select a type to open specifications.",
          severity: "information",
        },
];

export function validateListingDraft(draft: ListingDraft): ValidationReport {
  const issues = RULES.map((rule) => rule(draft)).filter(Boolean) as ValidationIssue[];
  const errors = issues.filter((i) => i.severity === "error" || i.severity === "required");
  const warnings = issues.filter((i) => i.severity === "warning");
  const information = issues.filter(
    (i) => i.severity === "information" || i.severity === "optional"
  );
  const stepsWithErrors = Array.from(new Set(errors.map((i) => i.stepId)));

  return {
    issues,
    errors,
    warnings,
    information,
    stepsWithErrors,
    isValid: errors.length === 0,
  };
}

export function getIssuesForStep(draft: ListingDraft, stepId: string) {
  return validateListingDraft(draft).issues.filter((issue) => issue.stepId === stepId);
}

export function getStepIds(): string[] {
  return LISTING_STEPS.map((step) => step.id);
}

/** Convenience for linking into type-specific specs from summary/review. */
export function getSpecsHrefForDraft(draft: ListingDraft) {
  return draft.listingTypeId
    ? specsEntryHref(draft.listingTypeId)
    : afterDetailsHref(draft.listingTypeId);
}

export const ValidationService = {
  validate: validateListingDraft,
  getIssuesForStep,
};
