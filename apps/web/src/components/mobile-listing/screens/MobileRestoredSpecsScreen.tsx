"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import type {
  FactoryCorrectDetails,
  ListingMediaItem,
  RestorationDocumentation,
} from "@/components/listing/types";
import {
  RESTORATION_AUTHENTICITY_OPTIONS,
  RESTORATION_COMPLETION_STATUS_OPTIONS,
  RESTORATION_LEVEL_OPTIONS,
} from "@/components/listing/specs/options";
import { RESTORED_RESTOMODE_SPECS_CONFIG } from "@/components/listing/specs/restored-restomod";
import { MobileListingShell } from "../MobileListingShell";
import { MobileShopBuilderField } from "../shop-builder/MobileShopBuilderField";
import { useOpenShopBuilder } from "../shop-builder/useOpenShopBuilder";

const CATEGORIES = RESTORED_RESTOMODE_SPECS_CONFIG.categories;

const YES_NO_FIELDS: { key: keyof FactoryCorrectDetails; label: string }[] = [
  { key: "numbersMatchingEngine", label: "Numbers Matching Engine" },
  { key: "numbersMatchingTransmission", label: "Numbers Matching Transmission" },
  { key: "originalBodyPanels", label: "Original Body Panels" },
  { key: "originalChassis", label: "Original Chassis" },
  { key: "factoryCorrectPaint", label: "Factory Correct Paint" },
  { key: "factoryCorrectInterior", label: "Factory Correct Interior" },
  { key: "factoryCorrectWheels", label: "Original Wheels" },
  { key: "factoryCorrectTrim", label: "Original Trim" },
  { key: "factoryCorrectRadio", label: "Original Radio" },
  { key: "originalEquipment", label: "Original Equipment" },
  { key: "periodCorrectParts", label: "Original / Period Correct Parts" },
];

const DOC_FIELDS: {
  key: keyof RestorationDocumentation;
  label: string;
  uploadLabel: string;
  helper: string;
  accept: string;
}[] = [
  {
    key: "buildBook",
    label: "Build Book",
    uploadLabel: "Upload Build Book",
    helper: "Upload PDFs or photos documenting the restoration.",
    accept: ".pdf,.png,.jpg,.jpeg,.doc,.docx",
  },
  {
    key: "receipts",
    label: "Receipts",
    uploadLabel: "Upload Receipts",
    helper: "PDFs or photos of receipts.",
    accept: ".pdf,.png,.jpg,.jpeg,.doc,.docx",
  },
  {
    key: "invoices",
    label: "Invoices",
    uploadLabel: "Upload Invoices",
    helper: "PDFs or photos of invoices.",
    accept: ".pdf,.png,.jpg,.jpeg,.doc,.docx",
  },
  {
    key: "restorationPhotos",
    label: "Photos",
    uploadLabel: "Upload Photos",
    helper: "Photos documenting the restoration process.",
    accept: "image/*",
  },
  {
    key: "factoryDocuments",
    label: "Factory Documents",
    uploadLabel: "Upload Documents",
    helper: "PDFs or photos of factory documents.",
    accept: ".pdf,.png,.jpg,.jpeg,.doc,.docx",
  },
];

type PickerState =
  | { kind: "authenticity"; field: keyof FactoryCorrectDetails }
  | { kind: "restorationLevel" }
  | { kind: "completionStatus" };

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

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
  const { openShopBuilder, opening } = useOpenShopBuilder();
  const ws = draft.modificationWorkspace;
  const restoration = ws.restoration;
  const [showRestorationFields, setShowRestorationFields] = React.useState(true);
  const [picker, setPicker] = React.useState<PickerState | null>(null);

  // Drop abandoned draft entries left behind by incomplete navigations.
  React.useEffect(() => {
    if (ws.editingEntryId) {
      cancelEntryEdit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const entries = ws.entries.filter((entry) => entry.completed);

  const firstCategoryWithEntries =
    CATEGORIES.find((category) => entries.some((entry) => entry.categoryId === category.id))?.id ??
    null;

  const [expanded, setExpanded] = React.useState<string | null>(
    () => ws.activeCategoryId || firstCategoryWithEntries || CATEGORIES[0]?.id || null
  );

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "restored-restomod-custom") {
      router.replace("/mobile-listing/specifications");
    }
  }, [draft.listingTypeId, router]);

  // Keep expanded category aligned when entries land in another category.
  React.useEffect(() => {
    if (!expanded) return;
    const expandedHasEntries = entries.some((entry) => entry.categoryId === expanded);
    if (expandedHasEntries || entries.length === 0) return;
    if (firstCategoryWithEntries) setExpanded(firstCategoryWithEntries);
  }, [entries, expanded, firstCategoryWithEntries]);

  const patchFactory = (patch: Partial<FactoryCorrectDetails>) => {
    updateWorkspace({
      restoration: {
        ...restoration,
        factoryCorrect: { ...restoration.factoryCorrect, ...patch },
      },
    });
  };

  const addDocs = (key: keyof RestorationDocumentation, files: FileList | null) => {
    if (!files?.length) return;
    const items: ListingMediaItem[] = Array.from(files).map((file) => ({
      id: createLocalId("doc"),
      name: file.name,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));
    updateWorkspace({
      restoration: {
        ...restoration,
        documentation: {
          ...restoration.documentation,
          [key]: [...restoration.documentation[key], ...items],
        },
      },
    });
  };

  const removeDoc = (key: keyof RestorationDocumentation, id: string) => {
    updateWorkspace({
      restoration: {
        ...restoration,
        documentation: {
          ...restoration.documentation,
          [key]: restoration.documentation[key].filter((item) => item.id !== id),
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
      ? YES_NO_FIELDS.find((field) => field.key === picker.field)?.label || "Select"
      : picker?.kind === "restorationLevel"
        ? "Restoration Level"
        : picker?.kind === "completionStatus"
          ? "Completion Status"
          : "";

  const pickerOptions =
    picker?.kind === "authenticity"
      ? RESTORATION_AUTHENTICITY_OPTIONS
      : picker?.kind === "restorationLevel"
        ? RESTORATION_LEVEL_OPTIONS
        : picker?.kind === "completionStatus"
          ? RESTORATION_COMPLETION_STATUS_OPTIONS
          : [];

  const pickerValue =
    picker?.kind === "authenticity"
      ? restoration.factoryCorrect[picker.field]
      : picker?.kind === "restorationLevel"
        ? restoration.factoryCorrect.restorationLevel
        : picker?.kind === "completionStatus"
          ? restoration.factoryCorrect.completionStatus
          : "";

  return (
    <MobileListingShell
      stepId="restored-specifications"
      continueDisabled={false}
      continueHref="/mobile-listing/condition"
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <div>
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            Authenticity &amp; Restoration
          </h1>
          <p className="mt-2 text-[14px] text-[#636366]">
            Document restoration authenticity, paperwork, and category work.
          </p>
        </div>

        <section className="rounded-xl border border-[#e5e5ea]">
          <button
            type="button"
            onClick={() => setShowRestorationFields((open) => !open)}
            className="flex h-12 w-full items-center justify-between px-3 text-left"
          >
            <span className="text-[13px] font-semibold text-[#1c1c1e]">Authenticity Checklist</span>
            {showRestorationFields ? (
              <ChevronDown className="h-4 w-4 text-[#636366]" />
            ) : (
              <ChevronRight className="h-4 w-4 text-[#636366]" />
            )}
          </button>

          {showRestorationFields ? (
            <div className="space-y-3 border-t border-[#e5e5ea] p-3">
              {YES_NO_FIELDS.map((field) => (
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

              <SelectField
                label="Completion Status"
                value={restoration.factoryCorrect.completionStatus}
                placeholder="Select completion status"
                onPress={() => setPicker({ kind: "completionStatus" })}
              />

              <MobileShopBuilderField
                label="Shop / Builder"
                value={
                  restoration.factoryCorrect.restorationShop ||
                  restoration.factoryCorrect.builder
                }
                placeholder="Search or add a shop"
                onPress={() =>
                  openShopBuilder({
                    target: "restoration.shop",
                    label: "Shop / Builder",
                  })
                }
                busy={opening}
              />

              {DOC_FIELDS.map((field) => (
                <div key={field.key} className="space-y-2">
                  <span className="text-[12px] font-semibold text-[#636366]">{field.label}</span>
                  <label className="flex h-11 cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#1b1464] text-[13px] font-semibold text-[#1b1464]">
                    {field.uploadLabel}
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept={field.accept}
                      onChange={(event) => {
                        addDocs(field.key, event.target.files);
                        event.target.value = "";
                      }}
                    />
                  </label>
                  <p className="text-[11px] text-[#636366]">{field.helper}</p>
                  {restoration.documentation[field.key].length > 0 ? (
                    <ul className="space-y-1">
                      {restoration.documentation[field.key].map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between rounded-lg bg-[#f4f5fc] px-3 py-2 text-[12px]"
                        >
                          <span className="truncate">{item.name}</span>
                          <button
                            type="button"
                            onClick={() => removeDoc(field.key, item.id)}
                            className="ml-2 font-semibold text-[#d34a4a]"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <div>
          <h2 className="text-[16px] font-bold text-[#1c1c1e]">Categories</h2>
          <p className="mt-1 text-[12px] text-[#636366]">
            {entries.length} restoration entr{entries.length === 1 ? "y" : "ies"} added
          </p>
        </div>

        <div className="divide-y divide-[#e5e5ea] rounded-xl border border-[#e5e5ea]">
          {CATEGORIES.map((category) => {
            const open = expanded === category.id;
            const categoryEntries = entries.filter((entry) => entry.categoryId === category.id);

            return (
              <div key={category.id}>
                <button
                  type="button"
                  onClick={() => {
                    setExpanded(open ? null : category.id);
                    updateWorkspace({ activeCategoryId: category.id });
                  }}
                  className="flex h-12 w-full items-center justify-between px-3 text-left"
                >
                  <span className="text-[13px] font-semibold text-[#1c1c1e]">
                    {category.label}
                    {categoryEntries.length > 0 ? (
                      <span className="ml-2 text-[10px] font-medium text-[#7b78a3]">
                        {categoryEntries.length}
                      </span>
                    ) : null}
                  </span>
                  {open ? (
                    <ChevronDown className="h-4 w-4 text-[#636366]" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-[#636366]" />
                  )}
                </button>

                {open ? (
                  <div className="space-y-3 border-t border-[#e5e5ea] bg-[#fafafa] p-3">
                    {categoryEntries.length === 0 ? (
                      <p className="text-[12px] text-[#636366]">
                        No restoration entries in this category yet.
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
                      Add Restoration Entry
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
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
            } else if (picker.kind === "restorationLevel") {
              patchFactory({ restorationLevel: value });
            } else {
              patchFactory({ completionStatus: value });
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
    <div className="fixed inset-0 z-50 flex items-end bg-black/40">
      <button type="button" className="absolute inset-0" aria-label="Close picker" onClick={onClose} />
      <div className="relative mx-auto w-full max-w-[440px] rounded-t-[28px] bg-white p-6 pb-8">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#d1d1d6]" />
        <h2 className="text-[18px] font-bold">{label}</h2>
        <div className="mt-4 max-h-[50vh] space-y-2 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`h-11 w-full rounded-lg border px-3 text-left text-[13px] ${
                option === value ? "border-[#1b1464] bg-[#f4f5fc]" : "border-[#e5e5ea]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
