"use client";

import { textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { useListingBuilder } from "../ListingBuilderContext";
import { OWNER_NOTES_COPY, ownerNotesPlaceholder } from "../owner-notes-copy";

export function OwnerNotesScreen() {
  const { draft, setOwnerNotes } = useListingBuilder();
  const count = draft.ownerNotes.length;

  return (
    <ListingStep title={OWNER_NOTES_COPY.title} description={OWNER_NOTES_COPY.subtext}>
      <div className="space-y-2">
        <textarea
          className={`${textareaClassName} min-h-56`}
          value={draft.ownerNotes}
          maxLength={OWNER_NOTES_COPY.maxLength}
          onChange={(e) => setOwnerNotes(e.target.value.slice(0, OWNER_NOTES_COPY.maxLength))}
          placeholder={ownerNotesPlaceholder(draft)}
        />
        <div className="flex justify-end text-xs text-muted-foreground">
          <span>{count} / {OWNER_NOTES_COPY.maxLength}</span>
        </div>
      </div>
    </ListingStep>
  );
}
