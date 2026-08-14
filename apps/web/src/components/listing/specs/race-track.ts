import type {
  ModificationWorkspaceState,
  RaceCompetitionProfile,
  RaceState,
  SpecsFlowConfig,
} from "./types";
import {
  createEmptyPerformanceSummary,
  createEmptyRaceState,
  createEmptyRestorationState,
  RACE_ENTRY_FORM_CONFIG,
} from "./options";
import { SHARED_MODIFICATION_CATEGORIES } from "./shared-modification-categories";

/** Race / Track Car specifications & competition config. */
export const RACE_TRACK_SPECS_CONFIG: SpecsFlowConfig = {
  id: "race-track-car",
  label: "Race / Track Car",
  description:
    "Configured for competition or track-only use rather than normal road use.",
  showPerformanceSummary: false,
  entryForm: RACE_ENTRY_FORM_CONFIG,
  categories: SHARED_MODIFICATION_CATEGORIES,
};

export const FLOW4_PRIMARY_USE_COPY = {
  title: "Race / Track Use",
  question: "What is this vehicle primarily built or configured for?",
  fieldLabel: "Primary Use",
  otherLabel: "Describe the primary use",
  otherPlaceholder: "Describe how this vehicle is primarily used…",
  streetLegalHint:
    "Street-legal vehicles remain in Modified / Performance, even when used for drag racing, drifting, autocross, track days, or other motorsports.",
} as const;

export const PRIMARY_USE_OPTIONS = [
  "Road Racing",
  "Drag Racing",
  "Time Attack",
  "Drifting",
  "Autocross",
  "Rally",
  "Hill Climb",
  "Oval Racing",
  "Off-Road Racing",
  "Track Day / HPDE",
  "Other",
] as const;

export type PrimaryUseOption = (typeof PRIMARY_USE_OPTIONS)[number];

const PRIMARY_USE_OPTION_SET = new Set<string>(PRIMARY_USE_OPTIONS);

export function isPrimaryUseOther(value: string | null | undefined): boolean {
  return value === "Other" || Boolean(value && !PRIMARY_USE_OPTION_SET.has(value));
}

export function primaryUseSelection(competition: {
  primaryDiscipline?: string | null;
  primaryUseOther?: string | null;
}): { use: string; other: string } {
  const raw = competition.primaryDiscipline?.trim() ?? "";
  if (!raw) return { use: "", other: competition.primaryUseOther?.trim() ?? "" };
  if (PRIMARY_USE_OPTION_SET.has(raw)) {
    return { use: raw, other: competition.primaryUseOther?.trim() ?? "" };
  }
  return { use: "Other", other: competition.primaryUseOther?.trim() || raw };
}

export function primaryUseDisplayLabel(competition: {
  primaryDiscipline?: string | null;
  primaryUseOther?: string | null;
}): string {
  const { use, other } = primaryUseSelection(competition);
  if (use === "Other") return other ? `Other — ${other}` : "Other";
  return use;
}

export function isRacePrimaryUseComplete(
  competition: Pick<RaceCompetitionProfile, "primaryDiscipline" | "primaryUseOther"> | {
    primaryDiscipline?: string | null;
    primaryUseOther?: string | null;
  }
): boolean {
  const { use, other } = primaryUseSelection(competition);
  if (!use) return false;
  if (use === "Other") return Boolean(other);
  return true;
}

export function racePrimaryUsePatch(
  nextUse: string,
  current?: { primaryUseOther?: string | null }
): Pick<RaceCompetitionProfile, "primaryDiscipline" | "primaryUseOther"> {
  if (nextUse === "Other") {
    return { primaryDiscipline: "Other", primaryUseOther: current?.primaryUseOther ?? "" };
  }
  return { primaryDiscipline: nextUse, primaryUseOther: "" };
}

export const FLOW4_BUILD_COPY = {
  title: "Race / Track Build",
  subtext: "Tell buyers how the vehicle is currently configured for racing or track use.",
  narrativeLabel: "Tell us about the build — Required",
  narrativeHelper:
    "Include any relevant engine, drivetrain, suspension, brakes, wheels and tires, aero, roll cage, seats and harnesses, fire system, fuel system, weight reduction, electronics, or other race/track equipment.",
  narrativePlaceholder:
    "Describe the current race / track configuration. A factory or spec car can describe the stock setup here.",
  performedByLabel: "Who performed the build or preparation? — Optional",
} as const;

export const RACE_BUILD_PERFORMED_BY_OPTIONS = [
  "Current Owner",
  "Previous Owner",
  "Professional Shop / Builder",
  "Multiple / Combination",
  "Unknown",
] as const;

const RACE_BUILD_SHOP_VALUES = new Set([
  "Professional Shop / Builder",
  "Multiple / Combination",
  "Professional Shop",
]);

export function shouldShowRaceBuildShopBuilder(
  workPerformedBy: string | null | undefined
): boolean {
  return Boolean(workPerformedBy && RACE_BUILD_SHOP_VALUES.has(workPerformedBy));
}

export function isRaceBuildComplete(race: {
  buildNarrative?: string | null;
}): boolean {
  return Boolean(race.buildNarrative?.trim());
}

export function raceBuildPerformedByPatch(
  race: { workPerformedBy?: string; shopBuilder?: string },
  workPerformedBy: string
): Pick<RaceState, "workPerformedBy" | "shopBuilder"> {
  return {
    workPerformedBy,
    shopBuilder: shouldShowRaceBuildShopBuilder(workPerformedBy) ? race.shopBuilder ?? "" : "",
  };
}

export const FLOW4_SAFETY_COPY = {
  title: "Safety Equipment",
  subtext: "Select any equipment currently installed.",
  selectLabel: "Select any equipment currently installed",
  notesLabel: "Safety Equipment Notes — Optional",
  notesPlaceholder: "Optional notes about installed safety equipment…",
  dateLabel: "Expiration or service date — Optional",
  otherHint: "Describe other equipment in Safety Equipment Notes.",
  disclaimer:
    "Seller-reported only. This does not mean the vehicle is safe, compliant, eligible, or race-ready.",
} as const;

export const SAFETY_EQUIPMENT_OPTIONS = [
  { id: "roll-cage", label: "Roll Cage" },
  { id: "competition-seat", label: "Competition Seat" },
  { id: "harness", label: "Harness" },
  { id: "fire-suppression", label: "Fire Suppression System" },
  { id: "fuel-cell", label: "Fuel Cell" },
  { id: "window-net", label: "Window Net" },
  { id: "kill-switch", label: "Kill Switch / Battery Cutoff" },
  { id: "other", label: "Other" },
] as const;

export type SafetyEquipmentOptionId = (typeof SAFETY_EQUIPMENT_OPTIONS)[number]["id"];

export const SAFETY_EQUIPMENT_DATE_IDS = [
  "competition-seat",
  "harness",
  "fire-suppression",
] as const;

export type SafetyEquipmentDateId = (typeof SAFETY_EQUIPMENT_DATE_IDS)[number];

const SAFETY_DATE_ID_SET = new Set<string>(SAFETY_EQUIPMENT_DATE_IDS);

export function isSafetyEquipmentDateId(id: string): id is SafetyEquipmentDateId {
  return SAFETY_DATE_ID_SET.has(id);
}

export function installedSafetyLabels(race: {
  installedSafetyEquipment?: string[] | null;
}): string[] {
  const selected = new Set(race.installedSafetyEquipment ?? []);
  return SAFETY_EQUIPMENT_OPTIONS.filter((option) => selected.has(option.id)).map(
    (option) => option.label
  );
}

export function toggleInstalledSafetyEquipment(
  race: Pick<RaceState, "installedSafetyEquipment" | "safetyServiceDates">,
  id: SafetyEquipmentOptionId
): Pick<RaceState, "installedSafetyEquipment" | "safetyServiceDates"> {
  const selected = race.installedSafetyEquipment ?? [];
  const isOn = selected.includes(id);
  const installedSafetyEquipment = isOn ? selected.filter((item) => item !== id) : [...selected, id];
  const safetyServiceDates = { ...race.safetyServiceDates };
  if (isOn && isSafetyEquipmentDateId(id)) {
    safetyServiceDates[id] = "";
  }
  return { installedSafetyEquipment, safetyServiceDates };
}

export function patchSafetyServiceDate(
  race: Pick<RaceState, "safetyServiceDates">,
  id: SafetyEquipmentDateId,
  value: string
): Pick<RaceState, "safetyServiceDates"> {
  return {
    safetyServiceDates: {
      ...race.safetyServiceDates,
      [id]: value,
    },
  };
}

export const FLOW4_COMPETITION_HISTORY_COPY = {
  title: "Competition History",
  question: "Has this vehicle competed in organized competition? — Required",
  historyLabel: "Competition History — Optional",
  historyPrompt:
    "Tell us about the vehicle’s racing history. Include any known sanctioning body, series, class, events, results, previous teams, owners, drivers, or other notable competition history.",
  historyPlaceholder: "Seller-reported competition history…",
  disclaimer:
    "Race results and historical claims are seller-reported unless Carasta reviews supporting records.",
} as const;

export const ORGANIZED_COMPETITION_OPTIONS = ["Yes", "No", "Unknown"] as const;

export type OrganizedCompetitionOption = (typeof ORGANIZED_COMPETITION_OPTIONS)[number];

export function shouldShowCompetitionHistoryNarrative(
  organizedCompetition: string | null | undefined
): boolean {
  return organizedCompetition === "Yes";
}

export function raceOrganizedCompetitionPatch(
  race: Pick<RaceState, "competitionHistoryNarrative">,
  organizedCompetition: OrganizedCompetitionOption
): Pick<RaceState, "organizedCompetition" | "competitionHistoryNarrative"> {
  return {
    organizedCompetition,
    competitionHistoryNarrative:
      organizedCompetition === "Yes" ? race.competitionHistoryNarrative ?? "" : "",
  };
}

export function isRaceCompetitionHistoryComplete(race: {
  organizedCompetition?: string | null;
}): boolean {
  return ORGANIZED_COMPETITION_OPTIONS.includes(
    (race.organizedCompetition ?? "") as OrganizedCompetitionOption
  );
}

export const FLOW4_DOCUMENTATION_COPY = {
  title: "Race / Track Documentation",
  question: "Do you have race or track documentation for this vehicle?",
  requiredMark: "Required",
  selectLabel: "Select any that apply:",
  otherLabel: "Describe other documentation",
  otherPlaceholder: "Short description of the other documentation",
  uploadLabel: "Upload Documents — Optional",
  uploadHelper:
    "Files appear in Photos, Videos & Documents automatically. You don’t need to upload the same file twice.",
  dateLabel: "Date",
  dateHint: "Optional. The date on the document, if you have it — not whether it is current.",
  disclaimer:
    "We store the documents and dates you provide. We don’t ask whether a logbook or technical inspection is current — buyers determine eligibility.",
} as const;

export const RACE_DOCUMENTATION_OPTIONS = [
  { id: "competition-logbook", label: "Competition Logbook" },
  { id: "technical-inspection", label: "Technical Inspection Records" },
  { id: "build-sheets", label: "Build Sheets / Receipts" },
  { id: "engine-service", label: "Engine / Drivetrain Service Records" },
  { id: "race-event-records", label: "Race / Event Records" },
  { id: "dyno-sheets", label: "Dyno Sheets" },
  { id: "setup-sheets", label: "Setup Sheets" },
  { id: "other", label: "Other" },
  { id: "none", label: "None" },
] as const;

export type RaceDocumentationOptionId = (typeof RACE_DOCUMENTATION_OPTIONS)[number]["id"];

export const RACE_DOCUMENTATION_NONE_ID = "none" as const;
export const RACE_DOCUMENTATION_OTHER_ID = "other" as const;

export function documentationTypeLabels(ids: string[] | null | undefined): string[] {
  const selected = new Set(ids ?? []);
  return RACE_DOCUMENTATION_OPTIONS.filter((option) => selected.has(option.id)).map(
    (option) => option.label
  );
}

export function shouldShowDocumentationOther(types: string[] | null | undefined): boolean {
  return (types ?? []).includes(RACE_DOCUMENTATION_OTHER_ID);
}

export function shouldShowDocumentationUpload(types: string[] | null | undefined): boolean {
  const selected = types ?? [];
  return selected.length > 0 && !selected.includes(RACE_DOCUMENTATION_NONE_ID);
}

export function toggleRaceDocumentationType(
  race: Pick<RaceState, "documentationTypes" | "documentationOther">,
  id: RaceDocumentationOptionId
): Pick<RaceState, "documentationTypes" | "documentationOther"> {
  const current = race.documentationTypes ?? [];
  if (id === RACE_DOCUMENTATION_NONE_ID) {
    return {
      documentationTypes: current.includes(RACE_DOCUMENTATION_NONE_ID) ? [] : [RACE_DOCUMENTATION_NONE_ID],
      documentationOther: "",
    };
  }

  const withoutNone = current.filter((item) => item !== RACE_DOCUMENTATION_NONE_ID);
  const next = withoutNone.includes(id)
    ? withoutNone.filter((item) => item !== id)
    : [...withoutNone, id];
  return {
    documentationTypes: next,
    documentationOther: next.includes(RACE_DOCUMENTATION_OTHER_ID)
      ? race.documentationOther ?? ""
      : "",
  };
}

export function isRaceDocumentationComplete(race: {
  documentationTypes?: string[] | null;
  documentationOther?: string | null;
}): boolean {
  const types = race.documentationTypes ?? [];
  if (types.length === 0) return false;
  if (types.includes(RACE_DOCUMENTATION_OTHER_ID) && !race.documentationOther?.trim()) {
    return false;
  }
  return true;
}

export const FLOW4_SPARES_COPY = {
  title: "Spares & Support.",
  subtext: "Identify race support equipment and spare components included.",
  question: "Are any spares or support equipment included with the sale?",
  yesHint: "Included with the advertised sale",
  noHint: "Nothing extra transfers with the sale",
  descriptionLabel: "Spares / Support Included",
  descriptionPrompt:
    "Describe any spare wheels, tires, body panels, mechanical parts, electronics, tools, pit equipment, trailer, or other support equipment included with the sale.",
  saleHint:
    "Describe only what is included in the advertised sale, not equipment you own but plan to retain.",
} as const;

export const SPARES_INCLUDED_OPTIONS = ["Yes", "No"] as const;

export type SparesIncludedOption = (typeof SPARES_INCLUDED_OPTIONS)[number];

export function shouldShowSparesDescription(sparesIncluded: string | null | undefined): boolean {
  return sparesIncluded === "Yes";
}

export function raceSparesIncludedPatch(
  race: Pick<RaceState, "sparesIncluded" | "sparesDescription">,
  answer: SparesIncludedOption
): Pick<RaceState, "sparesIncluded" | "sparesDescription"> {
  if (race.sparesIncluded === answer) {
    return { sparesIncluded: "", sparesDescription: "" };
  }
  return {
    sparesIncluded: answer,
    sparesDescription: answer === "Yes" ? race.sparesDescription ?? "" : "",
  };
}

/** Optional screen: unanswered or No can continue; Yes requires a description. */
export function isRaceSparesComplete(race: {
  sparesIncluded?: string | null;
  sparesDescription?: string | null;
}): boolean {
  if (race.sparesIncluded !== "Yes") return true;
  return Boolean(race.sparesDescription?.trim());
}

export const FLOW4_KNOWN_ISSUES_COPY = {
  title: "Known Race / Track Issues",
  label: "Known Race / Track Issues — Optional",
  prompt:
    "Disclose any known mechanical problems, crash or contact damage, repairs, safety-equipment concerns, or other race/track issues a buyer should know about.",
} as const;

export const FLOW4_RACE_ACCIDENT_PLACEHOLDER =
  "Describe race contact, crash damage, related repairs, or other accidents. Do not leave race damage only in street-car accident wording.";

export function createRaceTrackWorkspace(): ModificationWorkspaceState {
  const firstCategoryId =
    RACE_TRACK_SPECS_CONFIG.categories[0]?.id ?? "engine-performance";
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
