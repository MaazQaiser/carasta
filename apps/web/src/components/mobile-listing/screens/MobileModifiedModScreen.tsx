"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import type { ListingMediaItem, ModificationEntry } from "@/components/listing/types";
import { MODIFIED_PERFORMANCE_SPECS_CONFIG } from "@/components/listing/specs/modified-performance";
import {
  DATE_STATUS_OPTIONS,
  ORIGINAL_PARTS_OPTIONS,
} from "@/components/listing/specs/options";
import { MobileListingShell } from "../MobileListingShell";
import { MobileSelectField } from "../MobileOptionSheet";
import { MobileShopBuilderField } from "../shop-builder/MobileShopBuilderField";
import { useOpenShopBuilder } from "../shop-builder/useOpenShopBuilder";

const CATEGORIES = MODIFIED_PERFORMANCE_SPECS_CONFIG.categories;

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

type MediaKey = "photos" | "receipt" | "supportingDocuments";

export function MobileModifiedModScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    draft,
    updateWorkspace,
    startNewEntry,
    saveEntry,
    cancelEntryEdit,
  } = useListingBuilder();
  const { openShopBuilder, opening } = useOpenShopBuilder();

  const entryIdParam = searchParams.get("id");
  const ws = draft.modificationWorkspace;

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "modified-performance") {
      router.replace("/mobile-listing/modifications/add");
    }
  }, [draft.listingTypeId, router]);

  React.useEffect(() => {
    if (ws.editingEntryId) return;
    if (entryIdParam) {
      const existing = ws.entries.find((entry) => entry.id === entryIdParam);
      if (existing) {
        updateWorkspace({ editingEntryId: existing.id, hasModifications: true });
        return;
      }
    }
    const categoryId = ws.activeCategoryId || CATEGORIES[0]?.id || "powertrain";
    updateWorkspace({ hasModifications: true });
    startNewEntry(categoryId);
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

  if (!form) {
    return (
      <MobileListingShell
        stepId="modified-mod-add"
        continueDisabled
        hideProgress
        hideSaveDraftExit
        backLabel="Cancel"
        continueLabel="Save Modification"
      >
        <div className="px-6 py-10 text-[14px] text-[#636366]">Preparing modification form…</div>
      </MobileListingShell>
    );
  }

  const patch = (partial: Partial<ModificationEntry>) =>
    setForm((prev) => (prev ? { ...prev, ...partial } : prev));

  const addFiles = (key: MediaKey, files: FileList | null) => {
    if (!files?.length) return;
    const items: ListingMediaItem[] = Array.from(files).map((file) => ({
      id: createLocalId("media"),
      name: file.name,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));
    patch({ [key]: [...form[key], ...items] });
  };

  const removeMedia = (key: MediaKey, id: string) => {
    patch({ [key]: form[key].filter((item) => item.id !== id) });
  };

  const workPerformed = form.description || form.title;
  const canSave = Boolean(form.categoryId && workPerformed.trim());

  const onSave = () => {
    if (!canSave) return;
    const trimmed = workPerformed.trim();
    saveEntry({
      ...form,
      title: form.title.trim() || trimmed,
      description: form.description.trim() || trimmed,
      completed: true,
    });
    router.push("/mobile-listing/modified/specifications");
  };

  const onCancel = () => {
    cancelEntryEdit();
    router.push("/mobile-listing/modified/specifications");
  };

  return (
    <MobileListingShell
      stepId="modified-mod-add"
      continueDisabled={!canSave}
      onContinue={onSave}
      onBack={onCancel}
      hideProgress
      hideSaveDraftExit
      backLabel="Cancel"
      continueLabel="Save Modification"
    >
      <div className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#1c1c1e]">Add Modification</h1>
          <p className="mt-2 text-[14px] text-[#636366]">
            Document work performed, parts, installer details, and supporting media.
          </p>
        </div>

        <FieldSelect
          label="Category"
          value={form.categoryId}
          options={CATEGORIES.map((category) => ({
            value: category.id,
            label: category.label,
          }))}
          onChange={(value) => {
            patch({ categoryId: value });
            updateWorkspace({ activeCategoryId: value });
          }}
        />

        <FieldTextarea
          label="Work Performed"
          value={form.description}
          placeholder="Describe the work performed"
          onChange={(value) => patch({ description: value, title: value })}
        />

        <FieldInput
          label="Parts / Brand"
          value={form.partsBrand}
          placeholder="e.g. Garrett, OEM+"
          onChange={(value) => patch({ partsBrand: value })}
        />

        <FieldInput
          label="Installer"
          value={form.workPerformedBy}
          placeholder="Who installed this modification"
          onChange={(value) => patch({ workPerformedBy: value })}
        />

        <MobileShopBuilderField
          label="Shop"
          value={form.shopBuilder}
          placeholder="Search or add a shop"
          onPress={() =>
            openShopBuilder({
              target: "entry.shopBuilder",
              entry: form,
              label: "Shop",
            })
          }
          busy={opening}
        />

        <FieldSelect
          label="Date Status"
          value={form.dateStatus}
          options={DATE_STATUS_OPTIONS.map((option) => ({
            value: option,
            label: option,
          }))}
          onChange={(value) =>
            patch({
              dateStatus: value,
              installationDate: value === "Exact Date" ? form.installationDate : "",
            })
          }
        />

        {form.dateStatus === "Exact Date" ? (
          <FieldInput
            label="Exact Date"
            type="date"
            value={form.installationDate}
            onChange={(value) => patch({ installationDate: value })}
          />
        ) : null}

        <FieldInput
          label="Mileage"
          value={form.mileage}
          placeholder="Mileage at installation"
          onChange={(value) => patch({ mileage: value })}
        />

        <FieldSelect
          label="Original Parts"
          value={form.originalPartsIncluded}
          options={ORIGINAL_PARTS_OPTIONS.map((option) => ({
            value: option,
            label: option,
          }))}
          onChange={(value) => patch({ originalPartsIncluded: value })}
        />

        <MediaField
          label="Photos"
          accept="image/*"
          items={form.photos}
          onAdd={(files) => addFiles("photos", files)}
          onRemove={(id) => removeMedia("photos", id)}
        />

        <MediaField
          label="Receipt"
          accept=".pdf,.png,.jpg,.jpeg"
          items={form.receipt}
          onAdd={(files) => addFiles("receipt", files)}
          onRemove={(id) => removeMedia("receipt", id)}
        />

        <MediaField
          label="Supporting Documents"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          items={form.supportingDocuments}
          onAdd={(files) => addFiles("supportingDocuments", files)}
          onRemove={(id) => removeMedia("supportingDocuments", id)}
        />

        <FieldTextarea
          label="Notes"
          value={form.additionalNotes}
          placeholder="Anything else buyers should know"
          onChange={(value) => patch({ additionalNotes: value })}
        />
      </div>
    </MobileListingShell>
  );
}

function FieldInput({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[12px] font-semibold text-[#636366]">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]"
      />
    </label>
  );
}

function FieldTextarea({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[12px] font-semibold text-[#636366]">{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-24 w-full rounded-lg border border-[#e5e5ea] p-3 text-[13px] outline-none focus:border-[#1b1464]"
      />
    </label>
  );
}

function FieldSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <MobileSelectField label={label} value={value} options={options} onChange={onChange} />
  );
}

function MediaField({
  label,
  accept,
  items,
  onAdd,
  onRemove,
}: {
  label: string;
  accept: string;
  items: ListingMediaItem[];
  onAdd: (files: FileList | null) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      <span className="text-[12px] font-semibold text-[#636366]">{label}</span>
      <label className="flex h-11 cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#1b1464] text-[13px] font-semibold text-[#1b1464]">
        Upload {label}
        <input
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={(event) => {
            onAdd(event.target.files);
            event.target.value = "";
          }}
        />
      </label>
      {items.length > 0 ? (
        <ul className="space-y-1">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg bg-[#f4f5fc] px-3 py-2 text-[12px]"
            >
              <span className="truncate">{item.name}</span>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="ml-2 font-semibold text-[#d34a4a]"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
