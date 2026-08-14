"use client";

import Link from "next/link";
import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import type { ValidationIssue, ValidationReport } from "./services/validation-service";
import { LISTING_MEDIA_LIMITS } from "./listing-media-library";
import type { ListingDraft } from "./types";

export function toMobileListingHref(href: string): string {
  if (href.startsWith("/mobile-listing")) return href;
  if (href.startsWith("/listing")) return href.replace(/^\/listing/, "/mobile-listing");
  return href;
}

/** Soft recommendations that never block submit. */
export function listingReviewSoftWarnings(draft: ListingDraft): ValidationIssue[] {
  const warnings: ValidationIssue[] = [];
  // Interior tip only when the required photo minimum is already met.
  if (draft.vehiclePhotos.length >= LISTING_MEDIA_LIMITS.minPhotos) {
    warnings.push({
      id: "interior-photos-recommended",
      stepId: "photos",
      href: "/listing/photos",
      field: "vehiclePhotos",
      message:
        draft.listingTypeId === "race-track-car"
          ? "Recommended race photos: exterior, cockpit, engine bay, cage, seats and harnesses, fire system, suspension, brakes, VIN/chassis plate, damage or repairs, and included spares."
          : "Interior photos recommended.",
      severity: "warning",
    });
  }
  if (draft.videos.length === 0) {
    warnings.push({
      id: "videos-optional",
      stepId: "photos",
      href: "/listing/photos",
      field: "videos",
      message: "Videos are optional but can help buyers.",
      severity: "warning",
    });
  }
  return warnings;
}

export function ListingReviewIssues({
  validation,
  draft,
  mobile = false,
}: {
  validation: ValidationReport;
  draft: ListingDraft;
  mobile?: boolean;
}) {
  const soft = listingReviewSoftWarnings(draft);
  const warnings = [
    ...validation.warnings,
    ...validation.information.filter((i) => i.severity === "optional"),
    ...soft.filter(
      (w) =>
        !validation.information.some((i) => i.id === w.id) &&
        !validation.warnings.some((i) => i.id === w.id)
    ),
  ];
  const href = (path: string) => (mobile ? toMobileListingHref(path) : path);

  if (validation.errors.length === 0 && warnings.length === 0) {
    return (
      <div
        className={
          mobile
            ? "flex items-center gap-2 rounded-lg border border-[#b7e4c7] bg-[#edf9f1] px-3 py-3 text-[12px] text-[#1b7a3d]"
            : "flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        }
      >
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        Ready to continue — no blocking issues.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {validation.errors.length > 0 ? (
        <div
          className={
            mobile
              ? "rounded-lg border border-[#f5c2c2] bg-[#fff5f5] p-3"
              : "rounded-2xl border border-destructive/30 bg-destructive/5 p-4"
          }
        >
          <p
            className={
              mobile
                ? "mb-2 flex items-center gap-2 text-[12px] font-semibold text-[#c10606]"
                : "mb-2 flex items-center gap-2 text-sm font-semibold text-destructive"
            }
          >
            <AlertCircle className="h-4 w-4" />
            Missing required items
          </p>
          <ul className="space-y-1.5">
            {validation.errors.map((issue) => (
              <li key={issue.id}>
                <Link
                  href={href(issue.href)}
                  className={
                    mobile
                      ? "text-[12px] font-medium text-[#c10606] underline"
                      : "text-sm text-destructive underline-offset-2 hover:underline"
                  }
                >
                  {issue.message}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {warnings.length > 0 ? (
        <div
          className={
            mobile
              ? "rounded-lg bg-[#fff6dd] p-3"
              : "rounded-2xl border border-amber-200 bg-amber-50 p-4"
          }
        >
          <p
            className={
              mobile
                ? "mb-2 flex items-center gap-2 text-[12px] font-semibold text-[#8b6500]"
                : "mb-2 flex items-center gap-2 text-sm font-semibold text-amber-900"
            }
          >
            <AlertTriangle className="h-4 w-4" />
            Missing items
          </p>
          <p
            className={
              mobile
                ? "mb-2 text-[11px] text-[#8b6500]"
                : "mb-2 text-xs text-amber-800"
            }
          >
            Recommended — these do not block submission.
          </p>
          <ul className="space-y-1.5">
            {warnings.map((issue) => (
              <li key={issue.id}>
                <Link
                  href={href(issue.href)}
                  className={
                    mobile
                      ? "text-[12px] font-medium text-[#8b6500] underline"
                      : "text-sm text-amber-900 underline-offset-2 hover:underline"
                  }
                >
                  {issue.message}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
