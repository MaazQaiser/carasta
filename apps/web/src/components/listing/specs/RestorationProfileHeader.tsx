"use client";

import * as React from "react";
import { Check } from "lucide-react";
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
  FactoryCorrectDetails,
  ListingMediaItem,
  RestorationDocumentation,
  RestorationProvenance,
  RestorationState,
  RestorationBuildTypeId,
} from "../types";
import {
  MILEAGE_STATUS_OPTIONS,
  RESTORATION_AUTHENTICITY_OPTIONS,
  RESTORATION_COMPLETION_STATUS_OPTIONS,
  RESTORATION_LEVEL_OPTIONS,
} from "./options";
import { RESTORATION_BUILD_TYPES } from "./restored-restomod";
import { SpecsCategoryTabs } from "./SpecsCategoryTabs";

const PROFILE_TABS = [
  { id: "build-type", label: "Build Type" },
  { id: "mileage", label: "Mileage Status" },
  { id: "documentation", label: "Documentation" },
  { id: "provenance", label: "Historical Provenance" },
] as const;

type ProfileTabId = (typeof PROFILE_TABS)[number]["id"];

function YesNoSelect({
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
          <SelectValue placeholder="Yes / No / Unknown" />
        </SelectTrigger>
        <SelectContent>
          {RESTORATION_AUTHENTICITY_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function RestorationProfileHeader({
  value,
  onChange,
}: {
  value: RestorationState;
  onChange: (patch: Partial<RestorationState>) => void;
}) {
  const [activeTab, setActiveTab] = React.useState<ProfileTabId>("build-type");

  const patchFactory = (patch: Partial<FactoryCorrectDetails>) =>
    onChange({ factoryCorrect: { ...value.factoryCorrect, ...patch } });

  const patchProvenance = (patch: Partial<RestorationProvenance>) =>
    onChange({ provenance: { ...value.provenance, ...patch } });

  const addDocs = (key: keyof RestorationDocumentation, items: ListingMediaItem[]) =>
    onChange({
      documentation: {
        ...value.documentation,
        [key]: [...value.documentation[key], ...items],
      },
    });

  const removeDoc = (key: keyof RestorationDocumentation, id: string) =>
    onChange({
      documentation: {
        ...value.documentation,
        [key]: value.documentation[key].filter((item) => item.id !== id),
      },
    });

  const showFactoryCorrect = value.buildType === "factory-correct-restoration";

  return (
    <div className="rounded-2xl border bg-card p-3 sm:p-5 space-y-4 sm:space-y-5 min-w-0">
      <SpecsCategoryTabs
        categories={[...PROFILE_TABS]}
        activeCategoryId={activeTab}
        onSelect={(id) => setActiveTab(id as ProfileTabId)}
        ariaLabel="Restoration profile sections"
      />

      {activeTab === "build-type" ? (
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-base">Build Type</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                What best describes this vehicle? This selection controls the rest of the experience.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {RESTORATION_BUILD_TYPES.map((type) => {
                const selected = value.buildType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => onChange({ buildType: type.id as RestorationBuildTypeId })}
                    className={cn(
                      "relative text-left rounded-2xl border p-4 transition-all",
                      "hover:border-primary/50 hover:bg-primary/5",
                      selected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border"
                    )}
                  >
                    {selected ? (
                      <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3 w-3" />
                      </span>
                    ) : null}
                    <p className="font-semibold text-sm pr-6">{type.label}</p>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {showFactoryCorrect ? (
              <div className="rounded-xl border p-4 sm:p-5 space-y-5">
                <div>
                  <h4 className="font-semibold text-sm">Factory Correct Details</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Shown because this listing is a Factory-Correct Restoration.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <YesNoSelect
                    label="Numbers Matching Engine"
                    value={value.factoryCorrect.numbersMatchingEngine}
                    onChange={(v) => patchFactory({ numbersMatchingEngine: v })}
                  />
                  <YesNoSelect
                    label="Numbers Matching Transmission"
                    value={value.factoryCorrect.numbersMatchingTransmission}
                    onChange={(v) => patchFactory({ numbersMatchingTransmission: v })}
                  />
                  <YesNoSelect
                    label="Original Engine"
                    value={value.factoryCorrect.originalEngine}
                    onChange={(v) => patchFactory({ originalEngine: v })}
                  />
                  <YesNoSelect
                    label="Original Transmission"
                    value={value.factoryCorrect.originalTransmission}
                    onChange={(v) => patchFactory({ originalTransmission: v })}
                  />
                  <YesNoSelect
                    label="Original Chassis"
                    value={value.factoryCorrect.originalChassis}
                    onChange={(v) => patchFactory({ originalChassis: v })}
                  />
                  <YesNoSelect
                    label="Original Body Panels"
                    value={value.factoryCorrect.originalBodyPanels}
                    onChange={(v) => patchFactory({ originalBodyPanels: v })}
                  />
                  <YesNoSelect
                    label="Factory Correct Paint"
                    value={value.factoryCorrect.factoryCorrectPaint}
                    onChange={(v) => patchFactory({ factoryCorrectPaint: v })}
                  />
                  <YesNoSelect
                    label="Factory Correct Interior"
                    value={value.factoryCorrect.factoryCorrectInterior}
                    onChange={(v) => patchFactory({ factoryCorrectInterior: v })}
                  />
                  <YesNoSelect
                    label="Factory Correct Wheels"
                    value={value.factoryCorrect.factoryCorrectWheels}
                    onChange={(v) => patchFactory({ factoryCorrectWheels: v })}
                  />
                  <YesNoSelect
                    label="Factory Correct Trim"
                    value={value.factoryCorrect.factoryCorrectTrim}
                    onChange={(v) => patchFactory({ factoryCorrectTrim: v })}
                  />
                  <YesNoSelect
                    label="Factory Correct Radio"
                    value={value.factoryCorrect.factoryCorrectRadio}
                    onChange={(v) => patchFactory({ factoryCorrectRadio: v })}
                  />
                  <YesNoSelect
                    label="Original Equipment"
                    value={value.factoryCorrect.originalEquipment}
                    onChange={(v) => patchFactory({ originalEquipment: v })}
                  />
                  <YesNoSelect
                    label="Period Correct Parts"
                    value={value.factoryCorrect.periodCorrectParts}
                    onChange={(v) => patchFactory({ periodCorrectParts: v })}
                  />
                  <div>
                    <FieldLabel htmlFor="restoration-level">Restoration Level</FieldLabel>
                    <Select
                      value={value.factoryCorrect.restorationLevel || undefined}
                      onValueChange={(v) => patchFactory({ restorationLevel: v })}
                    >
                      <SelectTrigger id="restoration-level">
                        <SelectValue placeholder="Select restoration level" />
                      </SelectTrigger>
                      <SelectContent>
                        {RESTORATION_LEVEL_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <FieldLabel htmlFor="completion-status">Completion Status</FieldLabel>
                    <Select
                      value={value.factoryCorrect.completionStatus || undefined}
                      onValueChange={(v) => patchFactory({ completionStatus: v })}
                    >
                      <SelectTrigger id="completion-status">
                        <SelectValue placeholder="Select completion status" />
                      </SelectTrigger>
                      <SelectContent>
                        {RESTORATION_COMPLETION_STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <FieldLabel htmlFor="restoration-shop">Restoration Shop</FieldLabel>
                    <Input
                      id="restoration-shop"
                      value={value.factoryCorrect.restorationShop}
                      onChange={(e) => patchFactory({ restorationShop: e.target.value })}
                      placeholder="Shop name"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="factory-builder">Builder</FieldLabel>
                    <Input
                      id="factory-builder"
                      value={value.factoryCorrect.builder}
                      onChange={(e) => patchFactory({ builder: e.target.value })}
                      placeholder="Lead builder or restorer"
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {activeTab === "mileage" ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-base">Mileage Status</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                How should buyers interpret the odometer for this vehicle?
              </p>
            </div>
            <div className="max-w-md">
              <FieldLabel>Mileage Status</FieldLabel>
              <Select
                value={value.mileageStatus || undefined}
                onValueChange={(v) => onChange({ mileageStatus: v })}
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
        ) : null}

        {activeTab === "documentation" ? (
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-base">Documentation</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Build books, receipts, invoices, and historical paperwork for this restoration.
              </p>
            </div>
            <div className="space-y-6">
              {(
                [
                  [
                    "buildBook",
                    "Upload Build Book",
                    "Upload PDFs or photos documenting the restoration.",
                  ],
                  ["receipts", "Receipts", "Parts and materials receipts."],
                  ["invoices", "Invoices", "Shop and labor invoices."],
                  [
                    "restorationPhotos",
                    "Restoration Photos",
                    "Process and completed restoration photos.",
                  ],
                  ["factoryDocuments", "Factory Documents", "OEM paperwork and factory records."],
                  ["certificates", "Certificates", "Authenticity, awards, and certification docs."],
                  [
                    "historicalDocumentation",
                    "Historical Documentation",
                    "Provenance packets and archival materials.",
                  ],
                ] as const
              ).map(([key, title, description]) => (
                <MediaUploadZone
                  key={key}
                  title={title}
                  description={description}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  variant={key === "restorationPhotos" ? "image" : "file"}
                  compact
                  items={value.documentation[key]}
                  onAdd={(items) => addDocs(key, items)}
                  onRemove={(id) => removeDoc(key, id)}
                />
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "provenance" ? (
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-base">Historical Provenance</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Ownership story, awards, media appearances, and auction history.
              </p>
            </div>
            <div className="space-y-4">
              {(
                [
                  ["previousOwners", "Previous Owners"],
                  ["historicalStory", "Historical Story"],
                  ["awards", "Awards"],
                  ["magazineFeatures", "Magazine Features"],
                  ["tvMovieAppearance", "TV / Movie Appearance"],
                  ["auctionHistory", "Auction History"],
                  ["specialNotes", "Special Notes"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <FieldLabel htmlFor={`prov-${key}`}>{label}</FieldLabel>
                  <textarea
                    id={`prov-${key}`}
                    className={textareaClassName}
                    value={value.provenance[key]}
                    onChange={(e) => patchProvenance({ [key]: e.target.value })}
                    placeholder={`Add ${label.toLowerCase()}...`}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
    </div>
  );
}
