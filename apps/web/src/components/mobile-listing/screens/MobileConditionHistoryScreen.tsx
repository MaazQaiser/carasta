"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import {
  formatTitleStatuses,
  parseTitleStatuses,
  TITLE_STATUS_OPTIONS,
  toggleTitleStatus,
  type TitleStatusOption,
} from "@/components/listing/specs/title-status";
import { MobileListingShell } from "../MobileListingShell";
import { MobileOptionSheet } from "../MobileOptionSheet";

export function MobileConditionHistoryScreen() {
  const { draft, updateCondition } = useListingBuilder();
  const [condition, setCondition] = React.useState(
    draft.condition.overallCondition || "Very Good"
  );
  const [sheet, setSheet] = React.useState<"condition" | "title" | null>(null);

  const titleStatuses = parseTitleStatuses(draft.condition.titleStatus);
  const titleLabel = formatTitleStatuses(titleStatuses) || "Select title status";

  React.useEffect(() => {
    if (!draft.condition.titleStatus) {
      updateCondition({ titleStatus: "Clean" });
    }
    if (!draft.condition.overallCondition) {
      updateCondition({ overallCondition: condition });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed defaults once
  }, []);

  const onToggleTitle = (option: TitleStatusOption) => {
    const next = toggleTitleStatus(titleStatuses, option);
    updateCondition({ titleStatus: formatTitleStatuses(next) });
  };

  return (
    <MobileListingShell
      stepId="condition"
      continueDisabled={false}
      continueHref="/mobile-listing/photos"
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
        <div className="rounded-lg bg-[#e7f7e8] px-3 py-2 text-[12px] text-[#26742d]">
          Vehicle history report found — 0 accidents reported, clean title.
        </div>
        <div className="space-y-3">
          <StaticSelect label="Accidents" value="None reported" />
          <StaticSelect label="Warranty" value="No active warranty" />
          <StaticSelect label="Service History" value="Service records available" />
          <StaticSelect
            label="Vehicle Condition"
            value={condition}
            onClick={() => setSheet("condition")}
          />
          <StaticSelect
            label="Title Status"
            value={titleLabel}
            onClick={() => setSheet("title")}
          />
          <div className="grid grid-cols-3 gap-2">
            {["1", "2", "3+"].map((count) => (
              <button
                key={count}
                type="button"
                className={`h-9 rounded-lg border text-[12px] ${
                  count === "2"
                    ? "border-[#1b1464] bg-[#f4f5fc] text-[#1b1464]"
                    : "border-[#e5e5ea]"
                }`}
              >
                {count} owners
              </button>
            ))}
          </div>
        </div>
      </div>

      {sheet === "condition" ? (
        <MobileOptionSheet open title="Vehicle Condition" onClose={() => setSheet(null)}>
          <div className="divide-y divide-[#f0f0f2]">
            {["Excellent", "Very Good", "Good", "Fair", "Project"].map((option) => (
              <button
                key={option}
                type="button"
                className="flex w-full items-center justify-between py-3.5 text-left text-[14px] text-[#1c1c1e]"
                onClick={() => {
                  setCondition(option);
                  updateCondition({ overallCondition: option });
                  setSheet(null);
                }}
              >
                {option}
                {option === condition ? (
                  <Check className="h-4 w-4 text-[#1b1464]" />
                ) : null}
              </button>
            ))}
          </div>
        </MobileOptionSheet>
      ) : null}

      {sheet === "title" ? (
        <MobileOptionSheet open title="Title Status" onClose={() => setSheet(null)}>
          <p className="mb-3 text-[12px] leading-relaxed text-[#636366]">
            Select one of Clean, Salvage, or Rebuilt. Lien can be added with any of those. Unknown
            cannot be combined.
          </p>
          <div className="divide-y divide-[#f0f0f2]">
            {TITLE_STATUS_OPTIONS.map((option) => {
              const selected = titleStatuses.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  className="flex w-full items-center justify-between py-3.5 text-left text-[14px] text-[#1c1c1e]"
                  onClick={() => onToggleTitle(option)}
                >
                  {option}
                  {selected ? <Check className="h-4 w-4 text-[#1b1464]" /> : null}
                </button>
              );
            })}
          </div>
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

function StaticSelect({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick?: () => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[12px] font-semibold text-[#636366]">{label}</span>
      <button
        type="button"
        onClick={onClick}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-[#e5e5ea] px-3 text-left text-[13px] text-[#1c1c1e]"
      >
        <span className="min-w-0 truncate">{value}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-[#636366]" />
      </button>
    </label>
  );
}
