"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAdjacentListingSteps } from "./config";
import { useListingBuilder } from "./ListingBuilderContext";

export interface ListingFooterProps {
  className?: string;
  children?: React.ReactNode;
  /** When true, footer sits inside the step card (no outer card chrome). */
  inset?: boolean;
}

/**
 * Footer actions for Listing Builder steps.
 * Continue is disabled on Vehicle Type until a type is selected.
 */
export function ListingFooter({
  className,
  children,
  inset = false,
}: ListingFooterProps) {
  const pathname = usePathname();
  const { draft } = useListingBuilder();
  const { previous, current, next } = getAdjacentListingSteps(pathname);

  const isTypeStep = current?.id === "type";
  const isReviewStep = current?.id === "review";
  const continueDisabled = isTypeStep && !draft.listingTypeId;

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
    return previous ? (
      <div className={shellClass}>
        <Button variant="outline" asChild>
          <Link href={previous.href}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <span />
      </div>
    ) : null;
  }

  return (
    <div className={shellClass}>
      {previous ? (
        <Button variant="outline" asChild className="min-w-0 flex-1 sm:flex-none">
          <Link href={previous.href}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      ) : (
        <span className="w-10 shrink-0" />
      )}

      {next ? (
        continueDisabled ? (
          <Button disabled className="min-w-0 flex-1 sm:flex-none">
            Continue
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button asChild className="min-w-0 flex-1 sm:flex-none">
            <Link href={next.href}>
              Continue
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        )
      ) : (
        <span className="w-10 shrink-0" />
      )}
    </div>
  );
}
