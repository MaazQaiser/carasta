"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import type { ListingMediaItem, ModificationEntry } from "@/components/listing/types";
import { RESTORED_RESTOMODE_SPECS_CONFIG } from "@/components/listing/specs/restored-restomod";
import {
  ORIGINAL_PARTS_OPTIONS,
  RESTORATION_DATE_STATUS_OPTIONS,
  RESTORATION_WORK_PERFORMED_BY_OPTIONS,
} from "@/components/listing/specs/options";
import { MobileListingShell } from "../MobileListingShell";
import { MobileShopBuilderField } from "../shop-builder/MobileShopBuilderField";
import { useOpenShopBuilder } from "../shop-builder/useOpenShopBuilder";

const CATEGORIES = RESTORED_RESTOMODE_SPECS_CONFIG.categories;

type PickerKey = "category" | "workPerformedBy" | "dateStatus" | "originalParts";

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function MobileRestoredModScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { draft, updateWorkspace, startNewEntry, saveEntry, cancelEntryEdit } =
    useListingBuilder();
  const { openShopBuilder, opening } = useOpenShopBuilder();
  const entryIdParam = searchParams.get("id");
  const ws = draft.modificationWorkspace;
  const [picker, setPicker] = React.useState<PickerKey | null>(null);

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "restored-restomod-custom") {
      router.replace("/mobile-listing/modifications/add");
    }
  }, [draft.listingTypeId, router]);

  React.useEffect(() => {
    if (ws.editingEntryId) return;
    if (entryIdParam) {
      const existing = ws.entries.find((entry) => entry.id === entryIdParam);
      if (existing) {
        updateWorkspace({ editingEntryId: existing.id });
        return;
      }
    }
    startNewEntry(ws.activeCategoryId || CATEGORIES[0]?.id || "build-restoration");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editing =
    ws.entries.find((entry) => entry.id === ws.editingEntryId) ??
    (entryIdParam ? ws.entries.find((entry) => entry.id === entryIdParam) : null) ??
    null;

  const [form, setForm] = React.useState<ModificationEntry | null>(null);

  React.useEffect(() => {
    if (!editing) return;
    setForm((prev) => {
      if (!prev || prev.id !== editing.id) return editing;
      return {
        ...prev,
        shopBuilder: editing.shopBuilder,
        workPerformedBy: editing.workPerformedBy,
      };
    });
  }, [editing]);

  const onCancel = () => {
    cancelEntryEdit();
    router.push("/mobile-listing/restored/specifications");
  };

  if (!form) {
    return (
      <MobileListingShell
        stepId="restored-mod-add"
        continueDisabled
        hideProgress
        hideSaveDraftExit
        backLabel="Cancel"
        continueLabel="Save Restoration Entry"
        onBack={onCancel}
      >
        <div className="px-6 py-10 text-[14px] text-[#636366]">Preparing entry form…</div>
      </MobileListingShell>
    );
  }

  const patch = (partial: Partial<ModificationEntry>) =>
    setForm((prev) => (prev ? { ...prev, ...partial } : prev));

  const addFiles = (key: "photos" | "supportingDocuments", files: FileList | null) => {
    if (!files?.length) return;
    const items: ListingMediaItem[] = Array.from(files).map((file) => ({
      id: createLocalId("media"),
      name: file.name,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));
    patch({ [key]: [...form[key], ...items] });
  };

  const canSave = Boolean(form.categoryId && form.title.trim());

  const onSave = () => {
    if (!canSave) return;
    saveEntry({ ...form, completed: true });
    router.push("/mobile-listing/restored/specifications");
  };

  const categoryLabel =
    CATEGORIES.find((category) => category.id === form.categoryId)?.label || "";

  const pickerConfig: Record<
    PickerKey,
    { label: string; options: { value: string; label: string }[]; value: string }
  > = {
    category: {
      label: "Category",
      options: CATEGORIES.map((category) => ({
        value: category.id,
        label: category.label,
      })),
      value: form.categoryId,
    },
    workPerformedBy: {
      label: "Work Performed By",
      options: RESTORATION_WORK_PERFORMED_BY_OPTIONS.map((option) => ({
        value: option,
        label: option,
      })),
      value: form.workPerformedBy,
    },
    dateStatus: {
      label: "Date Status",
      options: RESTORATION_DATE_STATUS_OPTIONS.map((option) => ({
        value: option,
        label: option,
      })),
      value: form.dateStatus,
    },
    originalParts: {
      label: "Original Parts",
      options: ORIGINAL_PARTS_OPTIONS.map((option) => ({
        value: option,
        label: option,
      })),
      value: form.originalPartsIncluded,
    },
  };

  return (
    <MobileListingShell
      stepId="restored-mod-add"
      continueDisabled={!canSave}
      onContinue={onSave}
      onBack={onCancel}
      hideProgress
      hideSaveDraftExit
      backLabel="Cancel"
      continueLabel="Save Restoration Entry"
    >
      <div className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#1c1c1e]">Restoration Entry</h1>
          <p className="mt-2 text-[14px] text-[#636366]">
            Document work under the restored / restomod / custom categories.
          </p>
        </div>

        <SelectField
          label="Category"
          value={categoryLabel}
          placeholder="Select category"
          onPress={() => setPicker("category")}
        />

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Restoration Title</span>
          <input
            value={form.title}
            onChange={(event) => patch({ title: event.target.value })}
            placeholder="Name this restoration entry"
            className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Summary</span>
          <textarea
            value={form.description}
            onChange={(event) => patch({ description: event.target.value })}
            placeholder="Brief overview of this restoration entry"
            className="min-h-24 w-full rounded-lg border border-[#e5e5ea] p-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Work Performed</span>
          <textarea
            value={form.typeOfWork}
            onChange={(event) => patch({ typeOfWork: event.target.value })}
            placeholder="Describe the restoration work in detail"
            className="min-h-28 w-full rounded-lg border border-[#e5e5ea] p-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Parts / Brand</span>
          <input
            value={form.partsBrand}
            onChange={(event) => patch({ partsBrand: event.target.value })}
            className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>

        <SelectField
          label="Work Performed By"
          value={form.workPerformedBy}
          placeholder="Select who performed the work"
          onPress={() => setPicker("workPerformedBy")}
        />

        <MobileShopBuilderField
          label="Shop / Builder"
          value={form.shopBuilder}
          placeholder="Search or add a shop"
          onPress={() =>
            openShopBuilder({
              target: "entry.shopBuilder",
              entry: form,
              label: "Shop / Builder",
            })
          }
          busy={opening}
        />

        <SelectField
          label="Date Status"
          value={form.dateStatus}
          placeholder="Select date status"
          onPress={() => setPicker("dateStatus")}
        />

        <SelectField
          label="Original Parts"
          value={form.originalPartsIncluded}
          placeholder="Yes / No / Partial"
          onPress={() => setPicker("originalParts")}
        />

        <div className="space-y-2">
          <span className="text-[12px] font-semibold text-[#636366]">Photos</span>
          <label className="flex h-11 cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#1b1464] text-[13px] font-semibold text-[#1b1464]">
            Upload Photos
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                addFiles("photos", event.target.files);
                event.target.value = "";
              }}
            />
          </label>
          <p className="text-[11px] text-[#636366]">Photos documenting this restoration work.</p>
        </div>

        <div className="space-y-2">
          <span className="text-[12px] font-semibold text-[#636366]">Supporting Documents</span>
          <label className="flex h-11 cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#1b1464] text-[13px] font-semibold text-[#1b1464]">
            Upload Documents
            <input
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              multiple
              className="hidden"
              onChange={(event) => {
                addFiles("supportingDocuments", event.target.files);
                event.target.value = "";
              }}
            />
          </label>
          <p className="text-[11px] text-[#636366]">
            PDFs or photos of receipts, invoices, and related documents.
          </p>
        </div>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Notes</span>
          <textarea
            value={form.additionalNotes}
            onChange={(event) => patch({ additionalNotes: event.target.value })}
            className="min-h-24 w-full rounded-lg border border-[#e5e5ea] p-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>
      </div>

      {picker ? (
        <OptionSheet
          label={pickerConfig[picker].label}
          options={pickerConfig[picker].options}
          value={pickerConfig[picker].value}
          onClose={() => setPicker(null)}
          onSelect={(value) => {
            if (picker === "category") {
              patch({ categoryId: value });
              updateWorkspace({ activeCategoryId: value });
            } else if (picker === "workPerformedBy") {
              patch({ workPerformedBy: value });
            } else if (picker === "dateStatus") {
              patch({ dateStatus: value });
            } else {
              patch({ originalPartsIncluded: value });
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
  options: { value: string; label: string }[];
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
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className={`h-11 w-full rounded-lg border px-3 text-left text-[13px] ${
                option.value === value ? "border-[#1b1464] bg-[#f4f5fc]" : "border-[#e5e5ea]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
