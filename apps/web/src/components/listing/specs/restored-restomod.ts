import {
  Cog,
  Gauge,
  Disc3,
  CircleStop,
  CircleDot,
  Paintbrush,
  Armchair,
  Speaker,
  Shield,
  Factory,
  MoreHorizontal,
  Car,
} from "lucide-react";
import type {
  FactoryCorrectDetails,
  ListingMediaItem,
  ModificationWorkspaceState,
  RestorationBuildTypeId,
  RestorationDocumentation,
  RestorationDocumentationGroupId,
  RestorationState,
  RestorationTimelineEvent,
  RestomodSubcategoryId,
} from "../types";
import type {
  RestorationBuildTypeOption,
  RestomodSubcategoryOption,
  SpecsCategoryDefinition,
  SpecsFlowConfig,
} from "./types";
import {
  createEmptyPerformanceSummary,
  createEmptyRestorationState,
  createEmptyRaceState,
  RESTORATION_ENTRY_FORM_CONFIG,
  shouldShowShopBuilder,
  shouldShowCompletionYear,
} from "./options";
import { normalizeModificationCategoryId } from "./shared-modification-categories";

export const RESTORATION_BUILD_TYPES: RestorationBuildTypeOption[] = [
  {
    id: "factory-correct-restoration",
    label: "Factory-Correct Restoration",
    description:
      "Restored with the goal of matching the vehicle’s original/factory configuration.",
  },
  {
    id: "restored",
    label: "Restored",
    description:
      "Substantially refurbished or rebuilt, but not necessarily to factory specifications. But may include some original factory options.",
  },
  {
    id: "restomod",
    label: "Restomod",
    description:
      "Classic vehicle restored while also receiving modern mechanical, performance, comfort, or technology upgrades.",
  },
];

export const RESTOMODE_SUBCATEGORIES: RestomodSubcategoryOption[] = [
  {
    id: "custom",
    label: "Custom",
    description:
      "Significantly redesigned, fabricated, or reconfigured beyond the original factory specification.",
  },
  {
    id: "hot-rod-street-rod",
    label: "Hot Rod / Street Rod",
    description:
      "Traditional custom build with major engine, chassis, suspension, body, or drivetrain changes.",
  },
];

export const FLOW3_ORIGINALITY_COPY = {
  title: "Originality & Factory Correctness.",
  description:
    "Tell us which major components remain original or match the vehicle’s factory configuration.",
  sectionTitle: "Numbers Matching & Originality",
  scoreLabel: "Seller-reported originality",
} as const;

export const ORIGINALITY_ANSWER_OPTIONS = ["Yes", "No", "Unknown"] as const;
export type OriginalityAnswer = (typeof ORIGINALITY_ANSWER_OPTIONS)[number];

export const ORIGINALITY_FACTORY_CORRECTNESS_FIELDS: {
  key: keyof FactoryCorrectDetails;
  label: string;
}[] = [
  { key: "originalEngine", label: "Original engine still installed?" },
  {
    key: "numbersMatchingEngine",
    label: "Engine numbers match the vehicle’s factory identification records?",
  },
  { key: "originalTransmission", label: "Original transmission still installed?" },
  {
    key: "numbersMatchingTransmission",
    label: "Transmission numbers match the vehicle’s factory identification records?",
  },
  { key: "originalChassis", label: "Original chassis / frame" },
  { key: "originalBodyPanels", label: "Original body panels" },
  { key: "factoryCorrectPaint", label: "Factory-correct exterior color" },
  { key: "factoryCorrectInterior", label: "Factory-correct interior configuration" },
  { key: "factoryCorrectWheels", label: "Factory-correct wheels" },
  { key: "factoryCorrectTrim", label: "Factory-correct trim" },
  { key: "factoryCorrectRadio", label: "Factory-correct radio" },
  { key: "originalEquipment", label: "Factory-correct equipment" },
];

export const FLOW3_BUILD_RESTORATION_COPY = {
  title: "Build & Restoration",
  description:
    "Document all custom fabrications, chassis upgrades and cosmetic restorations.",
  emptyCategory: "No entries in this category yet. Entries are optional.",
  addEntry: "Add Restoration Entry",
  originalityScoreLabel: "Seller-reported originality",
  originalityScoreHint:
    "Seller answers are seller-reported. A Yes answer is not verified.",
} as const;

export const FLOW3_SPECS_COMPLETED_COPY = {
  bannerTitle: "Specs Completed",
  bannerSubtitle: "All required vehicle details are filled",
  buildSummaryHeading: "Build Summary",
  emptyBuildSummary: "No build summary added.",
  confirmContinue: "Confirm & Continue",
} as const;

export const FLOW3_DOCUMENTATION_COPY = {
  title: "Documentation",
  subtext: "Upload receipts, build books, historical photos, and certificates.",
  add: "Add",
  emptyGroup: "No files in this group yet.",
  historicalHint:
    "These photos document the restoration/build process and stay separate from listing photos.",
  totalBanner: (count: number) =>
    count === 1 ? "1 File uploaded in total" : `${count} Files uploaded in total`,
} as const;

export const FLOW3_DOCUMENTATION_GROUPS: {
  id: RestorationDocumentationGroupId;
  label: string;
  accept: string;
  image?: boolean;
}[] = [
  { id: "buildBook", label: "Build Book", accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg" },
  {
    id: "receiptsAndInvoices",
    label: "Receipts & Invoices",
    accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg",
  },
  {
    id: "factoryDocuments",
    label: "Factory Documentation",
    accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg",
  },
  {
    id: "historicalBuildPhotos",
    label: "Historical / Build Photos",
    accept: "image/*",
    image: true,
  },
  { id: "certificates", label: "Certificates", accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg" },
  {
    id: "magazineFeatures",
    label: "Magazine Features",
    accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg",
  },
  { id: "awards", label: "Awards", accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg" },
  { id: "judgingSheets", label: "Judging Sheets", accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg" },
  { id: "other", label: "Other", accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg" },
];

function mergeDocumentationItems(...lists: (ListingMediaItem[] | undefined)[]): ListingMediaItem[] {
  const seen = new Set<string>();
  const next: ListingMediaItem[] = [];
  for (const list of lists) {
    for (const item of list ?? []) {
      if (!item?.id || seen.has(item.id)) continue;
      seen.add(item.id);
      next.push(item);
    }
  }
  return next;
}

type LegacyRestorationDocumentation = Partial<RestorationDocumentation> & {
  receipts?: ListingMediaItem[];
  invoices?: ListingMediaItem[];
  restorationPhotos?: ListingMediaItem[];
  historicalDocumentation?: ListingMediaItem[];
};

export function normalizeRestorationDocumentation(
  docs?: LegacyRestorationDocumentation | null
): RestorationDocumentation {
  const source = docs ?? {};
  return {
    buildBook: source.buildBook ?? [],
    receiptsAndInvoices: mergeDocumentationItems(
      source.receiptsAndInvoices,
      source.receipts,
      source.invoices
    ),
    factoryDocuments: source.factoryDocuments ?? [],
    historicalBuildPhotos: mergeDocumentationItems(
      source.historicalBuildPhotos,
      source.restorationPhotos
    ),
    certificates: source.certificates ?? [],
    magazineFeatures: source.magazineFeatures ?? [],
    awards: source.awards ?? [],
    judgingSheets: source.judgingSheets ?? [],
    other: mergeDocumentationItems(source.other, source.historicalDocumentation),
  };
}

export const FLOW3_TIMELINE_COPY = {
  title: "Restoration Timeline",
  subtext: "Document the key dates, milestones, and restoration events of your vehicle.",
  addEvent: "+ Add Event",
  saveEvent: "Save Event",
  cancel: "Cancel",
  deleteEvent: "Delete",
  empty: "No timeline events yet.",
} as const;

export const RESTORATION_TIMELINE_DATE_PRECISION_OPTIONS = [
  "Exact Date",
  "Approximate Date",
  "Before Current Ownership",
  "Previous Owner",
  "Unknown",
] as const;

export const RESTORATION_TIMELINE_EVENT_TYPES = [
  "Original Purchase",
  "Discovery",
  "Ownership Change",
  "Restoration Started",
  "Mechanical Work",
  "Engine Swap",
  "Paint & Body",
  "Interior",
  "Completion",
  "Other",
] as const;

export function normalizeRestorationTimelineEvents(
  events?: RestorationTimelineEvent[] | null
): RestorationTimelineEvent[] {
  if (!Array.isArray(events)) return [];
  return events.map((event) => ({
    id: event.id || `timeline-${Math.random().toString(36).slice(2, 9)}`,
    title: event.title ?? "",
    dateYear: event.dateYear ?? "",
    exactDate: event.exactDate ?? "",
    datePrecision: event.datePrecision ?? "",
    eventType: event.eventType ?? "",
    description: event.description ?? "",
    photos: event.photos ?? [],
  }));
}

export function restorationTimelineEventHeading(event: RestorationTimelineEvent): string {
  const year =
    event.dateYear.trim() ||
    (event.exactDate.match(/^(\d{4})/)?.[1] ?? "");
  const title = event.title.trim() || event.eventType.trim() || "Untitled event";
  return year ? `${year} ${title}` : title;
}

export function sortRestorationTimelineEvents(
  events: RestorationTimelineEvent[]
): RestorationTimelineEvent[] {
  return [...events].sort((a, b) => {
    const yearA = Number(a.dateYear || a.exactDate.slice(0, 4) || 0);
    const yearB = Number(b.dateYear || b.exactDate.slice(0, 4) || 0);
    if (yearA !== yearB) return yearA - yearB;
    return (a.exactDate || "").localeCompare(b.exactDate || "");
  });
}

export const RESTORATION_BUILD_CATEGORIES: SpecsCategoryDefinition[] = [
  {
    id: "body-chassis",
    label: "Body / Chassis",
    description: "Body structure, chassis, and fabrication",
    icon: Car,
  },
  {
    id: "engine-performance",
    label: "Engine & Performance",
    description: "Engine, induction, exhaust, and tuning",
    icon: Cog,
  },
  {
    id: "transmission-drivetrain",
    label: "Transmission & Drivetrain",
    description: "Gearbox, differential, axles, and driveline",
    icon: Gauge,
  },
  {
    id: "suspension-handling",
    label: "Suspension & Handling",
    description: "Suspension, steering, and chassis dynamics",
    icon: Disc3,
  },
  {
    id: "brakes",
    label: "Brakes",
    description: "Brake system and cooling",
    icon: CircleStop,
  },
  {
    id: "wheels-tires",
    label: "Wheels & Tires",
    description: "Wheels, tires, and fitment",
    icon: CircleDot,
  },
  {
    id: "exterior-paint-trim",
    label: "Exterior / Paint & Trim",
    description: "Paint, bodywork, and exterior trim",
    icon: Paintbrush,
  },
  {
    id: "interior",
    label: "Interior",
    description: "Cabin, seats, and interior trim",
    icon: Armchair,
  },
  {
    id: "electronics-audio",
    label: "Electronics & Audio",
    description: "Electronics, gauges, and audio",
    icon: Speaker,
  },
  {
    id: "safety-equipment",
    label: "Safety Equipment",
    description: "Safety systems and equipment",
    icon: Shield,
  },
  {
    id: "factory-equipment",
    label: "Factory Equipment",
    description: "Original factory packages and equipment",
    icon: Factory,
  },
  {
    id: "other",
    label: "Other",
    description: "Anything that doesn’t fit above",
    icon: MoreHorizontal,
  },
];

const RESTORATION_BUILD_CATEGORY_IDS = RESTORATION_BUILD_CATEGORIES.map(
  (category) => category.id
);

const RESTORATION_CATEGORY_ALIASES: Record<string, string> = {
  "build-restoration": "body-chassis",
  "chassis-structure": "body-chassis",
  "exterior-aero": "exterior-paint-trim",
  "exterior-body-paint": "exterior-paint-trim",
  "aerodynamics-bodywork": "exterior-paint-trim",
  "original-factory-equipment": "factory-equipment",
  "factory-equipment": "factory-equipment",
};

export function normalizeRestorationCategoryId(id: string | null | undefined): string {
  const raw = id ?? "";
  if (RESTORATION_BUILD_CATEGORY_IDS.includes(raw)) return raw;
  if (RESTORATION_CATEGORY_ALIASES[raw]) return RESTORATION_CATEGORY_ALIASES[raw];
  const shared = normalizeModificationCategoryId(raw);
  if (shared === "exterior-aero") return "exterior-paint-trim";
  if (RESTORATION_BUILD_CATEGORY_IDS.includes(shared)) return shared;
  return "other";
}

export function normalizeRestorationEntries<T extends { categoryId: string }>(entries: T[]): T[] {
  return entries.map((entry) => ({
    ...entry,
    categoryId: normalizeRestorationCategoryId(entry.categoryId),
  }));
}

/** Part Classification is optional and most useful on factory-correct and restored builds. */
export function shouldShowPartClassification(buildType?: string | null): boolean {
  const normalized = normalizeRestorationBuild({ buildType }).buildType;
  return normalized === "factory-correct-restoration" || normalized === "restored";
}

/** Factory Equipment is relevant for factory-correct and restored builds, not restomods. */
export function getRestorationBuildCategories(
  buildType?: string | null
): SpecsCategoryDefinition[] {
  if (isRestomodBuild(buildType)) {
    return RESTORATION_BUILD_CATEGORIES.filter((category) => category.id !== "factory-equipment");
  }
  return RESTORATION_BUILD_CATEGORIES;
}

export function sellerReportedOriginality(factoryCorrect: FactoryCorrectDetails): {
  yesCount: number;
  total: number;
  answered: number;
  label: string;
} {
  const total = ORIGINALITY_FACTORY_CORRECTNESS_FIELDS.length;
  const answered = ORIGINALITY_FACTORY_CORRECTNESS_FIELDS.filter((field) =>
    ORIGINALITY_ANSWER_OPTIONS.includes(
      (factoryCorrect[field.key] ?? "") as (typeof ORIGINALITY_ANSWER_OPTIONS)[number]
    )
  ).length;
  const yesCount = ORIGINALITY_FACTORY_CORRECTNESS_FIELDS.filter(
    (field) => factoryCorrect[field.key] === "Yes"
  ).length;
  return {
    yesCount,
    total,
    answered,
    label: FLOW3_ORIGINALITY_COPY.scoreLabel,
  };
}

export function isFactoryCorrectOriginalityComplete(
  factoryCorrect: FactoryCorrectDetails
): boolean {
  return ORIGINALITY_FACTORY_CORRECTNESS_FIELDS.every((field) =>
    ORIGINALITY_ANSWER_OPTIONS.includes(
      (factoryCorrect[field.key] ?? "") as (typeof ORIGINALITY_ANSWER_OPTIONS)[number]
    )
  );
}

export const FLOW3_BUILD_OVERVIEW_COPY = {
  title: "Build Overview",
  description:
    "Shared start for Restored / Restomod listings. Choose build type, status, and who performed the work.",
  survivorHint:
    "Preserved / Survivor vehicles belong in Stock / Lightly Modified — a survivor is valuable because it has not been restored.",
  restomodSubcategoryLabel: "Restomod Subcategory",
  restomodSubcategoryHint:
    "Optional. Choose Custom or Hot Rod / Street Rod if the build goes beyond a typical restomod.",
  completionYearHint: "Shown for completed, in-progress, and partial builds. Exact date is optional.",
  shopBuilderHint: "Shown because work was performed by a professional shop or builder.",
  buildSummaryPlaceholder: "Short narrative describing the restoration or build…",
} as const;

export type Flow3AdaptiveSectionId =
  | "originality"
  | "restoration-scope"
  | "build-restoration"
  | "documentation"
  | "timeline"
  | "build-summary";

export interface Flow3AdaptiveSection {
  id: Flow3AdaptiveSectionId;
  label: string;
  optional?: boolean;
}

const FLOW3_SHARED_AFTER_ORIGINALITY: Flow3AdaptiveSection[] = [
  { id: "build-restoration", label: "Build & Restoration" },
  { id: "documentation", label: "Documentation" },
  { id: "timeline", label: "Restoration Timeline", optional: true },
  { id: "build-summary", label: "Build Summary" },
];

/** Next screens inside Flow #3 after Build Overview, by canonical build type. */
export function flow3AdaptiveSections(
  buildType: string | null | undefined,
  subcategory?: string | null
): Flow3AdaptiveSection[] {
  const normalized = normalizeRestorationBuild({
    buildType,
    restomodSubcategory: subcategory,
  }).buildType;
  if (normalized === "factory-correct-restoration") {
    return [
      { id: "originality", label: "Originality & Factory Correctness" },
      ...FLOW3_SHARED_AFTER_ORIGINALITY,
    ];
  }
  if (normalized === "restored") {
    return [
      {
        id: "restoration-scope",
        label: "Originality & Factory Correctness — Restoration Scope",
      },
      ...FLOW3_SHARED_AFTER_ORIGINALITY,
    ];
  }
  return FLOW3_SHARED_AFTER_ORIGINALITY;
}

export function flow3ProfileSections(
  buildType: string | null | undefined,
  subcategory?: string | null
): Flow3AdaptiveSection[] {
  return flow3AdaptiveSections(buildType, subcategory).filter(
    (section) =>
      section.id !== "build-restoration" &&
      section.id !== "build-summary" &&
      section.id !== "timeline"
  );
}

export function isFlow3BuildOverviewComplete(restoration: {
  buildType?: string | null;
  mileageStatus?: string | null;
  buildStatus?: string | null;
  workPerformedBy?: string | null;
}): boolean {
  return Boolean(
    restoration.buildType &&
      restoration.mileageStatus &&
      restoration.buildStatus &&
      restoration.workPerformedBy
  );
}

/** Restored / Restomod / Custom specifications config. */
export const RESTORED_RESTOMODE_SPECS_CONFIG: SpecsFlowConfig = {
  id: "restored-restomod-custom",
  label: "Restored / Restomod / Custom",
  description:
    "Build a restoration record that adapts to the selected build type — factory-correct, restored, or restomod.",
  showPerformanceSummary: false,
  entryForm: RESTORATION_ENTRY_FORM_CONFIG,
  categories: RESTORATION_BUILD_CATEGORIES,
};

export function createRestoredRestomodWorkspace(): ModificationWorkspaceState {
  const firstCategoryId =
    RESTORED_RESTOMODE_SPECS_CONFIG.categories[0]?.id ?? "body-chassis";
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

export function isRestomodBuild(buildType: string | null | undefined): boolean {
  return (
    buildType === "restomod" ||
    buildType === "custom" ||
    buildType === "hot-rod-street-rod"
  );
}

export function normalizeRestorationBuild(restoration: {
  buildType?: string | null;
  restomodSubcategory?: string | null;
}): {
  buildType: RestorationBuildTypeId | "";
  restomodSubcategory: RestomodSubcategoryId | "";
  rerouteToStock: boolean;
} {
  const id = restoration.buildType ?? "";
  if (id === "preserved-survivor") {
    return { buildType: "", restomodSubcategory: "", rerouteToStock: true };
  }
  if (id === "custom") {
    return { buildType: "restomod", restomodSubcategory: "custom", rerouteToStock: false };
  }
  if (id === "hot-rod-street-rod") {
    return {
      buildType: "restomod",
      restomodSubcategory: "hot-rod-street-rod",
      rerouteToStock: false,
    };
  }
  if (id === "restomod") {
    const sub =
      restoration.restomodSubcategory === "custom" ||
      restoration.restomodSubcategory === "hot-rod-street-rod"
        ? restoration.restomodSubcategory
        : "";
    return { buildType: "restomod", restomodSubcategory: sub, rerouteToStock: false };
  }
  if (id === "factory-correct-restoration" || id === "restored") {
    return { buildType: id, restomodSubcategory: "", rerouteToStock: false };
  }
  return { buildType: "", restomodSubcategory: "", rerouteToStock: false };
}

export function restorationBuildTypePatch(
  current: RestorationState,
  buildType: RestorationBuildTypeId
): Partial<RestorationState> {
  return {
    buildType,
    restomodSubcategory: buildType === "restomod" ? current.restomodSubcategory : "",
  };
}

export function restorationBuildStatusPatch(
  current: RestorationState,
  buildStatus: string
): Partial<RestorationState> {
  const keepDates = shouldShowCompletionYear(buildStatus);
  return {
    buildStatus,
    completionYear: keepDates ? current.completionYear : "",
    completionDate: keepDates ? current.completionDate : "",
  };
}

export function restorationWorkPerformedByPatch(
  current: RestorationState,
  workPerformedBy: string
): Partial<RestorationState> {
  const showShop = shouldShowShopBuilder(workPerformedBy);
  return {
    workPerformedBy,
    shopBuilder: showShop ? current.shopBuilder : "",
    factoryCorrect: {
      ...current.factoryCorrect,
      restorationShop: showShop ? current.factoryCorrect.restorationShop : "",
      builder: showShop ? current.factoryCorrect.builder : "",
    },
  };
}

export function getRestomodSubcategoryLabel(id: string | null | undefined) {
  if (!id) return undefined;
  return RESTOMODE_SUBCATEGORIES.find((item) => item.id === id)?.label;
}

export function getRestorationBuildTypeLabel(
  buildType: string | null | undefined,
  subcategory?: string | null
) {
  if (!buildType) return undefined;
  const normalized = normalizeRestorationBuild({
    buildType,
    restomodSubcategory: subcategory,
  });
  if (normalized.rerouteToStock) return "Preserved / Survivor";
  const typeLabel =
    RESTORATION_BUILD_TYPES.find((type) => type.id === normalized.buildType)?.label ??
    buildType;
  const subLabel = getRestomodSubcategoryLabel(normalized.restomodSubcategory);
  return subLabel ? `${typeLabel} · ${subLabel}` : typeLabel;
}
