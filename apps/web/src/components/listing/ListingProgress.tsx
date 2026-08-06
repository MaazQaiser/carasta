"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ListingStepDefinition } from "./types";
import { getListingStepIndex } from "./config";

export interface ListingProgressProps {
  steps: ListingStepDefinition[];
  className?: string;
  /** @deprecated Unused — stepper shows progress only, not validation errors. */
  errorStepIds?: string[];
  completionPercent?: number;
}

/**
 * Horizontal stepper for Listing Builder — one straight row across the workspace.
 * Shows pending / current / complete only (validation lives in Summary).
 */
export function ListingProgress({
  steps,
  className,
  completionPercent,
}: ListingProgressProps) {
  const pathname = usePathname();
  const currentIndex = getListingStepIndex(pathname);

  return (
    <div className={cn("rounded-2xl border bg-card px-3 py-3 sm:px-4 sm:py-4", className)}>
      <div className="mb-3 space-y-2 px-0.5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-muted-foreground tabular-nums">
            Step {Math.max(currentIndex, 0) + 1} of {steps.length}
          </p>
          {completionPercent != null ? (
            <p className="text-xs sm:text-sm text-muted-foreground tabular-nums">
              {completionPercent}% complete
            </p>
          ) : null}
        </div>
        {completionPercent != null ? (
          <div
            className="h-1.5 rounded-full bg-muted overflow-hidden"
            role="progressbar"
            aria-valuenow={completionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Listing completion"
          >
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, completionPercent))}%` }}
            />
          </div>
        ) : null}
      </div>

      <nav aria-label="Listing progress" className="-mx-1 overflow-x-auto scrollbar-hide">
        <ol className="flex min-w-max xl:min-w-0 xl:w-full items-start px-1 pb-1">
          {steps.map((step, index) => {
            const isCurrent = index === currentIndex;
            const isComplete = currentIndex >= 0 && index < currentIndex;
            const isLast = index === steps.length - 1;

            return (
              <li
                key={step.id}
                className={cn("flex items-start", !isLast && "xl:flex-1")}
              >
                <Link
                  href={step.href}
                  className={cn(
                    "group flex w-[4.5rem] sm:w-[5.25rem] xl:w-auto xl:min-w-0 xl:flex-1 flex-col items-center gap-1.5 text-center outline-none",
                    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs font-semibold border transition-colors",
                      isCurrent && "bg-primary text-primary-foreground border-primary",
                      !isCurrent &&
                        isComplete &&
                        "bg-emerald-500 text-white border-emerald-500",
                      !isCurrent &&
                        !isComplete &&
                        "bg-muted text-muted-foreground border-transparent group-hover:border-border group-hover:text-foreground"
                    )}
                  >
                    {isComplete ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : index + 1}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] sm:text-[11px] font-medium leading-tight line-clamp-2 px-0.5",
                      isCurrent
                        ? "text-foreground"
                        : isComplete
                          ? "text-emerald-700"
                          : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </Link>

                {!isLast ? (
                  <div
                    aria-hidden
                    className={cn(
                      "mt-4 h-0.5 w-3 sm:w-5 xl:w-full xl:min-w-3 xl:flex-1 shrink-0 rounded-full self-start",
                      index < currentIndex ? "bg-emerald-500" : "bg-border"
                    )}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
