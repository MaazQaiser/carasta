import type { Vehicle } from "./vehicle";

export type GarageEntryType = "owned" | "sold" | "wishlist" | "auction-win";

export interface MaintenanceEntry {
  id: string;
  vehicleId: string;
  type: string;
  description: string;
  mileageAtService: number;
  cost?: number;
  performedAt: string;
  performedBy?: string;
  notes?: string;
}

export interface GarageEntry {
  id: string;
  userId: string;
  vehicle: Vehicle;
  type: GarageEntryType;
  purchasePrice?: number;
  salePrice?: number;
  purchasedAt?: string;
  soldAt?: string;
  maintenanceHistory: MaintenanceEntry[];
  notes?: string;
  addedAt: string;
}

export interface GarageStats {
  totalVehicles: number;
  ownedCount: number;
  soldCount: number;
  wishlistCount: number;
  auctionWins: number;
  totalInvested: number;
  totalReturned: number;
}

export interface ListingDraft {
  id: string;
  userId: string;
  step: number;
  data: Partial<{
    make: string;
    model: string;
    year: number;
    trim: string;
    vin: string;
    mileage: number;
    condition: string;
    fuelType: string;
    transmission: string;
    driveType: string;
    exteriorColor: string;
    interiorColor: string;
    description: string;
    story: string;
    photos: string[];
    features: string[];
    reservePrice: number;
    startingBid: number;
    auctionDuration: number;
  }>;
  createdAt: string;
  updatedAt: string;
}
