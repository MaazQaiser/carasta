"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Plus,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { MediaUploadZone } from "../MediaUploadZone";
import type {
  ListingMediaItem,
  RaceDocumentation,
  RaceHistoryEntry,
  RaceState,
} from "../types";
import {
  COMPETITION_LEVEL_OPTIONS,
  createEmptyRaceHistoryEntry,
  STREET_LEGAL_STATUS_OPTIONS,
  TITLE_STATUS_OPTIONS,
  YES_NO_OPTIONS,
} from "./options";
import { SpecsCategoryTabs } from "./SpecsCategoryTabs";

const PROFILE_TABS = [
  { id: "identity", label: "Vehicle Identity" },
  { id: "competition", label: "Competition Profile" },
  { id: "safety", label: "Safety Equipment" },
  { id: "documentation", label: "Race Documentation" },
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
  const patchCompetition = (patch: Partial<RaceState["competition"]>) =>
    onChange({ competition: { ...value.competition, ...patch } });
  const patchSafety = (patch: Partial<RaceState["safety"]>) =>
    onChange({ safety: { ...value.safety, ...patch } });
  const patchSetup = (patch: Partial<RaceState["setup"]>) =>
    onChange({ setup: { ...value.setup, ...patch } });

  const addDocs = (key: keyof RaceDocumentation, items: ListingMediaItem[]) =>
    onChange({
      documentation: {
        ...value.documentation,
        [key]: [...value.documentation[key], ...items],
      },
    });

  const removeDoc = (key: keyof RaceDocumentation, id: string) =>
    onChange({
      documentation: {
        ...value.documentation,
        [key]: value.documentation[key].filter((item) => item.id !== id),
      },
    });

  const updateHistory = (id: string, patch: Partial<RaceHistoryEntry>) =>
    onChange({
      historyEntries: value.historyEntries.map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry
      ),
    });

  const addHistory = () => {
    const entry = createEmptyRaceHistoryEntry();
    onChange({
      historyEntries: [...value.historyEntries, entry],
      editingHistoryId: entry.id,
    });
  };

  const duplicateHistory = (id: string) => {
    const source = value.historyEntries.find((entry) => entry.id === id);
    if (!source) return;
    const copy = {
      ...source,
      id: `race-hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      event: source.event ? `${source.event} (Copy)` : "",
      photos: [...source.photos],
      expanded: true,
    };
    onChange({
      historyEntries: [...value.historyEntries, copy],
      editingHistoryId: copy.id,
    });
  };

  const deleteHistory = (id: string) =>
    onChange({
      historyEntries: value.historyEntries.filter((entry) => entry.id !== id),
      editingHistoryId: value.editingHistoryId === id ? null : value.editingHistoryId,
    });

  return (
    <div className="rounded-2xl border bg-card p-5 space-y-5">
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

      {activeTab === "competition" ? (
      <div className="space-y-5">
        <div>
          <h3 className="font-semibold text-base">Competition Profile</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Discipline, series, class, and eligibility for this motorsport build.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              ["primaryDiscipline", "Primary Discipline"],
              ["secondaryDiscipline", "Secondary Discipline"],
              ["sanctioningBody", "Sanctioning Body"],
              ["series", "Series"],
              ["competitionClass", "Competition Class"],
              ["currentEligibility", "Current Eligibility"],
              ["logbookStatus", "Logbook Status"],
              ["technicalInspection", "Technical Inspection"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <FieldLabel htmlFor={`race-comp-${key}`}>{label}</FieldLabel>
              <Input
                id={`race-comp-${key}`}
                value={value.competition[key]}
                onChange={(e) => patchCompetition({ [key]: e.target.value })}
                placeholder={label}
              />
            </div>
          ))}
          <div>
            <FieldLabel>Competition Level</FieldLabel>
            <Select
              value={value.competition.competitionLevel || undefined}
              onValueChange={(v) => patchCompetition({ competitionLevel: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select competition level" />
              </SelectTrigger>
              <SelectContent>
                {COMPETITION_LEVEL_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="competition-history-summary">Competition History</FieldLabel>
            <textarea
              id="competition-history-summary"
              className={textareaClassName}
              value={value.competition.competitionHistorySummary}
              onChange={(e) => patchCompetition({ competitionHistorySummary: e.target.value })}
              placeholder="High-level competition history overview..."
            />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="notable-results">Notable Results</FieldLabel>
            <textarea
              id="notable-results"
              className={textareaClassName}
              value={value.competition.notableResults}
              onChange={(e) => patchCompetition({ notableResults: e.target.value })}
              placeholder="Wins, podiums, records, championship results..."
            />
          </div>
        </div>
      </div>
      ) : null}

      {activeTab === "safety" ? (
      <div className="space-y-5">
        <div>
          <h3 className="font-semibold text-base">Safety Equipment</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Cage, restraints, fire systems, and certification details.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              ["rollCageType", "Roll Cage Type"],
              ["rollCageBuilder", "Roll Cage Builder"],
              ["certificationOrganization", "Certification Organization"],
              ["certificationNumber", "Certification Number"],
              ["certificationExpiration", "Certification Expiration"],
              ["seatManufacturer", "Seat Manufacturer"],
              ["seatCertification", "Seat Certification"],
              ["harnessManufacturer", "Harness Manufacturer"],
              ["harnessCertification", "Harness Certification"],
              ["windowNet", "Window Net"],
              ["fireSuppressionSystem", "Fire Suppression System"],
              ["fuelCell", "Fuel Cell"],
              ["batteryCutoff", "Battery Cutoff"],
              ["killSwitch", "Kill Switch"],
              ["towHooks", "Tow Hooks"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <FieldLabel htmlFor={`race-safety-${key}`}>{label}</FieldLabel>
              <Input
                id={`race-safety-${key}`}
                type={key === "certificationExpiration" ? "date" : "text"}
                value={value.safety[key]}
                onChange={(e) => patchSafety({ [key]: e.target.value })}
                placeholder={label}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="safety-notes">Safety Notes</FieldLabel>
            <textarea
              id="safety-notes"
              className={textareaClassName}
              value={value.safety.safetyNotes}
              onChange={(e) => patchSafety({ safetyNotes: e.target.value })}
              placeholder="Additional safety notes, inspection caveats, or equipment details..."
            />
          </div>
        </div>
      </div>
      ) : null}

      {activeTab === "documentation" ? (
      <div className="space-y-5">
        <div>
          <h3 className="font-semibold text-base">Race Documentation</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Logbooks, inspections, certifications, setup sheets, and media.
          </p>
        </div>
        <div className="space-y-6">
          {(
            [
              ["logbook", "Logbook", "file"],
              ["inspectionReports", "Inspection Reports", "file"],
              ["certificationDocuments", "Certification Documents", "file"],
              ["dynoSheets", "Dyno Sheets", "file"],
              ["raceResults", "Race Results", "file"],
              ["setupSheets", "Setup Sheets", "file"],
              ["dataLogs", "Data Logs", "file"],
              ["technicalReports", "Technical Reports", "file"],
              ["photos", "Photos", "image"],
              ["videos", "Videos", "video"],
            ] as const
          ).map(([key, title, variant]) => (
            <MediaUploadZone
              key={key}
              title={title}
              description={`${title} for this race / track car.`}
              accept={
                variant === "image"
                  ? "image/*"
                  : variant === "video"
                    ? "video/*"
                    : ".pdf,.doc,.docx,.png,.jpg,.jpeg,.csv,.txt"
              }
              variant={variant}
              compact
              items={value.documentation[key]}
              onAdd={(items) => addDocs(key, items)}
              onRemove={(id) => removeDoc(key, id)}
            />
          ))}
        </div>
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
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-base">Competition History</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Add event-by-event results. Editing stays inline on this page.
            </p>
          </div>
          <Button type="button" onClick={addHistory}>
            <Plus className="h-4 w-4" />
            Add History Entry
          </Button>
        </div>

        {value.historyEntries.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-10 text-center">
            <p className="text-sm font-medium">No race history entries yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Capture events, tracks, results, and fastest laps.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {value.historyEntries.map((entry) => {
              const editing = value.editingHistoryId === entry.id;
              return (
                <div key={entry.id} className="rounded-2xl border bg-muted/10 overflow-hidden">
                  <div className="px-4 py-3 flex items-start gap-3">
                    <button
                      type="button"
                      className="mt-0.5 text-muted-foreground hover:text-foreground"
                      onClick={() => updateHistory(entry.id, { expanded: !entry.expanded })}
                    >
                      {entry.expanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-sm truncate">
                          {entry.event.trim() || "Untitled event"}
                        </p>
                        {entry.result ? <Badge variant="secondary">{entry.result}</Badge> : null}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {[entry.track, entry.date, entry.className].filter(Boolean).join(" · ") ||
                          "Track / date not set"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onChange({
                            editingHistoryId: editing ? null : entry.id,
                            historyEntries: value.historyEntries.map((item) =>
                              item.id === entry.id ? { ...item, expanded: true } : item
                            ),
                          })
                        }
                      >
                        {editing ? "Done" : "Edit"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => duplicateHistory(entry.id)}
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteHistory(entry.id)}
                        className="text-muted-foreground hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className={cn("border-t px-4 py-4 space-y-4", entry.expanded ? "block" : "hidden")}>
                    {editing ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {(
                            [
                              ["event", "Event"],
                              ["track", "Track"],
                              ["date", "Date"],
                              ["result", "Result"],
                              ["className", "Class"],
                              ["position", "Position"],
                              ["fastestLap", "Fastest Lap"],
                            ] as const
                          ).map(([key, label]) => (
                            <div key={key}>
                              <FieldLabel htmlFor={`hist-${entry.id}-${key}`}>{label}</FieldLabel>
                              <Input
                                id={`hist-${entry.id}-${key}`}
                                type={key === "date" ? "date" : "text"}
                                value={entry[key]}
                                onChange={(e) => updateHistory(entry.id, { [key]: e.target.value })}
                                placeholder={label}
                              />
                            </div>
                          ))}
                          <div className="sm:col-span-2">
                            <FieldLabel htmlFor={`hist-notes-${entry.id}`}>Notes</FieldLabel>
                            <textarea
                              id={`hist-notes-${entry.id}`}
                              className={textareaClassName}
                              value={entry.notes}
                              onChange={(e) => updateHistory(entry.id, { notes: e.target.value })}
                              placeholder="Session notes, conditions, incidents..."
                            />
                          </div>
                        </div>
                        <MediaUploadZone
                          title="Photos"
                          description="Event photos for this history entry."
                          compact
                          items={entry.photos}
                          onAdd={(items) =>
                            updateHistory(entry.id, { photos: [...entry.photos, ...items] })
                          }
                          onRemove={(id) =>
                            updateHistory(entry.id, {
                              photos: entry.photos.filter((photo) => photo.id !== id),
                            })
                          }
                        />
                      </>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {(
                          [
                            ["Result", entry.result],
                            ["Class", entry.className],
                            ["Position", entry.position],
                            ["Fastest lap", entry.fastestLap],
                          ] as const
                        ).map(([label, val]) => (
                          <div key={label} className="rounded-xl border bg-card px-3 py-2">
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                              {label}
                            </p>
                            <p className="font-medium mt-0.5">{val?.trim() ? val : "—"}</p>
                          </div>
                        ))}
                        {entry.notes ? (
                          <p className="sm:col-span-2 text-muted-foreground whitespace-pre-wrap">
                            {entry.notes}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      ) : null}
    </div>
  );
}
