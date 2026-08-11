"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import type { RaceCompetitionProfile, RaceVehicleIdentity } from "@/components/listing/types";
import {
  COMPETITION_LEVEL_OPTIONS,
  RACE_CLASS_OPTIONS,
  RACE_DISCIPLINE_OPTIONS,
  RACE_ELIGIBILITY_OPTIONS,
  RACE_LOGBOOK_STATUS_OPTIONS,
  RACE_SANCTIONING_BODY_OPTIONS,
  RACE_SERIES_OPTIONS,
  RACE_TECHNICAL_INSPECTION_OPTIONS,
} from "@/components/listing/specs/options";
import { MobileListingShell } from "../MobileListingShell";
import { MobileOptionList, MobileOptionSheet } from "../MobileOptionSheet";

type PickerKey = keyof Pick<
  RaceCompetitionProfile,
  | "primaryDiscipline"
  | "secondaryDiscipline"
  | "sanctioningBody"
  | "series"
  | "competitionClass"
  | "competitionLevel"
  | "currentEligibility"
  | "technicalInspection"
  | "logbookStatus"
>;

const PICKER_CONFIG: Record<
  PickerKey,
  { label: string; options: readonly string[]; placeholder: string }
> = {
  primaryDiscipline: {
    label: "Primary Discipline",
    options: RACE_DISCIPLINE_OPTIONS,
    placeholder: "Select primary discipline",
  },
  secondaryDiscipline: {
    label: "Secondary Discipline",
    options: RACE_DISCIPLINE_OPTIONS,
    placeholder: "Select secondary discipline",
  },
  sanctioningBody: {
    label: "Sanctioning Body",
    options: RACE_SANCTIONING_BODY_OPTIONS,
    placeholder: "Select sanctioning body",
  },
  series: {
    label: "Series",
    options: RACE_SERIES_OPTIONS,
    placeholder: "Select series",
  },
  competitionClass: {
    label: "Class",
    options: RACE_CLASS_OPTIONS,
    placeholder: "Select class",
  },
  competitionLevel: {
    label: "Competition Level",
    options: COMPETITION_LEVEL_OPTIONS,
    placeholder: "Select competition level",
  },
  currentEligibility: {
    label: "Current Eligibility",
    options: RACE_ELIGIBILITY_OPTIONS,
    placeholder: "Select current eligibility",
  },
  technicalInspection: {
    label: "Technical Inspection",
    options: RACE_TECHNICAL_INSPECTION_OPTIONS,
    placeholder: "Select inspection status",
  },
  logbookStatus: {
    label: "Logbook Status",
    options: RACE_LOGBOOK_STATUS_OPTIONS,
    placeholder: "Select logbook status",
  },
};

function vehicleTypeLabel(identity: RaceVehicleIdentity) {
  const street = identity.streetBased === "Yes";
  const purpose = identity.purposeBuilt === "Yes";
  if (street && purpose) return "Converted Race Car";
  if (purpose) return "Purpose Built Race Car";
  if (street) return "Street Legal";
  return "";
}

function identityMethodLabel(identity: RaceVehicleIdentity, vin: string) {
  if (identity.noStreetVin === "Yes") return "No Street VIN";
  const value = (identity.vin || vin || "").trim();
  if (value.length === 17) return "Modern VIN";
  if (value) return "VIN";
  if (identity.chassisNumber) return "Chassis Number";
  if (identity.serialNumber) return "Serial Number";
  if (identity.logbookNumber) return "Logbook Number";
  return "Identity pending";
}

export function MobileRaceSummaryScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const race = draft.modificationWorkspace.race;
  const competition = race.competition;
  const identity = race.identity;
  const [picker, setPicker] = React.useState<PickerKey | null>(null);

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "race-track-car") {
      router.replace("/mobile-listing/specifications");
    }
  }, [draft.listingTypeId, router]);

  const patchCompetition = (patch: Partial<RaceCompetitionProfile>) => {
    updateWorkspace({
      race: {
        ...race,
        competition: { ...competition, notes: competition.notes ?? "", ...patch },
      },
    });
  };

  const trim = identity.chassisDesignation || identity.trim || draft.details.trim;
  const vehicleLabel =
    [
      identity.year || draft.details.year,
      identity.make || draft.details.make,
      identity.model || draft.details.model,
      trim,
    ]
      .filter(Boolean)
      .join(" ") || "Race / Track Car";

  const typeLabel = vehicleTypeLabel(identity);
  const methodLabel = identityMethodLabel(identity, draft.details.vin);

  return (
    <MobileListingShell
      stepId="race-summary"
      continueDisabled={false}
      continueHref="/mobile-listing/race/biography"
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            Competition Profile
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">
            Capture race summary details buyers need before reviewing the build.
          </p>
        </div>

        <div className="rounded-lg border border-[#e5e5ea] bg-[#fafafa] px-3 py-3">
          <p className="text-[14px] font-semibold text-[#1c1c1e]">{vehicleLabel}</p>
          {typeLabel ? <p className="mt-1 text-[12px] text-[#636366]">{typeLabel}</p> : null}
          <p className="mt-0.5 text-[12px] text-[#636366]">{methodLabel}</p>
        </div>

        <div className="flex flex-col gap-4">
          {(Object.keys(PICKER_CONFIG) as PickerKey[]).map((key) => (
            <PickerField
              key={key}
              label={PICKER_CONFIG[key].label}
              value={competition[key]}
              placeholder={PICKER_CONFIG[key].placeholder}
              onClick={() => setPicker(key)}
            />
          ))}

          <label className="block space-y-1.5">
            <span className="text-[12px] font-semibold text-[#636366]">Notes</span>
            <textarea
              value={competition.notes ?? ""}
              onChange={(event) => patchCompetition({ notes: event.target.value })}
              placeholder="Add any additional competition profile details"
              className="min-h-24 w-full resize-none rounded-lg border border-[#e5e5ea] p-3 text-[13px] leading-relaxed outline-none focus:border-[#1b1464]"
            />
          </label>
        </div>
      </div>

      {picker ? (
        <OptionSheet
          label={PICKER_CONFIG[picker].label}
          options={[...PICKER_CONFIG[picker].options]}
          value={competition[picker]}
          onClose={() => setPicker(null)}
          onSelect={(value) => {
            patchCompetition({ [picker]: value });
            setPicker(null);
          }}
        />
      ) : null}
    </MobileListingShell>
  );
}

function PickerField({
  label,
  value,
  placeholder,
  onClick,
}: {
  label: string;
  value: string;
  placeholder: string;
  onClick: () => void;
}) {
  return (
    <div className="block space-y-1.5">
      <span className="text-[12px] font-semibold text-[#636366]">{label}</span>
      <button
        type="button"
        onClick={onClick}
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
