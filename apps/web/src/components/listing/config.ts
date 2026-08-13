import {
  Car,
  Camera,
  ClipboardList,
  FileText,
  History,
  NotebookPen,
  Sparkles,
  Settings2,
  Eye,
  CheckCircle2,
  Tags,
  Wrench,
  Flag,
} from "lucide-react";
import type { ListingStepDefinition, ListingTypeDefinition } from "./types";
import {
  LISTING_PATHS,
  resolveListingProgressStepId,
  specsEditHref,
} from "./listing-route-map";

/**
 * Shared listing categories — single source for web + mobile beginning screen.
 * Selection here is the main adaptive routing decision for every flow.
 */
export const LISTING_TYPES: ListingTypeDefinition[] = [
  {
    id: "stock-lightly-modified",
    label: "Stock / Lightly Modified",
    description:
      "Stock or mostly stock, with only minor performance upgrades or cosmetic changes.",
    icon: Car,
  },
  {
    id: "modified-performance",
    label: "Modified / Performance",
    description:
      "Significantly modified, with major upgrades to the powertrain, suspension, brakes, or exterior.",
    icon: Wrench,
  },
  {
    id: "restored-restomod-custom",
    label: "Restored / Restomod / Custom",
    description:
      "Restored, modernized, or custom-built, with extensive work completed on the body, chassis, powertrain, or interior.",
    icon: History,
  },
  {
    id: "race-track-car",
    label: "Race / Track Car",
    description:
      "Purpose-built or heavily modified for racing, track use, or competition.",
    icon: Flag,
  },
];

/**
 * Shared step sequence for every Listing Builder flow.
 * Individual listing types reuse these routes.
 */
export const LISTING_STEPS: ListingStepDefinition[] = [
  {
    id: "type",
    label: "Vehicle Type",
    href: "/listing/type",
    description: "Choose the vehicle category.",
    icon: Tags,
  },
  {
    id: "identify",
    label: "Vehicle Information",
    href: "/listing/identify",
    description: "Scan, enter, or continue without a VIN.",
    icon: Car,
  },
  {
    id: "details",
    label: "Vehicle Details",
    href: "/listing/details",
    description: "Confirm and complete vehicle information.",
    icon: ClipboardList,
  },
  {
    id: "specifications",
    label: "Specifications",
    href: "/listing/specifications",
    description: "Adaptive vehicle-specific section.",
    icon: FileText,
  },
  {
    id: "history",
    label: "Condition & History",
    href: LISTING_PATHS.condition,
    description: "Condition & history.",
    icon: History,
  },
  {
    id: "photos",
    label: "Photos, Videos & Documents",
    href: "/listing/photos",
    description: "Photos, videos & documents.",
    icon: Camera,
  },
  {
    id: "notes",
    label: "Owner's Notes",
    href: "/listing/notes",
    description: "Owner notes and story.",
    icon: NotebookPen,
  },
  {
    id: "ai",
    label: "AI Description",
    href: "/listing/ai",
    description: "AI-assisted description.",
    icon: Sparkles,
  },
  {
    id: "settings",
    label: "Auction Settings",
    href: "/listing/settings",
    description: "Choose how you would like your auction to run.",
    icon: Settings2,
  },
  {
    id: "preview",
    label: "Listing Review",
    href: "/listing/preview",
    description: "Review each listing section before submit.",
    icon: Eye,
  },
  {
    id: "buyer-preview",
    label: "Buyer View Preview",
    href: "/listing/buyer-preview",
    description: "See your listing as buyers will.",
    icon: Eye,
  },
  {
    id: "review",
    label: "Submit to Carasta",
    href: "/listing/buyer-preview",
    description: "Submit from Buyer View Preview after re-validation.",
    icon: CheckCircle2,
  },
];

/** Map preview Edit actions back to listing steps. */
export const LISTING_EDIT_HREFS = {
  type: LISTING_PATHS.type,
  details: LISTING_PATHS.details,
  specifications: LISTING_PATHS.specifications,
  history: LISTING_PATHS.condition,
  photos: LISTING_PATHS.photos,
  notes: LISTING_PATHS.notes,
  ai: LISTING_PATHS.ai,
  settings: LISTING_PATHS.settings,
} as const;

/** Preview specs edit — type-aware (race → race/specifications). */
export function getListingSpecsEditHref(listingTypeId: string | null | undefined) {
  return specsEditHref(listingTypeId as Parameters<typeof specsEditHref>[0]);
}

export function getListingStepIndex(pathname: string): number {
  const stepId = resolveListingProgressStepId(pathname);
  if (!stepId) return -1;
  return LISTING_STEPS.findIndex((step) => step.id === stepId);
}

export function getListingStepByPath(pathname: string): ListingStepDefinition | undefined {
  const index = getListingStepIndex(pathname);
  return index >= 0 ? LISTING_STEPS[index] : undefined;
}

export function getAdjacentListingSteps(pathname: string): {
  previous?: ListingStepDefinition;
  current?: ListingStepDefinition;
  next?: ListingStepDefinition;
} {
  const index = getListingStepIndex(pathname);
  if (index < 0) return {};
  return {
    previous: index > 0 ? LISTING_STEPS[index - 1] : undefined,
    current: LISTING_STEPS[index],
    next: index < LISTING_STEPS.length - 1 ? LISTING_STEPS[index + 1] : undefined,
  };
}

export function getListingTypeById(id: string | null | undefined) {
  if (!id) return undefined;
  return LISTING_TYPES.find((type) => type.id === id);
}

/** Soft completion cues for preview/review UI only — not validation. */
export function getListingCompletionItems(draft: {
  listingTypeId: string | null;
  details: { year: string; make: string; model: string; vin: string };
  vehiclePhotos: unknown[];
  ownerNotes: string;
  aiDescription: string;
  saleSettings: { saleType: string; reservePrice: string };
  modificationWorkspace?: {
    entries: { completed: boolean; title: string }[];
    performanceSummary: { horsepower: string; currentEngine: string };
    restoration: { buildType: string; identityType: string };
    race: {
      competition: { competitionLevel: string; primaryDiscipline: string };
      historyEntries: unknown[];
    };
  };
}) {
  const items = [
    { id: "type", label: "Vehicle type selected", done: Boolean(draft.listingTypeId), href: "/listing/type" },
    {
      id: "details",
      label: "Vehicle details started",
      done: Boolean(draft.details.year || draft.details.make || draft.details.model),
      href: "/listing/details",
    },
    { id: "vin", label: "VIN added", done: Boolean(draft.details.vin), href: "/listing/identify" },
    { id: "photos", label: "Photos added", done: draft.vehiclePhotos.length > 0, href: "/listing/photos" },
    { id: "notes", label: "Owner notes added", done: Boolean(draft.ownerNotes.trim()), href: "/listing/notes" },
    { id: "ai", label: "AI description saved", done: Boolean(draft.aiDescription.trim()), href: "/listing/ai" },
    {
      id: "settings",
      label: "Auction settings started",
      done: Boolean(draft.saleSettings.saleType || draft.saleSettings.reservePrice),
      href: "/listing/settings",
    },
  ];

  if (draft.listingTypeId === "modified-performance" && draft.modificationWorkspace) {
    const mods = draft.modificationWorkspace;
    items.splice(3, 0, {
      id: "specs",
      label: "Build / modifications started",
      done: Boolean(
        mods.entries.some((e) => e.completed || e.title.trim()) ||
          mods.performanceSummary.horsepower ||
          mods.performanceSummary.currentEngine
      ),
      href: LISTING_PATHS.modifiedSpecs,
    });
  }

  if (draft.listingTypeId === "restored-restomod-custom" && draft.modificationWorkspace) {
    const mods = draft.modificationWorkspace;
    items.splice(3, 0, {
      id: "specs",
      label: "Restoration record started",
      done: Boolean(
        mods.restoration.buildType ||
          mods.entries.some((e) => e.completed || e.title.trim()) ||
          mods.restoration.identityType
      ),
      href: LISTING_PATHS.restoredSpecs,
    });
  }

  if (draft.listingTypeId === "race-track-car" && draft.modificationWorkspace) {
    const mods = draft.modificationWorkspace;
    items.splice(3, 0, {
      id: "specs",
      label: "Competition sheet started",
      done: Boolean(
        mods.race.competition.competitionLevel ||
          mods.race.competition.primaryDiscipline ||
          mods.race.historyEntries.length > 0 ||
          mods.entries.some((e) => e.completed || e.title.trim())
      ),
      href: LISTING_PATHS.raceSummary,
    });
  }

  return items;
}

export function getListingScore(items: { done: boolean }[]) {
  if (items.length === 0) return 0;
  return Math.round((items.filter((item) => item.done).length / items.length) * 100);
}
