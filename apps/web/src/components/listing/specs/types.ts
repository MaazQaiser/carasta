import type { LucideIcon } from "lucide-react";
import type {
  ModificationEntry,
  ModificationWorkspaceState,
  RestorationBuildTypeId,
} from "../types";

export type {
  MeasurementStatus,
  DateStatusOption,
  WorkPerformedByOption,
  ModificationEntry,
  PerformanceSummary,
  ModificationWorkspaceState,
  RestorationBuildTypeId,
  FactoryCorrectDetails,
  RestorationDocumentation,
  RestorationProvenance,
  RestorationState,
  RaceVehicleIdentity,
  RaceCompetitionProfile,
  RaceSafetyEquipment,
  RaceDocumentation,
  RaceSetupInformation,
  RaceHistoryEntry,
  RaceState,
} from "../types";

export interface SpecsCategoryDefinition {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

export type EntryMediaKey = keyof Pick<
  ModificationEntry,
  | "photos"
  | "receipt"
  | "dynoSheet"
  | "installationInvoice"
  | "warranty"
  | "supportingDocuments"
>;

export interface EntryDocumentSlotConfig {
  key: EntryMediaKey;
  title: string;
  description: string;
  accept?: string;
  variant?: "image" | "file" | "video";
}

/** Per-flow labels / options for the shared modification entry form. */
export interface EntryFormConfig {
  entryTitleLabel?: string;
  typeOfWorkLabel?: string;
  typeOfWorkPlaceholder?: string;
  /** When set, Type of Work renders as a dropdown. */
  typeOfWorkOptions?: string[];
  partsBrandLabel?: string;
  manufacturerLabel?: string;
  /** Hide manufacturer field (stock flow uses Brand / Parts only). */
  hideManufacturer?: boolean;
  /** Hide free-text specifications field. */
  hideSpecifications?: boolean;
  shopBuilderLabel?: string;
  workPerformedByLabel?: string;
  /** When true, Work Performed By renders as a free-text field (e.g. Builder). */
  workPerformedByAsText?: boolean;
  /** Override default work-performed-by options. */
  workPerformedByOptions?: string[];
  installationDateLabel?: string;
  dateStatusOptions?: string[];
  /** When true, date picker only shows if date status is Exact Date. */
  gateDatePickerOnExact?: boolean;
  documentSlots?: EntryDocumentSlotConfig[];
  showOriginalPartsIncluded?: boolean;
  saveButtonLabel?: string;
  notesLabel?: string;
  notesPlaceholder?: string;
  descriptionPlaceholder?: string;
}

export interface SpecsFlowConfig {
  id: string;
  label: string;
  description: string;
  categories: SpecsCategoryDefinition[];
  showPerformanceSummary: boolean;
  entryForm?: EntryFormConfig;
}

export interface RestorationBuildTypeOption {
  id: RestorationBuildTypeId;
  label: string;
  description: string;
}

export type SpecsModificationEntry = ModificationEntry;
export type SpecsWorkspaceState = ModificationWorkspaceState;
