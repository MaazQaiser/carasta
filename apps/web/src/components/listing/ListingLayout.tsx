"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ListingStepFooterProvider } from "./ListingStepFooterContext";

export interface ListingLayoutProps {
  progress?: React.ReactNode;
  summary?: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  /** Top-right actions aligned with the page title (e.g. draft recovery). */
  titleActions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

/**
 * Listing Builder workspace shell.
 * Stepper sits full-width above content; summary is a right column from lg.
 * When a footer is present, step body + Back/Continue share one card.
 */
export function ListingLayout({
  progress,
  summary,
  footer,
  header,
  titleActions,
  children,
  className,
  title = "Listing Builder",
  description = "Create a listing using the shared Carasta workspace.",
}: ListingLayoutProps) {
  const hasSummary = Boolean(summary);

  return (
    <ListingStepFooterProvider footer={footer}>
      <div
        className={cn(
          "mx-auto w-full max-w-screen-2xl px-4 sm:px-5 lg:px-6 py-6 sm:py-8",
          className
        )}
      >
        <div className="mb-5 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
            {description ? (
              <p className="text-muted-foreground mt-0.5 text-sm sm:text-base">{description}</p>
            ) : null}
          </div>
          {titleActions ? (
            <div className="flex flex-wrap items-center gap-2 sm:justify-end shrink-0">
              {titleActions}
            </div>
          ) : null}
        </div>

        {header}

        {progress ? <div className="mb-4 sm:mb-6 w-full min-w-0">{progress}</div> : null}

        <div
          className={cn(
            "grid w-full gap-4 sm:gap-6 items-start",
            hasSummary && "lg:grid-cols-[minmax(0,1fr)_17.5rem]"
          )}
        >
          <div className="min-w-0 w-full space-y-4 sm:space-y-6">
            {footer ? (
              <div className="rounded-2xl border bg-card overflow-hidden">
                <div className="p-4 sm:p-6">{children}</div>
                <div className="border-t">{footer}</div>
              </div>
            ) : (
              children
            )}
          </div>

          {summary ? (
            <aside className="min-w-0 w-full lg:sticky lg:top-20">{summary}</aside>
          ) : null}
        </div>
      </div>
    </ListingStepFooterProvider>
  );
}
