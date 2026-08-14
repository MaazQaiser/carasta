"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import type {
  FactoryCorrectDetails,
  ListingMediaItem,
  RestorationDocumentationGroupId,
} from "@/components/listing/types";
import { RESTORATION_LEVEL_OPTIONS } from "@/components/listing/specs/options";
import { FactoryCorrectOriginalityChecklist } from "@/components/listing/specs/FactoryCorrectOriginalityChecklist";
import { RestorationDocumentationList } from "@/components/listing/specs/RestorationDocumentationList";
import {
  FLOW3_BUILD_RESTORATION_COPY,
  FLOW3_ORIGINALITY_COPY,
  ORIGINALITY_ANSWER_OPTIONS,
  flow3AdaptiveSections,
  getRestorationBuildCategories,
  isFactoryCorrectOriginalityComplete,
  normalizeRestorationCategoryId,
  normalizeRestorationDocumentation,
} from "@/components/listing/specs/restored-restomod";
import { MobileListingShell } from "../MobileListingShell";
import { MobileOptionList, MobileOptionSheet } from "../MobileOptionSheet";
import { MobileRestoredVehicleCard } from "./MobileRestoredVehicleCard";

const SCOPE_FIELDS: { key: keyof FactoryCorrectDetails; label: string }[] = [
  { key: "originalEngine", label: "Original Engine" },
  { key: "originalTransmission", label: "Original Transmission" },
  { key: "originalChassis", label: "Original Chassis" },
  { key: "originalBodyPanels", label: "Original Body Panels" },
  { key: "originalEquipment", label: "Original Equipment" },
  { key: "periodCorrectParts", label: "Original / Period Correct Parts" },
];

type PickerState =
  | { kind: "authenticity"; field: keyof FactoryCorrectDetails }
  | { kind: "restorationLevel" };

export function MobileRestoredSpecsScreen() {
  const router = useRouter();
  const {
    draft,
    updateWorkspace,
    startNewEntry,
    startEditEntry,
    deleteEntry,
    cancelEntryEdit,
  } = useListingBuilder();
  const ws = draft.modificationWorkspace;
  const restoration = ws.restoration;
  const categories = getRestorationBuildCategories(restoration.buildType);
  const sections = flow3AdaptiveSections(restoration.buildType, restoration.restomodSubcategory);
  const showOriginality = sections.some((section) => section.id === "originality");
  const showScope = sections.some((section) => section.id === "restoration-scope");
  const authenticityFields = SCOPE_FIELDS;
  const [showRestorationFields, setShowRestorationFields] = React.useState(showScope);
  const [picker, setPicker] = React.useState<PickerState | null>(null);

  // Drop abandoned draft entries left behind by incomplete navigations.
  React.useEffect(() => {
    if (ws.editingEntryId) {
      cancelEntryEdit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const entries = ws.entries.filter((entry) => entry.completed || entry.title.trim());
  const [expanded, setExpanded] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "restored-restomod-custom") {
      router.replace("/mobile-listing/specifications");
    }
  }, [draft.listingTypeId, router]);

  const patchFactory = (patch: Partial<FactoryCorrectDetails>) => {
    updateWorkspace({
      restoration: {
        ...restoration,
        factoryCorrect: { ...restoration.factoryCorrect, ...patch },
      },
    });
  };

  const documentation = normalizeRestorationDocumentation(restoration.documentation);

  const addDocs = (key: RestorationDocumentationGroupId, items: ListingMediaItem[]) => {
    if (!items.length) return;
    updateWorkspace({
      restoration: {
        ...restoration,
        documentation: {
          ...documentation,
          [key]: [...documentation[key], ...items],
        },
      },
    });
  };

  const removeDoc = (key: RestorationDocumentationGroupId, id: string) => {
    updateWorkspace({
      restoration: {
        ...restoration,
        documentation: {
          ...documentation,
          [key]: documentation[key].filter((item) => item.id !== id),
        },
      },
    });
  };

  const addModification = (categoryId: string) => {
    updateWorkspace({ activeCategoryId: categoryId });
    startNewEntry(categoryId);
    router.push("/mobile-listing/restored/modifications/add");
  };

  const editModification = (entryId: string) => {
    startEditEntry(entryId);
    router.push(`/mobile-listing/restored/modifications/add?id=${entryId}`);
  };

  const pickerLabel =
    picker?.kind === "authenticity"
      ? authenticityFields.find((field) => field.key === picker.field)?.label || "Select"
      : picker?.kind === "restorationLevel"
        ? "Restoration Level"
        : "";

  const pickerOptions =
    picker?.kind === "authenticity"
      ? [...ORIGINALITY_ANSWER_OPTIONS]
      : picker?.kind === "restorationLevel"
        ? RESTORATION_LEVEL_OPTIONS
        : [];

  const pickerValue =
    picker?.kind === "authenticity"
      ? restoration.factoryCorrect[picker.field]
      : picker?.kind === "restorationLevel"
        ? restoration.factoryCorrect.restorationLevel
        : "";

  return (
    <MobileListingShell
      stepId="restored-specifications"
      continueDisabled={
        showOriginality && !isFactoryCorrectOriginalityComplete(restoration.factoryCorrect)
      }
      continueHref="/mobile-listing/restored/timeline"
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <MobileRestoredVehicleCard />

        <div>
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            {FLOW3_BUILD_RESTORATION_COPY.title}
          </h1>
          <p className="mt-2 text-[14px] text-[#636366]">
            {FLOW3_BUILD_RESTORATION_COPY.description}
          </p>
        </div>

        {showOriginality ? (
          <section className="space-y-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#1c1c1e]">
                {FLOW3_ORIGINALITY_COPY.title}
              </h2>
              <p className="mt-1 text-[12px] text-[#636366]">
                {FLOW3_ORIGINALITY_COPY.description}
              </p>
            </div>
            <FactoryCorrectOriginalityChecklist
              variant="mobile"
              values={restoration.factoryCorrect}
              onChange={(key, next) => patchFactory({ [key]: next })}
            />
          </section>
        ) : null}

        {showScope ? (
        <section className="rounded-xl border border-[#e5e5ea] bg-white">
          <button
            type="button"
            onClick={() => setShowRestorationFields((open) => !open)}
            className="flex h-12 w-full items-center justify-between px-3 text-left"
          >
            <span className="text-[13px] font-semibold text-[#1c1c1e]">
              Originality & Factory Correctness — Restoration Scope
            </span>
            {showRestorationFields ? (
              <ChevronDown className="h-4 w-4 text-[#636366]" />
            ) : (
              <ChevronRight className="h-4 w-4 text-[#636366]" />
            )}
          </button>

          {showRestorationFields ? (
            <div className="space-y-3 border-t border-[#e5e5ea] p-3">
              <p className="text-[11px] text-[#636366]">
                {FLOW3_BUILD_RESTORATION_COPY.originalityScoreHint}
              </p>
              {authenticityFields.map((field) => (
                <SelectField
                  key={field.key}
                  label={field.label}
                  value={restoration.factoryCorrect[field.key]}
                  placeholder="Yes / No / Unknown"
                  onPress={() => setPicker({ kind: "authenticity", field: field.key })}
                />
              ))}
              <SelectField
                label="Restoration Level"
                value={restoration.factoryCorrect.restorationLevel}
                placeholder="Select restoration level"
                onPress={() => setPicker({ kind: "restorationLevel" })}
              />
            </div>
          ) : null}
        </section>
        ) : null}

        <div className="flex flex-col gap-2">
          {categories.map((category) => {
            const open = expanded === category.id;
            const categoryEntries = entries.filter(
              (entry) => normalizeRestorationCategoryId(entry.categoryId) === category.id
            );
            const count = categoryEntries.length;

            return (
              <div
                key={category.id}
                className="overflow-hidden rounded-xl border border-[#e5e5ea] bg-white"
              >
                <button
                  type="button"
                  onClick={() => {
                    setExpanded(open ? null : category.id);
                    updateWorkspace({ activeCategoryId: category.id });
                  }}
                  className="flex h-12 w-full items-center gap-2 px-3 text-left"
                >
                  <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#1c1c1e]">
                    {category.label}
                  </span>
                  {count > 0 ? (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#1b1464] px-1.5 text-[10px] font-bold text-white">
                      {count}
                    </span>
                  ) : null}
                  {open ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#636366]" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-[#636366]" />
                  )}
                </button>

                {open ? (
                  <div className="space-y-3 border-t border-[#e5e5ea] bg-[#fafafa] p-3">
                    {categoryEntries.length === 0 ? (
                      <p className="text-[12px] text-[#636366]">
                      {FLOW3_BUILD_RESTORATION_COPY.emptyCategory}
                      </p>
                    ) : (
                      categoryEntries.map((entry) => {
                        const detail =
                          entry.description && entry.description !== entry.title
                            ? entry.description
                            : entry.typeOfWork || entry.additionalNotes;
                        return (
                          <div
                            key={entry.id}
                            className="rounded-lg border border-[#e5e5ea] bg-white px-3 py-2"
                          >
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#636366]">
                              {category.label}
                            </p>
                            <p className="mt-0.5 truncate text-[13px] font-semibold text-[#1c1c1e]">
                              {entry.title || "Untitled restoration entry"}
                            </p>
                            {detail ? (
                              <p className="mt-1 line-clamp-2 text-[11px] text-[#636366]">
                                {detail}
                              </p>
                            ) : null}
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => editModification(entry.id)}
                                className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#e5e5ea] px-2.5 text-[12px] font-semibold text-[#1c1c1e]"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteEntry(entry.id)}
                                className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#e5e5ea] px-2.5 text-[12px] font-semibold text-[#d34a4a]"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <button
                      type="button"
                      onClick={() => addModification(category.id)}
                      className="flex h-10 w-full items-center justify-center gap-1 rounded-lg border border-[#1b1464] text-[12px] font-semibold text-[#1b1464]"
                    >
                      <Plus className="h-4 w-4" />
                      {FLOW3_BUILD_RESTORATION_COPY.addEntry}
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() =>
            addModification(expanded || categories[0]?.id || "body-chassis")
          }
          className="flex h-11 items-center justify-center rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
        >
          {FLOW3_BUILD_RESTORATION_COPY.addEntry}
        </button>

        <RestorationDocumentationList
          documentation={documentation}
          onAdd={addDocs}
          onRemove={removeDoc}
        />

        {restoration.buildSummary?.trim() ? (
          <section className="rounded-xl border border-[#e5e5ea] p-3">
            <h2 className="text-[13px] font-semibold text-[#1c1c1e]">Build Summary</h2>
            <p className="mt-2 text-[13px] text-[#636366]">{restoration.buildSummary}</p>
          </section>
        ) : null}
      </div>

      {picker ? (
        <OptionSheet
          label={pickerLabel}
          options={[...pickerOptions]}
          value={pickerValue}
          onClose={() => setPicker(null)}
          onSelect={(value) => {
            if (picker.kind === "authenticity") {
              patchFactory({ [picker.field]: value });
            } else {
              patchFactory({ restorationLevel: value });
            }
            setPicker(null);
          }}
        />
      ) : null}
    </MobileListingShell>
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
