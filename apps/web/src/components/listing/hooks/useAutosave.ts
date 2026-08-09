"use client";

import * as React from "react";
import {
  DraftService,
  type AutosaveStatus,
  type ListingActivityEvent,
  type PersistedListingDraft,
} from "../services/draft-service";
import type { ListingDraft } from "../types";

export function useAutosave(
  draft: ListingDraft,
  options: {
    enabled?: boolean;
    debounceMs?: number;
    lastPath: string;
    activity: ListingActivityEvent[];
    onSaved?: (envelope: PersistedListingDraft) => void;
  }
) {
  const { enabled = true, debounceMs = 1500, lastPath, activity, onSaved } = options;
  const [status, setStatus] = React.useState<AutosaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = React.useState<string | null>(null);
  const skipFirst = React.useRef(true);

  const saveNow = React.useCallback(() => {
    try {
      setStatus("saving");
      const envelope = DraftService.save(draft, { lastPath, activity });
      setLastSavedAt(envelope.savedAt);
      setStatus("saved");
      onSaved?.(envelope);
      return envelope;
    } catch {
      setStatus("failed");
      return null;
    }
  }, [activity, draft, lastPath, onSaved]);

  React.useEffect(() => {
    if (!enabled) return;
    if (skipFirst.current) {
      skipFirst.current = false;
      const existing = DraftService.load();
      if (existing) setLastSavedAt(existing.savedAt);
      return;
    }

    // Don't flash "Saving…" until the debounce actually fires — keeps navigation feeling snappy.
    const timer = window.setTimeout(() => {
      saveNow();
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [debounceMs, draft, enabled, saveNow]);

  return { status, lastSavedAt, saveNow };
}
