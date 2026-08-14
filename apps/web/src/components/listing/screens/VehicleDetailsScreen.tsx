"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldHint, FieldLabel, textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import type { ListingVehicleDetails, RestorationBuildTypeId, RestomodSubcategoryId } from "../types";
import { getIssuesForStep } from "../services/validation-service";
import {
  MILEAGE_STATUS_OPTIONS,
  normalizeMileageStatus,
  HORSEPOWER_STATUS_OPTIONS,
  TORQUE_STATUS_OPTIONS,
  WORK_PERFORMED_BY_OPTIONS,
  BUILD_STATUS_OPTIONS,
  shouldShowShopBuilder,
  shouldShowCompletionYear,
} from "../specs/options";
import {
  FLOW3_BUILD_OVERVIEW_COPY,
  RESTORATION_BUILD_TYPES,
  RESTOMODE_SUBCATEGORIES,
  isRestomodBuild,
  restorationBuildTypePatch,
  restorationBuildStatusPatch,
  restorationWorkPerformedByPatch,
} from "../specs/restored-restomod";
import { ListingShopBuilderField } from "../shop-builder/ListingShopBuilderField";
import { RaceIdentityFields } from "./RaceIdentityFields";
import {
  EXTERIOR_COLOR_OPTIONS,
  INTERIOR_COLOR_OPTIONS,
  VEHICLE_DETAILS_COPY,
} from "../vehicle-details-copy";
import { VIN_IDENTIFY_COPY } from "../vin-identify-copy";

const IDENTITY_FIELDS: {
  key: keyof ListingVehicleDetails;
  label: string;
  placeholder: string;
  required?: boolean;
}[] = [
  { key: "year", label: "Year", placeholder: "e.g. 2019", required: true },
  { key: "make", label: "Make", placeholder: "e.g. Porsche", required: true },
  { key: "model", label: "Model", placeholder: "e.g. 911", required: true },
  { key: "trim", label: "Trim", placeholder: "e.g. Carrera S", required: true },
  { key: "mileage", label: "Mileage", placeholder: VEHICLE_DETAILS_COPY.mileagePlaceholder, required: true },
];

const FACTORY_EQUIPMENT_KEY = "factory-equipment:Packages";

function VinImportedBadge() {
  return (
    <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
      {VEHICLE_DETAILS_COPY.vinImportedBadge}
    </span>
  );
}

/**
 * Shared Vehicle Details for every listing flow (VIN and no-VIN).
 * Exterior supports Primary + Secondary color.
 */
export function VehicleDetailsScreen() {
  const { draft, updateDetails, updateWorkspace, updatePerformanceSummary } =
    useListingBuilder();
  const issues = getIssuesForStep(draft, "details");
  const imported = new Set(draft.vinImportedFields ?? []);

  const isStock = draft.listingTypeId === "stock-lightly-modified";
  const isModified = draft.listingTypeId === "modified-performance";
  const isRestored = draft.listingTypeId === "restored-restomod-custom";
  const isRace = draft.listingTypeId === "race-track-car";

  const factoryEquipment =
    draft.modificationWorkspace.factorySpecOverrides?.[FACTORY_EQUIPMENT_KEY] ?? "";
  const performance = draft.modificationWorkspace.performanceSummary;
  const restoration = draft.modificationWorkspace.restoration;
  const noVin = !draft.details.vin && !draft.vinInput;

  if (isRace) {
    return (
      <ListingStep title={VEHICLE_DETAILS_COPY.title} description={VEHICLE_DETAILS_COPY.subtext}>
        <RaceIdentityFields />
      </ListingStep>
    );
  }

  return (
    <ListingStep title={VEHICLE_DETAILS_COPY.title} description={VEHICLE_DETAILS_COPY.subtext}>
      <div className="space-y-6">
        <ListingSection
          title="Core details"
          description={
            noVin
              ? "No VIN on file — enter identity details manually on this same screen."
              : "Confirm or correct VIN-imported values. All fields stay editable."
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {IDENTITY_FIELDS.map((field) => {
              const fieldIssue = issues.find((issue) => issue.field === field.key);
              const isImported = imported.has(field.key) && Boolean(draft.details[field.key]);
              return (
                <div key={field.key}>
                  <FieldLabel htmlFor={`detail-${field.key}`}>
                    {field.label}
                    {field.required ? " *" : ""}
                    {isImported ? <VinImportedBadge /> : null}
                  </FieldLabel>
                  <Input
                    id={`detail-${field.key}`}
                    value={draft.details[field.key]}
                    onChange={(e) =>
                      updateDetails({
                        [field.key]:
                          field.key === "mileage"
                            ? e.target.value.replace(/[^\d,]/g, "")
                            : e.target.value,
                      })
                    }
                    placeholder={field.placeholder}
                    className={fieldIssue ? "border-destructive" : undefined}
                    aria-invalid={Boolean(fieldIssue)}
                  />
                  {fieldIssue ? (
                    <p className="text-xs text-destructive mt-1.5">{fieldIssue.message}</p>
                  ) : null}
                </div>
              );
            })}

            <div>
              <FieldLabel htmlFor="detail-exterior-primary">
                {VEHICLE_DETAILS_COPY.primaryColor}
                {imported.has("exteriorColor") && draft.details.exteriorColor ? (
                  <VinImportedBadge />
                ) : null}
              </FieldLabel>
              <Select
                value={draft.details.exteriorColor || undefined}
                onValueChange={(v) => updateDetails({ exteriorColor: v })}
              >
                <SelectTrigger id="detail-exterior-primary">
                  <SelectValue placeholder={VEHICLE_DETAILS_COPY.primaryColorPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {EXTERIOR_COLOR_OPTIONS.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                  {draft.details.exteriorColor &&
                  !EXTERIOR_COLOR_OPTIONS.includes(
                    draft.details.exteriorColor as (typeof EXTERIOR_COLOR_OPTIONS)[number]
                  ) ? (
                    <SelectItem value={draft.details.exteriorColor}>
                      {draft.details.exteriorColor}
                    </SelectItem>
                  ) : null}
                </SelectContent>
              </Select>
            </div>

            <div>
              <FieldLabel htmlFor="detail-exterior-secondary">
                {VEHICLE_DETAILS_COPY.secondaryColor}
              </FieldLabel>
              <Select
                value={draft.details.secondaryExteriorColor || "None"}
                onValueChange={(v) =>
                  updateDetails({ secondaryExteriorColor: v === "None" ? "" : v })
                }
              >
                <SelectTrigger id="detail-exterior-secondary">
                  <SelectValue placeholder={VEHICLE_DETAILS_COPY.secondaryColorPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  {EXTERIOR_COLOR_OPTIONS.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <FieldLabel htmlFor="detail-interior">Interior Color</FieldLabel>
              <Select
                value={draft.details.interiorColor || undefined}
                onValueChange={(v) => updateDetails({ interiorColor: v })}
              >
                <SelectTrigger id="detail-interior">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {INTERIOR_COLOR_OPTIONS.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                  {draft.details.interiorColor &&
                  !INTERIOR_COLOR_OPTIONS.includes(
                    draft.details.interiorColor as (typeof INTERIOR_COLOR_OPTIONS)[number]
                  ) ? (
                    <SelectItem value={draft.details.interiorColor}>
                      {draft.details.interiorColor}
                    </SelectItem>
                  ) : null}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <FieldLabel htmlFor="detail-vin">
                VIN
                {imported.has("vin") && draft.details.vin ? <VinImportedBadge /> : null}
              </FieldLabel>
              <Input
                id="detail-vin"
                value={draft.details.vin}
                onChange={(e) => updateDetails({ vin: e.target.value.toUpperCase() })}
                placeholder={
                  noVin
                    ? "Optional — leave blank for classics, race, kit, or custom vehicles"
                    : "Vehicle VIN"
                }
                className="font-mono tracking-wide uppercase"
              />
              {noVin ? (
                <FieldHint>
                  {VIN_IDENTIFY_COPY.withoutVin.description}
                </FieldHint>
              ) : null}
            </div>
          </div>
          <FieldHint>
            Trim and mileage are required to continue. VIN-imported values stay editable.
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
                  <FieldLabel htmlFor={`factory-${key}`}>
                    {label}
                    {imported.has(key) && draft.details[key] ? <VinImportedBadge /> : null}
                  </FieldLabel>
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
            title={FLOW3_BUILD_OVERVIEW_COPY.title}
            description={FLOW3_BUILD_OVERVIEW_COPY.description}
          >
            {restoration.identityType ? (
              <div className="rounded-xl border bg-muted/30 px-4 py-3 mb-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Vehicle Identified By
                </p>
                <p className="mt-1 text-sm font-semibold">{restoration.identityType}</p>
              </div>
            ) : null}
            <p className="text-xs text-muted-foreground mb-4">
              {FLOW3_BUILD_OVERVIEW_COPY.survivorHint}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Build Type *</FieldLabel>
                <Select
                  value={restoration.buildType || undefined}
                  onValueChange={(v) =>
                    updateWorkspace({
                      restoration: {
                        ...restoration,
                        ...restorationBuildTypePatch(
                          restoration,
                          v as RestorationBuildTypeId
                        ),
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
                {RESTORATION_BUILD_TYPES.find((type) => type.id === restoration.buildType)
                  ?.description ? (
                  <FieldHint>
                    {
                      RESTORATION_BUILD_TYPES.find((type) => type.id === restoration.buildType)
                        ?.description
                    }
                  </FieldHint>
                ) : null}
              </div>
              {isRestomodBuild(restoration.buildType) ? (
                <div>
                  <FieldLabel>{FLOW3_BUILD_OVERVIEW_COPY.restomodSubcategoryLabel}</FieldLabel>
                  <Select
                    value={restoration.restomodSubcategory || undefined}
                    onValueChange={(v) =>
                      updateWorkspace({
                        restoration: {
                          ...restoration,
                          restomodSubcategory: v as RestomodSubcategoryId,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESTOMODE_SUBCATEGORIES.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldHint>{FLOW3_BUILD_OVERVIEW_COPY.restomodSubcategoryHint}</FieldHint>
                </div>
              ) : null}
              <div>
                <FieldLabel>Build Status *</FieldLabel>
                <Select
                  value={restoration.buildStatus || undefined}
                  onValueChange={(v) =>
                    updateWorkspace({
                      restoration: {
                        ...restoration,
                        ...restorationBuildStatusPatch(restoration, v),
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select build status" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUILD_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {shouldShowCompletionYear(restoration.buildStatus) ? (
                <>
                  <div>
                    <FieldLabel htmlFor="completion-year">Completion Year</FieldLabel>
                    <Input
                      id="completion-year"
                      inputMode="numeric"
                      value={restoration.completionYear}
                      onChange={(e) =>
                        updateWorkspace({
                          restoration: {
                            ...restoration,
                            completionYear: e.target.value.replace(/\D/g, "").slice(0, 4),
                          },
                        })
                      }
                      placeholder="e.g. 2018"
                    />
                    <FieldHint>{FLOW3_BUILD_OVERVIEW_COPY.completionYearHint}</FieldHint>
                  </div>
                  <div>
                    <FieldLabel htmlFor="completion-date">Exact Date</FieldLabel>
                    <Input
                      id="completion-date"
                      type="date"
                      value={restoration.completionDate}
                      onChange={(e) =>
                        updateWorkspace({
                          restoration: {
                            ...restoration,
                            completionDate: e.target.value,
                          },
                        })
                      }
                    />
                    <FieldHint>Optional.</FieldHint>
                  </div>
                </>
              ) : null}
              <div>
                <FieldLabel>Work Performed By *</FieldLabel>
                <Select
                  value={restoration.workPerformedBy || undefined}
                  onValueChange={(v) =>
                    updateWorkspace({
                      restoration: {
                        ...restoration,
                        ...restorationWorkPerformedByPatch(restoration, v),
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select who performed the work" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_PERFORMED_BY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {shouldShowShopBuilder(restoration.workPerformedBy) ? (
                <div>
                  <ListingShopBuilderField
                    label="Builder / Restoration Shop"
                    value={restoration.shopBuilder || restoration.factoryCorrect.restorationShop}
                    target="restoration.shop"
                    placeholder="Search or add a shop"
                  />
                  <FieldHint>{FLOW3_BUILD_OVERVIEW_COPY.shopBuilderHint}</FieldHint>
                </div>
              ) : null}
              <div>
                <FieldLabel>Mileage Status *</FieldLabel>
                <Select
                  value={normalizeMileageStatus(restoration.mileageStatus) || undefined}
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
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="restoration-build-summary">Build Summary</FieldLabel>
                <textarea
                  id="restoration-build-summary"
                  className={textareaClassName}
                  value={restoration.buildSummary}
                  onChange={(e) =>
                    updateWorkspace({
                      restoration: { ...restoration, buildSummary: e.target.value },
                    })
                  }
                  placeholder={FLOW3_BUILD_OVERVIEW_COPY.buildSummaryPlaceholder}
                />
              </div>
            </div>
          </ListingSection>
        ) : null}

        {isModified ? (
          <ListingSection
            title="Performance Specifications"
            description="Enter detailed output if you have it. Unsupported or unverified figures are shown as seller-reported."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(
                [
                  ["currentEngine", "Current Engine", performance.currentEngine],
                  ["transmission", "Current Transmission", performance.transmission],
                  ["drivetrain", "Current Drivetrain", performance.drivetrain],
                  ["fuelType", "Fuel Type", performance.fuelType],
                  ["tuningPlatform", "Tuning Platform", performance.tuningPlatform],
                ] as const
              ).map(([key, label, value]) => (
                <div key={key}>
                  <FieldLabel htmlFor={`perf-${key}`}>{label}</FieldLabel>
                  <Input
                    id={`perf-${key}`}
                    value={value}
                    onChange={(e) => updatePerformanceSummary({ [key]: e.target.value })}
                  />
                </div>
              ))}
              <div>
                <FieldLabel htmlFor="perf-horsepower">Horsepower</FieldLabel>
                <Input
                  id="perf-horsepower"
                  value={performance.horsepower}
                  onChange={(e) =>
                    updatePerformanceSummary({
                      horsepower: e.target.value.replace(/\D/g, ""),
                      horsepowerStatus:
                        performance.horsepowerStatus || "Seller Reported",
                    })
                  }
                />
              </div>
              <div>
                <FieldLabel>Horsepower Status</FieldLabel>
                <Select
                  value={performance.horsepowerStatus || undefined}
                  onValueChange={(v) => updatePerformanceSummary({ horsepowerStatus: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seller Reported" />
                  </SelectTrigger>
                  <SelectContent>
                    {HORSEPOWER_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FieldLabel htmlFor="perf-torque">Torque</FieldLabel>
                <Input
                  id="perf-torque"
                  value={performance.torque}
                  onChange={(e) =>
                    updatePerformanceSummary({
                      torque: e.target.value.replace(/\D/g, ""),
                      torqueStatus: performance.torqueStatus || "Seller Reported",
                    })
                  }
                />
              </div>
              <div>
                <FieldLabel>Torque Status</FieldLabel>
                <Select
                  value={performance.torqueStatus || undefined}
                  onValueChange={(v) => updatePerformanceSummary({ torqueStatus: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seller Reported" />
                  </SelectTrigger>
                  <SelectContent>
                    {TORQUE_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="perf-summary">Build Summary</FieldLabel>
                <Input
                  id="perf-summary"
                  value={performance.buildSummary}
                  onChange={(e) => updatePerformanceSummary({ buildSummary: e.target.value })}
                  placeholder="Short summary of the current build"
                />
                <FieldHint>
                  Dyno verified and factory-rated figures can be labeled as such. Anything else
                  remains seller-reported.
                </FieldHint>
              </div>
            </div>
          </ListingSection>
        ) : null}
      </div>
    </ListingStep>
  );
}
