import type {
  DateStatusOption,
  MeasurementStatus,
  ModificationEntry,
  PerformanceSummary,
  RaceHistoryEntry,
  RaceState,
  RestorationState,
  RestorationTimelineEvent,
  WorkPerformedByOption,
} from "../types";
import type { EntryDocumentSlotConfig, EntryFormConfig } from "./types";

export const HORSEPOWER_STATUS_OPTIONS: MeasurementStatus[] = [
  "Factory Rated",
  "Estimated",
  "Dyno Verified",
  "Seller Reported",
  "Unknown",
];

export const TORQUE_STATUS_OPTIONS: MeasurementStatus[] = [
  "Factory Rated",
  "Estimated",
  "Dyno Verified",
  "Seller Reported",
  "Unknown",
];

const SUPPORTED_PERFORMANCE_CLAIM_STATUSES = new Set([
  "Dyno Verified",
  "Factory Rated",
]);

export function isSupportedPerformanceClaim(status: string | null | undefined): boolean {
  return Boolean(status && SUPPORTED_PERFORMANCE_CLAIM_STATUSES.has(status));
}

/** Unsupported or unverified figures stay labeled as seller-reported. */
export function displayPerformanceClaimStatus(status: string | null | undefined): string {
  if (isSupportedPerformanceClaim(status)) return status as string;
  return "Seller Reported";
}

export const DATE_STATUS_OPTIONS: DateStatusOption[] = [
  "Exact Date",
  "Approximate Date",
  "Installed Before Current Ownership",
  "Completed by Previous Owner",
  "Unknown",
  "Not Applicable",
];

export const RESTORATION_DATE_STATUS_OPTIONS: DateStatusOption[] = [
  "Exact Date",
  "Approximate Date",
  "Completed Before Current Ownership",
  "Completed by Previous Owner",
  "Unknown",
  "Not Applicable",
];

export const PROFESSIONAL_SHOP_BUILDER_OPTION = "Professional Shop / Builder";

export const WORK_PERFORMED_BY_OPTIONS: WorkPerformedByOption[] = [
  "Current Owner",
  "Previous Owner",
  PROFESSIONAL_SHOP_BUILDER_OPTION,
  "Other Individual",
  "Unknown",
];

const LEGACY_SHOP_BUILDER_WORK_VALUES = new Set([
  PROFESSIONAL_SHOP_BUILDER_OPTION,
  "Professional Shop",
  "Restoration Shop",
  "Current Owner + Shop",
]);

export function shouldShowShopBuilder(workPerformedBy: string | null | undefined): boolean {
  return Boolean(workPerformedBy && LEGACY_SHOP_BUILDER_WORK_VALUES.has(workPerformedBy));
}

export const ORIGINAL_PARTS_OPTIONS = ["Yes", "No", "Partial", "Unknown"];

/** Optional on restoration entries. Most useful for factory-correct and restored builds. */
export const PART_CLASSIFICATION_OPTIONS = [
  "Original to Vehicle",
  "OEM / New Old Stock",
  "Factory-Correct Reproduction",
  "Period-Correct",
  "Modern Replacement",
  "Custom / Fabricated",
  "Unknown",
] as const;

export const YES_NO_UNKNOWN_OPTIONS = ["Yes", "No", "Unknown", "Not Applicable"];

/** Authenticity checklist answers for restored / restomod listings. */
/** Seller-reported answers only. Do not label Yes as verified. */
export const RESTORATION_AUTHENTICITY_OPTIONS = ["Yes", "No", "Unknown"];

export const RESTORATION_LEVEL_OPTIONS = [
  "Concours",
  "Show Quality",
  "Driver Quality",
  "Survivor",
  "Partial Restoration",
];

/** Shared Flow #3 Build Overview status + restoration entry Completion Status. */
export const BUILD_STATUS_OPTIONS = [
  "Completed",
  "In Progress",
  "Partial",
  "Planned",
  "Unknown",
] as const;

/** Restoration / Build entry Completion Status (optional). */
export const RESTORATION_COMPLETION_STATUS_OPTIONS = [...BUILD_STATUS_OPTIONS];

export function shouldShowCompletionYear(buildStatus: string | null | undefined): boolean {
  return buildStatus === "Completed" || buildStatus === "In Progress" || buildStatus === "Partial";
}

export const RESTORATION_WORK_PERFORMED_BY_OPTIONS = [
  "Self",
  "Restoration Shop",
  "Dealership",
  "Previous Owner",
  "Unknown",
];

export const VEHICLE_IDENTITY_TYPE_OPTIONS = [
  "Modern VIN",
  "Older VIN",
  "Serial Number",
  "Chassis Number",
  "State Assigned VIN",
  "Manual Entry",
];

export const MILEAGE_STATUS_CHOICES = [
  { value: "Actual", description: "Verified original mileage" },
  { value: "Exempt", description: "Mileage exempt vehicle" },
  { value: "Odometer Replaced", description: "Odometer has been replaced" },
  { value: "Rolled Over", description: "Odometer has exceeded its limit" },
  { value: "Unknown", description: "" },
] as const;

export const MILEAGE_STATUS_OPTIONS = MILEAGE_STATUS_CHOICES.map((choice) => choice.value);

const MILEAGE_STATUS_ALIASES: Record<string, string> = {
  "Actual Mileage": "Actual",
  "Odometer Rolled Over": "Rolled Over",
};

export function normalizeMileageStatus(value: string): string {
  if (!value) return "";
  return MILEAGE_STATUS_ALIASES[value] ?? value;
}

export const DEFAULT_ENTRY_DOCUMENT_SLOTS: EntryDocumentSlotConfig[] = [
  {
    key: "photos",
    title: "Photos",
    description: "Modification photos for this entry.",
    accept: "image/*",
    variant: "image",
  },
  {
    key: "receipt",
    title: "Receipt",
    description: "Purchase receipts for parts or labor.",
    accept: ".pdf,.png,.jpg,.jpeg",
    variant: "file",
  },
  {
    key: "dynoSheet",
    title: "Dyno Sheet",
    description: "Dyno results supporting this modification.",
    accept: ".pdf,.png,.jpg,.jpeg",
    variant: "file",
  },
  {
    key: "installationInvoice",
    title: "Installation Invoice",
    description: "Shop invoices for installation work.",
    accept: ".pdf,.png,.jpg,.jpeg",
    variant: "file",
  },
  {
    key: "warranty",
    title: "Warranty",
    description: "Warranty documents for parts or labor.",
    accept: ".pdf,.png,.jpg,.jpeg",
    variant: "file",
  },
  {
    key: "supportingDocuments",
    title: "Supporting Documents",
    description: "Any additional documentation.",
    accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg",
    variant: "file",
  },
];

export const RESTORATION_ENTRY_DOCUMENT_SLOTS: EntryDocumentSlotConfig[] = [
  {
    key: "photos",
    title: "Photos",
    description: "Photos documenting this restoration or build work.",
    accept: "image/*",
    variant: "image",
  },
  {
    key: "supportingDocuments",
    title: "Files / Receipts",
    description: "Upload receipts, invoices, or any other supporting documentation.",
    accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg",
    variant: "file",
  },
];

export const DEFAULT_ENTRY_FORM_CONFIG: EntryFormConfig = {
  entryTitleLabel: "Entry Title",
  typeOfWorkLabel: "Type of Work",
  typeOfWorkPlaceholder: "e.g. Forced induction",
  partsBrandLabel: "Parts / Brand",
  manufacturerLabel: "Manufacturer",
  shopBuilderLabel: "Add Shop / Builder",
  shopBuilderWhenWorkPerformedBy: PROFESSIONAL_SHOP_BUILDER_OPTION,
  useShopBuilderPicker: true,
  workPerformedByLabel: "Work Performed By",
  workPerformedByAsText: false,
  workPerformedByOptions: WORK_PERFORMED_BY_OPTIONS,
  installationDateLabel: "Installation Date",
  dateStatusOptions: DATE_STATUS_OPTIONS,
  documentSlots: DEFAULT_ENTRY_DOCUMENT_SLOTS,
  showOriginalPartsIncluded: true,
  showPartClassification: false,
};

export const RESTORATION_ENTRY_FORM_CONFIG: EntryFormConfig = {
  entryTitleLabel: "Entry Title",
  descriptionLabel: "Details",
  descriptionPlaceholder:
    "Describe what was restored, rebuilt, fabricated, replaced, upgraded, or added.",
  hideTypeOfWork: true,
  hideSpecifications: true,
  partsBrandLabel: "Parts Used",
  manufacturerLabel: "Manufacturer / Source",
  shopBuilderLabel: "Add Shop / Builder",
  shopBuilderWhenWorkPerformedBy: PROFESSIONAL_SHOP_BUILDER_OPTION,
  useShopBuilderPicker: true,
  workPerformedByLabel: "Work Performed By",
  workPerformedByOptions: WORK_PERFORMED_BY_OPTIONS,
  workPerformedByAsText: false,
  completedDuringLabel: "Completion Status",
  completedDuringOptions: [...RESTORATION_COMPLETION_STATUS_OPTIONS],
  completedDuringAfterShop: true,
  installationDateLabel: "Completion Date",
  simpleDateOnly: true,
  mileageLabel: "Completion Mileage",
  documentSlots: RESTORATION_ENTRY_DOCUMENT_SLOTS,
  showOriginalPartsIncluded: false,
  showPartClassification: true,
  partClassificationLabel: "Classification",
  notesLabel: "Additional Notes",
  notesPlaceholder: "Anything else buyers should know about this entry…",
  saveButtonLabel: "Save Entry",
  addEntryLabel: "Add Restoration Entry",
};

export const RACE_ENTRY_DOCUMENT_SLOTS: EntryDocumentSlotConfig[] = [
  {
    key: "photos",
    title: "Photos",
    description: "Photos documenting this race / track component.",
    accept: "image/*",
    variant: "image",
  },
  {
    key: "supportingDocuments",
    title: "Supporting Documents",
    description: "Tech sheets, invoices, certs, and related files.",
    accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg",
    variant: "file",
  },
];

export const RACE_ENTRY_FORM_CONFIG: EntryFormConfig = {
  entryTitleLabel: "Title",
  typeOfWorkLabel: "Type of Work",
  typeOfWorkPlaceholder: "e.g. Cage install, aero package, engine rebuild",
  partsBrandLabel: "Brand",
  manufacturerLabel: "Manufacturer",
  shopBuilderLabel: "Add Shop / Builder",
  shopBuilderWhenWorkPerformedBy: PROFESSIONAL_SHOP_BUILDER_OPTION,
  useShopBuilderPicker: true,
  workPerformedByLabel: "Work Performed By",
  workPerformedByOptions: WORK_PERFORMED_BY_OPTIONS,
  workPerformedByAsText: false,
  installationDateLabel: "Completion Date",
  dateStatusOptions: RESTORATION_DATE_STATUS_OPTIONS,
  documentSlots: RACE_ENTRY_DOCUMENT_SLOTS,
  showOriginalPartsIncluded: false,
};

export const COMPETITION_LEVEL_OPTIONS = [
  "Club",
  "Regional",
  "National",
  "Professional",
  "Historic",
  "Exhibition",
];

export const RACE_DISCIPLINE_OPTIONS = [
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
];

export const RACE_SANCTIONING_BODY_OPTIONS = [
  "IMSA",
  "SCCA",
  "NASA",
  "PCA",
  "NHRA",
  "FIA",
  "NASCAR",
  "Other / Independent",
  "Unknown",
];

export const RACE_SERIES_OPTIONS = [
  "GT World Challenge",
  "IMSA WeatherTech",
  "SCCA Majors",
  "NASA Championships",
  "Club Racing",
  "Time Trial",
  "Track Day Series",
  "Other",
  "Unknown / N/A",
];

export const RACE_CLASS_OPTIONS = [
  "GT3",
  "GT4",
  "TCR",
  "Spec Miata",
  "Spec E30",
  "Super Touring",
  "Open Class",
  "Other",
  "Unknown / N/A",
];

export const RACE_ELIGIBILITY_OPTIONS = ["Eligible", "Pending", "Expired", "Unknown"];

export const RACE_TECHNICAL_INSPECTION_OPTIONS = ["Passed", "Pending", "Failed", "N/A"];

export const RACE_LOGBOOK_STATUS_OPTIONS = ["Current", "Expired", "Missing", "Unknown"];

export const RACE_VEHICLE_TYPE_OPTIONS = [
  "Street Legal",
  "Purpose Built Race Car",
  "Converted Race Car",
];

export const RACE_STREET_VIN_AVAILABLE_OPTIONS = ["Yes", "No"];

export const RACE_SAFETY_EQUIPMENT_OPTIONS = ["Installed", "Not Installed", "Unknown"];

export const STREET_LEGAL_STATUS_OPTIONS = [
  "Street Legal",
  "Off-Highway / Track Only",
  "Convertible / Dual Purpose",
  "Unknown",
];

export const TITLE_STATUS_OPTIONS = [
  "Clean",
  "Salvage",
  "Rebuilt",
  "Non-Titled",
  "Bill of Sale Only",
  "Unknown",
];

export const YES_NO_OPTIONS = ["Yes", "No", "Unknown", "Not Applicable"];

export function createEmptyPerformanceSummary(): PerformanceSummary {
  return {
    currentEngine: "",
    transmission: "",
    drivetrain: "",
    horsepower: "",
    horsepowerStatus: "",
    torque: "",
    torqueStatus: "",
    fuelType: "",
    tuningPlatform: "",
    buildSummary: "",
  };
}

export function createEmptyRestorationState(): RestorationState {
  return {
    identityType: "",
    identityValue: "",
    buildType: "",
    restomodSubcategory: "",
    mileageStatus: "",
    buildStatus: "",
    completionYear: "",
    completionDate: "",
    workPerformedBy: "",
    shopBuilder: "",
    buildSummary: "",
    factoryCorrect: {
      numbersMatchingEngine: "",
      numbersMatchingTransmission: "",
      originalEngine: "",
      originalTransmission: "",
      originalChassis: "",
      originalBodyPanels: "",
      factoryCorrectPaint: "",
      factoryCorrectInterior: "",
      factoryCorrectWheels: "",
      factoryCorrectTrim: "",
      factoryCorrectRadio: "",
      originalEquipment: "",
      periodCorrectParts: "",
      restorationLevel: "",
      completionStatus: "",
      restorationShop: "",
      builder: "",
    },
    documentation: {
      buildBook: [],
      receiptsAndInvoices: [],
      factoryDocuments: [],
      historicalBuildPhotos: [],
      certificates: [],
      magazineFeatures: [],
      awards: [],
      judgingSheets: [],
      other: [],
    },
    provenance: {
      previousOwners: "",
      historicalStory: "",
      awards: "",
      magazineFeatures: "",
      tvMovieAppearance: "",
      auctionHistory: "",
      specialNotes: "",
    },
    timelineEvents: [],
  };
}

export function createEmptyRestorationTimelineEvent(
  id = `timeline-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
): RestorationTimelineEvent {
  return {
    id,
    title: "",
    dateYear: "",
    exactDate: "",
    datePrecision: "",
    eventType: "",
    description: "",
    photos: [],
  };
}

export function createEmptyModificationEntry(
  categoryId: string,
  id = `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
): ModificationEntry {
  return {
    id,
    categoryId,
    title: "",
    description: "",
    typeOfWork: "",
    partsBrand: "",
    manufacturer: "",
    specifications: "",
    workPerformedBy: "",
    completedDuring: "",
    shopBuilder: "",
    installationDate: "",
    dateStatus: "",
    mileage: "",
    originalPartsIncluded: "",
    partClassification: "",
    photos: [],
    receipt: [],
    dynoSheet: [],
    installationInvoice: [],
    warranty: [],
    supportingDocuments: [],
    additionalNotes: "",
    completed: false,
  };
}

export function countEntryDocuments(entry: ModificationEntry) {
  return (
    entry.receipt.length +
    entry.dynoSheet.length +
    entry.installationInvoice.length +
    entry.warranty.length +
    entry.supportingDocuments.length
  );
}

export function countEntryPhotos(entry: ModificationEntry) {
  return entry.photos.length;
}

export function countRestorationDocuments(docs: RestorationState["documentation"]) {
  return Object.values(docs).reduce(
    (sum, items) => sum + (Array.isArray(items) ? items.length : 0),
    0
  );
}

export function createEmptyRaceHistoryEntry(
  id = `race-hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
): RaceHistoryEntry {
  return {
    id,
    event: "",
    track: "",
    date: "",
    result: "",
    className: "",
    position: "",
    fastestLap: "",
    notes: "",
    photos: [],
    expanded: true,
  };
}

export function createEmptyRaceState(): RaceState {
  return {
    identity: {
      year: "",
      make: "",
      model: "",
      trim: "",
      chassisDesignation: "",
      streetBased: "",
      purposeBuilt: "",
      vin: "",
      chassisNumber: "",
      tubNumber: "",
      serialNumber: "",
      logbookNumber: "",
      builderAssignedId: "",
      noStreetVin: "",
      builder: "",
      manufacturer: "",
      builderManufacturer: "",
      buildYear: "",
      mileage: "",
      engineHours: "",
      chassisHours: "",
      streetLegalStatus: "",
      titleStatus: "",
    },
    competition: {
      primaryDiscipline: "",
      primaryUseOther: "",
      secondaryDiscipline: "",
      sanctioningBody: "",
      series: "",
      competitionClass: "",
      competitionLevel: "",
      currentEligibility: "",
      logbookStatus: "",
      technicalInspection: "",
      competitionHistorySummary: "",
      notableResults: "",
      notes: "",
    },
    safety: {
      rollCageType: "",
      rollCageBuilder: "",
      certificationOrganization: "",
      certificationNumber: "",
      certificationExpiration: "",
      seatManufacturer: "",
      seatCertification: "",
      harnessManufacturer: "",
      harnessCertification: "",
      windowNet: "",
      fireSuppressionSystem: "",
      fuelCell: "",
      batteryCutoff: "",
      killSwitch: "",
      towHooks: "",
      safetyNotes: "",
    },
    documentation: {
      logbook: [],
      inspectionReports: [],
      certificationDocuments: [],
      dynoSheets: [],
      raceResults: [],
      setupSheets: [],
      dataLogs: [],
      technicalReports: [],
      photos: [],
      videos: [],
    },
    setup: {
      suspensionSetup: "",
      alignment: "",
      cornerWeights: "",
      rideHeight: "",
      brakeBias: "",
      tirePressures: "",
      gearRatios: "",
      ecuCalibration: "",
      driverNotes: "",
      crewNotes: "",
    },
    biography: {
      competitionHistory: "",
      notableResults: "",
      vehicleHistory: "",
      builderNotes: "",
      previousTeamsOrDrivers: "",
      championships: "",
      significantEvents: "",
      additionalBackground: "",
    },
    historyEntries: [],
    editingHistoryId: null,
    buildNarrative: "",
    workPerformedBy: "",
    shopBuilder: "",
    installedSafetyEquipment: [],
    safetyEquipmentNotes: "",
    safetyServiceDates: {
      "competition-seat": "",
      harness: "",
      "fire-suppression": "",
    },
    organizedCompetition: "",
    competitionHistoryNarrative: "",
    documentationTypes: [],
    documentationOther: "",
    documentationUploads: [],
    sparesIncluded: "",
    sparesDescription: "",
    knownRaceTrackIssues: "",
  };
}

export function countRaceDocuments(docs: RaceState["documentation"]) {
  return (
    docs.logbook.length +
    docs.inspectionReports.length +
    docs.certificationDocuments.length +
    docs.dynoSheets.length +
    docs.raceResults.length +
    docs.setupSheets.length +
    docs.dataLogs.length +
    docs.technicalReports.length +
    docs.photos.length +
    docs.videos.length
  );
}
