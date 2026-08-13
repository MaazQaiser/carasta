import type { Image, Location } from "./common";
import type { User } from "./user";

export type FuelType = "gasoline" | "diesel" | "electric" | "hybrid" | "hydrogen";
export type TransmissionType = "automatic" | "manual" | "cvt" | "semi-automatic";
export type DriveType = "fwd" | "rwd" | "awd" | "4wd";
export type VehicleCondition = "new" | "like-new" | "excellent" | "good" | "fair" | "poor";
export type VehicleStatus = "active" | "in-auction" | "sold" | "draft" | "pending-review" | "upcoming";

/** Listing Builder vehicle categories surfaced on Marketplace cards. */
export type MarketplaceListingType =
  | "stock-lightly-modified"
  | "modified-performance"
  | "restored-restomod-custom"
  | "race-track-car";

/** Sale settings captured in the Listing Builder. */
export type MarketplaceSaleType =
  | "reserve-auction"
  | "buy-it-now"
  | "auction-buy-now"
  | "make-offer";

/** Shipping options from Listing Builder sale settings. */
export type VehicleShippingOption =
  | "Pickup Only"
  | "Domestic Shipping"
  | "International Shipping";

export interface VehicleSpec {
  make: string;
  model: string;
  year: number;
  trim?: string;
  engineSize?: string;
  horsepower?: number;
  torque?: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  driveType: DriveType;
  mileage: number;
  exteriorColor: string;
  interiorColor: string;
  vin?: string;
  doors?: number;
  seats?: number;
  bodyStyle?: string;
}

/** Condition & history fields from the Listing Builder. */
export interface VehicleConditionHistory {
  vehicleHistory?: string;
  accidentHistory?: string;
  titleStatus?: string;
  serviceRecords?: string;
  overallCondition?: string;
  ownershipHistory?: string;
  generalNotes?: string;
}

/** Media asset captured during listing upload. */
export interface VehicleMediaAsset {
  id: string;
  url: string;
  alt: string;
  name?: string;
}

/** Photos & documents grouped by Listing Builder bucket. */
export interface VehicleMediaBuckets {
  vehiclePhotos?: VehicleMediaAsset[];
  modificationPhotos?: VehicleMediaAsset[];
  receipts?: VehicleMediaAsset[];
  invoices?: VehicleMediaAsset[];
  supportingDocuments?: VehicleMediaAsset[];
  videos?: VehicleMediaAsset[];
}

/** Modification entry for Modified / Restored / Race listing types. */
export interface VehicleModificationEntry {
  id: string;
  categoryId: string;
  categoryLabel?: string;
  title: string;
  description?: string;
  typeOfWork?: string;
  partsBrand?: string;
  manufacturer?: string;
  specifications?: string;
  workPerformedBy?: string;
  completedDuring?: string;
  shopBuilder?: string;
  installationDate?: string;
  additionalNotes?: string;
}

export interface VehiclePerformanceSummary {
  currentEngine?: string;
  transmission?: string;
  drivetrain?: string;
  horsepower?: string;
  horsepowerStatus?: string;
  torque?: string;
  torqueStatus?: string;
  fuelType?: string;
  tuningPlatform?: string;
  buildSummary?: string;
}

export interface VehicleRestorationSummary {
  buildType?: string;
  mileageStatus?: string;
  identityType?: string;
  identityValue?: string;
  factoryCorrect?: Record<string, string>;
  provenance?: Record<string, string>;
}

export interface VehicleRaceHistoryEntry {
  id: string;
  event: string;
  track?: string;
  date?: string;
  result?: string;
  className?: string;
  position?: string;
  fastestLap?: string;
  notes?: string;
}

export interface VehicleRaceSummary {
  competition?: Record<string, string>;
  safety?: Record<string, string>;
  setup?: Record<string, string>;
  history?: VehicleRaceHistoryEntry[];
}

/**
 * Listing Builder payload surfaced on the Vehicle Detail page.
 * All fields optional so legacy listings remain valid.
 */
export interface VehicleListingDetails {
  buyNowPrice?: number;
  shipping?: VehicleShippingOption | string;
  sellerLocation?: string;
  /** Stock / lightly modified notes. */
  factorySpecsNotes?: string;
  lightModifications?: string[];
  performanceSummary?: VehiclePerformanceSummary;
  modifications?: VehicleModificationEntry[];
  restoration?: VehicleRestorationSummary;
  race?: VehicleRaceSummary;
  conditionHistory?: VehicleConditionHistory;
  media?: VehicleMediaBuckets;
}

export interface Vehicle {
  id: string;
  title: string;
  slug: string;
  spec: VehicleSpec;
  condition: VehicleCondition;
  status: VehicleStatus;
  description: string;
  /** Seller owner notes from Listing Builder (Owner Notes step). */
  story?: string;
  images: Image[];
  location: Location;
  seller: User;
  features: string[];
  reservePrice?: number;
  startingPrice: number;
  estimatedValue?: number;
  hasInspectionReport: boolean;
  inspectionReportUrl?: string;
  hasFinancingOptions: boolean;
  views: number;
  watchlistCount: number;
  /** Listing Builder category — optional for legacy listings. */
  listingType?: MarketplaceListingType;
  /** Sale format from Listing Builder sale settings. */
  saleType?: MarketplaceSaleType;
  /** Optional verification badges — only render when true. */
  vinVerified?: boolean;
  documentsAvailable?: boolean;
  carastaVerified?: boolean;
  /** Extended Listing Builder fields for detail-page parity. */
  listingDetails?: VehicleListingDetails;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFilters {
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  fuelType?: FuelType;
  transmission?: TransmissionType;
  driveType?: DriveType;
  condition?: VehicleCondition;
  location?: string;
  sellerType?: "dealer" | "private";
  exteriorColor?: string;
}

export type VehicleSortField =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "mileage-asc"
  | "year-desc"
  | "recently-listed";
