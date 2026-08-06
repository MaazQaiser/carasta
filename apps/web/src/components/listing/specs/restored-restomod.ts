import {
  Hammer,
  Cog,
  Gauge,
  Disc3,
  CircleDot,
  Paintbrush,
  Armchair,
  Speaker,
  Shield,
  Factory,
  MoreHorizontal,
} from "lucide-react";
import type { ModificationWorkspaceState, SpecsFlowConfig, RestorationBuildTypeOption } from "./types";
import {
  createEmptyPerformanceSummary,
  createEmptyRestorationState,
  createEmptyRaceState,
  RESTORATION_ENTRY_FORM_CONFIG,
} from "./options";

export const RESTORATION_BUILD_TYPES: RestorationBuildTypeOption[] = [
  {
    id: "preserved-survivor",
    label: "Preserved / Survivor",
    description: "Mostly original, unrestored or carefully preserved.",
  },
  {
    id: "factory-correct-restoration",
    label: "Factory-Correct Restoration",
    description: "Restored to factory-correct specification and finish.",
  },
  {
    id: "restored",
    label: "Restored",
    description: "Fully or substantially restored with updated or refreshed systems.",
  },
  {
    id: "restomod",
    label: "Restomod",
    description: "Classic character with modern performance and comfort upgrades.",
  },
  {
    id: "custom",
    label: "Custom",
    description: "One-off custom fabrication beyond a traditional restoration.",
  },
  {
    id: "hot-rod-street-rod",
    label: "Hot Rod / Street Rod",
    description: "Hot rod or street rod style build and presentation.",
  },
];

/** Restored / Restomod / Custom specifications config. */
export const RESTORED_RESTOMODE_SPECS_CONFIG: SpecsFlowConfig = {
  id: "restored-restomod-custom",
  label: "Restored / Restomod / Custom",
  description:
    "Build a restoration record that adapts to the selected build type — factory-correct, restomod, custom, and more.",
  showPerformanceSummary: false,
  entryForm: RESTORATION_ENTRY_FORM_CONFIG,
  categories: [
    {
      id: "build-restoration",
      label: "Build & Restoration",
      description: "Core restoration and build work",
      icon: Hammer,
    },
    {
      id: "engine-performance",
      label: "Engine & Performance",
      description: "Engine, induction, exhaust, tuning",
      icon: Cog,
    },
    {
      id: "transmission-drivetrain",
      label: "Transmission & Drivetrain",
      description: "Gearbox, differential, axles, driveline",
      icon: Gauge,
    },
    {
      id: "suspension-steering-brakes",
      label: "Suspension, Steering & Brakes",
      description: "Chassis dynamics and stopping power",
      icon: Disc3,
    },
    {
      id: "wheels-tires",
      label: "Wheels & Tires",
      description: "Wheels, tires, and fitment",
      icon: CircleDot,
    },
    {
      id: "exterior-body-paint",
      label: "Exterior, Body & Paint",
      description: "Bodywork, paint, trim, and finish",
      icon: Paintbrush,
    },
    {
      id: "interior",
      label: "Interior",
      description: "Cabin, upholstery, and interior trim",
      icon: Armchair,
    },
    {
      id: "electrical-audio",
      label: "Electrical & Audio",
      description: "Wiring, lighting, gauges, and audio",
      icon: Speaker,
    },
    {
      id: "safety",
      label: "Safety",
      description: "Safety equipment and compliance items",
      icon: Shield,
    },
    {
      id: "original-factory-equipment",
      label: "Original / Factory Equipment",
      description: "Retained OEM and factory equipment",
      icon: Factory,
    },
    {
      id: "other",
      label: "Other",
      description: "Anything that doesn’t fit above",
      icon: MoreHorizontal,
    },
  ],
};

export function createRestoredRestomodWorkspace(): ModificationWorkspaceState {
  const firstCategoryId =
    RESTORED_RESTOMODE_SPECS_CONFIG.categories[0]?.id ?? "build-restoration";
  return {
    performanceSummary: createEmptyPerformanceSummary(),
    restoration: createEmptyRestorationState(),
    race: createEmptyRaceState(),
    entries: [],
    activeCategoryId: firstCategoryId,
    expandedEntryIds: [],
    editingEntryId: null,
    hasModifications: null,
    reviewedFactoryCategoryIds: [],
    factorySpecOverrides: {},
  };
}

export function getRestorationBuildTypeLabel(id: string | null | undefined) {
  if (!id) return undefined;
  return RESTORATION_BUILD_TYPES.find((type) => type.id === id)?.label;
}
