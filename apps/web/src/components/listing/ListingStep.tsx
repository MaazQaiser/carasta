"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ListingContent } from "./ListingContent";
import { useListingStepFooter } from "./ListingStepFooterContext";

export interface ListingStepProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  /** When false, renders without the ListingContent card wrapper. */
  bordered?: boolean;
}

/**
 * Generic step wrapper — title, description, and optional body.
 * Skips its own card when the layout already wraps step + footer together.
 */
export function ListingStep({
  title,
  description,
  children,
  className,
  bordered = true,
}: ListingStepProps) {
  const footer = useListingStepFooter();
  const nestInLayoutCard = Boolean(footer);

  const body = (
    <div className={cn("space-y-4 sm:space-y-5", className)}>
      <div>
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );

  if (!bordered || nestInLayoutCard) return body;
  return <ListingContent>{body}</ListingContent>;
}
