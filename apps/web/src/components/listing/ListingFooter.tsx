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
import { useSaveDraftExit } from "./ListingBuilderShell";
import { FLOW3_SPECS_COMPLETED_COPY } from "./specs/restored-restomod";

export interface ListingFooterProps {
  className?: string;
  children?: React.ReactNode;
  /** When true, footer sits inside the step card (no outer card chrome). */
  inset?: boolean;
}

/**
 * Footer actions for Carasta Listing steps.
 * Back / Continue / Save Draft & Exit — mirrors mobile chrome exactly.
 */
export function ListingFooter({
  className,
  children,
  inset = false,
}: ListingFooterProps) {
  const pathname = usePathname();
  const { draft } = useListingBuilder();
  const { openSaveDraftExit } = useSaveDraftExit();
  const stepId = resolveListingProgressStepId(pathname);
  const cleanPath = pathname.split("?")[0];
  const isIdentifyPrompt = cleanPath === LISTING_PATHS.identify;
  const isBuyerPreview = cleanPath === LISTING_PATHS.buyerPreview;
  /** Preview step has its own full-validation CTA inline — footer shows Back only. */
  const isPreviewStep = cleanPath === LISTING_PATHS.preview;

  const backHref = getBackHref(pathname, draft.listingTypeId);
  const continueHref = getContinueHref(pathname, draft);
  const continueDisabled = !canContinueOnPath(pathname, draft);

  const continueLabel = isBuyerPreview
    ? "Submit to Carasta"
    : pathname.split("?")[0]?.endsWith("/restored/summary")
      ? FLOW3_SPECS_COMPLETED_COPY.confirmContinue
      : "Continue";

  const backLabel = isBuyerPreview ? "Back to Listing Review" : "Back";

  const shellClass = cn(
    "flex flex-col gap-0",
    inset
      ? ["sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 border-t bg-card sm:static"]
      : [
          "rounded-2xl border bg-card",
          "sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 shadow-lg shadow-black/5 sm:bottom-3 lg:static lg:shadow-none",
          "supports-[backdrop-filter]:bg-card/95 supports-[backdrop-filter]:backdrop-blur",
        ],
    className
  );

  if (children) {
    return (
      <div className={shellClass}>
        <div className="flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 py-3">
          {children}
        </div>
      </div>
    );
  }

  // Identify prompt uses method cards — no Continue in footer, no Save Draft & Exit.
  if (isIdentifyPrompt) {
    return (
      <div className={shellClass}>
        <div className="flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 py-3">
          {backHref ? (
            <Button variant="outline" asChild className="min-w-0 flex-1 sm:flex-none">
              <Link href={backHref}>
                <ChevronLeft className="h-4 w-4" />
                {backLabel}
              </Link>
            </Button>
          ) : (
            <span className="w-10 shrink-0" />
          )}
          <span className="w-10 shrink-0" />
        </div>
      </div>
    );
  }

  // Preview step — Back + Save Draft & Exit; inline CTA handles Continue with full validation.
  if (isPreviewStep) {
    return (
      <div className={shellClass}>
        <div className="flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 py-3">
          {backHref ? (
            <Button variant="outline" asChild className="min-w-0 flex-1 sm:flex-none">
              <Link href={backHref}>
                <ChevronLeft className="h-4 w-4" />
                {backLabel}
              </Link>
            </Button>
          ) : (
            <span className="w-10 shrink-0" />
          )}
          <span className="w-10 shrink-0" />
        </div>
        <div className="flex justify-center pb-3">
          <button
            type="button"
            onClick={openSaveDraftExit}
            className="text-[12px] font-medium underline text-muted-foreground hover:text-foreground transition-colors"
          >
            Save Draft &amp; Exit
          </button>
        </div>
      </div>
    );
  }

  // Buyer View Preview: hide Save Draft & Exit
  const showSaveDraftExit = !isBuyerPreview && stepId !== "review";

  return (
    <div className={shellClass}>
      <div className="flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 py-3">
        {backHref ? (
          <Button variant="outline" asChild className="min-w-0 flex-1 sm:flex-none">
            <Link href={backHref}>
              <ChevronLeft className="h-4 w-4" />
              {backLabel}
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

      {showSaveDraftExit ? (
        <div className="flex justify-center pb-3">
          <button
            type="button"
            onClick={openSaveDraftExit}
            className="text-[12px] font-medium underline text-muted-foreground hover:text-foreground transition-colors"
          >
            Save Draft &amp; Exit
          </button>
        </div>
      ) : null}
    </div>
  );
}
