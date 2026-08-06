"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldLabel, textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import type { ListingConditionHistory } from "../types";

const TITLE_STATUSES = ["Clean", "Rebuilt", "Salvage", "Lemon", "Other / Unknown"];
const OVERALL_CONDITIONS = ["Excellent", "Very Good", "Good", "Fair", "Project"];

export function ConditionHistoryScreen() {
  const { draft, updateCondition } = useListingBuilder();
  const c = draft.condition;

  const set = (key: keyof ListingConditionHistory, value: string) =>
    updateCondition({ [key]: value });

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
            <FieldLabel htmlFor="title-status">Status</FieldLabel>
            <Select value={c.titleStatus || undefined} onValueChange={(v) => set("titleStatus", v)}>
              <SelectTrigger id="title-status">
                <SelectValue placeholder="Select title status" />
              </SelectTrigger>
              <SelectContent>
                {TITLE_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
