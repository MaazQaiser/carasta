"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getListingSpecsEditHref, getListingTypeById, LISTING_EDIT_HREFS } from "../config";
import { useListingBuilder } from "../ListingBuilderContext";
import { getRestorationBuildTypeLabel } from "../specs/restored-restomod";

function PreviewBlock({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>
        <Button type="button" variant="outline" size="sm" asChild>
          <Link href={href}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>
        </Button>
      </div>
      {children}
    </div>
  );
}

function ValueRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right">{value?.trim() ? value : "—"}</span>
    </div>
  );
}

export function ListingPreviewScreen() {
  const { draft } = useListingBuilder();
  const listingType = getListingTypeById(draft.listingTypeId);
  const d = draft.details;
  const vehicleLabel = [d.year, d.make, d.model].filter(Boolean).join(" ") || "Vehicle not set";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Listing Review</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review each section of your listing draft. Use Edit to jump back and make changes.
        </p>
      </div>

      <div className="space-y-4">
        <PreviewBlock title="Vehicle Details" href={LISTING_EDIT_HREFS.details}>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <p className="text-lg font-semibold">{vehicleLabel}</p>
            {listingType ? <Badge variant="secondary">{listingType.label}</Badge> : null}
          </div>
          <ValueRow label="Trim" value={d.trim} />
          <ValueRow label="Mileage" value={d.mileage} />
          <ValueRow label="Exterior" value={d.exteriorColor} />
          <ValueRow label="Interior" value={d.interiorColor} />
          <ValueRow label="Engine" value={d.engine} />
          <ValueRow label="Transmission" value={d.transmission} />
          <ValueRow label="Drivetrain" value={d.drivetrain} />
          <ValueRow label="VIN" value={d.vin} />
        </PreviewBlock>

        <PreviewBlock
          title="Specifications"
          href={getListingSpecsEditHref(draft.listingTypeId)}
        >
          {draft.listingTypeId === "modified-performance" ? (
            <div className="space-y-1">
              <ValueRow
                label="Engine"
                value={draft.modificationWorkspace.performanceSummary.currentEngine}
              />
              <ValueRow
                label="Horsepower"
                value={
                  [
                    draft.modificationWorkspace.performanceSummary.horsepower,
                    draft.modificationWorkspace.performanceSummary.horsepowerStatus,
                  ]
                    .filter(Boolean)
                    .join(" · ") || undefined
                }
              />
              <ValueRow
                label="Torque"
                value={
                  [
                    draft.modificationWorkspace.performanceSummary.torque,
                    draft.modificationWorkspace.performanceSummary.torqueStatus,
                  ]
                    .filter(Boolean)
                    .join(" · ") || undefined
                }
              />
              <ValueRow
                label="Tuning platform"
                value={draft.modificationWorkspace.performanceSummary.tuningPlatform}
              />
              <ValueRow
                label="Modification entries"
                value={String(
                  draft.modificationWorkspace.entries.filter((e) => e.completed || e.title.trim())
                    .length
                )}
              />
              {draft.modificationWorkspace.performanceSummary.buildSummary ? (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap pt-2 leading-relaxed">
                  {draft.modificationWorkspace.performanceSummary.buildSummary}
                </p>
              ) : null}
            </div>
          ) : draft.listingTypeId === "restored-restomod-custom" ? (
            <div className="space-y-1">
              <ValueRow
                label="Build type"
                value={getRestorationBuildTypeLabel(
                  draft.modificationWorkspace.restoration.buildType
                )}
              />
              <ValueRow
                label="Identity"
                value={
                  [
                    draft.modificationWorkspace.restoration.identityType,
                    draft.modificationWorkspace.restoration.identityValue,
                  ]
                    .filter(Boolean)
                    .join(" · ") || undefined
                }
              />
              <ValueRow
                label="Mileage status"
                value={draft.modificationWorkspace.restoration.mileageStatus}
              />
              <ValueRow
                label="Restoration entries"
                value={String(
                  draft.modificationWorkspace.entries.filter((e) => e.completed || e.title.trim())
                    .length
                )}
              />
              <ValueRow
                label="Historical story"
                value={
                  draft.modificationWorkspace.restoration.provenance.historicalStory
                    ? draft.modificationWorkspace.restoration.provenance.historicalStory.slice(0, 120) +
                      (draft.modificationWorkspace.restoration.provenance.historicalStory.length > 120
                        ? "…"
                        : "")
                    : undefined
                }
              />
            </div>
          ) : draft.listingTypeId === "race-track-car" ? (
            <div className="space-y-1">
              <ValueRow
                label="Vehicle"
                value={
                  [
                    draft.modificationWorkspace.race.identity.year,
                    draft.modificationWorkspace.race.identity.make,
                    draft.modificationWorkspace.race.identity.model,
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
              />
              <ValueRow
                label="Discipline"
                value={draft.modificationWorkspace.race.competition.primaryDiscipline}
              />
              <ValueRow
                label="Competition level"
                value={draft.modificationWorkspace.race.competition.competitionLevel}
              />
              <ValueRow
                label="Class"
                value={draft.modificationWorkspace.race.competition.competitionClass}
              />
              <ValueRow
                label="Race history entries"
                value={String(draft.modificationWorkspace.race.historyEntries.length)}
              />
              <ValueRow
                label="Technical entries"
                value={String(
                  draft.modificationWorkspace.entries.filter((e) => e.completed || e.title.trim())
                    .length
                )}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Specifications & modifications vary by vehicle type and will appear here once that
              step is implemented.
            </p>
          )}
        </PreviewBlock>

        <PreviewBlock
          title="Modifications"
          href={getListingSpecsEditHref(draft.listingTypeId)}
        >
          <p className="text-sm font-medium">
            {(() => {
              const count = draft.modificationWorkspace.entries.filter(
                (e) => e.completed || e.title.trim()
              ).length;
              if (draft.modificationWorkspace.hasModifications === false || count === 0) {
                return "No modifications reported";
              }
              return `${count} modification${count === 1 ? "" : "s"} added`;
            })()}
          </p>
        </PreviewBlock>

        <PreviewBlock title="Condition & History" href={LISTING_EDIT_HREFS.history}>
          <ValueRow label="Title status" value={draft.condition.titleStatus} />
          <ValueRow label="Overall condition" value={draft.condition.overallCondition} />
          <ValueRow label="Service records" value={draft.condition.serviceRecords} />
          <ValueRow label="Accident history" value={draft.condition.accidentHistory} />
          <ValueRow label="Ownership history" value={draft.condition.ownershipHistory} />
        </PreviewBlock>

        <PreviewBlock title="Photos & Documents" href={LISTING_EDIT_HREFS.photos}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="rounded-xl border bg-muted/30 p-3">
              <p className="font-semibold text-lg">{draft.vehiclePhotos.length}</p>
              <p className="text-xs text-muted-foreground">Vehicle photos</p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-3">
              <p className="font-semibold text-lg">{draft.modificationPhotos.length}</p>
              <p className="text-xs text-muted-foreground">Mod photos</p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-3">
              <p className="font-semibold text-lg">{draft.documents.length}</p>
              <p className="text-xs text-muted-foreground">Documents</p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-3">
              <p className="font-semibold text-lg">{draft.videos.length}</p>
              <p className="text-xs text-muted-foreground">Videos</p>
            </div>
          </div>
          {draft.vehiclePhotos.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
              {draft.vehiclePhotos.slice(0, 8).map((photo) => (
                <div key={photo.id} className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                  {photo.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo.previewUrl}
                      alt={photo.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">No photos added yet.</p>
          )}
        </PreviewBlock>

        <PreviewBlock title="Owner Notes" href={LISTING_EDIT_HREFS.notes}>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {draft.ownerNotes.trim() || "No owner notes yet."}
          </p>
        </PreviewBlock>

        <PreviewBlock title="AI Description" href={LISTING_EDIT_HREFS.ai}>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {draft.aiDescription.trim() || "No AI description saved yet."}
          </p>
        </PreviewBlock>

        <PreviewBlock title="Auction Settings" href={LISTING_EDIT_HREFS.settings}>
          <ValueRow label="Sale type" value={draft.saleSettings.saleType} />
          <ValueRow label="Reserve price" value={draft.saleSettings.reservePrice} />
          <ValueRow label="Buy now price" value={draft.saleSettings.buyNowPrice} />
          <ValueRow label="Start date" value={draft.saleSettings.preferredStartDate} />
          <ValueRow label="Duration" value={draft.saleSettings.auctionDuration} />
          <ValueRow label="Shipping" value={draft.saleSettings.shipping} />
          <ValueRow label="Location" value={draft.saleSettings.shippingLocation} />
        </PreviewBlock>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="button" asChild>
            <Link href="/listing/buyer-preview">Continue to Buyer View Preview</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
