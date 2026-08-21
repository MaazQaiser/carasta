"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { resolveListingStepProgress } from "./listing-step-progress";

export interface ListingProgressProps {
  className?: string;
}

/**
 * Linear Step X of 15 progress bar — matches mobile chrome exactly.
 * Non-interactive: no skip-ahead, no clickable steps.
 */
export function ListingProgress({ className }: ListingProgressProps) {
  const pathname = usePathname();
  const progress = resolveListingStepProgress(pathname);

  if (!progress) return null;

  const pct = Math.min((progress.index / progress.total) * 100, 100);

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
        Step {progress.index} of {progress.total}
      </p>
      <div
        className="relative h-1.5 w-full rounded-full bg-muted overflow-hidden"
        role="progressbar"
        aria-valuenow={progress.index}
        aria-valuemin={1}
        aria-valuemax={progress.total}
        aria-label={`Step ${progress.index} of ${progress.total}: ${progress.label}`}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
