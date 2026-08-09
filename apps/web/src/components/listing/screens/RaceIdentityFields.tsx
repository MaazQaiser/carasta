"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldLabel } from "../fields";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import type { RaceVehicleIdentity } from "../types";
import {
  RACE_STREET_VIN_AVAILABLE_OPTIONS,
  RACE_VEHICLE_TYPE_OPTIONS,
  STREET_LEGAL_STATUS_OPTIONS,
  TITLE_STATUS_OPTIONS,
} from "../specs/options";
import { ListingShopBuilderField } from "../shop-builder/ListingShopBuilderField";

function vehicleTypeValue(identity: RaceVehicleIdentity) {
  const street = identity.streetBased === "Yes";
  const purpose = identity.purposeBuilt === "Yes";
  if (street && purpose) return "Converted Race Car";
  if (purpose) return "Purpose Built Race Car";
  if (street) return "Street Legal";
  return "";
}

function streetVinAvailableValue(identity: RaceVehicleIdentity) {
  if (identity.noStreetVin === "Yes") return "No";
  if (identity.noStreetVin === "No") return "Yes";
  return "";
}

/** Desktop race identity fields — mirrors mobile race details logic. */
export function RaceIdentityFields() {
  const { draft, updateDetails, updateWorkspace } = useListingBuilder();
  const race = draft.modificationWorkspace.race;
  const identity = race.identity;

  const patchIdentity = (patch: Partial<RaceVehicleIdentity>) => {
    const next: RaceVehicleIdentity = { ...identity, ...patch };
    if (patch.manufacturer !== undefined) {
      next.builderManufacturer = patch.manufacturer;
    }
    updateWorkspace({ race: { ...race, identity: next } });

    const detailsPatch: Record<string, string> = {};
    if (patch.year !== undefined) detailsPatch.year = patch.year;
    if (patch.make !== undefined) detailsPatch.make = patch.make;
    if (patch.model !== undefined) detailsPatch.model = patch.model;
    if (patch.trim !== undefined || patch.chassisDesignation !== undefined) {
      detailsPatch.trim = patch.trim ?? patch.chassisDesignation ?? identity.trim;
    }
    if (patch.mileage !== undefined) detailsPatch.mileage = patch.mileage;
    if (patch.vin !== undefined) detailsPatch.vin = patch.vin;
    if (Object.keys(detailsPatch).length) updateDetails(detailsPatch);
  };

  const setVehicleType = (value: string) => {
    if (value === "Street Legal") {
      patchIdentity({ streetBased: "Yes", purposeBuilt: "No" });
    } else if (value === "Purpose Built Race Car") {
      patchIdentity({ streetBased: "No", purposeBuilt: "Yes" });
    } else if (value === "Converted Race Car") {
      patchIdentity({ streetBased: "Yes", purposeBuilt: "Yes" });
    }
  };

  const setStreetVinAvailable = (value: string) => {
    if (value === "Yes") patchIdentity({ noStreetVin: "No" });
    else if (value === "No") patchIdentity({ noStreetVin: "Yes" });
  };

  const trimChassis =
    identity.chassisDesignation || identity.trim || draft.details.trim || "";

  return (
    <div className="space-y-6">
      <ListingSection title="Race Identity" description="Year, make, model, and chassis designation.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              ["year", "Year", identity.year || draft.details.year],
              ["make", "Make", identity.make || draft.details.make],
              ["model", "Model", identity.model || draft.details.model],
            ] as const
          ).map(([key, label, value]) => (
            <div key={key}>
              <FieldLabel htmlFor={`race-${key}`}>{label}</FieldLabel>
              <Input
                id={`race-${key}`}
                value={value}
                onChange={(e) => patchIdentity({ [key]: e.target.value })}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}
          <div>
            <FieldLabel htmlFor="race-trim">Trim / Chassis designation</FieldLabel>
            <Input
              id="race-trim"
              value={trimChassis}
              onChange={(e) =>
                patchIdentity({ trim: e.target.value, chassisDesignation: e.target.value })
              }
              placeholder="e.g. GT3 Cup"
            />
          </div>
          <div>
            <FieldLabel>Vehicle Type</FieldLabel>
            <Select value={vehicleTypeValue(identity) || undefined} onValueChange={setVehicleType}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                {RACE_VEHICLE_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </ListingSection>

      <ListingSection title="Numbers & Builder">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Street VIN Available</FieldLabel>
            <Select
              value={streetVinAvailableValue(identity) || undefined}
              onValueChange={setStreetVinAvailable}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {RACE_STREET_VIN_AVAILABLE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <FieldLabel htmlFor="race-vin">VIN</FieldLabel>
            <Input
              id="race-vin"
              value={identity.vin || draft.details.vin}
              onChange={(e) => patchIdentity({ vin: e.target.value.toUpperCase() })}
              className="font-mono tracking-wide uppercase"
              placeholder="Street VIN if available"
            />
          </div>
          <div>
            <FieldLabel htmlFor="race-chassis">Chassis Number</FieldLabel>
            <Input
              id="race-chassis"
              value={identity.chassisNumber}
              onChange={(e) => patchIdentity({ chassisNumber: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel htmlFor="race-serial">Serial Number</FieldLabel>
            <Input
              id="race-serial"
              value={identity.serialNumber}
              onChange={(e) => patchIdentity({ serialNumber: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <ListingShopBuilderField
              label="Builder / Shop"
              value={identity.builder}
              target="race.identity.builder"
            />
          </div>
          <div>
            <FieldLabel htmlFor="race-build-year">Build Year</FieldLabel>
            <Input
              id="race-build-year"
              value={identity.buildYear}
              onChange={(e) => patchIdentity({ buildYear: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel htmlFor="race-mileage">Mileage / Hours</FieldLabel>
            <Input
              id="race-mileage"
              value={identity.mileage || draft.details.mileage}
              onChange={(e) => patchIdentity({ mileage: e.target.value.replace(/[^\d,]/g, "") })}
            />
          </div>
          <div>
            <FieldLabel>Street Legal Status</FieldLabel>
            <Select
              value={identity.streetLegalStatus || undefined}
              onValueChange={(v) => patchIdentity({ streetLegalStatus: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {STREET_LEGAL_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <FieldLabel>Title Status</FieldLabel>
            <Select
              value={identity.titleStatus || undefined}
              onValueChange={(v) => patchIdentity({ titleStatus: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {TITLE_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </ListingSection>
    </div>
  );
}
