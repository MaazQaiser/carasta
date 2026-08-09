"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import type { RaceSafetyEquipment } from "@/components/listing/types";
import { RACE_TRACK_SPECS_CONFIG } from "@/components/listing/specs/race-track";
import { RACE_SAFETY_EQUIPMENT_OPTIONS } from "@/components/listing/specs/options";
import { MobileListingShell } from "../MobileListingShell";
import { MobileShopBuilderField } from "../shop-builder/MobileShopBuilderField";
import { useOpenShopBuilder } from "../shop-builder/useOpenShopBuilder";

const CATEGORIES = RACE_TRACK_SPECS_CONFIG.categories;

const CORE_SAFETY_FIELDS: { key: keyof RaceSafetyEquipment; label: string }[] = [
  { key: "rollCageType", label: "Cage Type" },
  { key: "seatManufacturer", label: "Seat" },
  { key: "harnessManufacturer", label: "Harness" },
];

const CERTIFICATION_FIELDS: { key: keyof RaceSafetyEquipment; label: string; type?: string }[] = [
  { key: "seatCertification", label: "Certification" },
  { key: "certificationOrganization", label: "Certification Organization" },
  { key: "certificationNumber", label: "Certification Number" },
  { key: "certificationExpiration", label: "Expiration", type: "date" },
];

const SAFETY_EQUIPMENT_FIELDS: { key: keyof RaceSafetyEquipment; label: string }[] = [
  { key: "windowNet", label: "Window Net" },
  { key: "fireSuppressionSystem", label: "Fire System" },
  { key: "fuelCell", label: "Fuel Cell" },
  { key: "batteryCutoff", label: "Battery Cutoff" },
  { key: "towHooks", label: "Tow Hooks" },
  { key: "killSwitch", label: "Kill Switch" },
];

export function MobileRaceSpecsScreen() {
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
  const race = ws.race;
  const [expanded, setExpanded] = React.useState<string | null>(
    ws.activeCategoryId || CATEGORIES[0]?.id || null
  );
  const [showSafety, setShowSafety] = React.useState(true);
  const [pickerField, setPickerField] = React.useState<keyof RaceSafetyEquipment | null>(null);

  React.useEffect(() => {
    if (ws.editingEntryId) {
      cancelEntryEdit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "race-track-car") {
      router.replace("/mobile-listing/specifications");
    }
  }, [draft.listingTypeId, router]);

  const entries = ws.entries.filter((entry) => entry.completed);

  const patchSafety = (patch: Partial<RaceSafetyEquipment>) => {
    updateWorkspace({
      race: {
        ...race,
        safety: { ...race.safety, ...patch },
      },
    });
  };

  const addModification = (categoryId: string) => {
    updateWorkspace({ activeCategoryId: categoryId });
    startNewEntry(categoryId);
    router.push("/mobile-listing/race/modifications/add");
  };

  const editModification = (entryId: string) => {
    startEditEntry(entryId);
    router.push(`/mobile-listing/race/modifications/add?id=${entryId}`);
  };

  return (
    <MobileListingShell
      stepId="race-specifications"
      continueDisabled={false}
      continueHref="/mobile-listing/condition"
    >
      <div className="flex flex-col gap-6 px-6 pt-4 pb-6">
        <div>
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            Race Specifications &amp; Modifications
          </h1>
          <p className="mt-2 text-[14px] text-[#636366]">
            Document safety equipment and race / track categories.
          </p>
        </div>

        <section className="rounded-xl border border-[#e5e5ea]">
          <button
            type="button"
            onClick={() => setShowSafety((open) => !open)}
            className="flex h-12 w-full items-center justify-between px-3 text-left"
          >
            <span className="text-[13px] font-semibold text-[#1c1c1e]">
              Safety Equipment Checklist
            </span>
            {showSafety ? (
              <ChevronDown className="h-4 w-4 text-[#636366]" />
            ) : (
              <ChevronRight className="h-4 w-4 text-[#636366]" />
            )}
          </button>

          {showSafety ? (
            <div className="space-y-5 border-t border-[#e5e5ea] p-3">
              <div className="space-y-3">
                {CORE_SAFETY_FIELDS.map((field) => (
                  <React.Fragment key={field.key}>
                    <label className="block space-y-1.5">
                      <span className="text-[12px] font-semibold text-[#636366]">{field.label}</span>
                      <input
                        value={race.safety[field.key]}
                        onChange={(event) => patchSafety({ [field.key]: event.target.value })}
                        className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]"
                      />
                    </label>
                    {field.key === "rollCageType" ? (
                      <MobileShopBuilderField
                        label="Builder"
                        value={race.safety.rollCageBuilder}
                        placeholder="Search or add a builder"
                        onPress={() =>
                          openShopBuilder({
                            target: "race.safety.rollCageBuilder",
                            label: "Builder",
                          })
                        }
                        busy={opening}
                      />
                    ) : null}
                  </React.Fragment>
                ))}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-wide text-[#1b1464]">
                    Certification Details
                  </p>
                  <p className="mt-1 text-[12px] text-[#636366]">
                    Seat and equipment certification records for this build.
                  </p>
                </div>
                {CERTIFICATION_FIELDS.map((field) => (
                  <label key={field.key} className="block space-y-1.5">
                    <span className="text-[12px] font-semibold text-[#636366]">{field.label}</span>
                    <input
                      type={field.type ?? "text"}
                      value={race.safety[field.key]}
                      onChange={(event) => patchSafety({ [field.key]: event.target.value })}
                      className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]"
                    />
                  </label>
                ))}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-wide text-[#1b1464]">
                    Safety Equipment
                  </p>
                  <p className="mt-1 text-[12px] text-[#636366]">
                    Confirm whether each item is installed on the vehicle.
                  </p>
                </div>
                {SAFETY_EQUIPMENT_FIELDS.map((field) => (
                  <SelectField
                    key={field.key}
                    label={field.label}
                    value={race.safety[field.key]}
                    placeholder="Installed / Not Installed"
                    onPress={() => setPickerField(field.key)}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <div>
          <h2 className="text-[16px] font-bold text-[#1c1c1e]">Categories</h2>
          <p className="mt-1 text-[12px] text-[#636366]">
            {entries.length === 0
              ? "No modification entries yet."
              : `${entries.length} Modification${entries.length === 1 ? "" : "s"} Added`}
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
                        No modification entries in this category yet.
                      </p>
                    ) : (
                      categoryEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="rounded-lg border border-[#e5e5ea] bg-white px-3 py-2"
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#636366]">
                            {category.label}
                          </p>
                          <p className="mt-0.5 truncate text-[13px] font-semibold text-[#1c1c1e]">
                            {entry.title || "Untitled modification"}
                          </p>
                          {entry.description || entry.typeOfWork ? (
                            <p className="mt-1 line-clamp-2 text-[11px] text-[#636366]">
                              {entry.description || entry.typeOfWork}
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
                      ))
                    )}
                    <button
                      type="button"
                      onClick={() => addModification(category.id)}
                      className="flex h-11 w-full items-center justify-center gap-1 rounded-lg border border-[#1b1464] text-[13px] font-semibold text-[#1b1464]"
                    >
                      <Plus className="h-4 w-4" />
                      Add Entry
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {pickerField ? (
        <OptionSheet
          label={
            SAFETY_EQUIPMENT_FIELDS.find((field) => field.key === pickerField)?.label || "Select"
          }
          options={[...RACE_SAFETY_EQUIPMENT_OPTIONS]}
          value={race.safety[pickerField]}
          onClose={() => setPickerField(null)}
          onSelect={(value) => {
            patchSafety({ [pickerField]: value });
            setPickerField(null);
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
        <div className="mt-4 space-y-2">
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
