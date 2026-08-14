"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldLabel } from "../fields";
import type {
  FactoryCorrectDetails,
  ListingMediaItem,
  RestorationDocumentationGroupId,
  RestorationState,
} from "../types";
import {
  RESTORATION_LEVEL_OPTIONS,
} from "./options";
import {
  FLOW3_ORIGINALITY_COPY,
  ORIGINALITY_ANSWER_OPTIONS,
  FLOW3_BUILD_RESTORATION_COPY,
  flow3ProfileSections,
  getRestorationBuildTypeLabel,
  normalizeRestorationDocumentation,
  type Flow3AdaptiveSectionId,
} from "./restored-restomod";
import { RestorationDocumentationList } from "./RestorationDocumentationList";
import { FactoryCorrectOriginalityChecklist } from "./FactoryCorrectOriginalityChecklist";
import { SpecsCategoryTabs } from "./SpecsCategoryTabs";

function YesNoSelect({
  label,
  value,
  onChange,
  options = [...ORIGINALITY_ANSWER_OPTIONS],
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: readonly string[];
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Yes / No / Unknown" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const RESTORATION_SCOPE_FIELDS: { key: keyof FactoryCorrectDetails; label: string }[] = [
  { key: "originalEngine", label: "Original Engine" },
  { key: "originalTransmission", label: "Original Transmission" },
  { key: "originalChassis", label: "Original Chassis" },
  { key: "originalBodyPanels", label: "Original Body Panels" },
  { key: "originalEquipment", label: "Original Equipment" },
  { key: "periodCorrectParts", label: "Period Correct / Original Parts" },
];

export function RestorationProfileHeader({
  value,
  onChange,
}: {
  value: RestorationState;
  onChange: (patch: Partial<RestorationState>) => void;
}) {
  const sections = React.useMemo(
    () => flow3ProfileSections(value.buildType, value.restomodSubcategory),
    [value.buildType, value.restomodSubcategory]
  );
  const [activeTab, setActiveTab] = React.useState<Flow3AdaptiveSectionId>(
    sections[0]?.id ?? "documentation"
  );

  React.useEffect(() => {
    if (!sections.some((section) => section.id === activeTab)) {
      setActiveTab(sections[0]?.id ?? "documentation");
    }
  }, [activeTab, sections]);

  const patchFactory = (patch: Partial<FactoryCorrectDetails>) =>
    onChange({ factoryCorrect: { ...value.factoryCorrect, ...patch } });

  const addDocs = (key: RestorationDocumentationGroupId, items: ListingMediaItem[]) => {
    const documentation = normalizeRestorationDocumentation(value.documentation);
    onChange({
      documentation: {
        ...documentation,
        [key]: [...documentation[key], ...items],
      },
    });
  };

  const removeDoc = (key: RestorationDocumentationGroupId, id: string) => {
    const documentation = normalizeRestorationDocumentation(value.documentation);
    onChange({
      documentation: {
        ...documentation,
        [key]: documentation[key].filter((item) => item.id !== id),
      },
    });
  };

  const buildLabel =
    getRestorationBuildTypeLabel(value.buildType, value.restomodSubcategory) ||
    "Build type not set";

  return (
    <div className="rounded-2xl border bg-card p-3 sm:p-5 space-y-4 sm:space-y-5 min-w-0">
      <div className="rounded-xl border bg-muted/30 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Build Type
        </p>
        <p className="mt-1 text-sm font-semibold">{buildLabel}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Edit on Vehicle Details. This selection controls the screens below.
        </p>
      </div>

      {sections.length > 0 ? (
        <SpecsCategoryTabs
          categories={sections.map((section) => ({
            id: section.id,
            label: section.optional ? `${section.label} (optional)` : section.label,
          }))}
          activeCategoryId={activeTab}
          onSelect={(id) => setActiveTab(id as Flow3AdaptiveSectionId)}
          ariaLabel="Restoration profile sections"
        />
      ) : null}

      {activeTab === "originality" ? (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-base">{FLOW3_ORIGINALITY_COPY.title}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {FLOW3_ORIGINALITY_COPY.description}
            </p>
          </div>
          <FactoryCorrectOriginalityChecklist
            values={value.factoryCorrect}
            onChange={(key, next) => patchFactory({ [key]: next })}
          />
        </div>
      ) : null}

      {activeTab === "restoration-scope" ? (
        <div className="space-y-5">
          <div>
            <h3 className="font-semibold text-base">
              Originality & Factory Correctness — Restoration Scope
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Describe how much of the vehicle was restored versus left original. This is not a
              factory-correct restoration.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {FLOW3_BUILD_RESTORATION_COPY.originalityScoreHint}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RESTORATION_SCOPE_FIELDS.map((field) => (
              <YesNoSelect
                key={field.key}
                label={field.label}
                value={value.factoryCorrect[field.key]}
                onChange={(v) => patchFactory({ [field.key]: v })}
              />
            ))}
            <div>
              <FieldLabel htmlFor="scope-restoration-level">Restoration Level</FieldLabel>
              <Select
                value={value.factoryCorrect.restorationLevel || undefined}
                onValueChange={(v) => patchFactory({ restorationLevel: v })}
              >
                <SelectTrigger id="scope-restoration-level">
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
          </div>
        </div>
      ) : null}

      {activeTab === "documentation" ? (
        <RestorationDocumentationList
          documentation={value.documentation}
          onAdd={addDocs}
          onRemove={removeDoc}
        />
      ) : null}
    </div>
  );
}
