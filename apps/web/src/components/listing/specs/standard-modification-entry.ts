import type { EntryFormConfig } from "./types";
import {
  PROFESSIONAL_SHOP_BUILDER_OPTION,
  WORK_PERFORMED_BY_OPTIONS,
} from "./options";

export const STANDARD_COMPLETED_DURING_OPTIONS = [
  "Current Ownership",
  "Previous Ownership",
  "Unknown",
];

/**
 * Canonical Add Modification form shared by Stock (Flow #1) and
 * Modified / Performance (Flow #2). Do not fork a second field set.
 */
export const STANDARD_MODIFICATION_ENTRY_FORM_CONFIG: EntryFormConfig = {
  entryTitleLabel: "Modification",
  descriptionLabel: "Modification Details",
  descriptionPlaceholder:
    "Describe what was modified, replaced, upgraded or added. Include details about the parts used and changes made.",
  hideTypeOfWork: true,
  hidePartsBrand: true,
  hideManufacturer: true,
  hideSpecifications: true,
  completedDuringLabel: "Modification Completed During",
  completedDuringOptions: STANDARD_COMPLETED_DURING_OPTIONS,
  shopBuilderLabel: "Add Shop / Builder",
  shopBuilderWhenWorkPerformedBy: PROFESSIONAL_SHOP_BUILDER_OPTION,
  useShopBuilderPicker: true,
  workPerformedByLabel: "Work Performed By",
  workPerformedByOptions: WORK_PERFORMED_BY_OPTIONS,
  installationDateLabel: "Date",
  simpleDateOnly: true,
  showOriginalPartsIncluded: true,
  saveButtonLabel: "Save Modification",
  addEntryLabel: "Add Modification",
  notesLabel: "Notes",
  documentSlots: [
    {
      key: "photos",
      title: "Photos",
      description: "Browse files or drag images. Multiple images supported.",
      accept: "image/*",
      variant: "image",
    },
    {
      key: "receipt",
      title: "Supporting Documents",
      description:
        "Upload receipts or any other supporting documentation about the modification.",
      accept: ".pdf,.png,.jpg,.jpeg",
      variant: "file",
    },
  ],
};

export const MODIFIED_SPECS_COPY = {
  title: "Specifications & Modifications",
  subtext:
    "Tell us what’s been upgraded or modified. Choose a category below to get started.",
} as const;
