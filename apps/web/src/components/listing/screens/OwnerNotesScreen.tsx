"use client";

import { Cloud } from "lucide-react";
import { textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import { OWNER_NOTES_COPY, ownerNotesPlaceholder } from "../owner-notes-copy";

export function OwnerNotesScreen() {
  const { draft, setOwnerNotes } = useListingBuilder();
  const count = draft.ownerNotes.length;

  return (
    <ListingStep title={OWNER_NOTES_COPY.title} description={OWNER_NOTES_COPY.subtext}>
      <ListingSection title="Your notes">
        <textarea
          className={`${textareaClassName} min-h-56`}
          value={draft.ownerNotes}
          maxLength={OWNER_NOTES_COPY.maxLength}
          onChange={(e) => setOwnerNotes(e.target.value.slice(0, OWNER_NOTES_COPY.maxLength))}
          placeholder={ownerNotesPlaceholder(draft)}
        />
        <div className="flex flex-wrap items-center justify-end gap-4 mt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Cloud className="h-3.5 w-3.5" />
            Autosave placeholder
          </span>
          <span>
            {count} / {OWNER_NOTES_COPY.maxLength}
          </span>
        </div>
      </ListingSection>
    </ListingStep>
  );
}
