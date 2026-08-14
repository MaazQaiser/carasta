"use client";

import { cn } from "@/lib/utils";
import type { FactoryCorrectDetails } from "../types";
import {
  FLOW3_ORIGINALITY_COPY,
  ORIGINALITY_ANSWER_OPTIONS,
  ORIGINALITY_FACTORY_CORRECTNESS_FIELDS,
  sellerReportedOriginality,
  type OriginalityAnswer,
} from "./restored-restomod";

export function FactoryCorrectOriginalityChecklist({
  values,
  onChange,
  variant = "web",
}: {
  values: FactoryCorrectDetails;
  onChange: (key: keyof FactoryCorrectDetails, value: OriginalityAnswer) => void;
  variant?: "web" | "mobile";
}) {
  const score = sellerReportedOriginality(values);
  const mobile = variant === "mobile";

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "overflow-hidden",
          mobile ? "rounded-[16px] bg-[#f2f2f7]" : "rounded-2xl border bg-muted/40"
        )}
      >
        <p
          className={cn(
            "font-semibold uppercase tracking-[0.04em] text-[#636366]",
            mobile ? "px-4 pt-3.5 text-[11px]" : "px-4 pt-4 text-xs"
          )}
        >
          {FLOW3_ORIGINALITY_COPY.sectionTitle}
        </p>
        <div className="px-2 pb-2 pt-1">
          {ORIGINALITY_FACTORY_CORRECTNESS_FIELDS.map((field) => {
            const selected = values[field.key];
            return (
              <div
                key={field.key}
                className="flex items-start gap-3 border-b border-[#e5e5ea] px-2 py-3 last:border-b-0"
              >
                <span
                  className={cn(
                    "min-w-0 flex-1 font-medium leading-snug text-[#1c1c1e]",
                    mobile ? "text-[14px]" : "text-sm"
                  )}
                >
                  {field.label}
                </span>
                <div className="flex shrink-0 items-center gap-1.5 pt-0.5" role="radiogroup">
                  {ORIGINALITY_ANSWER_OPTIONS.map((option) => {
                    const isOn = selected === option;
                    const isUnknown = option === "Unknown";
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={isOn}
                        aria-label={option}
                        onClick={() => onChange(field.key, option)}
                        className={cn(
                          "flex items-center justify-center text-[13px] font-semibold transition-colors",
                          isUnknown
                            ? "h-8 w-8 rounded-md"
                            : "h-8 min-w-[44px] rounded-md px-3",
                          isUnknown
                            ? isOn
                              ? "bg-[#1b1464] text-white"
                              : "bg-[#8e8e93] text-white"
                            : isOn
                              ? "bg-[#1b1464] text-white"
                              : "bg-[#e8e8ed] text-[#3a3a3c]"
                        )}
                      >
                        {isUnknown ? "?" : option}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={cn(
          "rounded-[14px] bg-[#fbf6e0] px-4 py-3",
          mobile ? "text-[13px]" : "text-sm"
        )}
      >
        <p className="font-medium text-[#8a6a12]">
          {FLOW3_ORIGINALITY_COPY.scoreLabel}: {score.yesCount}/{score.total}
        </p>
      </div>
    </div>
  );
}
