"use client";

import { getListingTypeById } from "./config";
import { evaluateListingCompletion } from "./services/completion-engine";
import type { PersistedListingDraft } from "./services/draft-service";

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: true,
    }).format(new Date(value));
  } catch {
    return value;
  }
}

/**
 * Compact draft notice. Resume / Start New actions live in the page title row.
 */
export function DraftRecovery({ saved }: { saved: PersistedListingDraft }) {
  const completion = evaluateListingCompletion(saved.draft);
  const typeLabel = getListingTypeById(saved.draft.listingTypeId)?.label ?? "Not selected";

  return (
    <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-3">
      <div>
        <h2 className="text-base sm:text-lg font-semibold">Resume unfinished listing?</h2>
        <p className="text-sm text-muted-foreground mt-1">
          A draft was found on this device. Use Resume or Start New in the top right.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <Meta label="Vehicle Type" value={typeLabel} />
        <Meta label="Draft Date" value={formatDate(saved.savedAt)} />
        <Meta label="Completion" value={`${completion.overallPercent}%`} />
        <Meta label="Last Edited" value={formatDate(saved.savedAt)} />
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-muted/30 px-3 py-2.5 sm:py-3 min-w-0">
      <p className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-semibold mt-1 truncate">{value}</p>
    </div>
  );
}
