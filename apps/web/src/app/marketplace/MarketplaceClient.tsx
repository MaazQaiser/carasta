"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { SlidersHorizontal, LayoutGrid, List, GitCompare, X, Bookmark, Plus } from "lucide-react";
import type { Vehicle, VehicleFilters, VehicleSortField } from "@carasta/types";
import { vehicleService } from "@carasta/mock-data/services";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useCompare } from "@/lib/context/compare-context";
import { formatPrice } from "@/lib/utils";

const MAKES = ["All", "Aston Martin", "Chevrolet", "Dodge", "Ford", "Jaguar", "Mercedes-Benz", "Volkswagen"];
const TRANSMISSIONS = ["All", "automatic", "manual"];
const FUELS = ["All", "gasoline", "diesel", "electric", "hybrid"];
const CONDITIONS = ["All", "new", "like-new", "excellent", "good", "fair"];
const DRIVE_TYPES = ["All", "rwd", "awd", "fwd", "4wd"];

export function MarketplaceClient() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [total, setTotal] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [view, setView] = useState<"grid" | "list">("grid");
  const { compareList, clear } = useCompare();

  const [make, setMake] = useState("All");
  const [transmission, setTransmission] = useState("All");
  const [fuel, setFuel] = useState("All");
  const [condition, setCondition] = useState("All");
  const [driveType, setDriveType] = useState("All");
  const [sort, setSort] = useState<VehicleSortField>("newest");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [mileageMax, setMileageMax] = useState("");

  useEffect(() => {
    startTransition(async () => {
      const filters: VehicleFilters = {};
      if (make !== "All") filters.make = make;
      if (transmission !== "All") filters.transmission = transmission as VehicleFilters["transmission"];
      if (fuel !== "All") filters.fuelType = fuel as VehicleFilters["fuelType"];
      if (condition !== "All") filters.condition = condition as VehicleFilters["condition"];
      if (driveType !== "All") filters.driveType = driveType as VehicleFilters["driveType"];
      if (priceMin) filters.priceMin = parseInt(priceMin);
      if (priceMax) filters.priceMax = parseInt(priceMax);
      if (mileageMax) filters.mileageMax = parseInt(mileageMax);

      const result = await vehicleService.getVehicles({ filters, sort, pageSize: 24, excludeAuction: false });
      setVehicles(result.data);
      setTotal(result.total);
    });
  }, [make, transmission, fuel, condition, driveType, sort, priceMin, priceMax, mileageMax]);

  const resetFilters = () => {
    setMake("All"); setTransmission("All"); setFuel("All");
    setCondition("All"); setDriveType("All");
    setPriceMin(""); setPriceMax(""); setMileageMax("");
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground mt-1">{total} vehicles available</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Bookmark className="h-4 w-4" /> Saved Searches
          </Button>
          {compareList.length > 0 && (
            <Link href="/marketplace/compare">
              <Button variant="default" size="sm" className="gap-1.5">
                <GitCompare className="h-4 w-4" /> Compare ({compareList.length})
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="rounded-2xl border bg-card p-4 space-y-5 sticky top-20">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Filters</h3>
              <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <X className="h-3 w-3" /> Reset
              </button>
            </div>
            {[
              { label: "Make", value: make, onChange: setMake, options: MAKES },
              { label: "Transmission", value: transmission, onChange: setTransmission, options: TRANSMISSIONS },
              { label: "Fuel Type", value: fuel, onChange: setFuel, options: FUELS },
              { label: "Condition", value: condition, onChange: setCondition, options: CONDITIONS },
              { label: "Drive Type", value: driveType, onChange: setDriveType, options: DRIVE_TYPES },
            ].map(({ label, value, onChange, options }) => (
              <div key={label}>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {options.map((o) => <SelectItem key={o} value={o} className="capitalize">{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Price Range</label>
              <div className="flex gap-2 mt-1">
                <Input placeholder="Min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="h-8 text-sm" type="number" />
                <Input placeholder="Max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="h-8 text-sm" type="number" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Max Mileage</label>
              <Input placeholder="e.g. 50000" value={mileageMax} onChange={(e) => setMileageMax(e.target.value)} className="mt-1 h-8 text-sm" type="number" />
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">{total} results</span>
            <div className="flex items-center gap-2">
              <Select value={sort} onValueChange={(v) => setSort(v as VehicleSortField)}>
                <SelectTrigger className="w-40 h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="mileage-asc">Lowest Mileage</SelectItem>
                  <SelectItem value="year-desc">Newest Year</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex rounded-lg border overflow-hidden">
                <Button variant={view === "grid" ? "default" : "ghost"} size="icon" className="h-8 w-8 rounded-none" onClick={() => setView("grid")}>
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button variant={view === "list" ? "default" : "ghost"} size="icon" className="h-8 w-8 rounded-none" onClick={() => setView("list")}>
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {isPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="rounded-2xl border bg-card animate-pulse aspect-[16/10]" />)}
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} showCompare />)}
            </div>
          ) : (
            <div className="space-y-3">
              {vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} view="list" />)}
            </div>
          )}
        </div>
      </div>

      {/* Compare floating bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-card border shadow-xl rounded-2xl px-4 py-3 z-30 animate-in slide-in-from-bottom-4">
          <GitCompare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{compareList.length} vehicles selected</span>
          <Link href="/marketplace/compare">
            <Button size="sm" variant="bid">Compare Now</Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clear}><X className="h-3.5 w-3.5" /></Button>
        </div>
      )}
    </div>
  );
}
