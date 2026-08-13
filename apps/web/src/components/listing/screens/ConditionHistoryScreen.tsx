"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FieldLabel, textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import type { ListingConditionHistory } from "../types";
import {
  formatTitleStatuses,
  parseTitleStatuses,
  TITLE_STATUS_OPTIONS,
  TITLE_STATUS_RULES_COPY,
  toggleTitleStatus,
  type TitleStatusOption,
} from "../specs/title-status";

const OVERALL_CONDITIONS: { id: string; label: string; description: string }[] = [
  { id: "Excellent", label: "Excellent", description: "No cosmetic or mechanical flaws." },
  { id: "Very Good", label: "Very Good", description: "Minor wear, fully operational." },
  { id: "Good", label: "Good", description: "Some wear, all systems functional." },
  { id: "Fair", label: "Fair", description: "Passable, needs minor repairs." },
  { id: "Project", label: "Project", description: "Needs restoration or assembly." },
];

const KEY_OPTIONS = ["None", "1", "2", "3+"] as const;

/** Mock imported history — source-labeled, never treated as seller verification. */
const IMPORTED_HISTORY = {
  source: "Vehicle History API",
  accidentHistory: "No Accidents Reported",
  serviceRecords: "18 Records",
  previousOwners: "2 Owners",
};

function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left"
      >
        <span className="text-sm font-semibold">{title}</span>
        <ChevronDown
          className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? <div className="border-t px-4 py-3 space-y-3">{children}</div> : null}
    </div>
  );
}

export function ConditionHistoryScreen() {
  const { draft, updateCondition } = useListingBuilder();
  const c = draft.condition;
  const titleStatuses = parseTitleStatuses(c.titleStatus);

  const set = (key: keyof ListingConditionHistory, value: string) =>
    updateCondition({ [key]: value });

  const onToggleTitle = (option: TitleStatusOption) => {
    const next = toggleTitleStatus(titleStatuses, option);
    set("titleStatus", formatTitleStatuses(next));
  };

  return (
    <ListingStep
      title="Condition & History"
      description="Capture condition and ownership context buyers care about. Shared across all listing types."
    >
      <div className="space-y-6">
        <div
          className="rounded-2xl border px-4 py-3 space-y-2"
          style={{ backgroundColor: "#e7f7e8", borderColor: "#86efac" }}
        >
          <p className="text-sm font-semibold" style={{ color: "#166534" }}>
            Retrieved from {IMPORTED_HISTORY.source}
          </p>
          <ul className="text-sm space-y-1" style={{ color: "#166534" }}>
            <li>Accident History: {IMPORTED_HISTORY.accidentHistory}</li>
            <li>Service Records: {IMPORTED_HISTORY.serviceRecords}</li>
            <li>Previous Owners: {IMPORTED_HISTORY.previousOwners}</li>
          </ul>
          <p className="text-xs" style={{ color: "#3f6212" }}>
            Imported for reference only — not seller-verified. Confirm or correct details in the
            sections below.
          </p>
        </div>

        <div className="space-y-2">
          <AccordionSection title="Vehicle History">
            <textarea
              className={textareaClassName}
              value={c.vehicleHistory}
              onChange={(e) => set("vehicleHistory", e.target.value)}
              placeholder="Add seller notes about vehicle history..."
            />
          </AccordionSection>
          <AccordionSection title="Ownership">
            <textarea
              className={textareaClassName}
              value={c.ownershipHistory}
              onChange={(e) => set("ownershipHistory", e.target.value)}
              placeholder="Number of owners, how long you've owned it, garage kept, etc."
            />
          </AccordionSection>
          <AccordionSection title="Accidents">
            <textarea
              className={textareaClassName}
              value={c.accidentHistory}
              onChange={(e) => set("accidentHistory", e.target.value)}
              placeholder="Describe any accidents, damage, or repairs..."
            />
          </AccordionSection>
          <AccordionSection title="Warranty">
            <Input
              value={c.warranty}
              onChange={(e) => set("warranty", e.target.value)}
              placeholder="e.g. No active warranty / Factory remaining"
            />
          </AccordionSection>
          <AccordionSection title="Service Records">
            <Input
              value={c.serviceRecords}
              onChange={(e) => set("serviceRecords", e.target.value)}
              placeholder="e.g. Full dealer history, recent timing service"
            />
          </AccordionSection>
        </div>

        <ListingSection title="Vehicle Condition">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {OVERALL_CONDITIONS.map((option) => {
              const selected = c.overallCondition === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => set("overallCondition", option.id)}
                  className={cn(
                    "rounded-2xl border p-3 text-left transition-colors",
                    selected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:bg-muted/40"
                  )}
                >
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{option.description}</p>
                </button>
              );
            })}
          </div>
        </ListingSection>

        <ListingSection title="Title Status">
          <FieldLabel>Status</FieldLabel>
          <p className="mb-2 text-xs text-muted-foreground">{TITLE_STATUS_RULES_COPY}</p>
          <div className="flex flex-wrap gap-2">
            {TITLE_STATUS_OPTIONS.map((option) => {
              const selected = titleStatuses.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onToggleTitle(option)}
                  className={cn(
                    "h-9 rounded-lg border px-3 text-sm font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-input bg-background text-foreground hover:bg-muted"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {titleStatuses.length ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Selected: {formatTitleStatuses(titleStatuses)}
            </p>
          ) : null}
        </ListingSection>

        <ListingSection title="Number of Keys">
          <div className="flex flex-wrap gap-2">
            {KEY_OPTIONS.map((option) => {
              const selected = c.numberOfKeys === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => set("numberOfKeys", option)}
                  className={cn(
                    "h-9 min-w-[4.5rem] rounded-lg border px-3 text-sm font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-input bg-background hover:bg-muted"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </ListingSection>

        <ListingSection title="General Notes">
          <textarea
            className={textareaClassName}
            value={c.generalNotes}
            onChange={(e) => set("generalNotes", e.target.value)}
            placeholder="Anything else about condition or history..."
          />
        </ListingSection>
      </div>
    </ListingStep>
  );
}
