"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import type { ListingMediaItem, ModificationEntry } from "@/components/listing/types";
import { RACE_TRACK_SPECS_CONFIG } from "@/components/listing/specs/race-track";
import {
  shouldShowShopBuilder,
  WORK_PERFORMED_BY_OPTIONS,
} from "@/components/listing/specs/options";
import { MobileListingShell } from "../MobileListingShell";
import { MobileSelectField } from "../MobileOptionSheet";
import { MobileAddShopBuilderControl } from "../shop-builder/MobileAddShopBuilderControl";
import { useOpenShopBuilder } from "../shop-builder/useOpenShopBuilder";

const CATEGORIES = RACE_TRACK_SPECS_CONFIG.categories;

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function MobileRaceModScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { draft, updateWorkspace, startNewEntry, saveEntry, cancelEntryEdit } =
    useListingBuilder();
  const { openShopBuilder, opening } = useOpenShopBuilder();
  const entryIdParam = searchParams.get("id");
  const ws = draft.modificationWorkspace;

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "race-track-car") {
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
    startNewEntry(ws.activeCategoryId || CATEGORIES[0]?.id || "engine-performance");
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
    router.push("/mobile-listing/race/specifications");
  };

  if (!form) {
    return (
      <MobileListingShell
        stepId="race-mod-add"
        continueDisabled
        hideProgress
        hideSaveDraftExit
        backLabel="Cancel"
        continueLabel="Save Race Entry"
        onBack={onCancel}
      >
        <div className="px-6 py-10 text-[14px] text-[#636366]">Preparing entry form…</div>
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

  const addPhotos = (files: FileList | null) => {
    if (!files?.length) return;
    const items: ListingMediaItem[] = Array.from(files).map((file) => ({
      id: createLocalId("media"),
      name: file.name,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));
    patch({ photos: [...form.photos, ...items] });
  };

  const canSave = Boolean(form.categoryId && form.title.trim());

  const onSave = () => {
    if (!canSave) return;
    saveEntry({ ...form, completed: true });
    router.push("/mobile-listing/race/specifications");
  };

  return (
    <MobileListingShell
      stepId="race-mod-add"
      continueDisabled={!canSave}
      onContinue={onSave}
      onBack={onCancel}
      hideProgress
      hideSaveDraftExit
      backLabel="Cancel"
      continueLabel="Save Race Entry"
    >
      <div className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#1c1c1e]">Race Entry</h1>
          <p className="mt-2 text-[14px] text-[#636366]">
            Document work under the race / track categories.
          </p>
        </div>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Category</span>
          <select
            value={form.categoryId}
            onChange={(event) => {
              patch({ categoryId: event.target.value });
              updateWorkspace({ activeCategoryId: event.target.value });
            }}
            className="h-11 w-full rounded-lg border border-[#e5e5ea] bg-white px-3 text-[13px]"
          >
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Title</span>
          <input
            value={form.title}
            onChange={(event) => patch({ title: event.target.value })}
            className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px]"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Type of Work</span>
          <input
            value={form.typeOfWork}
            onChange={(event) => patch({ typeOfWork: event.target.value })}
            placeholder="e.g. Cage install, aero package"
            className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px]"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Description</span>
          <textarea
            value={form.description}
            onChange={(event) => patch({ description: event.target.value })}
            className="min-h-24 w-full rounded-lg border border-[#e5e5ea] p-3 text-[13px]"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Brand</span>
          <input
            value={form.partsBrand}
            onChange={(event) => patch({ partsBrand: event.target.value })}
            className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px]"
          />
        </label>

        <MobileSelectField
          label="Work Performed By"
          value={form.workPerformedBy}
          options={WORK_PERFORMED_BY_OPTIONS.map((option) => ({
            value: option,
            label: option,
          }))}
          onChange={setWorkPerformedBy}
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
                addPhotos(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Notes</span>
          <textarea
            value={form.additionalNotes}
            onChange={(event) => patch({ additionalNotes: event.target.value })}
            className="min-h-24 w-full rounded-lg border border-[#e5e5ea] p-3 text-[13px]"
          />
        </label>
      </div>
    </MobileListingShell>
  );
}
