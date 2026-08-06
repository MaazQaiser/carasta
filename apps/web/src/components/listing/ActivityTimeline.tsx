"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ListingActivityEvent } from "./services/draft-service";

/** Fixed timestamps so SSR and client placeholders match. */
const PLACEHOLDER_ACTIVITY: ListingActivityEvent[] = [
  {
    id: "ph-1",
    type: "system",
    label: "Vehicle created",
    at: "2024-01-01T12:00:00.000Z",
  },
  {
    id: "ph-2",
    type: "identify",
    label: "VIN decoded",
    at: "2024-01-01T12:15:00.000Z",
  },
  {
    id: "ph-3",
    type: "media",
    label: "Photos uploaded",
    at: "2024-01-01T12:30:00.000Z",
  },
  {
    id: "ph-4",
    type: "save",
    label: "Draft saved",
    at: "2024-01-01T12:48:00.000Z",
  },
  {
    id: "ph-5",
    type: "ai",
    label: "Description generated",
    at: "2024-01-01T12:55:00.000Z",
  },
];

/** Locale-stable formatter — avoids server/client hour12 mismatches. */
function formatTime(value: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(value));
  } catch {
    return value;
  }
}

/** Render local times only after mount so timezone/locale never hydrate-mismatch. */
function ClientTime({ value }: { value: string }) {
  const [label, setLabel] = React.useState("");

  React.useEffect(() => {
    setLabel(formatTime(value));
  }, [value]);

  return (
    <span suppressHydrationWarning>{label || "\u00a0"}</span>
  );
}

export function ActivityTimeline({
  events,
  className,
  usePlaceholdersWhenEmpty = true,
}: {
  events: ListingActivityEvent[];
  className?: string;
  usePlaceholdersWhenEmpty?: boolean;
}) {
  const items =
    events.length > 0 ? events : usePlaceholdersWhenEmpty ? PLACEHOLDER_ACTIVITY : [];

  return (
    <div className={cn("rounded-2xl border bg-card p-4 space-y-3", className)}>
      <h3 className="font-semibold text-sm">Activity</h3>
      <ul className="space-y-3">
        {items.slice(0, 8).map((event) => (
          <li key={event.id} className="flex gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{event.label}</p>
              <p className="text-[11px] text-muted-foreground">
                <ClientTime value={event.at} />
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
