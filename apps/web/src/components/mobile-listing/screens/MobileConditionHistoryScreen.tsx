"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import {
  formatTitleStatuses,
  isTitleStatusComplete,
  parseTitleStatuses,
  TITLE_STATUS_OPTIONS,
  TITLE_STATUS_RULES_COPY,
  toggleTitleStatus,
  type TitleStatusOption,
} from "@/components/listing/specs/title-status";
import { MobileListingShell } from "../MobileListingShell";
import { MobileOptionSheet } from "../MobileOptionSheet";

const OVERALL_CONDITIONS: { id: string; label: string; description: string }[] = [
  { id: "Excellent", label: "Excellent", description: "No cosmetic or mechanical flaws." },
  { id: "Very Good", label: "Very Good", description: "Minor wear, fully operational." },
  { id: "Good", label: "Good", description: "Some wear, all systems functional." },
  { id: "Fair", label: "Fair", description: "Passable, needs minor repairs." },
  { id: "Project", label: "Project", description: "Needs restoration or assembly." },
];

const KEY_OPTIONS = ["None", "1", "2", "3+"] as const;

const IMPORTED_HISTORY = {
  source: "Vehicle History API",
  accidentHistory: "No Accidents Reported",
  serviceRecords: "18 Records",
  previousOwners: "2 Owners",
};

const HISTORY_SECTIONS = [
  { id: "vehicleHistory", label: "Vehicle History", placeholder: "Add seller notes about vehicle history…" },
  { id: "ownershipHistory", label: "Ownership", placeholder: "Ownership details buyers should know…" },
  { id: "accidentHistory", label: "Accidents", placeholder: "Describe accidents, damage, or repairs…" },
  { id: "warranty", label: "Warranty", placeholder: "Warranty status or coverage notes…" },
  { id: "serviceRecords", label: "Service Records", placeholder: "Service history notes…" },
] as const;

export function MobileConditionHistoryScreen() {
  const { draft, updateCondition } = useListingBuilder();
  const [openSection, setOpenSection] = React.useState<string | null>(null);
  const [sheet, setSheet] = React.useState<"title" | null>(null);

  const titleStatuses = parseTitleStatuses(draft.condition.titleStatus);
  const titleLabel = formatTitleStatuses(titleStatuses) || "Select Status";
  const canContinue =
    Boolean(draft.condition.overallCondition) && isTitleStatusComplete(draft.condition.titleStatus);

  const onToggleTitle = (option: TitleStatusOption) => {
    const next = toggleTitleStatus(titleStatuses, option);
    updateCondition({ titleStatus: formatTitleStatuses(next) });
  };

  return (
    <MobileListingShell
      stepId="condition"
      continueDisabled={!canContinue}
      continueHref={canContinue ? "/mobile-listing/photos" : undefined}
    >
      <div className="flex flex-col gap-5 px-6 pb-6 pt-4">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            Condition &amp; History
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">
            Tell buyers about your vehicle’s history and condition.
          </p>
        </div>

        <div className="rounded-xl border border-[#86efac] bg-[#e7f7e8] px-4 py-3 space-y-2">
          <p className="text-[13px] font-semibold text-[#166534]">
            Retrieved from {IMPORTED_HISTORY.source}
          </p>
          <ul className="space-y-1 text-[12px] text-[#166534]">
            <li>Accident History: {IMPORTED_HISTORY.accidentHistory}</li>
            <li>Service Records: {IMPORTED_HISTORY.serviceRecords}</li>
            <li>Previous Owners: {IMPORTED_HISTORY.previousOwners}</li>
          </ul>
          <p className="text-[11px] leading-relaxed text-[#3f6212]">
            Imported for reference only — not seller-verified. Confirm or correct details below.
          </p>
        </div>

        <div className="space-y-2">
          {HISTORY_SECTIONS.map((section) => {
            const open = openSection === section.id;
            const value = draft.condition[section.id];
            return (
              <div key={section.id} className="overflow-hidden rounded-2xl border border-[#e5e5ea] bg-white">
                <button
                  type="button"
                  onClick={() => setOpenSection(open ? null : section.id)}
                  className="flex w-full items-center justify-between px-4 py-3.5 text-left"
                >
                  <span className="text-[14px] font-semibold text-[#1c1c1e]">{section.label}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-[#636366] transition-transform",
                      open && "rotate-180"
                    )}
                  />
                </button>
                {open ? (
                  <div className="border-t border-[#f0f0f2] px-4 py-3">
                    <textarea
                      value={value}
                      onChange={(event) =>
                        updateCondition({ [section.id]: event.target.value })
                      }
                      placeholder={section.placeholder}
                      className="min-h-24 w-full resize-none rounded-lg border border-[#e5e5ea] p-3 text-[13px] outline-none focus:border-[#1b1464]"
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <p className="text-[12px] font-semibold text-[#636366]">Vehicle Condition</p>
          <div className="grid grid-cols-2 gap-2">
            {OVERALL_CONDITIONS.map((option) => {
              const selected = draft.condition.overallCondition === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => updateCondition({ overallCondition: option.id })}
                  className={cn(
                    "rounded-2xl border p-3 text-left",
                    selected
                      ? "border-[#1b1464] bg-[#f4f5fc]"
                      : "border-[#e5e5ea] bg-white"
                  )}
                >
                  <p
                    className={cn(
                      "text-[13px] font-bold",
                      selected ? "text-[#1b1464]" : "text-[#1c1c1e]"
                    )}
                  >
                    {option.label}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-[#636366]">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Title Status</span>
          <button
            type="button"
            onClick={() => setSheet("title")}
            className="flex h-11 w-full items-center justify-between rounded-lg border border-[#e5e5ea] bg-white px-3 text-left"
          >
            <span
              className={
                titleStatuses.length
                  ? "text-[13px] text-[#1c1c1e]"
                  : "text-[13px] text-[#9ca3af]"
              }
            >
              {titleLabel}
            </span>
            <ChevronDown className="h-4 w-4 text-[#636366]" />
          </button>
        </div>

        <div className="space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Number of Keys</span>
          <div className="grid grid-cols-4 gap-2">
            {KEY_OPTIONS.map((option) => {
              const selected = draft.condition.numberOfKeys === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateCondition({ numberOfKeys: option })}
                  className={cn(
                    "h-10 rounded-lg border text-[12px] font-semibold",
                    selected
                      ? "border-[#1b1464] bg-[#f4f5fc] text-[#1b1464]"
                      : "border-[#e5e5ea] text-[#1c1c1e]"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {sheet === "title" ? (
        <MobileOptionSheet open title="Title Status" onClose={() => setSheet(null)}>
          <p className="mb-3 text-[12px] leading-relaxed text-[#636366]">
            {TITLE_STATUS_RULES_COPY}
          </p>
          <div className="space-y-2">
            {TITLE_STATUS_OPTIONS.map((option) => {
              const selected = titleStatuses.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-[14px]",
                    selected
                      ? "border-[#1b1464] bg-[#f4f5fc] text-[#1b1464]"
                      : "border-[#e5e5ea] text-[#1c1c1e]"
                  )}
                  onClick={() => onToggleTitle(option)}
                >
                  {option}
                  {selected ? <Check className="h-4 w-4 text-[#1b1464]" /> : null}
                </button>
              );
            })}
          </div>
          {titleStatuses.length ? (
            <p className="mt-3 text-[12px] text-[#636366]">
              Selected: {formatTitleStatuses(titleStatuses)}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => setSheet(null)}
            className="mt-4 h-11 w-full rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
          >
            Done
          </button>
        </MobileOptionSheet>
      ) : null}
    </MobileListingShell>
  );
}
