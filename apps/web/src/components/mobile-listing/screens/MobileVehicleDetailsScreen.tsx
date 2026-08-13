"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import {
  HORSEPOWER_STATUS_OPTIONS,
  TORQUE_STATUS_OPTIONS,
} from "@/components/listing/specs/options";
import { RESTORATION_BUILD_TYPES } from "@/components/listing/specs/restored-restomod";
import type { RestorationBuildTypeId } from "@/components/listing/types";
import { MobileListingShell } from "../MobileListingShell";
import { MobileOptionList, MobileOptionSheet } from "../MobileOptionSheet";
import { MobileRaceIdentityFields } from "./MobileRaceIdentityFields";
import {
  EXTERIOR_COLOR_OPTIONS,
  INTERIOR_COLOR_OPTIONS,
  VEHICLE_DETAILS_COPY,
} from "@/components/listing/vehicle-details-copy";
import { afterDetailsHrefMobile } from "@/components/listing/shared-finish-sequence";
import type { ListingVehicleDetails } from "@/components/listing/types";

const RESTORED_MILEAGE_STATUS_OPTIONS = [
  "Actual",
  "Exempt",
  "Odometer Replaced",
  "Odometer Rolled Over",
  "Unknown",
] as const;

const IDENTITY_SELECT_FIELDS = [
  { label: "Year", key: "year" as const, placeholder: "Select year" },
  { label: "Make", key: "make" as const, placeholder: "Select make" },
  { label: "Model", key: "model" as const, placeholder: "Select model" },
];

const COLOR_PICKERS = [
  {
    label: VEHICLE_DETAILS_COPY.primaryColor,
    key: "exteriorColor" as const,
    placeholder: VEHICLE_DETAILS_COPY.primaryColorPlaceholder,
  },
  {
    label: VEHICLE_DETAILS_COPY.secondaryColor,
    key: "secondaryExteriorColor" as const,
    placeholder: VEHICLE_DETAILS_COPY.secondaryColorPlaceholder,
  },
  {
    label: "Interior Color",
    key: "interiorColor" as const,
    placeholder: "Select color",
  },
] as const;

type ColorPickerKey = (typeof COLOR_PICKERS)[number]["key"];
type DetailsPickerKey = (typeof IDENTITY_SELECT_FIELDS)[number]["key"] | ColorPickerKey;

const FIELD_OPTIONS: Record<string, string[]> = {
  year: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"],
  make: ["Porsche", "BMW", "Ford", "Audi", "Mercedes-Benz", "Toyota"],
  model: ["911 GT3", "M3", "Mustang", "RS 6", "AMG GT"],
  exteriorColor: [...EXTERIOR_COLOR_OPTIONS],
  secondaryExteriorColor: ["None", ...EXTERIOR_COLOR_OPTIONS],
  interiorColor: [...INTERIOR_COLOR_OPTIONS],
};

const FACTORY_EQUIPMENT_KEY = "factory-equipment:Packages";

const IDENTITY_TYPE_HELPERS: Record<string, string> = {
  "Modern VIN": "17-character VIN",
  "Older VIN": "Pre-1981 or non-standard VIN",
  "Serial Number": "Manufacturer serial number",
  "Chassis Number": "Chassis or frame number",
  "State Assigned VIN": "State-issued replacement VIN",
  "Manual Entry": "Manually entered vehicle identity",
};

export function MobileVehicleDetailsScreen() {
  const { draft, updateDetails, updateWorkspace, updatePerformanceSummary } =
    useListingBuilder();
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const [picker, setPicker] = React.useState<DetailsPickerKey | null>(null);
  const [statusSheet, setStatusSheet] = React.useState<"horsepower" | "torque" | null>(null);
  const [restoredPicker, setRestoredPicker] = React.useState<"buildType" | "mileageStatus" | null>(
    null
  );

  const imported = new Set(draft.vinImportedFields ?? []);
  const noVin = !draft.details.vin && !draft.vinInput;

  const isStock = draft.listingTypeId === "stock-lightly-modified";
  const isModified = draft.listingTypeId === "modified-performance";
  const isRestored = draft.listingTypeId === "restored-restomod-custom";
  const isRace = draft.listingTypeId === "race-track-car";
  const factoryEquipment =
    draft.modificationWorkspace.factorySpecOverrides?.[FACTORY_EQUIPMENT_KEY] ?? "";
  const performance = draft.modificationWorkspace.performanceSummary;
  const restoration = draft.modificationWorkspace.restoration;
  const raceIdentity = draft.modificationWorkspace.race.identity;

  const isValid = isRace
    ? Boolean(
        (raceIdentity.year || draft.details.year) &&
          (raceIdentity.make || draft.details.make) &&
          (raceIdentity.model || draft.details.model)
      )
    : Boolean(
        draft.details.year &&
          draft.details.make &&
          draft.details.model &&
          draft.details.trim &&
          draft.details.mileage &&
          (!isRestored || (restoration.buildType && restoration.mileageStatus))
      );

  const continueHref = !isValid
    ? undefined
    : afterDetailsHrefMobile(draft.listingTypeId);

  return (
    <MobileListingShell
      stepId="details"
      continueDisabled={!isValid}
      continueHref={continueHref}
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            {VEHICLE_DETAILS_COPY.title}
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">
            {VEHICLE_DETAILS_COPY.subtext}
          </p>
          {noVin ? (
            <p className="text-[12px] text-[#636366]">
              No VIN on file — enter identity details manually on this same screen.
            </p>
          ) : null}
        </div>

        {isRace ? (
          <MobileRaceIdentityFields />
        ) : (
        <div className="flex flex-col gap-3">
          {IDENTITY_SELECT_FIELDS.map(({ label, key, placeholder }) => (
            <SelectField
              key={key}
              label={label}
              value={draft.details[key]}
              placeholder={placeholder}
              vinImported={imported.has(key) && Boolean(draft.details[key])}
              active={focusedField === key}
              onFocus={() => setPicker(key)}
              onChange={(value) => updateDetails({ [key]: value })}
            />
          ))}

          <TextField
            label="Trim"
            value={draft.details.trim}
            placeholder="Enter trim"
            vinImported={imported.has("trim") && Boolean(draft.details.trim)}
            onChange={(value) => updateDetails({ trim: value })}
          />

          <TextField
            label="Mileage"
            value={draft.details.mileage}
            placeholder={VEHICLE_DETAILS_COPY.mileagePlaceholder}
            inputMode="numeric"
            required
            active={focusedField === "mileage"}
            onFocus={() => setFocusedField("mileage")}
            onChange={(value) => updateDetails({ mileage: value.replace(/[^\d,]/g, "") })}
          />

          {COLOR_PICKERS.map(({ label, key, placeholder }) => (
            <SelectField
              key={key}
              label={label}
              value={
                key === "secondaryExteriorColor" && !draft.details.secondaryExteriorColor
                  ? ""
                  : draft.details[key]
              }
              placeholder={placeholder}
              vinImported={
                key === "exteriorColor" &&
                imported.has("exteriorColor") &&
                Boolean(draft.details.exteriorColor)
              }
              active={focusedField === key}
              onFocus={() => setPicker(key)}
              onChange={(value) =>
                updateDetails({
                  [key]:
                    key === "secondaryExteriorColor" && value === "None" ? "" : value,
                } as Partial<ListingVehicleDetails>)
              }
            />
          ))}

          <TextField
            label="VIN"
            value={draft.details.vin}
            placeholder={
              noVin
                ? "Optional for classics, race, kit, or custom vehicles"
                : "Vehicle VIN"
            }
            vinImported={imported.has("vin") && Boolean(draft.details.vin)}
            onChange={(value) => updateDetails({ vin: value.toUpperCase() })}
          />

          {isStock ? (
            <>
              <div className="pt-2">
                <p className="text-[12px] font-bold uppercase tracking-wide text-[#1b1464]">
                  Factory Information
                </p>
                <p className="mt-1 text-[12px] text-[#636366]">Imported from VIN decode</p>
              </div>
              <TextField
                label="Factory Engine"
                value={draft.details.engine}
                placeholder="Enter factory engine"
                onChange={(value) => updateDetails({ engine: value })}
              />
              <TextField
                label="Transmission"
                value={draft.details.transmission}
                placeholder="Enter transmission"
                onChange={(value) => updateDetails({ transmission: value })}
              />
              <TextField
                label="Drivetrain"
                value={draft.details.drivetrain}
                placeholder="Enter drivetrain"
                onChange={(value) => updateDetails({ drivetrain: value })}
              />
              <TextField
                label="Factory Equipment"
                value={factoryEquipment}
                placeholder="Enter factory packages and equipment"
                onChange={(value) =>
                  updateWorkspace({
                    factorySpecOverrides: {
                      ...(draft.modificationWorkspace.factorySpecOverrides ?? {}),
                      [FACTORY_EQUIPMENT_KEY]: value,
                    },
                  })
                }
              />
            </>
          ) : null}

          {isRestored ? (
            <>
              <div className="pt-2">
                <p className="text-[12px] font-bold uppercase tracking-wide text-[#1b1464]">
                  Restoration Details
                </p>
                <p className="mt-1 text-[12px] text-[#636366]">
                  Build type and mileage status required for this listing type
                </p>
              </div>
              {restoration.identityType ? (
                <div className="rounded-lg bg-[#f4f5fc] px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#7b78a3]">
                    Vehicle Identified By
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-[#1b1464]">
                    {restoration.identityType}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#636366]">
                    {IDENTITY_TYPE_HELPERS[restoration.identityType] || "Identity on file"}
                  </p>
                </div>
              ) : null}
              <SelectField
                label="Build Type"
                value={
                  RESTORATION_BUILD_TYPES.find((type) => type.id === restoration.buildType)?.label ??
                  ""
                }
                placeholder="Select build type"
                onFocus={() => setRestoredPicker("buildType")}
                onChange={() => undefined}
              />
              <SelectField
                label="Mileage Status"
                value={restoration.mileageStatus}
                placeholder="Select mileage status"
                onFocus={() => setRestoredPicker("mileageStatus")}
                onChange={() => undefined}
              />
            </>
          ) : null}

          {isModified ? (
            <>
              <div className="pt-2">
                <p className="text-[12px] font-bold uppercase tracking-wide text-[#1b1464]">
                  Performance Specifications
                </p>
                <p className="mt-1 text-[12px] text-[#636366]">
                  Current build output for this Modified / Performance listing
                </p>
              </div>
              <TextField
                label="Current Engine"
                value={performance.currentEngine}
                placeholder="e.g. 2.5L Turbo Flat-4"
                onChange={(value) => updatePerformanceSummary({ currentEngine: value })}
              />
              <TextField
                label="Current Transmission"
                value={performance.transmission}
                placeholder="e.g. 6-speed manual"
                onChange={(value) => updatePerformanceSummary({ transmission: value })}
              />
              <TextField
                label="Current Drivetrain"
                value={performance.drivetrain}
                placeholder="e.g. AWD"
                onChange={(value) => updatePerformanceSummary({ drivetrain: value })}
              />
              <StatusNumberField
                label="Horsepower"
                value={performance.horsepower}
                suffix="hp"
                status={performance.horsepowerStatus || "Factory Rated"}
                onStatus={() => setStatusSheet("horsepower")}
                onChange={(value) =>
                  updatePerformanceSummary({ horsepower: value.replace(/\D/g, "") })
                }
              />
              <StatusNumberField
                label="Torque"
                value={performance.torque}
                suffix="lb-ft"
                status={performance.torqueStatus || "Factory Rated"}
                onStatus={() => setStatusSheet("torque")}
                onChange={(value) =>
                  updatePerformanceSummary({ torque: value.replace(/\D/g, "") })
                }
              />
              <TextField
                label="Fuel Type"
                value={performance.fuelType}
                placeholder="e.g. 91 octane / E85"
                onChange={(value) => updatePerformanceSummary({ fuelType: value })}
              />
              <TextField
                label="Tuning Platform"
                value={performance.tuningPlatform}
                placeholder="e.g. Cobb Accessport"
                onChange={(value) => updatePerformanceSummary({ tuningPlatform: value })}
              />
              <label className="block space-y-1.5">
                <span className="text-[12px] font-semibold text-[#636366]">Build Summary</span>
                <textarea
                  value={performance.buildSummary}
                  onChange={(event) =>
                    updatePerformanceSummary({ buildSummary: event.target.value })
                  }
                  placeholder="Describe your build in a few sentences…"
                  className="min-h-28 w-full resize-none rounded-lg border border-[#e5e5ea] p-3 text-[13px] outline-none focus:border-[#1b1464]"
                />
              </label>
            </>
          ) : null}
        </div>
        )}
      </div>

      {picker ? (
        <SelectSheet
          label={
            IDENTITY_SELECT_FIELDS.find((field) => field.key === picker)?.label ??
            COLOR_PICKERS.find((field) => field.key === picker)?.label ??
            "Select"
          }
          options={FIELD_OPTIONS[picker] ?? []}
          value={
            picker === "secondaryExteriorColor" && !draft.details.secondaryExteriorColor
              ? "None"
              : draft.details[picker]
          }
          allowCustom={picker === "exteriorColor" || picker === "secondaryExteriorColor" || picker === "interiorColor"}
          onClose={() => setPicker(null)}
          onSelect={(value) => {
            if (picker === "secondaryExteriorColor") {
              updateDetails({ secondaryExteriorColor: value === "None" ? "" : value });
            } else {
              updateDetails({ [picker]: value });
            }
            setPicker(null);
          }}
        />
      ) : null}

      {statusSheet ? (
        <SelectSheet
          label={`${statusSheet === "horsepower" ? "Horsepower" : "Torque"} Status`}
          options={
            statusSheet === "horsepower"
              ? [...HORSEPOWER_STATUS_OPTIONS]
              : [...TORQUE_STATUS_OPTIONS]
          }
          value={
            statusSheet === "horsepower"
              ? performance.horsepowerStatus
              : performance.torqueStatus
          }
          onClose={() => setStatusSheet(null)}
          onSelect={(value) => {
            if (statusSheet === "horsepower") {
              updatePerformanceSummary({ horsepowerStatus: value });
            } else {
              updatePerformanceSummary({ torqueStatus: value });
            }
            setStatusSheet(null);
          }}
        />
      ) : null}

      {restoredPicker === "buildType" ? (
        <SelectSheet
          label="Build Type"
          options={RESTORATION_BUILD_TYPES.map((type) => type.label)}
          value={
            RESTORATION_BUILD_TYPES.find((type) => type.id === restoration.buildType)?.label ?? ""
          }
          onClose={() => setRestoredPicker(null)}
          onSelect={(label) => {
            const selected = RESTORATION_BUILD_TYPES.find((type) => type.label === label);
            if (selected) {
              updateWorkspace({
                restoration: {
                  ...restoration,
                  buildType: selected.id as RestorationBuildTypeId,
                },
              });
            }
            setRestoredPicker(null);
          }}
        />
      ) : null}

      {restoredPicker === "mileageStatus" ? (
        <SelectSheet
          label="Mileage Status"
          options={[...RESTORED_MILEAGE_STATUS_OPTIONS]}
          value={restoration.mileageStatus}
          onClose={() => setRestoredPicker(null)}
          onSelect={(value) => {
            updateWorkspace({
              restoration: {
                ...restoration,
                mileageStatus: value,
              },
            });
            setRestoredPicker(null);
          }}
        />
      ) : null}
    </MobileListingShell>
  );
}

function StatusNumberField({
  label,
  value,
  suffix,
  status,
  onStatus,
  onChange,
}: {
  label: string;
  value: string;
  suffix: string;
  status: string;
  onStatus: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="block space-y-1.5">
        <span className="text-[12px] font-semibold text-[#636366]">{label}</span>
        <div className="relative">
          <input
            value={value}
            inputMode="numeric"
            onChange={(event) => onChange(event.target.value)}
            className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 pr-12 text-[13px] outline-none focus:border-[#1b1464]"
          />
          <span className="pointer-events-none absolute right-3 top-3 text-[12px] text-[#636366]">
            {suffix}
          </span>
        </div>
      </label>
      <div className="block space-y-1.5">
        <span className="text-[12px] font-semibold text-[#636366]">{label} Status</span>
        <button
          type="button"
          onClick={onStatus}
          className="relative flex h-11 w-full items-center rounded-lg border border-[#e5e5ea] bg-white text-left transition-colors hover:border-[#c7c7cc]"
        >
          <span
            className={
              status ? "px-3 text-[13px] text-[#1c1c1e]" : "px-3 text-[13px] text-[#9ca3af]"
            }
          >
            {status || "Select status"}
          </span>
          <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[#636366]" />
        </button>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  placeholder: string;
  active?: boolean;
  required?: boolean;
  invalid?: boolean;
  vinImported?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  onFocus?: () => void;
  onChange: (value: string) => void;
}

function TextField({
  label,
  value,
  placeholder,
  active,
  required,
  invalid,
  vinImported,
  inputMode,
  onFocus,
  onChange,
}: FieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center gap-2 text-[12px] font-semibold text-[#636366]">
        {label} {required ? <span className="text-[#c44]">*</span> : null}
        {vinImported ? (
          <span className="rounded-full bg-[#ecebff] px-2 py-0.5 text-[10px] font-semibold text-[#1b1464]">
            {VEHICLE_DETAILS_COPY.vinImportedBadge}
          </span>
        ) : null}
      </span>
      <input
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onFocus={onFocus}
        onChange={(event) => onChange(event.target.value)}
        className={[
          "h-11 w-full rounded-lg border bg-white px-3 text-[13px] text-[#1c1c1e] outline-none transition-colors",
          invalid
            ? "border-[#ef7373] ring-1 ring-[#ef7373]/20"
            : active
              ? "border-[#1b1464] ring-2 ring-[#1b1464]/15"
              : "border-[#e5e5ea]",
        ].join(" ")}
      />
      {invalid ? <span className="text-[11px] text-[#d34a4a]">Mileage is required</span> : null}
    </label>
  );
}

function SelectField({ value, placeholder, onFocus, vinImported, ...props }: FieldProps) {
  return (
    <div className="block space-y-1.5">
      <span className="flex items-center gap-2 text-[12px] font-semibold text-[#636366]">
        {props.label}
        {vinImported ? (
          <span className="rounded-full bg-[#ecebff] px-2 py-0.5 text-[10px] font-semibold text-[#1b1464]">
            {VEHICLE_DETAILS_COPY.vinImportedBadge}
          </span>
        ) : null}
      </span>
      <button
        type="button"
        onClick={onFocus}
        className={[
          "relative flex h-11 w-full items-center rounded-lg border bg-white text-left transition-colors",
          props.active ? "border-[#1b1464] ring-2 ring-[#1b1464]/15" : "border-[#e5e5ea]",
        ].join(" ")}
      >
        <span className={value ? "px-3 text-[13px] text-[#1c1c1e]" : "px-3 text-[13px] text-[#9ca3af]"}>
          {value || placeholder}
        </span>
        <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[#636366]" />
      </button>
    </div>
  );
}

function SelectSheet({
  label,
  options,
  value,
  allowCustom = false,
  onClose,
  onSelect,
}: {
  label: string;
  options: string[];
  value: string;
  allowCustom?: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
}) {
  const [addingCustom, setAddingCustom] = React.useState(false);
  const [customColor, setCustomColor] = React.useState("");

  return (
    <MobileOptionSheet open title={`Select ${label}`} onClose={onClose}>
      <MobileOptionList
        options={options}
        value={value}
        onSelect={(next) => {
          onSelect(next);
        }}
      />
      {allowCustom ? (
        addingCustom ? (
          <div className="mt-4 flex gap-2">
            <input
              autoFocus
              value={customColor}
              onChange={(event) => setCustomColor(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && customColor.trim()) {
                  onSelect(customColor.trim());
                }
              }}
              placeholder="Enter custom color"
              className="h-10 min-w-0 flex-1 rounded-lg border border-[#1b1464] px-3 text-[13px] outline-none"
            />
            <button
              type="button"
              disabled={!customColor.trim()}
              onClick={() => onSelect(customColor.trim())}
              className="h-10 rounded-lg bg-[#1b1464] px-4 text-[13px] font-semibold text-white disabled:bg-[#e5e5ea] disabled:text-[#9ca3af]"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddingCustom(true)}
            className="mt-3 h-10 w-full rounded-lg border border-dashed border-[#1b1464] text-[13px] font-semibold text-[#1b1464]"
          >
            + Add custom color
          </button>
        )
      ) : null}
    </MobileOptionSheet>
  );
}
