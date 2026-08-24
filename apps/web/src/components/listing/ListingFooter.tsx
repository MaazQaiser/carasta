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
  /** When true, footer sits inside the step card (no outer card chrome). Unused for header placement. */
  inset?: boolean;
}

/**
 * Listing step actions shown in the Carasta Listing title row.
 * Back, Continue, and Save Draft & Exit sit together on the right.
 */
export function ListingFooter({ className, children }: ListingFooterProps) {
  const pathname = usePathname();
  const { draft } = useListingBuilder();
  const { openSaveDraftExit } = useSaveDraftExit();
  const stepId = resolveListingProgressStepId(pathname);
  const cleanPath = pathname.split("?")[0];
  const isIdentifyPrompt = cleanPath === LISTING_PATHS.identify;
  const isBuyerPreview = cleanPath === LISTING_PATHS.buyerPreview;
  /** Preview step has its own full-validation CTA inline — header shows Back + Save only. */
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
  const showSaveDraftExit = !isIdentifyPrompt && !isBuyerPreview && stepId !== "review";
  const showContinue = !isIdentifyPrompt && !isPreviewStep;

  const rowClass = cn("flex flex-wrap items-center justify-end gap-2 shrink-0", className);

  if (children) {
    return <div className={rowClass}>{children}</div>;
  }

  return (
    <div className={rowClass}>
      {backHref ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={backHref}>
            <ChevronLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </Button>
      ) : null}

      {showSaveDraftExit ? (
        <Button variant="outline" size="sm" type="button" onClick={openSaveDraftExit}>
          Save Draft &amp; Exit
        </Button>
      ) : null}

      {showContinue && continueHref ? (
        continueDisabled ? (
          <Button size="sm" disabled>
            {continueLabel}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="sm" asChild>
            <Link href={continueHref}>
              {continueLabel}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        )
      ) : showContinue && continueDisabled ? (
        <Button size="sm" disabled>
          {continueLabel}
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
