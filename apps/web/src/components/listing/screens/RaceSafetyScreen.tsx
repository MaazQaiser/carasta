"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FieldHint, FieldLabel, textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import {
  FLOW4_SAFETY_COPY,
  SAFETY_EQUIPMENT_OPTIONS,
  isSafetyEquipmentDateId,
  patchSafetyServiceDate,
  toggleInstalledSafetyEquipment,
} from "../specs/race-track";
import { LISTING_PATHS } from "../listing-route-map";

/** Phase 1 optional Safety Equipment — installed items only, no certification fields. */
export function RaceSafetyScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const race = draft.modificationWorkspace.race;
  const installed = race.installedSafetyEquipment ?? [];
  const otherSelected = installed.includes("other");

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "race-track-car") {
      router.replace(LISTING_PATHS.specifications);
    }
  }, [draft.listingTypeId, router]);

  const patchRace = (patch: Partial<typeof race>) => {
    updateWorkspace({
      race: { ...race, ...patch },
    });
  };

  return (
    <ListingStep title={FLOW4_SAFETY_COPY.title} description={FLOW4_SAFETY_COPY.subtext}>
      <ListingSection>
        <div className="space-y-2">
          {SAFETY_EQUIPMENT_OPTIONS.map((option) => {
            const selected = installed.includes(option.id);
            const dateId = isSafetyEquipmentDateId(option.id) ? option.id : null;
            return (
              <div key={option.id} className="space-y-2">
                <button
                  type="button"
                  onClick={() => patchRace(toggleInstalledSafetyEquipment(race, option.id))}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                    selected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:bg-muted/40"
                  )}
                >
                  <span className="font-medium text-foreground">{option.label}</span>
                  {selected ? <Check className="h-4 w-4 shrink-0 text-primary" /> : null}
                </button>
                {selected && dateId ? (
                  <div className="pl-4">
                    <FieldLabel htmlFor={`race-safety-date-${dateId}`}>
                      {FLOW4_SAFETY_COPY.dateLabel}
                    </FieldLabel>
                    <Input
                      id={`race-safety-date-${dateId}`}
                      type="date"
                      value={race.safetyServiceDates?.[dateId] ?? ""}
                      onChange={(event) =>
                        patchRace(patchSafetyServiceDate(race, dateId, event.target.value))
                      }
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <FieldHint>{FLOW4_SAFETY_COPY.disclaimer}</FieldHint>
      </ListingSection>

      <ListingSection>
        <div>
          <FieldLabel htmlFor="race-safety-notes">{FLOW4_SAFETY_COPY.notesLabel}</FieldLabel>
          <textarea
            id="race-safety-notes"
            className={textareaClassName}
            value={race.safetyEquipmentNotes ?? ""}
            onChange={(event) => patchRace({ safetyEquipmentNotes: event.target.value })}
            placeholder={FLOW4_SAFETY_COPY.notesPlaceholder}
          />
          {otherSelected ? <FieldHint>{FLOW4_SAFETY_COPY.otherHint}</FieldHint> : null}
        </div>
      </ListingSection>
    </ListingStep>
  );
}
