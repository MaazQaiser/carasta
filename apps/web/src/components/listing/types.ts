import type { LucideIcon } from "lucide-react";

/** Shared listing categories used by every Listing Builder flow. */
export type ListingTypeId =
  | "stock-lightly-modified"
  | "modified-performance"
  | "restored-restomod-custom"
  | "race-track-car";

export interface ListingTypeDefinition {
  id: ListingTypeId;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface ListingStepDefinition {
  id: string;
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

export type ListingStepStatus = "upcoming" | "current" | "complete";

export interface ListingMediaItem {
  id: string;
  name: string;
  previewUrl?: string;
  /** UI-only progress placeholder (0–100). */
  progress?: number;
}

export interface ListingVehicleDetails {
  year: string;
  make: string;
  model: string;
  trim: string;
  mileage: string;
  exteriorColor: string;
  interiorColor: string;
  engine: string;
  transmission: string;
  drivetrain: string;
  vin: string;
}

export interface ListingConditionHistory {
  vehicleHistory: string;
  accidentHistory: string;
  titleStatus: string;
  serviceRecords: string;
  overallCondition: string;
  ownershipHistory: string;
  generalNotes: string;
}

export interface ListingSaleSettings {
  saleType: string;
  reservePrice: string;
  buyNowPrice: string;
  preferredStartDate: string;
  auctionDuration: string;
  shipping: string;
  shippingLocation: string;
}

export type MeasurementStatus =
  | "Factory Rated"
  | "Estimated"
  | "Dyno Verified"
  | "Unknown";

export type DateStatusOption =
  | "Exact Date"
  | "Approximate Date"
  | "Installed Before Current Ownership"
  | "Completed Before Current Ownership"
  | "Completed by Previous Owner"
  | "Unknown"
  | "Not Applicable";

export type WorkPerformedByOption =
  | "Current Owner"
  | "Professional Shop"
  | "Current Owner + Shop"
  | "Previous Owner"
  | "Original Builder"
  | "Factory / Manufacturer"
  | "Unknown";

export interface ModificationEntry {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  typeOfWork: string;
  partsBrand: string;
  manufacturer: string;
  specifications: string;
  workPerformedBy: string;
  shopBuilder: string;
  installationDate: string;
  dateStatus: string;
  mileage: string;
  originalPartsIncluded: string;
  photos: ListingMediaItem[];
  receipt: ListingMediaItem[];
  dynoSheet: ListingMediaItem[];
  installationInvoice: ListingMediaItem[];
  warranty: ListingMediaItem[];
  supportingDocuments: ListingMediaItem[];
  additionalNotes: string;
  completed: boolean;
}

export interface PerformanceSummary {
  currentEngine: string;
  transmission: string;
  drivetrain: string;
  horsepower: string;
  horsepowerStatus: string;
  torque: string;
  torqueStatus: string;
  fuelType: string;
  tuningPlatform: string;
  buildSummary: string;
}

export type RestorationBuildTypeId =
  | "preserved-survivor"
  | "factory-correct-restoration"
  | "restored"
  | "restomod"
  | "custom"
  | "hot-rod-street-rod";

export interface FactoryCorrectDetails {
  numbersMatchingEngine: string;
  numbersMatchingTransmission: string;
  originalEngine: string;
  originalTransmission: string;
  originalChassis: string;
  originalBodyPanels: string;
  factoryCorrectPaint: string;
  factoryCorrectInterior: string;
  factoryCorrectWheels: string;
  factoryCorrectTrim: string;
  factoryCorrectRadio: string;
  originalEquipment: string;
  periodCorrectParts: string;
  restorationLevel: string;
  completionStatus: string;
  restorationShop: string;
  builder: string;
}

export interface RestorationDocumentation {
  buildBook: ListingMediaItem[];
  receipts: ListingMediaItem[];
  invoices: ListingMediaItem[];
  restorationPhotos: ListingMediaItem[];
  factoryDocuments: ListingMediaItem[];
  certificates: ListingMediaItem[];
  historicalDocumentation: ListingMediaItem[];
}

export interface RestorationProvenance {
  previousOwners: string;
  historicalStory: string;
  awards: string;
  magazineFeatures: string;
  tvMovieAppearance: string;
  auctionHistory: string;
  specialNotes: string;
}

export interface RestorationState {
  identityType: string;
  identityValue: string;
  buildType: RestorationBuildTypeId | "";
  mileageStatus: string;
  factoryCorrect: FactoryCorrectDetails;
  documentation: RestorationDocumentation;
  provenance: RestorationProvenance;
}

export interface RaceVehicleIdentity {
  year: string;
  make: string;
  model: string;
  trim: string;
  chassisDesignation: string;
  streetBased: string;
  purposeBuilt: string;
  vin: string;
  chassisNumber: string;
  tubNumber: string;
  serialNumber: string;
  logbookNumber: string;
  builderAssignedId: string;
  noStreetVin: string;
  /** Race shop / chassis builder name. */
  builder: string;
  /** Manufacturer name (also mirrored to builderManufacturer for legacy reads). */
  manufacturer: string;
  builderManufacturer: string;
  buildYear: string;
  mileage: string;
  engineHours: string;
  chassisHours: string;
  streetLegalStatus: string;
  titleStatus: string;
}

export interface RaceCompetitionProfile {
  primaryDiscipline: string;
  secondaryDiscipline: string;
  sanctioningBody: string;
  series: string;
  competitionClass: string;
  competitionLevel: string;
  currentEligibility: string;
  logbookStatus: string;
  technicalInspection: string;
  competitionHistorySummary: string;
  notableResults: string;
  /** Freeform notes for competition profile details. */
  notes: string;
}

export interface RaceSafetyEquipment {
  rollCageType: string;
  rollCageBuilder: string;
  certificationOrganization: string;
  certificationNumber: string;
  certificationExpiration: string;
  seatManufacturer: string;
  seatCertification: string;
  harnessManufacturer: string;
  harnessCertification: string;
  windowNet: string;
  fireSuppressionSystem: string;
  fuelCell: string;
  batteryCutoff: string;
  killSwitch: string;
  towHooks: string;
  safetyNotes: string;
}

export interface RaceDocumentation {
  logbook: ListingMediaItem[];
  inspectionReports: ListingMediaItem[];
  certificationDocuments: ListingMediaItem[];
  dynoSheets: ListingMediaItem[];
  raceResults: ListingMediaItem[];
  setupSheets: ListingMediaItem[];
  dataLogs: ListingMediaItem[];
  technicalReports: ListingMediaItem[];
  photos: ListingMediaItem[];
  videos: ListingMediaItem[];
}

export interface RaceSetupInformation {
  suspensionSetup: string;
  alignment: string;
  cornerWeights: string;
  rideHeight: string;
  brakeBias: string;
  tirePressures: string;
  gearRatios: string;
  ecuCalibration: string;
  driverNotes: string;
  crewNotes: string;
}

export interface RaceHistoryEntry {
  id: string;
  event: string;
  track: string;
  date: string;
  result: string;
  className: string;
  position: string;
  fastestLap: string;
  notes: string;
  photos: ListingMediaItem[];
  expanded: boolean;
}

export interface RaceVehicleBiography {
  competitionHistory: string;
  notableResults: string;
  vehicleHistory: string;
  builderNotes: string;
  previousTeamsOrDrivers: string;
  championships: string;
  significantEvents: string;
  additionalBackground: string;
}

export interface RaceState {
  identity: RaceVehicleIdentity;
  competition: RaceCompetitionProfile;
  safety: RaceSafetyEquipment;
  documentation: RaceDocumentation;
  setup: RaceSetupInformation;
  biography: RaceVehicleBiography;
  historyEntries: RaceHistoryEntry[];
  editingHistoryId: string | null;
}

export interface ModificationWorkspaceState {
  performanceSummary: PerformanceSummary;
  restoration: RestorationState;
  race: RaceState;
  entries: ModificationEntry[];
  activeCategoryId: string;
  expandedEntryIds: string[];
  editingEntryId: string | null;
  /**
   * Stock / Lightly Modified: has the seller indicated modifications exist?
   * null = unanswered, false = factory original, true = show modification list.
   */
  hasModifications: boolean | null;
  /** Stock / Lightly Modified: factory accordion categories the seller has expanded/reviewed. */
  reviewedFactoryCategoryIds: string[];
  /** Stock / Lightly Modified: edits for factory fields that aren’t on ListingVehicleDetails. */
  factorySpecOverrides: Record<string, string>;
}

export interface ListingDraft {
  listingTypeId: ListingTypeId | null;
  vinInput: string;
  details: ListingVehicleDetails;
  condition: ListingConditionHistory;
  vehiclePhotos: ListingMediaItem[];
  modificationPhotos: ListingMediaItem[];
  documents: ListingMediaItem[];
  videos: ListingMediaItem[];
  ownerNotes: string;
  aiDescription: string;
  aiSummary: string;
  saleSettings: ListingSaleSettings;
  /** Config-driven modification workspace (Modified / Restomod / Race). */
  modificationWorkspace: ModificationWorkspaceState;
}
