"use client";

import React, { useState } from "react";
import { ChevronDown, FileText, Film, Image as ImageIcon, Receipt } from "lucide-react";
import type {
  MarketplaceListingType,
  Vehicle,
  VehicleMediaAsset,
  VehicleModificationEntry,
} from "@carasta/types";
import { cn } from "@/lib/utils";
import { humanizeKey } from "@/lib/listing-labels";
import { displayPerformanceClaimStatus } from "@/components/listing/specs/options";

function Expandable({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-semibold text-sm">{title}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="px-4 pb-4 border-t">{children}</div>}
    </div>
  );
}

function KeyValueRows({ rows }: { rows: [string, string][] }) {
  if (rows.length === 0) return null;
  return (
    <div className="rounded-xl border overflow-hidden mt-3">
      {rows.map(([label, value], i) => (
        <div
          key={`${label}-${i}`}
          className={cn("flex justify-between gap-4 px-4 py-3 text-sm", i % 2 === 0 ? "bg-card" : "bg-muted/40")}
        >
          <span className="text-muted-foreground shrink-0">{label}</span>
          <span className="font-medium text-right">{value}</span>
        </div>
      ))}
    </div>
  );
}

function recordRows(record?: Record<string, string>): [string, string][] {
  if (!record) return [];
  return Object.entries(record)
    .filter(([, v]) => !!v?.trim())
    .map(([k, v]) => [humanizeKey(k), v]);
}

function groupMods(mods: VehicleModificationEntry[]) {
  const map = new Map<string, VehicleModificationEntry[]>();
  for (const mod of mods) {
    const key = mod.categoryLabel || mod.categoryId || "Other";
    const list = map.get(key) ?? [];
    list.push(mod);
    map.set(key, list);
  }
  return [...map.entries()];
}

function ModEntryCard({ entry }: { entry: VehicleModificationEntry }) {
  const [open, setOpen] = useState(false);
  const detailRows: [string, string][] = [
    ...(entry.typeOfWork ? [["Type of Work", entry.typeOfWork] as [string, string]] : []),
    ...(entry.partsBrand ? [["Parts Brand", entry.partsBrand] as [string, string]] : []),
    ...(entry.manufacturer ? [["Manufacturer", entry.manufacturer] as [string, string]] : []),
    ...(entry.partClassification
      ? [["Part Classification", entry.partClassification] as [string, string]]
      : []),
    ...(entry.specifications ? [["Specifications", entry.specifications] as [string, string]] : []),
    ...(entry.workPerformedBy ? [["Work Performed By", entry.workPerformedBy] as [string, string]] : []),
    ...(entry.shopBuilder ? [["Shop / Builder", entry.shopBuilder] as [string, string]] : []),
    ...(entry.installationDate ? [["Installation Date", entry.installationDate] as [string, string]] : []),
  ];

  return (
    <div className="rounded-xl border bg-background">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-left"
      >
        <span className="text-sm font-medium">{entry.title}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2 border-t pt-2">
          {entry.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{entry.description}</p>
          )}
          <KeyValueRows rows={detailRows} />
          {entry.additionalNotes && (
            <p className="text-xs text-muted-foreground pt-1">{entry.additionalNotes}</p>
          )}
        </div>
      )}
    </div>
  );
}

function MediaBucket({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: VehicleMediaAsset[];
}) {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {title}
      </h3>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="h-20 w-28 shrink-0 overflow-hidden rounded-xl border bg-muted relative"
            title={item.name ?? item.alt}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PhotosDocumentsSection({ vehicle }: { vehicle: Vehicle }) {
  const media = vehicle.listingDetails?.media;
  if (!media) return null;

  const hasAny = [
    media.vehiclePhotos,
    media.modificationPhotos,
    media.receipts,
    media.invoices,
    media.supportingDocuments,
    media.videos,
  ].some((b) => (b?.length ?? 0) > 0);

  if (!hasAny) return null;

  return (
    <div className="rounded-2xl border bg-card p-5 space-y-5">
      <h2 className="text-lg font-bold">Photos & Documents</h2>
      <MediaBucket title="Vehicle Photos" icon={ImageIcon} items={media.vehiclePhotos} />
      <MediaBucket title="Modification Photos" icon={ImageIcon} items={media.modificationPhotos} />
      <MediaBucket title="Receipts" icon={Receipt} items={media.receipts} />
      <MediaBucket title="Invoices" icon={FileText} items={media.invoices} />
      <MediaBucket title="Supporting Documents" icon={FileText} items={media.supportingDocuments} />
      <MediaBucket title="Videos" icon={Film} items={media.videos} />
    </div>
  );
}

type FactorySpecSection = { id: string; label: string; fields: { label: string; value: string }[] };

/** Factory accordion layout — mirrors Listing Builder stock factory specs. */
function buildFactorySpecSectionsFromVehicle(vehicle: Vehicle): FactorySpecSection[] {
  const s = vehicle.spec;
  const or = (value: string | number | undefined, fallback: string) =>
    value !== undefined && String(value).trim() ? String(value) : fallback;

  return [
    {
      id: "powertrain",
      label: "Powertrain",
      fields: [
        { label: "Engine", value: or(s.engineSize, "See documentation") },
        { label: "Horsepower", value: s.horsepower ? `${s.horsepower} hp` : "See documentation" },
        { label: "Torque", value: s.torque ? `${s.torque} lb-ft` : "See documentation" },
        { label: "Transmission", value: or(s.transmission, "See documentation") },
        { label: "Fuel Type", value: or(s.fuelType, "See documentation") },
      ],
    },
    {
      id: "drivetrain",
      label: "Drivetrain",
      fields: [
        { label: "Drive Type", value: s.driveType.toUpperCase() },
        { label: "Differential", value: "See documentation" },
      ],
    },
    {
      id: "wheels-tires",
      label: "Wheels & Tires",
      fields: [
        { label: "Wheel Size", value: "See documentation" },
        { label: "Tire Size", value: "See documentation" },
      ],
    },
    {
      id: "exterior",
      label: "Exterior",
      fields: [
        { label: "Exterior Color", value: or(s.exteriorColor, "See documentation") },
        { label: "Body Style", value: or(s.bodyStyle, "See documentation") },
      ],
    },
    {
      id: "interior",
      label: "Interior",
      fields: [
        { label: "Interior Color", value: or(s.interiorColor, "See documentation") },
        { label: "Seats", value: s.seats ? String(s.seats) : "See documentation" },
      ],
    },
    {
      id: "electronics",
      label: "Electronics & Audio",
      fields: [
        { label: "Factory Audio", value: "See documentation" },
        { label: "Navigation", value: "See documentation" },
        { label: "Display", value: "See documentation" },
      ],
    },
    {
      id: "safety",
      label: "Safety",
      fields: [
        { label: "Airbags", value: "See documentation" },
        { label: "ABS", value: "See documentation" },
        { label: "Driver Assistance", value: "See documentation" },
      ],
    },
    {
      id: "factory-equipment",
      label: "Factory Equipment",
      fields: [
        { label: "Packages", value: vehicle.features[0] || "See documentation" },
        { label: "Premium Options", value: vehicle.features[1] || "See documentation" },
        { label: "Factory Features", value: vehicle.features.slice(2, 5).join(", ") || "See documentation" },
      ],
    },
  ];
}

function ModGroupList({ mods, defaultOpenFirst = true }: { mods: VehicleModificationEntry[]; defaultOpenFirst?: boolean }) {
  const groups = groupMods(mods);
  if (groups.length === 0) return null;
  return (
    <>
      {groups.map(([category, entries], index) => (
        <Expandable key={category} title={category} defaultOpen={defaultOpenFirst && index === 0}>
          <div className="space-y-2 mt-3">
            {entries.map((entry) => (
              <ModEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </Expandable>
      ))}
    </>
  );
}

export function SpecificationsModificationsSection({ vehicle }: { vehicle: Vehicle }) {
  const details = vehicle.listingDetails;
  const listingType = vehicle.listingType as MarketplaceListingType | undefined;
  if (!listingType) return null;

  const mods = details?.modifications ?? [];
  const factorySections = buildFactorySpecSectionsFromVehicle(vehicle);

  const isStock = listingType === "stock-lightly-modified";
  const isModified = listingType === "modified-performance";
  const isRestored = listingType === "restored-restomod-custom";
  const isRace = listingType === "race-track-car";

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Specifications & Modifications</h2>

      {isStock && (
        <div className="space-y-3">
          {details?.factorySpecsNotes && (
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="font-semibold mb-2 text-sm">Factory Overview</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{details.factorySpecsNotes}</p>
            </div>
          )}
          {factorySections.map((section, index) => (
            <Expandable key={section.id} title={section.label} defaultOpen={index === 0}>
              <KeyValueRows rows={section.fields.map((f) => [f.label, f.value])} />
            </Expandable>
          ))}
          {mods.length > 0 ? (
            <div className="space-y-3 pt-1">
              <h3 className="font-semibold text-sm px-1">Light Modifications</h3>
              <ModGroupList mods={mods} />
            </div>
          ) : (details?.lightModifications?.length ?? 0) > 0 ? (
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="font-semibold mb-3 text-sm">Light Modifications</h3>
              <ul className="space-y-2">
                {details!.lightModifications!.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-2xl border bg-card p-5">
              <p className="text-sm text-muted-foreground">No light modifications listed — factory original presentation.</p>
            </div>
          )}
        </div>
      )}

      {isModified && (
        <div className="space-y-3">
          {details?.performanceSummary && (
            <Expandable title="Performance Summary" defaultOpen>
              <KeyValueRows
                rows={[
                  ...(details.performanceSummary.currentEngine
                    ? [["Current Engine", details.performanceSummary.currentEngine] as [string, string]]
                    : []),
                  ...(details.performanceSummary.transmission
                    ? [["Transmission", details.performanceSummary.transmission] as [string, string]]
                    : []),
                  ...(details.performanceSummary.drivetrain
                    ? [["Drivetrain", details.performanceSummary.drivetrain] as [string, string]]
                    : []),
                  ...(details.performanceSummary.horsepower
                    ? [[
                        "Horsepower",
                        `${details.performanceSummary.horsepower} (${displayPerformanceClaimStatus(
                          details.performanceSummary.horsepowerStatus
                        )})`,
                      ] as [string, string]]
                    : []),
                  ...(details.performanceSummary.torque
                    ? [[
                        "Torque",
                        `${details.performanceSummary.torque} (${displayPerformanceClaimStatus(
                          details.performanceSummary.torqueStatus
                        )})`,
                      ] as [string, string]]
                    : []),
                  ...(details.performanceSummary.fuelType
                    ? [["Fuel Type", details.performanceSummary.fuelType] as [string, string]]
                    : []),
                  ...(details.performanceSummary.tuningPlatform
                    ? [["Tuning Platform", details.performanceSummary.tuningPlatform] as [string, string]]
                    : []),
                ]}
              />
              {details.performanceSummary.buildSummary && (
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {details.performanceSummary.buildSummary}
                </p>
              )}
            </Expandable>
          )}
          <ModGroupList mods={mods} />
        </div>
      )}

      {isRestored && (
        <div className="space-y-3">
          {details?.restoration && (
            <>
              <Expandable title="Restoration Profile" defaultOpen>
                <KeyValueRows
                  rows={[
                    ...(details.restoration.buildType
                      ? [["Build Type", details.restoration.buildType] as [string, string]]
                      : []),
                    ...(details.restoration.buildStatus
                      ? [["Build Status", details.restoration.buildStatus] as [string, string]]
                      : []),
                    ...(details.restoration.workPerformedBy
                      ? [["Work Performed By", details.restoration.workPerformedBy] as [string, string]]
                      : []),
                    ...(details.restoration.shopBuilder
                      ? [["Builder / Restoration Shop", details.restoration.shopBuilder] as [string, string]]
                      : []),
                    ...(details.restoration.mileageStatus
                      ? [["Mileage Status", details.restoration.mileageStatus] as [string, string]]
                      : []),
                    ...(details.restoration.identityType && details.restoration.identityValue
                      ? [[details.restoration.identityType, details.restoration.identityValue] as [string, string]]
                      : []),
                  ]}
                />
              </Expandable>
              {recordRows(details.restoration.factoryCorrect).length > 0 && (
                <Expandable title="Seller-reported originality" defaultOpen>
                  <KeyValueRows rows={recordRows(details.restoration.factoryCorrect)} />
                </Expandable>
              )}
              {recordRows(details.restoration.provenance).length > 0 && (
                <Expandable title="Provenance & History">
                  <KeyValueRows rows={recordRows(details.restoration.provenance)} />
                </Expandable>
              )}
            </>
          )}
          {mods.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm px-1">Restoration Entries</h3>
              <ModGroupList mods={mods} />
            </div>
          )}
        </div>
      )}

      {isRace && (
        <div className="space-y-3">
          {details?.race && (
            <>
              {recordRows(details.race.competition).length > 0 && (
                <Expandable title="Primary Use" defaultOpen>
                  <KeyValueRows rows={recordRows(details.race.competition)} />
                </Expandable>
              )}
              {(details.race.buildNarrative ||
                details.race.workPerformedBy ||
                details.race.shopBuilder) && (
                <Expandable title="Race / Track Build" defaultOpen>
                  <KeyValueRows
                    rows={[
                      ...(details.race.buildNarrative
                        ? [["Build", details.race.buildNarrative] as [string, string]]
                        : []),
                      ...(details.race.workPerformedBy
                        ? [["Prepared by", details.race.workPerformedBy] as [string, string]]
                        : []),
                      ...(details.race.shopBuilder
                        ? [["Shop / Builder", details.race.shopBuilder] as [string, string]]
                        : []),
                    ]}
                  />
                </Expandable>
              )}
              {recordRows(details.race.safety).length > 0 && (
                <Expandable title="Safety Equipment" defaultOpen>
                  <KeyValueRows rows={recordRows(details.race.safety)} />
                </Expandable>
              )}
              {(details.race.organizedCompetition || details.race.competitionHistory) && (
                <Expandable title="Competition History" defaultOpen>
                  <KeyValueRows
                    rows={[
                      ...(details.race.organizedCompetition
                        ? [["Organized competition", details.race.organizedCompetition] as [string, string]]
                        : []),
                      ...(details.race.competitionHistory
                        ? [["Competition History", details.race.competitionHistory] as [string, string]]
                        : []),
                    ]}
                  />
                </Expandable>
              )}
              {((details.race.documentationTypes?.length ?? 0) > 0 ||
                details.race.documentationOther) && (
                <Expandable title="Race / Track Documentation" defaultOpen>
                  <KeyValueRows
                    rows={[
                      ...(details.race.documentationTypes?.length
                        ? [["Documentation", details.race.documentationTypes.join(", ")] as [string, string]]
                        : []),
                      ...(details.race.documentationOther
                        ? [["Other", details.race.documentationOther] as [string, string]]
                        : []),
                    ]}
                  />
                </Expandable>
              )}
              {(details.race.sparesIncluded || details.race.sparesDescription) && (
                <Expandable title="Spares & Support Equipment" defaultOpen>
                  <KeyValueRows
                    rows={[
                      ...(details.race.sparesIncluded
                        ? [["Included with the sale", details.race.sparesIncluded] as [string, string]]
                        : []),
                      ...(details.race.sparesDescription
                        ? [["Spares / Support Included", details.race.sparesDescription] as [string, string]]
                        : []),
                    ]}
                  />
                </Expandable>
              )}
              {details.race.knownRaceTrackIssues ? (
                <Expandable title="Known Race / Track Issues" defaultOpen>
                  <KeyValueRows
                    rows={[["Known issues", details.race.knownRaceTrackIssues] as [string, string]]}
                  />
                </Expandable>
              ) : null}
              {recordRows(details.race.setup).length > 0 && (
                <Expandable title="Setup Information">
                  <KeyValueRows rows={recordRows(details.race.setup)} />
                </Expandable>
              )}
              {(details.race.history?.length ?? 0) > 0 && (
                <Expandable title="Race History">
                  <div className="space-y-2 mt-3">
                    {details.race.history!.map((entry) => (
                      <div key={entry.id} className="rounded-xl border bg-background p-3">
                        <p className="text-sm font-medium">{entry.event}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {[entry.track, entry.date, entry.className, entry.position && `P${entry.position}`]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        {entry.result && (
                          <p className="text-sm text-muted-foreground mt-1">{entry.result}</p>
                        )}
                        {entry.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{entry.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </Expandable>
              )}
            </>
          )}
          {mods.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm px-1">Competition Modifications</h3>
              <ModGroupList mods={mods} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export function ConditionHistorySection({ vehicle }: { vehicle: Vehicle }) {
  const history = vehicle.listingDetails?.conditionHistory;
  if (!history) return null;

  const rows: [string, string][] = [
    ...(history.vehicleHistory ? [["Vehicle History", history.vehicleHistory] as [string, string]] : []),
    ...(history.accidentHistory ? [["Accident History", history.accidentHistory] as [string, string]] : []),
    ...(history.knownRaceTrackIssues
      ? [["Known Race / Track Issues", history.knownRaceTrackIssues] as [string, string]]
      : []),
    ...(history.titleStatus ? [["Title Status", history.titleStatus] as [string, string]] : []),
    ...(history.ownershipHistory ? [["Ownership History", history.ownershipHistory] as [string, string]] : []),
    ...(history.serviceRecords ? [["Service Records", history.serviceRecords] as [string, string]] : []),
    ...(history.overallCondition ? [["Overall Condition", history.overallCondition] as [string, string]] : []),
    ...(history.generalNotes ? [["General Notes", history.generalNotes] as [string, string]] : []),
  ];

  if (rows.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Condition & History</h2>
      <div className="rounded-2xl border overflow-hidden">
        {rows.map(([label, value], i) => (
          <div
            key={label}
            className={cn("px-4 py-3 text-sm", i % 2 === 0 ? "bg-card" : "bg-muted/40")}
          >
            <p className="text-muted-foreground mb-1">{label}</p>
            <p className="font-medium leading-relaxed">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function OwnerNotesSection({ vehicle }: { vehicle: Vehicle }) {
  if (!vehicle.story?.trim()) return null;
  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Owner Notes</h2>
      <div className="rounded-2xl border bg-card p-5">
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{vehicle.story}</p>
      </div>
    </section>
  );
}
