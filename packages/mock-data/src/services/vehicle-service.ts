import type { Vehicle, VehicleFilters, VehicleSortField, PaginatedResponse } from "@carasta/types";
import { MOCK_VEHICLES } from "../seed/vehicles";

function delay(ms = 200): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function applyFilters(vehicles: Vehicle[], filters: VehicleFilters): Vehicle[] {
  return vehicles.filter((v) => {
    if (filters.make && v.spec.make.toLowerCase() !== filters.make.toLowerCase()) return false;
    if (filters.model && !v.spec.model.toLowerCase().includes(filters.model.toLowerCase())) return false;
    if (filters.yearMin && v.spec.year < filters.yearMin) return false;
    if (filters.yearMax && v.spec.year > filters.yearMax) return false;
    if (filters.priceMin && v.startingPrice < filters.priceMin) return false;
    if (filters.priceMax && v.startingPrice > filters.priceMax) return false;
    if (filters.mileageMax && v.spec.mileage > filters.mileageMax) return false;
    if (filters.fuelType && v.spec.fuelType !== filters.fuelType) return false;
    if (filters.transmission && v.spec.transmission !== filters.transmission) return false;
    if (filters.driveType && v.spec.driveType !== filters.driveType) return false;
    if (filters.condition && v.condition !== filters.condition) return false;
    return true;
  });
}

function applySort(vehicles: Vehicle[], sort: VehicleSortField): Vehicle[] {
  return [...vehicles].sort((a, b) => {
    switch (sort) {
      case "price-asc": return a.startingPrice - b.startingPrice;
      case "price-desc": return b.startingPrice - a.startingPrice;
      case "mileage-asc": return a.spec.mileage - b.spec.mileage;
      case "year-desc": return b.spec.year - a.spec.year;
      case "newest":
      case "recently-listed":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default: return 0;
    }
  });
}

export const vehicleService = {
  async getVehicles(params: {
    filters?: VehicleFilters;
    sort?: VehicleSortField;
    page?: number;
    pageSize?: number;
    excludeAuction?: boolean;
  } = {}): Promise<PaginatedResponse<Vehicle>> {
    await delay(150);
    const { filters = {}, sort = "newest", page = 1, pageSize = 12, excludeAuction = false } = params;
    let data = excludeAuction
      ? MOCK_VEHICLES.filter((v) => v.status !== "in-auction")
      : MOCK_VEHICLES;
    data = applyFilters(data, filters);
    data = applySort(data, sort);
    const total = data.length;
    const start = (page - 1) * pageSize;
    return { data: data.slice(start, start + pageSize), total, page, pageSize, hasNextPage: start + pageSize < total };
  },

  async getVehicle(id: string): Promise<Vehicle | null> {
    await delay(100);
    return MOCK_VEHICLES.find((v) => v.id === id) ?? null;
  },

  async getVehicleBySlug(slug: string): Promise<Vehicle | null> {
    await delay(100);
    return MOCK_VEHICLES.find((v) => v.slug === slug) ?? null;
  },

  async getSimilarVehicles(vehicleId: string, limit = 4): Promise<Vehicle[]> {
    await delay(100);
    const vehicle = MOCK_VEHICLES.find((v) => v.id === vehicleId);
    if (!vehicle) return [];
    return MOCK_VEHICLES.filter((v) => v.id !== vehicleId && v.spec.make === vehicle.spec.make).slice(0, limit);
  },

  async getPopularBrands(): Promise<{ name: string; count: number; imageUrl: string }[]> {
    await delay(80);
    const brands = [
      { name: "Jaguar", count: 6, imageUrl: "https://images.unsplash.com/photo-1750957823101-87ec89cf6862?w=400&auto=format&fit=crop" },
      { name: "Ford", count: 2, imageUrl: "https://images.unsplash.com/photo-1572011440385-cf32f4fc7d02?w=400&auto=format&fit=crop" },
      { name: "Chevrolet", count: 3, imageUrl: "https://images.unsplash.com/photo-1584345274849-e9596d6ea12d?w=400&auto=format&fit=crop" },
      { name: "Dodge", count: 1, imageUrl: "https://images.unsplash.com/photo-1569679614220-975786cbaca7?w=400&auto=format&fit=crop" },
      { name: "Mercedes-Benz", count: 1, imageUrl: "https://images.unsplash.com/photo-1662282925500-ddd13acb4fef?w=400&auto=format&fit=crop" },
      { name: "Aston Martin", count: 1, imageUrl: "https://images.unsplash.com/photo-1641035854263-797cec88bb8f?w=400&auto=format&fit=crop" },
      { name: "Volkswagen", count: 1, imageUrl: "https://images.unsplash.com/photo-1768713533995-82ba685c1bc3?w=400&auto=format&fit=crop" },
    ];
    return brands;
  },

  async getRecentlySold(limit = 6): Promise<Vehicle[]> {
    await delay(100);
    return MOCK_VEHICLES.filter((v) => v.status === "sold").slice(0, limit);
  },

  async search(query: string): Promise<Vehicle[]> {
    await delay(120);
    const q = query.toLowerCase();
    return MOCK_VEHICLES.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.spec.make.toLowerCase().includes(q) ||
        v.spec.model.toLowerCase().includes(q) ||
        String(v.spec.year).includes(q)
    ).slice(0, 10);
  },
};
