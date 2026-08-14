"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ListingMediaItem, RaceState } from "../types";
import {
  FLOW4_DOCUMENTATION_COPY,
  RACE_DOCUMENTATION_OPTIONS,
  shouldShowDocumentationOther,
  shouldShowDocumentationUpload,
  toggleRaceDocumentationType,
} from "../specs/race-track";

export function RaceDocumentationFields({
  race,
  onPatch,
  onAddFiles,
  onRemoveUpload,
  onSetUploadDate,
  variant = "web",
}: {
  race: RaceState;
  onPatch: (patch: Partial<RaceState>) => void;
  onAddFiles: (files: FileList | null) => void;
  onRemoveUpload: (id: string) => void;
  onSetUploadDate: (id: string, documentDate: string) => void;
  variant?: "web" | "mobile";
}) {
  const types = race.documentationTypes ?? [];
  const uploads = race.documentationUploads ?? [];
  const showOther = shouldShowDocumentationOther(types);
  const showUpload = shouldShowDocumentationUpload(types);
  const mobile = variant === "mobile";

  return (
    <div className={mobile ? "flex flex-col gap-5" : "space-y-5"}>
      <div className="space-y-1.5">
        <p
          className={
            mobile
              ? "text-[12px] font-semibold text-[#636366]"
              : "text-sm font-medium"
          }
        >
          {FLOW4_DOCUMENTATION_COPY.question}{" "}
          <span className={mobile ? "text-[#1b1464]" : "text-muted-foreground"}>
            — {FLOW4_DOCUMENTATION_COPY.requiredMark}
          </span>
        </p>
        <p
          className={
            mobile ? "text-[11px] text-[#636366]" : "text-xs text-muted-foreground"
          }
        >
          {FLOW4_DOCUMENTATION_COPY.selectLabel}
        </p>
        <div className="space-y-2" role="group" aria-label={FLOW4_DOCUMENTATION_COPY.selectLabel}>
          {RACE_DOCUMENTATION_OPTIONS.map((option) => {
            const selected = types.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onPatch(toggleRaceDocumentationType(race, option.id))}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border px-4 text-left transition-colors",
                  mobile ? "py-3.5 text-[14px]" : "py-3 text-sm",
                  selected
                    ? mobile
                      ? "border-[#1b1464] bg-[#f4f5fc] text-[#1b1464]"
                      : "border-primary bg-primary/5 text-primary"
                    : mobile
                      ? "border-[#e5e5ea] text-[#1c1c1e]"
                      : "border-border hover:bg-muted/40"
                )}
              >
                <span className={mobile ? "font-medium text-[#1c1c1e]" : "font-medium text-foreground"}>
                  {option.label}
                </span>
                {selected ? (
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      mobile ? "text-[#1b1464]" : "text-primary"
                    )}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
        <p
          className={
            mobile
              ? "text-[11px] leading-relaxed text-[#636366]"
              : "text-xs leading-relaxed text-muted-foreground"
          }
        >
          {FLOW4_DOCUMENTATION_COPY.disclaimer}
        </p>
      </div>

      {showOther ? (
        <label className="block space-y-1.5">
          <span
            className={
              mobile ? "text-[12px] font-semibold text-[#636366]" : "text-sm font-medium"
            }
          >
            {FLOW4_DOCUMENTATION_COPY.otherLabel}{" "}
            <span className={mobile ? "text-[#1b1464]" : "text-muted-foreground"}>
              — {FLOW4_DOCUMENTATION_COPY.requiredMark}
            </span>
          </span>
          <textarea
            value={race.documentationOther ?? ""}
            onChange={(event) => onPatch({ documentationOther: event.target.value })}
            placeholder={FLOW4_DOCUMENTATION_COPY.otherPlaceholder}
            className={
              mobile
                ? "min-h-24 w-full resize-none rounded-lg border border-[#e5e5ea] p-3 text-[13px] leading-relaxed outline-none focus:border-[#1b1464]"
                : "min-h-24 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            }
          />
        </label>
      ) : null}

      {showUpload ? (
        <div className="space-y-2">
          <div>
            <p
              className={
                mobile ? "text-[12px] font-semibold text-[#636366]" : "text-sm font-semibold"
              }
            >
              {FLOW4_DOCUMENTATION_COPY.uploadLabel}
            </p>
            <p
              className={
                mobile
                  ? "mt-0.5 text-[11px] leading-relaxed text-[#636366]"
                  : "mt-0.5 text-xs text-muted-foreground"
              }
            >
              {FLOW4_DOCUMENTATION_COPY.uploadHelper}
            </p>
          </div>
          <label
            className={
              mobile
                ? "flex h-11 cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#1b1464] text-[13px] font-semibold text-[#1b1464]"
                : "flex h-11 cursor-pointer items-center justify-center rounded-lg border border-dashed border-primary text-sm font-semibold text-primary"
            }
          >
            Upload Documents
            <input
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              multiple
              className="hidden"
              onChange={(event) => {
                onAddFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
          {uploads.length > 0 ? (
            <ul className="space-y-2">
              {uploads.map((item: ListingMediaItem) => (
                <li
                  key={item.id}
                  className={
                    mobile
                      ? "rounded-lg bg-[#f4f5fc] px-3 py-2"
                      : "rounded-lg border bg-muted/30 px-3 py-2"
                  }
                >
                  <div className="flex items-center justify-between gap-2 text-[12px]">
                    <span className="truncate font-medium">{item.name}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveUpload(item.id)}
                      className="ml-2 shrink-0 font-semibold text-[#d34a4a]"
                    >
                      Remove
                    </button>
                  </div>
                  <label className="mt-2 flex items-center gap-2">
                    <span
                      className={
                        mobile
                          ? "shrink-0 text-[11px] text-[#636366]"
                          : "shrink-0 text-[11px] text-muted-foreground"
                      }
                    >
                      {FLOW4_DOCUMENTATION_COPY.dateLabel}
                    </span>
                    <input
                      type="date"
                      value={item.documentDate ?? ""}
                      onChange={(event) => onSetUploadDate(item.id, event.target.value)}
                      className={
                        mobile
                          ? "h-8 min-w-0 flex-1 rounded-md border border-[#e5e5ea] bg-white px-2 text-[12px] outline-none focus:border-[#1b1464]"
                          : "h-8 min-w-0 flex-1 rounded-md border border-input bg-background px-2 text-xs outline-none"
                      }
                    />
                  </label>
                  <p
                    className={
                      mobile
                        ? "mt-1 text-[10px] leading-snug text-[#8e8e93]"
                        : "mt-1 text-[10px] leading-snug text-muted-foreground"
                    }
                  >
                    {FLOW4_DOCUMENTATION_COPY.dateHint}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
