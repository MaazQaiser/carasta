"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FieldLabel, textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import type { ListingConditionHistory } from "../types";
import {
  formatTitleStatuses,
  parseTitleStatuses,
  TITLE_STATUS_OPTIONS,
  toggleTitleStatus,
  type TitleStatusOption,
} from "../specs/title-status";

const OVERALL_CONDITIONS = ["Excellent", "Very Good", "Good", "Fair", "Project"];

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
        <ListingSection title="Vehicle History">
          <textarea
            className={textareaClassName}
            value={c.vehicleHistory}
            onChange={(e) => set("vehicleHistory", e.target.value)}
            placeholder="Summarize known vehicle history, prior ownership context, and notable events..."
          />
        </ListingSection>

        <ListingSection title="Accident History">
          <textarea
            className={textareaClassName}
            value={c.accidentHistory}
            onChange={(e) => set("accidentHistory", e.target.value)}
            placeholder="Describe any accidents, damage, or repairs..."
          />
        </ListingSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ListingSection title="Title Status">
            <FieldLabel>Status</FieldLabel>
            <p className="mb-2 text-xs text-muted-foreground">
              Select one of Clean, Salvage, or Rebuilt. Lien can be combined. Unknown stands alone.
            </p>
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

          <ListingSection title="Overall Condition">
            <FieldLabel htmlFor="overall-condition">Condition</FieldLabel>
            <Select
              value={c.overallCondition || undefined}
              onValueChange={(v) => set("overallCondition", v)}
            >
              <SelectTrigger id="overall-condition">
                <SelectValue placeholder="Select overall condition" />
              </SelectTrigger>
              <SelectContent>
                {OVERALL_CONDITIONS.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ListingSection>
        </div>

        <ListingSection title="Service Records">
          <Input
            value={c.serviceRecords}
            onChange={(e) => set("serviceRecords", e.target.value)}
            placeholder="e.g. Full dealer history, recent timing service, receipts available"
          />
        </ListingSection>

        <ListingSection title="Ownership History">
          <textarea
            className={textareaClassName}
            value={c.ownershipHistory}
            onChange={(e) => set("ownershipHistory", e.target.value)}
            placeholder="Number of owners, how long you've owned it, garage kept, etc."
          />
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
