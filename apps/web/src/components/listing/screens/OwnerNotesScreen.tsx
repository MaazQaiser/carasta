"use client";

import { Cloud } from "lucide-react";
import { FieldHint, textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";

const PLACEHOLDER_DEFAULT =
  "Share ownership history, maintenance, imperfections, modifications, or anything buyers should know.";
const PLACEHOLDER_STOCK =
  "Share ownership history, maintenance, imperfections, or anything buyers should know.";

export function OwnerNotesScreen() {
  const { draft, setOwnerNotes } = useListingBuilder();
  const count = draft.ownerNotes.length;
  const isStock =
    draft.listingTypeId === "stock-lightly-modified" &&
    draft.modificationWorkspace.hasModifications === false;

  return (
    <ListingStep
      title="Owner Notes"
      description="Share any important details buyers should know before bidding"
    >
      <ListingSection title="Your notes">
        <textarea
          className={`${textareaClassName} min-h-56`}
          value={draft.ownerNotes}
          onChange={(e) => setOwnerNotes(e.target.value)}
          placeholder={isStock ? PLACEHOLDER_STOCK : PLACEHOLDER_DEFAULT}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
          <FieldHint>
            Share any important details buyers should know before bidding
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
