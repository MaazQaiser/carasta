"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getListingTypeById } from "../config";
import { ListingStep } from "../ListingStep";
import { useListingBuilder } from "../ListingBuilderContext";
import { useCompletion } from "../hooks/useCompletion";
import { DraftService } from "../services/draft-service";
import { PublishedListingService } from "../services/published-listing-service";
import {
  createListingReference,
  SubmissionSession,
} from "../services/submission-session";
import { useListingNotifications } from "../notifications/NotificationProvider";
import { useAuth } from "@/lib/context/auth-context";
import { MOCK_USERS } from "@carasta/mock-data";

export function ReviewSubmitScreen() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { draft, activity, addActivity, markClean } = useListingBuilder();
  const { completion, recommendations, validation } = useCompletion(draft);
  const { notify } = useListingNotifications();
  const [submitting, setSubmitting] = React.useState(false);

  const listingType = getListingTypeById(draft.listingTypeId);
  const vehicleLabel =
    [draft.details.year, draft.details.make, draft.details.model].filter(Boolean).join(" ") ||
    "Untitled vehicle";
  const doneCount = completion.categories.filter((item) => item.done).length;

  const saveDraft = () => {
    if (submitting) return;
    DraftService.save(draft, { lastPath: pathname, activity });
    markClean();
    addActivity("Draft saved", "save");
    notify({ title: "Draft Saved", tone: "success" });
  };

  const submitListing = () => {
    if (submitting) return;
    if (!validation.isValid) {
      notify({
        title: "Validation Error",
        description: "Fix required fields before submitting.",
        tone: "error",
      });
      return;
    }

    setSubmitting(true);
    const reference = createListingReference();
    const submittedAt = new Date().toISOString();
    const seller =
      user ?? MOCK_USERS.find((u) => u.id === "user-me") ?? MOCK_USERS[0]!;

    window.setTimeout(() => {
      const published = PublishedListingService.publish(draft, seller, reference);
      SubmissionSession.save({
        reference,
        submittedAt,
        auctionId: published.auction.id,
        vehicleId: published.auction.vehicle.id,
      });
      DraftService.save(draft, { lastPath: "/listing/submitted", activity });
      markClean();
      addActivity("Listing submitted", "submit");
      notify({
        title: "Listing Submitted",
        description: `Live for buyers on Auctions · ${reference}`,
        tone: "success",
      });
      router.push("/listing/submitted");
    }, 1400);
  };

  return (
    <ListingStep
      title="Review & Submit"
      description="Final check before publishing. Validation and scoring use the shared production services."
    >
      <div
        className={`space-y-6 ${submitting ? "pointer-events-none opacity-70" : ""}`}
        aria-busy={submitting}
      >
        {submitting ? (
          <div className="rounded-2xl border bg-muted/30 px-4 py-5 flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div>
              <p className="text-sm font-medium">Submitting listing…</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Please wait — interaction is paused until submission completes.
              </p>
            </div>
          </div>
        ) : null}

        <div className="rounded-2xl border bg-muted/20 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Overall listing summary
            </p>
            <p className="font-semibold mt-1">{vehicleLabel}</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {listingType?.label ?? "Type not selected"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Completion checklist
            </p>
            <p className="font-semibold mt-1">
              {doneCount} / {completion.categories.length} categories · {completion.overallPercent}%
            </p>
          </div>
        </div>

        {recommendations.length > 0 ? (
          <div className="rounded-2xl border bg-card p-4 space-y-2">
            <h3 className="font-semibold text-sm">Recommendations</h3>
            <ul className="space-y-1.5">
              {recommendations.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="text-sm text-primary hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div>
          <h3 className="font-semibold text-sm mb-3">Completion checklist</h3>
          <ul className="rounded-2xl border divide-y overflow-hidden">
            {completion.categories.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 px-4 py-3 bg-card"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {item.done ? (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <span className="text-sm truncate">{item.label}</span>
                </div>
                {!item.done ? (
                  <Button type="button" variant="ghost" size="sm" asChild>
                    <Link href={item.href}>Complete</Link>
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">Done</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border bg-card p-4 space-y-2">
          <h3 className="font-semibold text-sm">Validation summary</h3>
          {validation.errors.length === 0 ? (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              No blocking validation issues.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {validation.errors.map((issue) => (
                <li key={issue.id}>
                  <Link href={issue.href} className="text-sm text-destructive hover:underline">
                    {issue.message}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="button" variant="ghost" size="lg" asChild disabled={submitting}>
            <Link href="/listing/preview">Back</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={saveDraft}
            disabled={submitting}
          >
            Save Draft
          </Button>
          <Button type="button" size="lg" onClick={submitListing} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit Listing"
            )}
          </Button>
        </div>
      </div>
    </ListingStep>
  );
}
