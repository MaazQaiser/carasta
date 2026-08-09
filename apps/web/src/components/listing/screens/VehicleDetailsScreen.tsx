"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldHint, FieldLabel } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import type { ListingVehicleDetails, RestorationBuildTypeId } from "../types";
import { getIssuesForStep } from "../services/validation-service";
import { MILEAGE_STATUS_OPTIONS } from "../specs/options";
import { RESTORATION_BUILD_TYPES } from "../specs/restored-restomod";
import { RaceIdentityFields } from "./RaceIdentityFields";

const CORE_FIELDS: {
  key: keyof ListingVehicleDetails;
  label: string;
  placeholder: string;
  required?: boolean;
}[] = [
  { key: "year", label: "Year", placeholder: "e.g. 2019", required: true },
  { key: "make", label: "Make", placeholder: "e.g. Porsche", required: true },
  { key: "model", label: "Model", placeholder: "e.g. 911", required: true },
  { key: "trim", label: "Trim", placeholder: "e.g. Carrera S", required: true },
  { key: "mileage", label: "Mileage", placeholder: "e.g. 24500", required: true },
  { key: "exteriorColor", label: "Exterior Color", placeholder: "e.g. Guards Red" },
  { key: "interiorColor", label: "Interior Color", placeholder: "e.g. Black" },
  { key: "vin", label: "VIN", placeholder: "Vehicle VIN" },
];

const FACTORY_EQUIPMENT_KEY = "factory-equipment:Packages";

/**
 * Type-adaptive vehicle details — gates and fields aligned with mobile listing.
 */
export function VehicleDetailsScreen() {
  const { draft, updateDetails, updateWorkspace, updatePerformanceSummary } =
    useListingBuilder();
  const issues = getIssuesForStep(draft, "details");

  const isStock = draft.listingTypeId === "stock-lightly-modified";
  const isModified = draft.listingTypeId === "modified-performance";
  const isRestored = draft.listingTypeId === "restored-restomod-custom";
  const isRace = draft.listingTypeId === "race-track-car";

  const factoryEquipment =
    draft.modificationWorkspace.factorySpecOverrides?.[FACTORY_EQUIPMENT_KEY] ?? "";
  const performance = draft.modificationWorkspace.performanceSummary;
  const restoration = draft.modificationWorkspace.restoration;

  const description = isStock
    ? "Confirm VIN-imported factory information. All fields remain editable. Trim and mileage are required."
    : isModified
      ? "Confirm vehicle identity and current performance specifications. Trim and mileage are required."
      : isRestored
        ? "Confirm vehicle identity, build type, and mileage status. Trim, mileage, build type, and mileage status are required."
        : isRace
          ? "Organize race identity, numbers, builder details, and legal status. Year, make, and model are required."
          : "Confirm and complete your vehicle information.";

  if (isRace) {
    return (
      <ListingStep title="Vehicle Details" description={description}>
        <RaceIdentityFields />
      </ListingStep>
    );
  }

  return (
    <ListingStep title="Vehicle Details" description={description}>
      <div className="space-y-6">
        <ListingSection title="Core details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CORE_FIELDS.map((field) => {
              const fieldIssue = issues.find((issue) => issue.field === field.key);
              return (
                <div key={field.key} className={field.key === "vin" ? "sm:col-span-2" : undefined}>
                  <FieldLabel htmlFor={`detail-${field.key}`}>
                    {field.label}
                    {field.required ? " *" : ""}
                  </FieldLabel>
                  <Input
                    id={`detail-${field.key}`}
                    value={draft.details[field.key]}
                    onChange={(e) =>
                      updateDetails({
                        [field.key]:
                          field.key === "vin"
                            ? e.target.value.toUpperCase()
                            : field.key === "mileage"
                              ? e.target.value.replace(/[^\d,]/g, "")
                              : e.target.value,
                      })
                    }
                    placeholder={field.placeholder}
                    className={
                      field.key === "vin"
                        ? "font-mono tracking-wide uppercase"
                        : fieldIssue
                          ? "border-destructive"
                          : undefined
                    }
                    aria-invalid={Boolean(fieldIssue)}
                  />
                  {fieldIssue ? (
                    <p className="text-xs text-destructive mt-1.5">{fieldIssue.message}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
          <FieldHint>
            Trim and mileage are required to continue. Values stay in the listing draft as you move
            between steps.
          </FieldHint>
        </ListingSection>

        {isStock ? (
          <ListingSection
            title="Factory Information"
            description="Imported from VIN decode when available."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(
                [
                  ["engine", "Factory Engine"],
                  ["transmission", "Transmission"],
                  ["drivetrain", "Drivetrain"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <FieldLabel htmlFor={`factory-${key}`}>{label}</FieldLabel>
                  <Input
                    id={`factory-${key}`}
                    value={draft.details[key]}
                    onChange={(e) => updateDetails({ [key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="factory-equipment">Factory Equipment</FieldLabel>
                <Input
                  id="factory-equipment"
                  value={factoryEquipment}
                  onChange={(e) =>
                    updateWorkspace({
                      factorySpecOverrides: {
                        ...(draft.modificationWorkspace.factorySpecOverrides ?? {}),
                        [FACTORY_EQUIPMENT_KEY]: e.target.value,
                      },
                    })
                  }
                  placeholder="Factory packages and equipment"
                />
              </div>
            </div>
          </ListingSection>
        ) : null}

        {isRestored ? (
          <ListingSection
            title="Restoration Details"
            description="Build type and mileage status are required for this listing type."
          >
            {restoration.identityType ? (
              <div className="rounded-xl border bg-muted/30 px-4 py-3 mb-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Vehicle Identified By
                </p>
                <p className="mt-1 text-sm font-semibold">{restoration.identityType}</p>
              </div>
            ) : null}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Build Type *</FieldLabel>
                <Select
                  value={restoration.buildType || undefined}
                  onValueChange={(v) =>
                    updateWorkspace({
                      restoration: {
                        ...restoration,
                        buildType: v as RestorationBuildTypeId,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select build type" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESTORATION_BUILD_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FieldLabel>Mileage Status *</FieldLabel>
                <Select
                  value={restoration.mileageStatus || undefined}
                  onValueChange={(v) =>
                    updateWorkspace({
                      restoration: { ...restoration, mileageStatus: v },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mileage status" />
                  </SelectTrigger>
                  <SelectContent>
                    {MILEAGE_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ListingSection>
        ) : null}

        {isModified ? (
          <ListingSection
            title="Performance Specifications"
            description="Current build output for this Modified / Performance listing."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(
                [
                  ["currentEngine", "Current Engine", performance.currentEngine],
                  ["transmission", "Current Transmission", performance.transmission],
                  ["drivetrain", "Current Drivetrain", performance.drivetrain],
                  ["horsepower", "Horsepower", performance.horsepower],
                  ["torque", "Torque", performance.torque],
                  ["fuelType", "Fuel Type", performance.fuelType],
                  ["tuningPlatform", "Tuning Platform", performance.tuningPlatform],
                ] as const
              ).map(([key, label, value]) => (
                <div key={key}>
                  <FieldLabel htmlFor={`perf-${key}`}>{label}</FieldLabel>
                  <Input
                    id={`perf-${key}`}
                    value={value}
                    onChange={(e) => {
                      const next =
                        key === "horsepower" || key === "torque"
                          ? e.target.value.replace(/\D/g, "")
                          : e.target.value;
                      updatePerformanceSummary({ [key]: next });
                    }}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="perf-summary">Build Summary</FieldLabel>
                <Input
                  id="perf-summary"
                  value={performance.buildSummary}
                  onChange={(e) => updatePerformanceSummary({ buildSummary: e.target.value })}
                  placeholder="Short summary of the current build"
                />
              </div>
            </div>
          </ListingSection>
        ) : null}
      </div>
    </ListingStep>
  );
}
