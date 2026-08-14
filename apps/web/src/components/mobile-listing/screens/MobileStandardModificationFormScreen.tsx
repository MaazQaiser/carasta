"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import type { ListingMediaItem, ListingTypeId, ModificationEntry } from "@/components/listing/types";
import {
  STANDARD_COMPLETED_DURING_OPTIONS,
} from "@/components/listing/specs/standard-modification-entry";
import { SHARED_MODIFICATION_CATEGORIES } from "@/components/listing/specs/shared-modification-categories";
import {
  ORIGINAL_PARTS_OPTIONS,
  shouldShowShopBuilder,
  WORK_PERFORMED_BY_OPTIONS,
} from "@/components/listing/specs/options";
import { MobileListingShell } from "../MobileListingShell";
import { MobileSelectField } from "../MobileOptionSheet";
import { MobileAddShopBuilderControl } from "../shop-builder/MobileAddShopBuilderControl";
import { useOpenShopBuilder } from "../shop-builder/useOpenShopBuilder";

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function MobileStandardModificationFormScreen({
  listingTypeId,
  stepId,
  returnPath,
  addPath,
  title,
  subtitle,
}: {
  listingTypeId: ListingTypeId;
  stepId: string;
  returnPath: string;
  addPath: string;
  title: string;
  subtitle: string;
}) {
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
    if (draft.listingTypeId && draft.listingTypeId !== listingTypeId) {
      router.replace("/mobile-listing/specifications");
    }
  }, [draft.listingTypeId, listingTypeId, router]);

  React.useEffect(() => {
    if (ws.editingEntryId) return;
    if (entryIdParam) {
      const existing = ws.entries.find((entry) => entry.id === entryIdParam);
      if (existing) {
        updateWorkspace({ editingEntryId: existing.id, hasModifications: true });
        return;
      }
    }
    const categoryId =
      ws.activeCategoryId || SHARED_MODIFICATION_CATEGORIES[0]?.id || "engine-performance";
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
        stepId={stepId}
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

  const setWorkPerformedBy = (value: string) => {
    patch({
      workPerformedBy: value,
      ...(shouldShowShopBuilder(value) ? null : { shopBuilder: "" }),
    });
  };

  const addFiles = (key: "photos" | "receipt", files: FileList | null) => {
    if (!files?.length) return;
    const items: ListingMediaItem[] = Array.from(files).map((file) => ({
      id: createLocalId("media"),
      name: file.name,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));
    patch({ [key]: [...form[key], ...items] });
  };

  const removeMedia = (key: "photos" | "receipt", id: string) => {
    patch({ [key]: form[key].filter((item) => item.id !== id) });
  };

  const canSave = Boolean(form.categoryId && form.title.trim());
  const showShopBuilder = shouldShowShopBuilder(form.workPerformedBy);

  const onSave = () => {
    if (!canSave) return;
    saveEntry({ ...form, completed: true });
    router.push(returnPath);
  };

  const onCancel = () => {
    cancelEntryEdit();
    router.push(returnPath);
  };

  const openShopPicker = () => {
    openShopBuilder({
      target: "entry.shopBuilder",
      entry: form,
      label: "Shop / Builder",
      returnTo: `${addPath}?id=${form.id}`,
    });
  };

  return (
    <MobileListingShell
      stepId={stepId}
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
          <h1 className="text-[28px] font-extrabold text-[#1c1c1e]">{title}</h1>
          <p className="mt-2 text-[14px] text-[#636366]">{subtitle}</p>
        </div>

        <MobileSelectField
          label="Category"
          value={form.categoryId}
          options={SHARED_MODIFICATION_CATEGORIES.map((category) => ({
            value: category.id,
            label: category.label,
          }))}
          onChange={(value) => {
            patch({ categoryId: value });
            updateWorkspace({ activeCategoryId: value });
          }}
        />

        <FieldInput
          label="Modification"
          value={form.title}
          placeholder="e.g. Aftermarket wheels"
          onChange={(value) => patch({ title: value })}
        />

        <FieldTextarea
          label="Modification Details"
          value={form.description}
          placeholder="Describe what was modified, replaced, upgraded or added. Include details about the parts used and changes made."
          onChange={(value) => patch({ description: value })}
        />

        <MobileSelectField
          label="Modification Completed During"
          value={form.completedDuring ?? ""}
          options={STANDARD_COMPLETED_DURING_OPTIONS.map((option) => ({
            value: option,
            label: option,
          }))}
          onChange={(value) => patch({ completedDuring: value })}
        />

        <MobileSelectField
          label="Work Performed By"
          value={form.workPerformedBy ?? ""}
          options={WORK_PERFORMED_BY_OPTIONS.map((option) => ({
            value: option,
            label: option,
          }))}
          onChange={setWorkPerformedBy}
        />

        {showShopBuilder ? (
          <MobileAddShopBuilderControl
            value={form.shopBuilder}
            onPress={openShopPicker}
            busy={opening}
          />
        ) : null}

        <FieldInput
          label="Date"
          type="date"
          value={form.installationDate}
          onChange={(value) =>
            patch({
              installationDate: value,
              dateStatus: value ? "Exact Date" : "",
            })
          }
        />

        <FieldInput
          label="Mileage"
          value={form.mileage}
          placeholder="Mileage at installation"
          onChange={(value) => patch({ mileage: value })}
        />

        <MobileSelectField
          label="Original Parts Included"
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
          label="Supporting Documents"
          description="Upload receipts or any other supporting documentation about the modification."
          accept=".pdf,.png,.jpg,.jpeg"
          items={form.receipt}
          onAdd={(files) => addFiles("receipt", files)}
          onRemove={(id) => removeMedia("receipt", id)}
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

function MediaField({
  label,
  description,
  accept,
  items,
  onAdd,
  onRemove,
}: {
  label: string;
  description?: string;
  accept: string;
  items: ListingMediaItem[];
  onAdd: (files: FileList | null) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div>
        <span className="text-[12px] font-semibold text-[#636366]">{label}</span>
        {description ? (
          <p className="mt-0.5 text-[12px] text-[#636366]">{description}</p>
        ) : null}
      </div>
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
