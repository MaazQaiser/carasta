"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X, Plus, ArrowLeft, Check, Minus } from "lucide-react";
import type { Vehicle } from "@carasta/types";
import { vehicleService } from "@carasta/mock-data/services";
import { useCompare } from "@/lib/context/compare-context";
import { Button } from "@/components/ui/button";
import { formatPrice, formatMileage } from "@/lib/utils";

const SPEC_ROWS = [
  { key: "year", label: "Year", get: (v: Vehicle) => String(v.spec.year) },
  { key: "make", label: "Make", get: (v: Vehicle) => v.spec.make },
  { key: "model", label: "Model", get: (v: Vehicle) => v.spec.model },
  { key: "trim", label: "Trim", get: (v: Vehicle) => v.spec.trim ?? "—" },
  { key: "price", label: "Asking Price", get: (v: Vehicle) => formatPrice(v.startingPrice) },
  { key: "mileage", label: "Mileage", get: (v: Vehicle) => formatMileage(v.spec.mileage) },
  { key: "engine", label: "Engine", get: (v: Vehicle) => v.spec.engineSize ?? "—" },
  { key: "hp", label: "Horsepower", get: (v: Vehicle) => v.spec.horsepower ? `${v.spec.horsepower} hp` : "—" },
  { key: "fuel", label: "Fuel Type", get: (v: Vehicle) => v.spec.fuelType },
  { key: "transmission", label: "Transmission", get: (v: Vehicle) => v.spec.transmission },
  { key: "drive", label: "Drive Type", get: (v: Vehicle) => v.spec.driveType.toUpperCase() },
  { key: "exterior", label: "Exterior Color", get: (v: Vehicle) => v.spec.exteriorColor },
  { key: "interior", label: "Interior Color", get: (v: Vehicle) => v.spec.interiorColor },
  { key: "condition", label: "Condition", get: (v: Vehicle) => v.condition },
  { key: "location", label: "Location", get: (v: Vehicle) => `${v.location.city}, ${v.location.state}` },
  { key: "seller", label: "Seller", get: (v: Vehicle) => v.seller.displayName },
  { key: "inspection", label: "Inspection Report", get: (v: Vehicle) => v.hasInspectionReport ? "✓ Available" : "✗ Not Available" },
  { key: "financing", label: "Financing", get: (v: Vehicle) => v.hasFinancingOptions ? "✓ Available" : "—" },
];

export function CompareClient() {
  const { compareList, toggle, clear } = useCompare();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    if (compareList.length === 0) return;
    Promise.all(compareList.map((id) => vehicleService.getVehicle(id))).then((results) => {
      setVehicles(results.filter((v): v is Vehicle => v !== null));
    });
  }, [compareList]);

  if (compareList.length === 0) {
    return (
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-16 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Plus className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No vehicles to compare</h2>
        <p className="text-muted-foreground mb-6">Add up to 4 vehicles from the Marketplace to compare side by side.</p>
        <Link href="/marketplace">
          <Button>Browse Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/marketplace">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Marketplace
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Vehicle Comparison</h1>
          <p className="text-sm text-muted-foreground">{vehicles.length} vehicles selected</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={clear}>Clear All</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-sm font-medium text-muted-foreground p-3 w-36 bg-muted/30 rounded-tl-xl sticky left-0">
                Specification
              </th>
              {vehicles.map((v) => (
                <th key={v.id} className="p-3 min-w-[200px]">
                  <div className="relative rounded-xl overflow-hidden border bg-card">
                    <button
                      onClick={() => toggle(v.id)}
                      className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-red-500 transition-colors z-10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      {v.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={v.images[0].url} alt={v.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="p-3 text-left">
                      <Link href={`/vehicles/${v.id}`} className="font-semibold text-sm hover:underline line-clamp-2">
                        {v.title}
                      </Link>
                      <p className="text-lg font-bold mt-1">{formatPrice(v.startingPrice)}</p>
                      <Link href={`/vehicles/${v.id}`}>
                        <Button variant="outline" size="sm" className="mt-2 w-full text-xs">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </th>
              ))}
              {compareList.length < 4 && (
                <th className="p-3 min-w-[180px]">
                  <Link href="/marketplace">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors cursor-pointer h-full min-h-[200px]">
                      <Plus className="h-8 w-8 mb-2" />
                      <span className="text-sm font-medium">Add Vehicle</span>
                    </div>
                  </Link>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {SPEC_ROWS.map((row, i) => (
              <tr key={row.key} className={i % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                <td className="p-3 text-sm font-medium text-muted-foreground sticky left-0 bg-inherit">
                  {row.label}
                </td>
                {vehicles.map((v) => {
                  const value = row.get(v);
                  const allValues = vehicles.map(row.get);
                  const isBest = row.key === "price"
                    ? value === allValues.reduce((a, b) => (parseFloat(a.replace(/[^0-9.]/g, "")) < parseFloat(b.replace(/[^0-9.]/g, "")) ? a : b))
                    : row.key === "mileage"
                    ? value === allValues.reduce((a, b) => (parseInt(a.replace(/[^0-9]/g, "")) < parseInt(b.replace(/[^0-9]/g, "")) ? a : b))
                    : false;
                  return (
                    <td key={v.id} className="p-3 text-sm capitalize">
                      <span className={isBest ? "font-semibold text-green-600 dark:text-green-400" : ""}>
                        {value}
                      </span>
                      {isBest && <span className="ml-1 text-xs">↓</span>}
                    </td>
                  );
                })}
                {compareList.length < 4 && <td />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
