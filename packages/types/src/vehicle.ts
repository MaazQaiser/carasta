import type { Image, Location } from "./common";
import type { User } from "./user";

export type FuelType = "gasoline" | "diesel" | "electric" | "hybrid" | "hydrogen";
export type TransmissionType = "automatic" | "manual" | "cvt" | "semi-automatic";
export type DriveType = "fwd" | "rwd" | "awd" | "4wd";
export type VehicleCondition = "new" | "like-new" | "excellent" | "good" | "fair" | "poor";
export type VehicleStatus = "active" | "in-auction" | "sold" | "draft" | "pending-review" | "upcoming";

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

export interface Vehicle {
  id: string;
  title: string;
  slug: string;
  spec: VehicleSpec;
  condition: VehicleCondition;
  status: VehicleStatus;
  description: string;
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
