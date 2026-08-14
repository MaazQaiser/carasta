"use client";

import * as React from "react";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { MediaUploadZone } from "../MediaUploadZone";
import { useListingBuilder } from "../ListingBuilderContext";
import { useListingNotifications } from "../notifications/NotificationProvider";
import type { ListingMediaItem } from "../types";
import {
  collectBuildHistoryMedia,
  listingPhotosHelper,
  listingDocumentsHelper,
  LISTING_MEDIA_COPY,
  LISTING_MEDIA_LIMITS,
  showBuildHistorySection,
  showModificationPhotosSection,
  totalListingPhotos,
} from "../listing-media-library";
import { cn } from "@/lib/utils";

type TopTab = "photos" | "videos" | "documents";

export function PhotosDocumentsScreen() {
  const {
    draft,
    addMediaItems,
    removeMediaItem,
    reorderMediaItems,
    setAuctionCoverPhotoId,
    syncCarriedForwardMedia,
  } = useListingBuilder();
  const { notify } = useListingNotifications();
  const [tab, setTab] = React.useState<TopTab>("photos");

  React.useEffect(() => {
    syncCarriedForwardMedia();
    // Carry-forward once when entering this screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  const showModifications = showModificationPhotosSection(draft);
  const buildHistory = collectBuildHistoryMedia(draft);
  const showBuildHistory = showBuildHistorySection(draft);
  const photoTotal = totalListingPhotos(draft);
  const coverId =
    draft.auctionCoverPhotoId ?? draft.vehiclePhotos[0]?.id ?? null;

  const onAdd =
    (bucket: "vehiclePhotos" | "modificationPhotos" | "documents" | "videos") =>
    (items: ListingMediaItem[]) => {
      const before =
        bucket === "videos"
          ? draft.videos.length
          : bucket === "documents"
            ? draft.documents.length
            : photoTotal;

      if (bucket === "videos" && draft.videos.length >= LISTING_MEDIA_LIMITS.maxVideos) {
        notify({
          title: "Video limit reached",
          description: `You can upload up to ${LISTING_MEDIA_LIMITS.maxVideos} videos.`,
          tone: "warning",
        });
        return;
      }
      if (
        (bucket === "vehiclePhotos" || bucket === "modificationPhotos") &&
        photoTotal >= LISTING_MEDIA_LIMITS.maxPhotos
      ) {
        notify({
          title: "Photo limit reached",
          description: `You can upload up to ${LISTING_MEDIA_LIMITS.maxPhotos} photos total.`,
          tone: "warning",
        });
        return;
      }

      addMediaItems(bucket, items);

      const room =
        bucket === "videos"
          ? LISTING_MEDIA_LIMITS.maxVideos - before
          : bucket === "vehiclePhotos" || bucket === "modificationPhotos"
            ? LISTING_MEDIA_LIMITS.maxPhotos - before
            : items.length;

      notify({
        title:
          bucket === "videos"
            ? "Video uploaded"
            : bucket === "documents"
              ? "Document uploaded"
              : "Photo uploaded",
        description: `${Math.min(items.length, Math.max(room, 0))} file${items.length === 1 ? "" : "s"} added.`,
        tone: "success",
      });
    };

  const tabs: { id: TopTab; label: string }[] = [
    { id: "photos", label: LISTING_MEDIA_COPY.photosTab },
    { id: "videos", label: LISTING_MEDIA_COPY.videosTab },
    { id: "documents", label: LISTING_MEDIA_COPY.documentsTab },
  ];

  return (
    <ListingStep
      title={LISTING_MEDIA_COPY.screenTitle}
      description={`Up to ${LISTING_MEDIA_LIMITS.maxPhotos} current-condition photos. Videos optional (max ${LISTING_MEDIA_LIMITS.maxVideos}, ≤1 min each).`}
    >
      <div className="space-y-6">
        <div className="flex gap-1 border-b border-border">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "px-4 py-2.5 text-sm font-semibold transition-colors",
                tab === item.id
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
              {item.id === "photos" ? (
                <span className="ml-1.5 text-xs font-medium text-muted-foreground">
                  ({photoTotal}/{LISTING_MEDIA_LIMITS.maxPhotos})
                </span>
              ) : null}
              {item.id === "videos" ? (
                <span className="ml-1.5 text-xs font-medium text-muted-foreground">
                  ({draft.videos.length}/{LISTING_MEDIA_LIMITS.maxVideos})
                </span>
              ) : null}
              {item.id === "documents" ? (
                <span className="ml-1.5 text-xs font-medium text-muted-foreground">
                  ({draft.documents.length})
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {tab === "photos" ? (
          <div className="space-y-8">
            <p className="text-sm text-muted-foreground">{listingPhotosHelper(draft)}</p>

            <ListingSection
              title={LISTING_MEDIA_COPY.generalPhotosTitle}
              description={`${draft.vehiclePhotos.length} general · recommend ${LISTING_MEDIA_LIMITS.minPhotos}+ · ${LISTING_MEDIA_COPY.generalPhotosHelper}`}
            >
              <MediaUploadZone
                accept="image/*"
                items={draft.vehiclePhotos}
                onAdd={onAdd("vehiclePhotos")}
                onRemove={(id) => removeMediaItem("vehiclePhotos", id)}
                onReorder={(from, to) => reorderMediaItems("vehiclePhotos", from, to)}
                coverItemId={coverId}
                onSetCover={setAuctionCoverPhotoId}
              />
            </ListingSection>

            {!showModifications ? null : (
              <ListingSection
                title={LISTING_MEDIA_COPY.modificationPhotosTitle}
                description={LISTING_MEDIA_COPY.modificationPhotosHelper}
              >
                <MediaUploadZone
                  accept="image/*"
                  items={draft.modificationPhotos}
                  onAdd={onAdd("modificationPhotos")}
                  onRemove={(id) => removeMediaItem("modificationPhotos", id)}
                  onReorder={(from, to) => reorderMediaItems("modificationPhotos", from, to)}
                />
              </ListingSection>
            )}

            {showBuildHistory ? (
              <ListingSection
                title={LISTING_MEDIA_COPY.buildHistoryTitle}
                description={LISTING_MEDIA_COPY.buildHistoryHelper}
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {buildHistory.map((item) => (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-xl border bg-card"
                    >
                      <div className="flex aspect-[4/3] items-center justify-center bg-muted">
                        {item.previewUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.previewUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="px-2 text-center text-[11px] text-muted-foreground">
                            {item.name}
                          </span>
                        )}
                      </div>
                      <p className="truncate px-2.5 py-2 text-xs font-medium">{item.name}</p>
                    </div>
                  ))}
                </div>
              </ListingSection>
            ) : null}
          </div>
        ) : null}

        {tab === "videos" ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{LISTING_MEDIA_COPY.videosHelper}</p>
            <ListingSection
              title="Videos"
              description={`Optional · ${draft.videos.length} of ${LISTING_MEDIA_LIMITS.maxVideos} · max ${LISTING_MEDIA_LIMITS.maxVideoSeconds / 60} minute each`}
            >
              <MediaUploadZone
                accept="video/*"
                variant="video"
                items={draft.videos}
                onAdd={onAdd("videos")}
                onRemove={(id) => removeMediaItem("videos", id)}
                onReorder={(from, to) => reorderMediaItems("videos", from, to)}
              />
            </ListingSection>
          </div>
        ) : null}

        {tab === "documents" ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{listingDocumentsHelper(draft)}</p>
            <ListingSection title="Documents" description={`${draft.documents.length} uploaded`}>
              <MediaUploadZone
                accept="image/*,.pdf,application/pdf"
                variant="file"
                items={draft.documents}
                onAdd={onAdd("documents")}
                onRemove={(id) => removeMediaItem("documents", id)}
                onReorder={(from, to) => reorderMediaItems("documents", from, to)}
              />
            </ListingSection>
          </div>
        ) : null}
      </div>
    </ListingStep>
  );
}
