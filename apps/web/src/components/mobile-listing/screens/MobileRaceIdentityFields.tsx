"use client";

import * as React from "react";
import { MobileOptionList, MobileOptionSheet } from "../MobileOptionSheet";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import type { RaceVehicleIdentity } from "@/components/listing/types";
import {
  RACE_STREET_VIN_AVAILABLE_OPTIONS,
  RACE_VEHICLE_TYPE_OPTIONS,
  STREET_LEGAL_STATUS_OPTIONS,
  TITLE_STATUS_OPTIONS,
} from "@/components/listing/specs/options";
import { MobileShopBuilderField } from "../shop-builder/MobileShopBuilderField";
import { useOpenShopBuilder } from "../shop-builder/useOpenShopBuilder";

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

type PickerKey =
  | "vehicleType"
  | "streetVinAvailable"
  | "streetLegalStatus"
  | "titleStatus";

export function MobileRaceIdentityFields() {
  const { draft, updateDetails, updateWorkspace } = useListingBuilder();
  const { openShopBuilder, opening } = useOpenShopBuilder();
  const race = draft.modificationWorkspace.race;
  const identity = race.identity;
  const [showAdditional, setShowAdditional] = React.useState(false);
  const [picker, setPicker] = React.useState<PickerKey | null>(null);

  const patchIdentity = (patch: Partial<RaceVehicleIdentity>) => {
    const next: RaceVehicleIdentity = {
      ...identity,
      ...patch,
    };
    if (patch.manufacturer !== undefined) {
      next.builderManufacturer = patch.manufacturer;
    }
    updateWorkspace({
      race: { ...race, identity: next },
    });

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

  const pickerConfig: Record<
    PickerKey,
    { label: string; options: readonly string[]; value: string; onSelect: (value: string) => void }
  > = {
    vehicleType: {
      label: "Vehicle Type",
      options: RACE_VEHICLE_TYPE_OPTIONS,
      value: vehicleTypeValue(identity),
      onSelect: setVehicleType,
    },
    streetVinAvailable: {
      label: "Street VIN Available",
      options: RACE_STREET_VIN_AVAILABLE_OPTIONS,
      value: streetVinAvailableValue(identity),
      onSelect: setStreetVinAvailable,
    },
    streetLegalStatus: {
      label: "Street Legal Status",
      options: STREET_LEGAL_STATUS_OPTIONS,
      value: identity.streetLegalStatus,
      onSelect: (value) => patchIdentity({ streetLegalStatus: value }),
    },
    titleStatus: {
      label: "Title Status",
      options: TITLE_STATUS_OPTIONS,
      value: identity.titleStatus,
      onSelect: (value) => patchIdentity({ titleStatus: value }),
    },
  };

  return (
    <div className="flex flex-col gap-6">
      <Section title="Race Identity" description="Core year, make, model, and chassis designation.">
        <TextField
          label="Year"
          value={identity.year || draft.details.year}
          onChange={(value) => patchIdentity({ year: value })}
        />
        <TextField
          label="Make"
          value={identity.make || draft.details.make}
          onChange={(value) => patchIdentity({ make: value })}
        />
        <TextField
          label="Model"
          value={identity.model || draft.details.model}
          onChange={(value) => patchIdentity({ model: value })}
        />
        <TextField
          label="Trim / Chassis Designation"
          value={trimChassis}
          onChange={(value) => patchIdentity({ trim: value, chassisDesignation: value })}
        />
        <SelectField
          label="Vehicle Type"
          value={vehicleTypeValue(identity)}
          placeholder="Select vehicle type"
          onPress={() => setPicker("vehicleType")}
        />
      </Section>

      <Section title="Vehicle Numbers" description="Identification numbers used for this race vehicle.">
        <TextField
          label="VIN"
          value={identity.vin || draft.details.vin}
          mono
          onChange={(value) => patchIdentity({ vin: value.toUpperCase() })}
        />
        <TextField
          label="Chassis Number"
          value={identity.chassisNumber}
          mono
          onChange={(value) => patchIdentity({ chassisNumber: value.toUpperCase() })}
        />
        <TextField
          label="Serial Number"
          value={identity.serialNumber}
          mono
          onChange={(value) => patchIdentity({ serialNumber: value.toUpperCase() })}
        />
        <TextField
          label="Logbook Number"
          value={identity.logbookNumber}
          mono
          onChange={(value) => patchIdentity({ logbookNumber: value.toUpperCase() })}
        />
        <SelectField
          label="Street VIN Available"
          value={streetVinAvailableValue(identity)}
          placeholder="Yes / No"
          onPress={() => setPicker("streetVinAvailable")}
        />
      </Section>

      <Section title="Builder Information" description="Who built or prepared this race vehicle.">
        <MobileShopBuilderField
          label="Builder"
          value={identity.builder ?? ""}
          placeholder="Search or add a builder"
          onPress={() =>
            openShopBuilder({
              target: "race.identity.builder",
              label: "Builder",
            })
          }
          busy={opening}
        />
      </Section>

      <Section title="Specifications" description="Build timing and usage metrics.">
        <TextField
          label="Build Year"
          value={identity.buildYear}
          onChange={(value) => patchIdentity({ buildYear: value })}
        />
        <TextField
          label="Mileage"
          value={identity.mileage || draft.details.mileage}
          onChange={(value) => patchIdentity({ mileage: value })}
        />
      </Section>

      <Section title="Legal Status" description="Street legality and title information.">
        <SelectField
          label="Street Legal Status"
          value={identity.streetLegalStatus}
          placeholder="Select street legal status"
          onPress={() => setPicker("streetLegalStatus")}
        />
        <SelectField
          label="Title Status"
          value={identity.titleStatus}
          placeholder="Select title status"
          onPress={() => setPicker("titleStatus")}
        />
      </Section>

      <section className="rounded-xl border border-[#e5e5ea]">
        <button
          type="button"
          onClick={() => setShowAdditional((open) => !open)}
          className="flex h-12 w-full items-center justify-between px-3 text-left"
        >
          <span className="text-[13px] font-semibold text-[#1c1c1e]">
            Additional Vehicle Details
          </span>
          {showAdditional ? (
            <ChevronDown className="h-4 w-4 text-[#636366]" />
          ) : (
            <ChevronRight className="h-4 w-4 text-[#636366]" />
          )}
        </button>
        {showAdditional ? (
          <div className="space-y-3 border-t border-[#e5e5ea] p-3">
            <p className="text-[12px] text-[#636366]">
              Optional identifiers and hour meters for buyers who need deeper detail.
            </p>
            <TextField
              label="Tub Number"
              value={identity.tubNumber}
              mono
              onChange={(value) => patchIdentity({ tubNumber: value.toUpperCase() })}
            />
            <TextField
              label="Builder Assigned ID"
              value={identity.builderAssignedId}
              mono
              onChange={(value) => patchIdentity({ builderAssignedId: value.toUpperCase() })}
            />
            <TextField
              label="Manufacturer"
              value={identity.manufacturer || identity.builderManufacturer || ""}
              onChange={(value) => patchIdentity({ manufacturer: value })}
            />
            <TextField
              label="Engine Hours"
              value={identity.engineHours}
              onChange={(value) => patchIdentity({ engineHours: value })}
            />
            <TextField
              label="Chassis Hours"
              value={identity.chassisHours}
              onChange={(value) => patchIdentity({ chassisHours: value })}
            />
          </div>
        ) : null}
      </section>

      {picker ? (
        <OptionSheet
          label={pickerConfig[picker].label}
          options={[...pickerConfig[picker].options]}
          value={pickerConfig[picker].value}
          onClose={() => setPicker(null)}
          onSelect={(value) => {
            pickerConfig[picker].onSelect(value);
            setPicker(null);
          }}
        />
      ) : null}
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-[12px] font-bold uppercase tracking-wide text-[#1b1464]">{title}</p>
        <p className="mt-1 text-[12px] text-[#636366]">{description}</p>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function TextField({
  label,
  value,
  mono,
  onChange,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[12px] font-semibold text-[#636366]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={[
          "h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]",
          mono ? "font-mono uppercase tracking-wide" : "",
        ].join(" ")}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  placeholder,
  onPress,
}: {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
}) {
  return (
    <div className="block space-y-1.5">
      <span className="text-[12px] font-semibold text-[#636366]">{label}</span>
      <button
        type="button"
        onClick={onPress}
        className="relative flex h-11 w-full items-center rounded-lg border border-[#e5e5ea] bg-white text-left transition-colors hover:border-[#c7c7cc]"
      >
        <span className={value ? "px-3 text-[13px] text-[#1c1c1e]" : "px-3 text-[13px] text-[#9ca3af]"}>
          {value || placeholder}
        </span>
        <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[#636366]" />
      </button>
    </div>
  );
}

function OptionSheet({
  label,
  options,
  value,
  onClose,
  onSelect,
}: {
  label: string;
  options: string[];
  value: string;
  onClose: () => void;
  onSelect: (value: string) => void;
}) {
    return (
    <MobileOptionSheet open title={label} onClose={onClose}>
      <MobileOptionList
        options={options}
        value={value}
        onSelect={onSelect}
      />
    </MobileOptionSheet>
  );
}
