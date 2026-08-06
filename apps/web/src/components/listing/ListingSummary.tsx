"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getListingTypeById } from "./config";
import { useListingBuilder } from "./ListingBuilderContext";
import { useCompletion } from "./hooks/useCompletion";
import type { ValidationReport } from "./services/validation-service";

export interface ListingSummaryProps {
  className?: string;
  title?: string;
  children?: React.ReactNode;
  /** @deprecated Score UI removed — kept for call-site compatibility. */
  score?: number;
  completionPercent?: number;
  validation?: ValidationReport;
}

/**
 * Summary panel — draft facts and mandatory items.
 * Compact + collapsible below lg; expanded sidebar from lg up.
 */
export function ListingSummary({
  className,
  title = "Summary",
  children,
  validation: validationProp,
}: ListingSummaryProps) {
  const pathname = usePathname();
  const { draft } = useListingBuilder();
  const computed = useCompletion(draft);
  const validation = validationProp ?? computed.validation;
  const isReviewish =
    pathname.startsWith("/listing/preview") || pathname.startsWith("/listing/review");
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const hasMandatory = validation.errors.length > 0;

  if (children) {
    return (
      <div className={cn("rounded-2xl border bg-card p-4 sm:p-5 space-y-4", className)}>
        <h3 className="font-semibold text-sm">{title}</h3>
        {children}
      </div>
    );
  }

  const listingType = getListingTypeById(draft.listingTypeId);
  const vehicle = [draft.details.year, draft.details.make, draft.details.model]
    .filter(Boolean)
    .join(" ");

  const mandatoryBlock = hasMandatory ? (
    <div>
      <h3 className="font-semibold text-sm mb-3">Mandatory to add</h3>
      <ul className="space-y-2">
        {validation.errors.slice(0, 4).map((issue) => (
          <li key={issue.id}>
            <Link
              href={issue.href}
              className="text-sm text-destructive hover:underline inline-flex items-start gap-1.5 break-words"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>{issue.message}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ) : null;

  return (
    <div className={cn("rounded-2xl border bg-card p-4 sm:p-5 space-y-4 sm:space-y-5", className)}>
      <h3 className="font-semibold text-sm">{title}</h3>

      {!isReviewish ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2 sm:gap-3">
          <SummaryRow label="Vehicle" value={vehicle || undefined} />
          <SummaryRow label="Listing type" value={listingType?.label} />
          <SummaryRow
            label="Photos"
            value={
              draft.vehiclePhotos.length
                ? `${draft.vehiclePhotos.length} vehicle photo${draft.vehiclePhotos.length === 1 ? "" : "s"}`
                : undefined
            }
          />
        </div>
      ) : null}

      {hasMandatory ? (
        <>
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setDetailsOpen((open) => !open)}
              className="flex w-full items-center justify-between gap-2 rounded-xl border bg-muted/30 px-3 py-2.5 text-sm font-medium"
              aria-expanded={detailsOpen}
            >
              Mandatory to add
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  detailsOpen && "rotate-180"
                )}
              />
            </button>
            {detailsOpen ? <div className="mt-4">{mandatoryBlock}</div> : null}
          </div>

          <div className="hidden lg:block">{mandatoryBlock}</div>
        </>
      ) : null}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-muted/30 px-3 py-2.5 sm:py-3 min-w-0">
      <p className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm mt-1 text-foreground/80 truncate">{value?.trim() ? value : "—"}</p>
    </div>
  );
}
