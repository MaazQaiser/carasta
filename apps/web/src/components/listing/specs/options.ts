import type {
  DateStatusOption,
  MeasurementStatus,
  ModificationEntry,
  PerformanceSummary,
  RaceHistoryEntry,
  RaceState,
  RestorationState,
  WorkPerformedByOption,
} from "../types";
import type { EntryDocumentSlotConfig, EntryFormConfig } from "./types";

export const HORSEPOWER_STATUS_OPTIONS: MeasurementStatus[] = [
  "Factory Rated",
  "Estimated",
  "Dyno Verified",
  "Unknown",
];

export const TORQUE_STATUS_OPTIONS: MeasurementStatus[] = [
  "Factory Rated",
  "Estimated",
  "Dyno Verified",
  "Unknown",
];

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

export const WORK_PERFORMED_BY_OPTIONS: WorkPerformedByOption[] = [
  "Current Owner",
  "Professional Shop",
  "Current Owner + Shop",
  "Previous Owner",
  "Original Builder",
  "Factory / Manufacturer",
  "Unknown",
];

export const ORIGINAL_PARTS_OPTIONS = ["Yes", "No", "Partial", "Unknown"];

export const YES_NO_UNKNOWN_OPTIONS = ["Yes", "No", "Unknown", "Not Applicable"];

export const VEHICLE_IDENTITY_TYPE_OPTIONS = [
  "Modern VIN",
  "Older VIN",
  "Serial Number",
  "Chassis Number",
  "State Assigned VIN",
  "Manual Entry",
];

export const MILEAGE_STATUS_OPTIONS = [
  "Actual Mileage",
  "Exempt",
  "Odometer Replaced",
  "Rolled Over",
  "Unknown",
];

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
    title: "Supporting Documents",
    description: "Receipts, invoices, notes, and other supporting files.",
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
  shopBuilderLabel: "Shop / Builder",
  workPerformedByLabel: "Work Performed By",
  workPerformedByAsText: false,
  installationDateLabel: "Installation Date",
  dateStatusOptions: DATE_STATUS_OPTIONS,
  documentSlots: DEFAULT_ENTRY_DOCUMENT_SLOTS,
  showOriginalPartsIncluded: true,
};

export const RESTORATION_ENTRY_FORM_CONFIG: EntryFormConfig = {
  entryTitleLabel: "Entry Title",
  typeOfWorkLabel: "Work Performed",
  typeOfWorkPlaceholder: "e.g. Body restoration, paint, rewire",
  partsBrandLabel: "Parts / Brand",
  manufacturerLabel: "Manufacturer",
  shopBuilderLabel: "Shop / Builder",
  workPerformedByLabel: "Work Performed By",
  workPerformedByAsText: false,
  installationDateLabel: "Completion Date",
  dateStatusOptions: RESTORATION_DATE_STATUS_OPTIONS,
  documentSlots: RESTORATION_ENTRY_DOCUMENT_SLOTS,
  showOriginalPartsIncluded: true,
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
  shopBuilderLabel: "Installer",
  workPerformedByLabel: "Builder",
  workPerformedByAsText: true,
  installationDateLabel: "Completion Date",
  dateStatusOptions: RESTORATION_DATE_STATUS_OPTIONS,
  documentSlots: RACE_ENTRY_DOCUMENT_SLOTS,
  showOriginalPartsIncluded: false,
};

export const COMPETITION_LEVEL_OPTIONS = [
  "Track Day",
  "Club",
  "Regional",
  "National",
  "Professional",
  "Historic / Vintage",
  "Unknown",
];

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
    mileageStatus: "",
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
      receipts: [],
      invoices: [],
      restorationPhotos: [],
      factoryDocuments: [],
      certificates: [],
      historicalDocumentation: [],
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
    shopBuilder: "",
    installationDate: "",
    dateStatus: "",
    mileage: "",
    originalPartsIncluded: "",
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
  return (
    docs.buildBook.length +
    docs.receipts.length +
    docs.invoices.length +
    docs.restorationPhotos.length +
    docs.factoryDocuments.length +
    docs.certificates.length +
    docs.historicalDocumentation.length
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
    historyEntries: [],
    editingHistoryId: null,
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
