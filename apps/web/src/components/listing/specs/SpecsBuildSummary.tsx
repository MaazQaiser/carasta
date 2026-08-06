"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SpecsCategoryDefinition } from "./types";
import type { ModificationEntry } from "./types";
import { countEntryDocuments, countEntryPhotos } from "./options";

export function SpecsBuildSummary({
  title = "Build Summary",
  categories,
  entries,
  rows: rowsOverride,
  continueHref = "/listing/history",
  className,
  footerNote = "Review your build details before continuing.",
  extraRows,
  showContinue = true,
  showProgress = false,
}: {
  title?: string;
  categories: SpecsCategoryDefinition[];
  entries: ModificationEntry[];
  rows?: { label: string; value: string }[];
  /** @deprecated Unused — listing score UI removed. */
  progress?: number;
  continueHref?: string;
  className?: string;
  footerNote?: string;
  extraRows?: { label: string; value: string }[];
  showContinue?: boolean;
  showProgress?: boolean;
}) {
  const categoriesCompleted = categories.filter((category) =>
    entries.some((entry) => entry.categoryId === category.id && entry.completed)
  ).length;
  const entriesAdded = entries.filter((entry) => entry.completed || entry.title.trim()).length;
  const photosUploaded = entries.reduce((sum, entry) => sum + countEntryPhotos(entry), 0);
  const documentsUploaded = entries.reduce((sum, entry) => sum + countEntryDocuments(entry), 0);
  const buildCompletion =
    categories.length === 0
      ? 0
      : Math.round((categoriesCompleted / categories.length) * 100);

  const rows =
    rowsOverride ??
    [
      { label: "Categories Completed", value: `${categoriesCompleted} / ${categories.length}` },
      { label: "Entries Added", value: String(entriesAdded) },
      { label: "Photos Uploaded", value: String(photosUploaded) },
      { label: "Documents Uploaded", value: String(documentsUploaded) },
      ...(extraRows ?? []),
    ];

  return (
    <div className={cn("space-y-4 sticky top-20", className)}>
      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <h3 className="font-semibold text-sm">{title}</h3>
        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.label}
              className="rounded-xl border border-dashed bg-muted/30 px-3 py-3"
            >
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {row.label}
              </p>
              <p className="text-sm font-semibold mt-1">{row.value}</p>
            </div>
          ))}
        </div>
        {showProgress ? (
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${buildCompletion}%` }}
            />
          </div>
        ) : null}
        <p className="text-[11px] text-muted-foreground">{footerNote}</p>
      </div>

      {showContinue ? (
        <div className="rounded-2xl border bg-card p-3 sticky bottom-4">
          <Button asChild className="w-full">
            <Link href={continueHref}>
              Continue
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function SpecsSummaryShell({
  children,
  continueHref = "/listing/history",
  className,
  showContinue = true,
}: {
  children: ReactNode;
  continueHref?: string;
  className?: string;
  showContinue?: boolean;
}) {
  return (
    <div className={cn("space-y-4 sticky top-20", className)}>
      {children}
      {showContinue ? (
        <div className="rounded-2xl border bg-card p-3">
          <Button asChild className="w-full">
            <Link href={continueHref}>
              Continue
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
