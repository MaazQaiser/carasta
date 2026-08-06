import type { ListingDraft } from "../types";
import { LISTING_STEPS } from "../config";

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

const RULES: Rule[] = [
  (draft) =>
    draft.listingTypeId
      ? null
      : {
          id: "type-required",
          stepId: "type",
          href: "/listing/type",
          field: "listingTypeId",
          message: "Select a vehicle type to continue.",
          severity: "error",
        },
  (draft) =>
    draft.details.year
      ? null
      : {
          id: "year-required",
          stepId: "details",
          href: "/listing/details",
          field: "year",
          message: "Year is required.",
          severity: "error",
        },
  (draft) =>
    draft.details.make
      ? null
      : {
          id: "make-required",
          stepId: "details",
          href: "/listing/details",
          field: "make",
          message: "Make is required.",
          severity: "error",
        },
  (draft) =>
    draft.details.model
      ? null
      : {
          id: "model-required",
          stepId: "details",
          href: "/listing/details",
          field: "model",
          message: "Model is required.",
          severity: "error",
        },
  (draft) =>
    draft.vehiclePhotos.length > 0
      ? null
      : {
          id: "photos-required",
          stepId: "photos",
          href: "/listing/photos",
          field: "vehiclePhotos",
          message: "Add at least one vehicle photo.",
          severity: "error",
        },
  (draft) =>
    draft.vehiclePhotos.length >= 3
      ? null
      : draft.vehiclePhotos.length > 0
        ? {
            id: "photos-warning",
            stepId: "photos",
            href: "/listing/photos",
            field: "vehiclePhotos",
            message: "Listings with 3+ photos perform better.",
            severity: "warning",
          }
        : null,
  (draft) =>
    draft.ownerNotes.trim()
      ? null
      : {
          id: "notes-warning",
          stepId: "notes",
          href: "/listing/notes",
          field: "ownerNotes",
          message: "Owner notes help buyers trust the listing.",
          severity: "warning",
        },
  (draft) =>
    draft.saleSettings.saleType
      ? null
      : {
          id: "sale-type-required",
          stepId: "settings",
          href: "/listing/settings",
          field: "saleType",
          message: "Sale type is required before submit.",
          severity: "error",
        },
  (draft) =>
    draft.details.vin || draft.vinInput
      ? null
      : {
          id: "vin-info",
          stepId: "identify",
          href: "/listing/identify",
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
          href: "/listing/photos",
          field: "documents",
          message: "Supporting documents are optional but recommended.",
          severity: "optional",
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

export const ValidationService = {
  validate: validateListingDraft,
  getIssuesForStep,
};
