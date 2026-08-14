"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getListingSpecsEditHref, getListingTypeById, LISTING_EDIT_HREFS } from "../config";
import { LISTING_PATHS } from "../listing-route-map";
import { useListingBuilder } from "../ListingBuilderContext";
import { useCompletion } from "../hooks/useCompletion";
import { ListingReviewIssues } from "../ListingReviewIssues";
import {
  listingReviewAuctionSettingsSummary,
  listingReviewBuildRestorationSummary,
  listingReviewCompetitionHistorySummary,
  listingReviewDescriptionSummary,
  listingReviewDocumentationSummary,
  listingReviewDocumentsSummary,
  listingReviewHeroUrl,
  listingReviewKnownIssuesSummary,
  listingReviewModificationsSummary,
  listingReviewPhotosSummary,
  listingReviewPrimaryUseSummary,
  listingReviewRaceBuildSummary,
  listingReviewSafetySummary,
  listingReviewSparesSummary,
  listingReviewSpecsLine,
  listingReviewVehicleTitle,
  showListingReviewBuildRestoration,
  showListingReviewModifications,
  showListingReviewPrimaryUse,
} from "../listing-review-summary";

function SummaryCard({
  title,
  href,
  summary,
}: {
  title: string;
  href: string;
  summary: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="mt-1 text-sm font-medium leading-relaxed">{summary}</p>
        </div>
        <Button type="button" variant="ghost" size="icon" className="shrink-0" asChild>
          <Link href={href} aria-label={`Edit ${title}`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function ListingPreviewScreen() {
  const { draft } = useListingBuilder();
  const { validation } = useCompletion(draft);
  const listingType = getListingTypeById(draft.listingTypeId);
  const title = listingReviewVehicleTitle(draft);
  const hero = listingReviewHeroUrl(draft);
  const specsHref = getListingSpecsEditHref(draft.listingTypeId);
  const condition =
    draft.condition.overallCondition.trim() || "Condition not set";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Listing Review</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review each section of your listing draft. Use Edit to jump back and make changes.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="aspect-[16/10] bg-muted">
          {hero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero} alt={title} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 p-4">
          <p className="text-lg font-semibold">{title}</p>
          {listingType ? <Badge variant="secondary">{listingType.label}</Badge> : null}
        </div>
      </div>

      <ListingReviewIssues validation={validation} draft={draft} />

      <div className="space-y-3">
        <SummaryCard
          title="Vehicle Details"
          href={LISTING_EDIT_HREFS.details}
          summary={`${title}${draft.details.trim ? ` ${draft.details.trim}` : ""}`}
        />
        <SummaryCard title="Specifications" href={specsHref} summary={listingReviewSpecsLine(draft)} />

        {showListingReviewModifications(draft) ? (
          <SummaryCard
            title="Modifications"
            href={specsHref}
            summary={listingReviewModificationsSummary(draft)}
          />
        ) : null}

        {showListingReviewBuildRestoration(draft) ? (
          <SummaryCard
            title="Build / Restoration"
            href={specsHref}
            summary={listingReviewBuildRestorationSummary(draft)}
          />
        ) : null}

        {showListingReviewPrimaryUse(draft) ? (
          <SummaryCard
            title="Primary Use"
            href={LISTING_PATHS.raceSummary}
            summary={listingReviewPrimaryUseSummary(draft)}
          />
        ) : null}

        {showListingReviewPrimaryUse(draft) ? (
          <SummaryCard
            title="Race / Track Build"
            href={LISTING_PATHS.raceSpecs}
            summary={listingReviewRaceBuildSummary(draft)}
          />
        ) : null}

        {showListingReviewPrimaryUse(draft) ? (
          <SummaryCard
            title="Safety Equipment"
            href={LISTING_PATHS.raceSafety}
            summary={listingReviewSafetySummary(draft)}
          />
        ) : null}

        {showListingReviewPrimaryUse(draft) ? (
          <SummaryCard
            title="Competition History"
            href={LISTING_PATHS.raceBiography}
            summary={listingReviewCompetitionHistorySummary(draft)}
          />
        ) : null}

        {showListingReviewPrimaryUse(draft) ? (
          <SummaryCard
            title="Race / Track Documentation"
            href={LISTING_PATHS.raceDocumentation}
            summary={listingReviewDocumentationSummary(draft)}
          />
        ) : null}

        {showListingReviewPrimaryUse(draft) ? (
          <SummaryCard
            title="Spares & Support Equipment"
            href={LISTING_PATHS.raceSpares}
            summary={listingReviewSparesSummary(draft)}
          />
        ) : null}

        <SummaryCard
          title="Condition"
          href={LISTING_EDIT_HREFS.history}
          summary={condition}
        />
        {showListingReviewPrimaryUse(draft) ? (
          <SummaryCard
            title="Known Race / Track Issues"
            href={LISTING_PATHS.condition}
            summary={listingReviewKnownIssuesSummary(draft)}
          />
        ) : null}
        <SummaryCard
          title="Photos"
          href={LISTING_EDIT_HREFS.photos}
          summary={listingReviewPhotosSummary(draft)}
        />
        <SummaryCard
          title="Documents"
          href={LISTING_EDIT_HREFS.photos}
          summary={listingReviewDocumentsSummary(draft)}
        />
        <SummaryCard
          title="Description"
          href={LISTING_EDIT_HREFS.ai}
          summary={listingReviewDescriptionSummary(draft)}
        />
        <SummaryCard
          title="Auction Settings"
          href={LISTING_EDIT_HREFS.settings}
          summary={listingReviewAuctionSettingsSummary(draft)}
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        {validation.isValid ? (
          <Button type="button" asChild>
            <Link href="/listing/buyer-preview">Continue to Buyer View Preview</Link>
          </Button>
        ) : (
          <Button type="button" disabled>
            Fix required items to continue
          </Button>
        )}
      </div>
    </div>
  );
}
