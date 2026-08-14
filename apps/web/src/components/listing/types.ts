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
  /** Stable file fingerprint so the same file is not stored twice. */
  sourceKey?: string;
  /** Optional seller-provided document date — not an eligibility or “current” check. */
  documentDate?: string;
}

export interface ListingVehicleDetails {
  year: string;
  make: string;
  model: string;
  trim: string;
  mileage: string;
  /** Primary exterior color. */
  exteriorColor: string;
  /** Optional secondary / accent exterior color. */
  secondaryExteriorColor: string;
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
  /** Number of keys included with the vehicle: None | 1 | 2 | 3+ */
  numberOfKeys: string;
  /** Optional warranty notes (seller-entered). */
  warranty: string;
}

export interface ListingSaleSettings {
  saleType: string;
  reservePrice: string;
  buyNowPrice: string;
  preferredStartDate: string;
  auctionDuration: string;
  /** Shipping Available toggle: "available" | "". */
  shipping: string;
  /** Seller location (not freeform shipping terms — KeySavvy handles terms). */
  shippingLocation: string;
  /** Local Pickup Required toggle: "required" | "". */
  localPickup: string;
}

export type MeasurementStatus =
  | "Factory Rated"
  | "Estimated"
  | "Dyno Verified"
  | "Seller Reported"
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
  | "Previous Owner"
  | "Professional Shop / Builder"
  | "Other Individual"
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
  /** When the modification was completed (stock light-mod flow). */
  completedDuring: string;
  shopBuilder: string;
  installationDate: string;
  dateStatus: string;
  mileage: string;
  originalPartsIncluded: string;
  /** Restoration entries: Original to Vehicle, OEM / NOS, reproduction, etc. */
  partClassification: string;
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
  | "factory-correct-restoration"
  | "restored"
  | "restomod";

export type RestomodSubcategoryId = "custom" | "hot-rod-street-rod";

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

export type RestorationDocumentationGroupId =
  | "buildBook"
  | "receiptsAndInvoices"
  | "factoryDocuments"
  | "historicalBuildPhotos"
  | "certificates"
  | "magazineFeatures"
  | "awards"
  | "judgingSheets"
  | "other";

export interface RestorationDocumentation {
  buildBook: ListingMediaItem[];
  receiptsAndInvoices: ListingMediaItem[];
  factoryDocuments: ListingMediaItem[];
  /** Restoration/build process photos — not current-condition listing photos. */
  historicalBuildPhotos: ListingMediaItem[];
  certificates: ListingMediaItem[];
  magazineFeatures: ListingMediaItem[];
  awards: ListingMediaItem[];
  judgingSheets: ListingMediaItem[];
  other: ListingMediaItem[];
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

export type RestorationTimelineDatePrecision =
  | "Exact Date"
  | "Approximate Date"
  | "Before Current Ownership"
  | "Previous Owner"
  | "Unknown";

export interface RestorationTimelineEvent {
  id: string;
  title: string;
  dateYear: string;
  exactDate: string;
  datePrecision: RestorationTimelineDatePrecision | "";
  eventType: string;
  description: string;
  photos: ListingMediaItem[];
}

export interface RestorationState {
  identityType: string;
  identityValue: string;
  buildType: RestorationBuildTypeId | "";
  /** Only used when buildType is restomod. */
  restomodSubcategory: RestomodSubcategoryId | "";
  mileageStatus: string;
  buildStatus: string;
  completionYear: string;
  /** Optional exact date when a completion year applies. */
  completionDate: string;
  workPerformedBy: string;
  shopBuilder: string;
  buildSummary: string;
  factoryCorrect: FactoryCorrectDetails;
  documentation: RestorationDocumentation;
  provenance: RestorationProvenance;
  /** Optional restoration / build timeline. Never required to continue or submit. */
  timelineEvents: RestorationTimelineEvent[];
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
  /** Seller-reported primary use. The only race-specific marketplace filter in Phase 1. */
  primaryDiscipline: string;
  /** Required when Primary Use is Other. */
  primaryUseOther: string;
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
  /** Phase 1 Race / Track Build narrative. Factory/spec cars describe the stock configuration here. */
  buildNarrative: string;
  /** Optional. Who performed the build or preparation. */
  workPerformedBy: string;
  shopBuilder: string;
  /** Phase 1 seller-reported installed safety equipment. Optional. */
  installedSafetyEquipment: string[];
  safetyEquipmentNotes: string;
  safetyServiceDates: RaceSafetyServiceDates;
  /** Phase 1: Has this vehicle competed in organized competition? Yes / No / Unknown. */
  organizedCompetition: string;
  /** Optional narrative. Shown only when organizedCompetition is Yes. */
  competitionHistoryNarrative: string;
  /** Phase 1 selected race/track documentation types. None is exclusive. */
  documentationTypes: string[];
  documentationOther: string;
  documentationUploads: ListingMediaItem[];
  /** Phase 1 optional: Are any spares or support equipment included with the sale? Yes / No. */
  sparesIncluded: string;
  /** Required when sparesIncluded is Yes. What is included in the advertised sale. */
  sparesDescription: string;
  /** Optional known race/track issues. Shown on shared Condition & History. */
  knownRaceTrackIssues: string;
}

export interface RaceSafetyServiceDates {
  "competition-seat": string;
  harness: string;
  "fire-suppression": string;
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
  /** Detail field keys populated by VIN decode — shown as “VIN imported”, still editable. */
  vinImportedFields: (keyof ListingVehicleDetails)[];
  condition: ListingConditionHistory;
  vehiclePhotos: ListingMediaItem[];
  modificationPhotos: ListingMediaItem[];
  documents: ListingMediaItem[];
  videos: ListingMediaItem[];
  ownerNotes: string;
  aiDescription: string;
  aiSummary: string;
  saleSettings: ListingSaleSettings;
  /** Selected auction cover photo id (from general vehicle photos). */
  auctionCoverPhotoId: string | null;
  /** Config-driven modification workspace (Modified / Restomod / Race). */
  modificationWorkspace: ModificationWorkspaceState;
}
