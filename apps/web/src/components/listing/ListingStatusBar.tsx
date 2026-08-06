"use client";

import { Cloud, CloudOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AutosaveStatus } from "./services/draft-service";

function formatSavedAt(value: string | null) {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function ListingStatusBar({
  status,
  lastSavedAt,
  completionPercent,
  currentStepLabel,
  completedSteps,
  remainingSteps,
  estimatedCompletion,
  className,
}: {
  status: AutosaveStatus;
  lastSavedAt: string | null;
  completionPercent: number;
  currentStepLabel?: string;
  completedSteps: number;
  remainingSteps: number;
  estimatedCompletion: string;
  className?: string;
}) {
  const savedLabel = formatSavedAt(lastSavedAt);

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card px-3 sm:px-4 py-3",
        "grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,auto)_minmax(0,1fr)_minmax(0,auto)] md:items-center md:gap-4 lg:gap-6",
        className
      )}
    >
      <div className="flex items-center gap-2 text-sm min-w-0">
        {status === "saving" ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
        ) : status === "failed" ? (
          <CloudOff className="h-4 w-4 shrink-0 text-destructive" />
        ) : (
          <Cloud className="h-4 w-4 shrink-0 text-primary" />
        )}
        <span className="font-medium shrink-0">
          {status === "saving"
            ? "Saving..."
            : status === "failed"
              ? "Failed"
              : status === "saved"
                ? "Saved"
                : "Ready"}
        </span>
        {savedLabel ? (
          <span className="text-xs text-muted-foreground truncate">· Last saved {savedLabel}</span>
        ) : null}
      </div>

      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground mb-1.5">
          <span className="truncate">
            {currentStepLabel ? `Current: ${currentStepLabel}` : "Listing progress"}
          </span>
          <span className="shrink-0 tabular-nums">{completionPercent}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground md:block md:text-right md:shrink-0">
        <p className="tabular-nums">
          {completedSteps} done · {remainingSteps} remaining
        </p>
        <p>{estimatedCompletion}</p>
      </div>
    </div>
  );
}
