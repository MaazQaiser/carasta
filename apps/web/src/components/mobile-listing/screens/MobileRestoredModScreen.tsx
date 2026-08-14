"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import type { ListingMediaItem, ModificationEntry } from "@/components/listing/types";
import {
  getRestorationBuildCategories,
  shouldShowPartClassification,
} from "@/components/listing/specs/restored-restomod";
import {
  PART_CLASSIFICATION_OPTIONS,
  RESTORATION_COMPLETION_STATUS_OPTIONS,
  shouldShowShopBuilder,
  WORK_PERFORMED_BY_OPTIONS,
} from "@/components/listing/specs/options";
import { MobileListingShell } from "../MobileListingShell";
import { MobileOptionList, MobileOptionSheet } from "../MobileOptionSheet";
import { MobileAddShopBuilderControl } from "../shop-builder/MobileAddShopBuilderControl";
import { useOpenShopBuilder } from "../shop-builder/useOpenShopBuilder";

type PickerKey =
  | "category"
  | "workPerformedBy"
  | "completionStatus"
  | "partClassification";

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
  const categories = getRestorationBuildCategories(ws.restoration.buildType);
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
    startNewEntry(ws.activeCategoryId || categories[0]?.id || "body-chassis");
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
        continueLabel="Save Entry"
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

  const canSave = Boolean(
    form.categoryId && form.title.trim() && form.description.trim() && form.workPerformedBy
  );
  const showPartClassification =
    shouldShowPartClassification(ws.restoration.buildType) || Boolean(form.partClassification);

  const onSave = () => {
    if (!canSave) return;
    saveEntry({ ...form, completed: true });
    router.push("/mobile-listing/restored/specifications");
  };

  const categoryLabel =
    categories.find((category) => category.id === form.categoryId)?.label || "";

  const pickerConfig: Record<
    PickerKey,
    { label: string; options: { value: string; label: string }[]; value: string }
  > = {
    category: {
      label: "Category",
      options: categories.map((category) => ({
        value: category.id,
        label: category.label,
      })),
      value: form.categoryId,
    },
    workPerformedBy: {
      label: "Work Performed By",
      options: WORK_PERFORMED_BY_OPTIONS.map((option) => ({
        value: option,
        label: option,
      })),
      value: form.workPerformedBy,
    },
    completionStatus: {
      label: "Completion Status",
      options: RESTORATION_COMPLETION_STATUS_OPTIONS.map((option) => ({
        value: option,
        label: option,
      })),
      value: form.completedDuring,
    },
    partClassification: {
      label: "Classification",
      options: PART_CLASSIFICATION_OPTIONS.map((option) => ({
        value: option,
        label: option,
      })),
      value: form.partClassification,
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
      continueLabel="Save Entry"
    >
      <div className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#1c1c1e]">Add Restoration Entry</h1>
          <p className="mt-2 text-[14px] text-[#636366]">
            Document restoration and build work for this listing.
          </p>
        </div>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Entry Title</span>
          <input
            value={form.title}
            onChange={(event) => patch({ title: event.target.value })}
            placeholder="e.g. Rally Green PPG Paint"
            className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>

        <SelectField
          label="Category"
          value={categoryLabel}
          placeholder="Select category"
          onPress={() => setPicker("category")}
        />

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Details</span>
          <textarea
            value={form.description}
            onChange={(event) => patch({ description: event.target.value })}
            placeholder="Describe what was restored, rebuilt, fabricated, replaced, upgraded, or added."
            className="min-h-28 w-full rounded-lg border border-[#e5e5ea] p-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>

        <SelectField
          label="Work Performed By"
          value={form.workPerformedBy}
          placeholder="Select who performed the work"
          onPress={() => setPicker("workPerformedBy")}
        />

        {shouldShowShopBuilder(form.workPerformedBy) ? (
          <MobileAddShopBuilderControl
            value={form.shopBuilder}
            onPress={() =>
              openShopBuilder({
                target: "entry.shopBuilder",
                entry: form,
                label: "Shop / Builder",
              })
            }
            busy={opening}
          />
        ) : null}

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Parts Used</span>
          <input
            value={form.partsBrand}
            onChange={(event) => patch({ partsBrand: event.target.value })}
            placeholder="Enter part name…"
            className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Manufacturer / Source</span>
          <input
            value={form.manufacturer}
            onChange={(event) => patch({ manufacturer: event.target.value })}
            placeholder="e.g. PPG Paint"
            className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>

        {showPartClassification ? (
          <SelectField
            label="Classification"
            value={form.partClassification}
            placeholder="Optional"
            onPress={() => setPicker("partClassification")}
          />
        ) : null}

        <SelectField
          label="Completion Status"
          value={form.completedDuring}
          placeholder="Optional"
          onPress={() => setPicker("completionStatus")}
        />

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Completion Date</span>
          <input
            type="date"
            value={form.installationDate}
            onChange={(event) =>
              patch({
                installationDate: event.target.value,
                dateStatus: event.target.value ? "Exact Date" : "",
              })
            }
            className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Completion Mileage</span>
          <input
            value={form.mileage}
            onChange={(event) => patch({ mileage: event.target.value })}
            placeholder="e.g. 14,800"
            className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>

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
          <span className="text-[12px] font-semibold text-[#636366]">Files / Receipts</span>
          <label className="flex h-11 cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#1b1464] text-[13px] font-semibold text-[#1b1464]">
            Upload Files
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
            Upload receipts, invoices, or any other supporting documentation.
          </p>
        </div>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Additional Notes</span>
          <textarea
            value={form.additionalNotes}
            onChange={(event) => patch({ additionalNotes: event.target.value })}
            placeholder="Anything else buyers should know about this entry…"
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
              patch({
                workPerformedBy: value,
                ...(shouldShowShopBuilder(value) ? null : { shopBuilder: "" }),
              });
            } else if (picker === "completionStatus") {
              patch({ completedDuring: value });
            } else {
              patch({ partClassification: value });
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
        className="flex h-11 w-full items-center justify-between rounded-lg border border-[#e5e5ea] px-3 text-left"
      >
        <span className={value ? "text-[13px] text-[#1c1c1e]" : "text-[13px] text-[#8e8e93]"}>
          {value || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-[#636366]" />
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
    <MobileOptionSheet open onClose={onClose} title={label}>
      <MobileOptionList
        options={options}
        value={value}
        onSelect={onSelect}
      />
    </MobileOptionSheet>
  );
}
