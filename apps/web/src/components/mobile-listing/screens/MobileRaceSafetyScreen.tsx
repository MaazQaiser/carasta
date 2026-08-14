"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import {
  FLOW4_SAFETY_COPY,
  SAFETY_EQUIPMENT_OPTIONS,
  isSafetyEquipmentDateId,
  patchSafetyServiceDate,
  toggleInstalledSafetyEquipment,
} from "@/components/listing/specs/race-track";
import { MobileListingShell } from "../MobileListingShell";

export function MobileRaceSafetyScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const race = draft.modificationWorkspace.race;
  const installed = race.installedSafetyEquipment ?? [];
  const otherSelected = installed.includes("other");

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "race-track-car") {
      router.replace("/mobile-listing/specifications");
    }
  }, [draft.listingTypeId, router]);

  const patchRace = (patch: Partial<typeof race>) => {
    updateWorkspace({
      race: { ...race, ...patch },
    });
  };

  return (
    <MobileListingShell
      stepId="race-safety"
      continueDisabled={false}
      continueHref="/mobile-listing/race/biography"
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            {FLOW4_SAFETY_COPY.title}
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">{FLOW4_SAFETY_COPY.subtext}</p>
        </div>

        <div className="overflow-hidden rounded-[16px] border border-[#e5e5ea] bg-white">
          {SAFETY_EQUIPMENT_OPTIONS.map((option, index) => {
            const selected = installed.includes(option.id);
            const dateId = isSafetyEquipmentDateId(option.id) ? option.id : null;
            return (
              <div
                key={option.id}
                className={cn(
                  index < SAFETY_EQUIPMENT_OPTIONS.length - 1 && "border-b border-[#e5e5ea]"
                )}
              >
                <button
                  type="button"
                  onClick={() => patchRace(toggleInstalledSafetyEquipment(race, option.id))}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                >
                  <span className="text-[15px] font-medium text-[#1c1c1e]">{option.label}</span>
                  <span
                    className={cn(
                      "relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors",
                      selected ? "bg-[#1b1464]" : "bg-[#e5e5ea]"
                    )}
                    aria-hidden
                  >
                    <span
                      className={cn(
                        "absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow transition-transform",
                        selected ? "translate-x-[22px]" : "translate-x-[2px]"
                      )}
                    />
                  </span>
                </button>
                {selected && dateId ? (
                  <div className="border-t border-[#f2f2f7] bg-[#fafafa] px-4 py-3">
                    <label className="block space-y-1.5">
                      <span className="text-[12px] font-semibold text-[#636366]">
                        {FLOW4_SAFETY_COPY.dateLabel}
                      </span>
                      <input
                        type="date"
                        value={race.safetyServiceDates?.[dateId] ?? ""}
                        onChange={(event) =>
                          patchRace(patchSafetyServiceDate(race, dateId, event.target.value))
                        }
                        className="h-11 w-full rounded-lg border border-[#e5e5ea] bg-white px-3 text-[13px] outline-none focus:border-[#1b1464]"
                      />
                    </label>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <p className="text-[11px] leading-relaxed text-[#636366]">{FLOW4_SAFETY_COPY.disclaimer}</p>

        <label className="block space-y-1.5">
          <span className="text-[13px] font-semibold text-[#1c1c1e]">
            {FLOW4_SAFETY_COPY.notesLabel}
          </span>
          <textarea
            value={race.safetyEquipmentNotes ?? ""}
            onChange={(event) => patchRace({ safetyEquipmentNotes: event.target.value })}
            placeholder={FLOW4_SAFETY_COPY.notesPlaceholder}
            className="min-h-24 w-full resize-none rounded-[12px] border border-[#e5e5ea] p-3 text-[13px] leading-relaxed outline-none focus:border-[#1b1464]"
          />
          {otherSelected ? (
            <p className="text-[11px] leading-relaxed text-[#636366]">
              {FLOW4_SAFETY_COPY.otherHint}
            </p>
          ) : null}
        </label>
      </div>
    </MobileListingShell>
  );
}
