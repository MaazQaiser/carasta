import {
  Cog,
  Gauge,
  CircleDot,
  Car,
  Armchair,
  Speaker,
  Shield,
  Factory,
  MoreHorizontal,
} from "lucide-react";
import type { ListingVehicleDetails } from "../types";
import type { EntryFormConfig, SpecsCategoryDefinition, SpecsFlowConfig } from "./types";
import { createModifiedPerformanceWorkspace } from "./modified-performance";

export const STOCK_FACTORY_CATEGORIES: SpecsCategoryDefinition[] = [
  { id: "powertrain", label: "Powertrain", description: "Engine, power, and transmission", icon: Cog },
  { id: "drivetrain", label: "Drivetrain", description: "Drive layout and differential", icon: Gauge },
  { id: "wheels-tires", label: "Wheels & Tires", description: "Wheel and tire sizes", icon: CircleDot },
  { id: "exterior", label: "Exterior", description: "Color and body style", icon: Car },
  { id: "interior", label: "Interior", description: "Cabin color and seating", icon: Armchair },
  { id: "electronics", label: "Electronics / Audio", description: "Factory audio and displays", icon: Speaker },
  { id: "safety", label: "Safety", description: "Airbags, ABS, and assistance", icon: Shield },
  { id: "factory-equipment", label: "Factory Equipment", description: "Packages and premium options", icon: Factory },
];

export const STOCK_MODIFICATION_CATEGORIES: SpecsCategoryDefinition[] = [
  ...STOCK_FACTORY_CATEGORIES.filter((category) => category.id !== "factory-equipment"),
  { id: "other", label: "Other", description: "Anything that doesn’t fit above", icon: MoreHorizontal },
];

export const STOCK_TYPE_OF_WORK_OPTIONS = [
  "Repair",
  "Upgrade",
  "Replacement",
  "Custom",
  "Fabrication",
  "Installation",
  "Other",
];

export const STOCK_COMPLETED_DURING_OPTIONS = [
  "Current ownership",
  "Previous Ownership",
  "Unknown",
];

/** Value that reveals the Add Shop / Builder control on the light-mod form. */
export const STOCK_PROFESSIONAL_SHOP_OPTION = "Professional Shop / Builder";

export const STOCK_WORK_PERFORMED_BY_OPTIONS = [
  "Current Owner",
  "Previous Owner",
  STOCK_PROFESSIONAL_SHOP_OPTION,
  "Other Individual",
  "Unknown",
];

export const STOCK_DATE_STATUS_OPTIONS = [
  "Exact Date",
  "Approximate Date",
  "Before Current Ownership",
  "Previous Owner Unknown",
  "Unknown",
  "Not Applicable",
] as const;

export const STOCK_ENTRY_FORM_CONFIG: EntryFormConfig = {
  entryTitleLabel: "Modification",
  descriptionLabel: "Modification Details",
  descriptionPlaceholder:
    "Describe what was modified, replaced, upgraded or added. Include and details about the parts used and changes made",
  hideTypeOfWork: true,
  hidePartsBrand: true,
  hideManufacturer: true,
  hideSpecifications: true,
  completedDuringLabel: "Modification Completed During",
  completedDuringOptions: STOCK_COMPLETED_DURING_OPTIONS,
  shopBuilderLabel: "Add Shop / Builder",
  shopBuilderWhenWorkPerformedBy: STOCK_PROFESSIONAL_SHOP_OPTION,
  useShopBuilderPicker: true,
  workPerformedByLabel: "Work Performed By",
  workPerformedByOptions: STOCK_WORK_PERFORMED_BY_OPTIONS,
  installationDateLabel: "Date",
  simpleDateOnly: true,
  showOriginalPartsIncluded: true,
  saveButtonLabel: "Save Modification",
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
        "Upload receipts or any other supporting documentation about modification",
      accept: ".pdf,.png,.jpg,.jpeg",
      variant: "file",
    },
  ],
};

export const STOCK_LIGHTLY_MODIFIED_SPECS_CONFIG: SpecsFlowConfig = {
  id: "stock-lightly-modified",
  label: "Stock / Lightly Modified",
  description:
    "Review factory specifications imported from VIN and add any light modifications.",
  showPerformanceSummary: false,
  categories: STOCK_MODIFICATION_CATEGORIES,
  entryForm: STOCK_ENTRY_FORM_CONFIG,
};

export type FactorySpecField = {
  id: string;
  label: string;
  value: string;
  /** When set, edits write through to listing vehicle details. */
  detailKey?: keyof ListingVehicleDetails;
};
export type FactorySpecSection = {
  id: string;
  label: string;
  fields: FactorySpecField[];
};

/** Build factory sections from listing details + VIN-imported placeholders. */
export function buildFactorySpecSections(
  details: ListingVehicleDetails,
  overrides: Record<string, string> = {}
): FactorySpecSection[] {
  const field = (
    sectionId: string,
    label: string,
    fallback: string,
    detailKey?: keyof ListingVehicleDetails
  ): FactorySpecField => {
    const id = `${sectionId}:${label}`;
    const fromDetails = detailKey ? details[detailKey]?.trim() : "";
    const fromOverride = overrides[id]?.trim();
    const value = fromOverride || fromDetails || fallback;
    return { id, label, value, detailKey };
  };

  return [
    {
      id: "powertrain",
      label: "Powertrain",
      fields: [
        field("powertrain", "Engine", "", "engine"),
        field("powertrain", "Horsepower", ""),
        field("powertrain", "Torque", ""),
        field("powertrain", "Transmission", "", "transmission"),
        field("powertrain", "Fuel Type", ""),
      ],
    },
    {
      id: "drivetrain",
      label: "Drivetrain",
      fields: [
        field("drivetrain", "Drive Type", "", "drivetrain"),
        field("drivetrain", "Differential", ""),
      ],
    },
    {
      id: "wheels-tires",
      label: "Wheels & Tires",
      fields: [
        field("wheels-tires", "Wheel Size", ""),
        field("wheels-tires", "Tire Size", ""),
      ],
    },
    {
      id: "exterior",
      label: "Exterior",
      fields: [
        field("exterior", "Exterior Color", "", "exteriorColor"),
        field("exterior", "Body Style", ""),
      ],
    },
    {
      id: "interior",
      label: "Interior",
      fields: [
        field("interior", "Interior Color", "", "interiorColor"),
        field("interior", "Seats", ""),
      ],
    },
    {
      id: "electronics",
      label: "Electronics / Audio",
      fields: [
        field("electronics", "Factory Audio", ""),
        field("electronics", "Navigation", ""),
        field("electronics", "Display", ""),
      ],
    },
    {
      id: "safety",
      label: "Safety",
      fields: [
        field("safety", "Airbags", ""),
        field("safety", "ABS", ""),
        field("safety", "Driver Assistance", ""),
      ],
    },
    {
      id: "factory-equipment",
      label: "Factory Equipment",
      fields: [
        field("factory-equipment", "Packages", ""),
        field("factory-equipment", "Premium Options", ""),
        field("factory-equipment", "Factory Features", ""),
      ],
    },
  ];
}

export function createStockLightlyModifiedWorkspace() {
  return {
    ...createModifiedPerformanceWorkspace(),
    activeCategoryId: STOCK_MODIFICATION_CATEGORIES[0]?.id ?? "powertrain",
    hasModifications: null as boolean | null,
    reviewedFactoryCategoryIds: [] as string[],
    factorySpecOverrides: {} as Record<string, string>,
  };
}
