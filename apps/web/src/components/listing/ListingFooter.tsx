"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useListingBuilder } from "./ListingBuilderContext";
import {
  canContinueOnPath,
  getBackHref,
  getContinueHref,
  LISTING_PATHS,
  resolveListingProgressStepId,
} from "./listing-route-map";
import { FLOW3_SPECS_COMPLETED_COPY } from "./specs/restored-restomod";

export interface ListingFooterProps {
  className?: string;
  children?: React.ReactNode;
  /** When true, footer sits inside the step card (no outer card chrome). */
  inset?: boolean;
}

/**
 * Footer actions for Listing Builder steps.
 * Continue/Back use type-aware routes aligned with mobile listing logic.
 */
export function ListingFooter({
  className,
  children,
  inset = false,
}: ListingFooterProps) {
  const pathname = usePathname();
  const { draft } = useListingBuilder();
  const stepId = resolveListingProgressStepId(pathname);
  const isReviewStep = stepId === "review";
  const isIdentifyPrompt =
    pathname.split("?")[0] === LISTING_PATHS.identify;

  const backHref = getBackHref(pathname, draft.listingTypeId);
  const continueHref = getContinueHref(pathname, draft);
  const continueDisabled = !canContinueOnPath(pathname, draft);
  const continueLabel = pathname.split("?")[0]?.endsWith("/restored/summary")
    ? FLOW3_SPECS_COMPLETED_COPY.confirmContinue
    : "Continue";

  const shellClass = cn(
    "flex items-center justify-between gap-2 sm:gap-3",
    inset
      ? [
          "px-3 sm:px-6 py-3 bg-muted/20",
          "sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 border-t sm:static",
        ]
      : [
          "rounded-2xl border bg-card px-3 sm:px-4 py-3",
          "sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 shadow-lg shadow-black/5 sm:bottom-3 lg:static lg:shadow-none",
          "supports-[backdrop-filter]:bg-card/95 supports-[backdrop-filter]:backdrop-blur",
        ],
    className
  );

  if (children) {
    return <div className={shellClass}>{children}</div>;
  }

  // Review screen owns Submit / Save Draft / Cancel actions.
  if (isReviewStep) {
    return backHref ? (
      <div className={shellClass}>
        <Button variant="outline" asChild>
          <Link href={backHref}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <span />
      </div>
    ) : null;
  }

  // Identify prompt uses method cards — no Continue in footer.
  if (isIdentifyPrompt) {
    return (
      <div className={shellClass}>
        {backHref ? (
          <Button variant="outline" asChild className="min-w-0 flex-1 sm:flex-none">
            <Link href={backHref}>
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        ) : (
          <span className="w-10 shrink-0" />
        )}
        <span className="w-10 shrink-0" />
      </div>
    );
  }

  return (
    <div className={shellClass}>
      {backHref ? (
        <Button variant="outline" asChild className="min-w-0 flex-1 sm:flex-none">
          <Link href={backHref}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      ) : (
        <span className="w-10 shrink-0" />
      )}

      {continueHref ? (
        continueDisabled ? (
          <Button disabled className="min-w-0 flex-1 sm:flex-none">
            {continueLabel}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button asChild className="min-w-0 flex-1 sm:flex-none">
            <Link href={continueHref}>
              {continueLabel}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        )
      ) : continueDisabled ? (
        <Button disabled className="min-w-0 flex-1 sm:flex-none">
          {continueLabel}
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <span className="w-10 shrink-0" />
      )}
    </div>
  );
}
