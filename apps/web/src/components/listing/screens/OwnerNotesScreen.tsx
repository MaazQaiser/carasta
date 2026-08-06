"use client";

import { Cloud } from "lucide-react";
import { FieldHint, textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";

export function OwnerNotesScreen() {
  const { draft, setOwnerNotes } = useListingBuilder();
  const count = draft.ownerNotes.length;

  return (
    <ListingStep
      title="Owner Notes"
      description="Share the story behind the car in your own words."
    >
      <ListingSection title="Your notes">
        <textarea
          className={`${textareaClassName} min-h-56`}
          value={draft.ownerNotes}
          onChange={(e) => setOwnerNotes(e.target.value)}
          placeholder="Add history, ownership information, awards, notable stories, provenance or anything buyers should know."
        />
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
          <FieldHint>
            Add history, ownership information, awards, notable stories, provenance or anything
            buyers should know.
          </FieldHint>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Cloud className="h-3.5 w-3.5" />
              Autosave placeholder
            </span>
            <span>{count} characters</span>
          </div>
        </div>
      </ListingSection>
    </ListingStep>
  );
}
