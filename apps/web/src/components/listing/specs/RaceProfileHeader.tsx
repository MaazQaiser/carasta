"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FieldLabel, textareaClassName } from "../fields";
import type { RaceState } from "../types";
import {
  STREET_LEGAL_STATUS_OPTIONS,
  TITLE_STATUS_OPTIONS,
  YES_NO_OPTIONS,
} from "./options";
import {
  FLOW4_COMPETITION_HISTORY_COPY,
  FLOW4_DOCUMENTATION_COPY,
  FLOW4_PRIMARY_USE_COPY,
  FLOW4_SAFETY_COPY,
  ORGANIZED_COMPETITION_OPTIONS,
  SAFETY_EQUIPMENT_OPTIONS,
  isSafetyEquipmentDateId,
  patchSafetyServiceDate,
  primaryUseDisplayLabel,
  raceOrganizedCompetitionPatch,
  shouldShowCompetitionHistoryNarrative,
  toggleInstalledSafetyEquipment,
  type OrganizedCompetitionOption,
} from "./race-track";
import { SpecsCategoryTabs } from "./SpecsCategoryTabs";

const PROFILE_TABS = [
  { id: "identity", label: "Vehicle Identity" },
  { id: "safety", label: "Safety Equipment" },
  { id: "documentation", label: "Race / Track Documentation" },
  { id: "setup", label: "Setup Information" },
  { id: "history", label: "Competition History" },
] as const;

type ProfileTabId = (typeof PROFILE_TABS)[number]["id"];

function YesNoField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {YES_NO_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function RaceProfileHeader({
  value,
  onChange,
}: {
  value: RaceState;
  onChange: (patch: Partial<RaceState> | ((prev: RaceState) => RaceState)) => void;
}) {
  const [activeTab, setActiveTab] = React.useState<ProfileTabId>("identity");

  const patchIdentity = (patch: Partial<RaceState["identity"]>) =>
    onChange({ identity: { ...value.identity, ...patch } });
  const patchSetup = (patch: Partial<RaceState["setup"]>) =>
    onChange({ setup: { ...value.setup, ...patch } });

  return (
    <div className="rounded-2xl border bg-card p-3 sm:p-5 space-y-4 sm:space-y-5 min-w-0">
      <div className="rounded-xl border bg-muted/30 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {FLOW4_PRIMARY_USE_COPY.fieldLabel}
        </p>
        <p className="mt-1 text-sm font-semibold">
          {primaryUseDisplayLabel(value.competition) || "Not set"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Edit on Race / Track Use. Seller-reported — not a Carasta eligibility or rulebook check.
        </p>
      </div>

      <SpecsCategoryTabs
        categories={[...PROFILE_TABS]}
        activeCategoryId={activeTab}
        onSelect={(id) => setActiveTab(id as ProfileTabId)}
        ariaLabel="Race profile sections"
      />

      {activeTab === "identity" ? (
      <div className="space-y-5">
        <div>
          <h3 className="font-semibold text-base">Vehicle Identity</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Race chassis identifiers, builder details, and legality status for this competition vehicle.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(
            [
              ["year", "Year"],
              ["make", "Make"],
              ["model", "Model"],
              ["trim", "Trim"],
              ["chassisDesignation", "Chassis Designation"],
              ["buildYear", "Build Year"],
              ["builderManufacturer", "Builder / Manufacturer"],
              ["vin", "VIN"],
              ["chassisNumber", "Chassis Number"],
              ["tubNumber", "Tub Number"],
              ["serialNumber", "Serial Number"],
              ["logbookNumber", "Logbook Number"],
              ["builderAssignedId", "Builder Assigned ID"],
              ["mileage", "Mileage"],
              ["engineHours", "Engine Hours"],
              ["chassisHours", "Chassis Hours"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <FieldLabel htmlFor={`race-id-${key}`}>{label}</FieldLabel>
              <Input
                id={`race-id-${key}`}
                value={value.identity[key]}
                onChange={(e) =>
                  patchIdentity({
                    [key]:
                      key === "vin" || key.includes("Number") || key === "builderAssignedId"
                        ? e.target.value.toUpperCase()
                        : e.target.value,
                  })
                }
                placeholder={label}
                className={
                  key === "vin" || key.includes("Number") || key === "builderAssignedId"
                    ? "font-mono tracking-wide uppercase"
                    : undefined
                }
              />
            </div>
          ))}
          <YesNoField
            label="Street Based"
            value={value.identity.streetBased}
            onChange={(v) => patchIdentity({ streetBased: v })}
          />
          <YesNoField
            label="Purpose Built"
            value={value.identity.purposeBuilt}
            onChange={(v) => patchIdentity({ purposeBuilt: v })}
          />
          <YesNoField
            label="No Street VIN"
            value={value.identity.noStreetVin}
            onChange={(v) => patchIdentity({ noStreetVin: v })}
          />
          <div>
            <FieldLabel>Street Legal Status</FieldLabel>
            <Select
              value={value.identity.streetLegalStatus || undefined}
              onValueChange={(v) => patchIdentity({ streetLegalStatus: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
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
              value={value.identity.titleStatus || undefined}
              onValueChange={(v) => patchIdentity({ titleStatus: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select title status" />
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
      </div>
      ) : null}

      {activeTab === "safety" ? (
      <div className="space-y-5">
        <div>
          <h3 className="font-semibold text-base">{FLOW4_SAFETY_COPY.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{FLOW4_SAFETY_COPY.subtext}</p>
        </div>
        <div className="space-y-2">
          {SAFETY_EQUIPMENT_OPTIONS.map((option) => {
            const selected = (value.installedSafetyEquipment ?? []).includes(option.id);
            const dateId = isSafetyEquipmentDateId(option.id) ? option.id : null;
            return (
              <div key={option.id} className="space-y-2">
                <button
                  type="button"
                  onClick={() => onChange(toggleInstalledSafetyEquipment(value, option.id))}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                    selected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:bg-muted/40"
                  )}
                >
                  <span className="font-medium text-foreground">{option.label}</span>
                  <span
                    className={cn(
                      "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                      selected ? "bg-primary" : "bg-muted"
                    )}
                    aria-hidden
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                        selected ? "translate-x-5" : "translate-x-0.5"
                      )}
                    />
                  </span>
                </button>
                {selected && dateId ? (
                  <div className="pl-4">
                    <FieldLabel htmlFor={`race-profile-safety-date-${dateId}`}>
                      {FLOW4_SAFETY_COPY.dateLabel}
                    </FieldLabel>
                    <Input
                      id={`race-profile-safety-date-${dateId}`}
                      type="date"
                      value={value.safetyServiceDates?.[dateId] ?? ""}
                      onChange={(e) =>
                        onChange(patchSafetyServiceDate(value, dateId, e.target.value))
                      }
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">{FLOW4_SAFETY_COPY.disclaimer}</p>
        <div>
          <FieldLabel htmlFor="safety-notes">{FLOW4_SAFETY_COPY.notesLabel}</FieldLabel>
          <textarea
            id="safety-notes"
            className={textareaClassName}
            value={value.safetyEquipmentNotes ?? ""}
            onChange={(e) => onChange({ safetyEquipmentNotes: e.target.value })}
            placeholder={FLOW4_SAFETY_COPY.notesPlaceholder}
          />
        </div>
      </div>
      ) : null}

      {activeTab === "documentation" ? (
      <div className="space-y-5">
        <div>
          <h3 className="font-semibold text-base">{FLOW4_DOCUMENTATION_COPY.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {FLOW4_DOCUMENTATION_COPY.disclaimer}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Use the Race / Track Documentation screen to select types and upload files. Uploads
          appear in the shared Documents section automatically.
        </p>
      </div>
      ) : null}

      {activeTab === "setup" ? (
      <div className="space-y-5">
        <div>
          <h3 className="font-semibold text-base">Setup Information</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Baseline chassis, tire, brake, and electronics setup notes.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              ["suspensionSetup", "Suspension Setup"],
              ["alignment", "Alignment"],
              ["cornerWeights", "Corner Weights"],
              ["rideHeight", "Ride Height"],
              ["brakeBias", "Brake Bias"],
              ["tirePressures", "Tire Pressures"],
              ["gearRatios", "Gear Ratios"],
              ["ecuCalibration", "ECU Calibration"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <FieldLabel htmlFor={`race-setup-${key}`}>{label}</FieldLabel>
              <Input
                id={`race-setup-${key}`}
                value={value.setup[key]}
                onChange={(e) => patchSetup({ [key]: e.target.value })}
                placeholder={label}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="driver-notes">Driver Notes</FieldLabel>
            <textarea
              id="driver-notes"
              className={textareaClassName}
              value={value.setup.driverNotes}
              onChange={(e) => patchSetup({ driverNotes: e.target.value })}
              placeholder="Driver feedback and preferred setup notes..."
            />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="crew-notes">Crew Notes</FieldLabel>
            <textarea
              id="crew-notes"
              className={textareaClassName}
              value={value.setup.crewNotes}
              onChange={(e) => patchSetup({ crewNotes: e.target.value })}
              placeholder="Crew chief and engineering notes..."
            />
          </div>
        </div>
      </div>
      ) : null}

      {activeTab === "history" ? (
      <div className="space-y-5">
        <div>
          <h3 className="font-semibold text-base">{FLOW4_COMPETITION_HISTORY_COPY.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {FLOW4_COMPETITION_HISTORY_COPY.disclaimer}
          </p>
        </div>
        <div>
          <FieldLabel>{FLOW4_COMPETITION_HISTORY_COPY.question}</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {ORGANIZED_COMPETITION_OPTIONS.map((option) => {
              const selected = value.organizedCompetition === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    onChange(
                      raceOrganizedCompetitionPatch(
                        value,
                        option as OrganizedCompetitionOption
                      )
                    )
                  }
                  className={cn(
                    "h-9 rounded-lg border px-3 text-sm font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-input bg-background text-foreground hover:bg-muted"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
        {shouldShowCompetitionHistoryNarrative(value.organizedCompetition) ? (
          <div>
            <FieldLabel htmlFor="race-profile-competition-history">
              {FLOW4_COMPETITION_HISTORY_COPY.historyLabel}
            </FieldLabel>
            <textarea
              id="race-profile-competition-history"
              className={`${textareaClassName} min-h-40`}
              value={value.competitionHistoryNarrative ?? ""}
              onChange={(e) => onChange({ competitionHistoryNarrative: e.target.value })}
              placeholder={FLOW4_COMPETITION_HISTORY_COPY.historyPlaceholder}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {FLOW4_COMPETITION_HISTORY_COPY.historyPrompt}
            </p>
          </div>
        ) : null}
      </div>
      ) : null}
    </div>
  );
}
