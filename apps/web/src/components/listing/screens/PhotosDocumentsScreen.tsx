"use client";

import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { MediaUploadZone } from "../MediaUploadZone";
import { useListingBuilder } from "../ListingBuilderContext";
import { useListingNotifications } from "../notifications/NotificationProvider";
import type { ListingMediaItem } from "../types";
import { MIN_LISTING_PHOTOS } from "../listing-route-map";

const MIN_VIDEOS = 1;
const MAX_VIDEOS = 5;

export function PhotosDocumentsScreen() {
  const { draft, addMediaItems, removeMediaItem } = useListingBuilder();
  const { notify } = useListingNotifications();

  const hideModifications =
    draft.listingTypeId === "stock-lightly-modified" &&
    draft.modificationWorkspace.hasModifications === false;

  const onAdd =
    (bucket: "vehiclePhotos" | "modificationPhotos" | "documents" | "videos") =>
    (items: ListingMediaItem[]) => {
      if (bucket === "videos") {
        const room = MAX_VIDEOS - draft.videos.length;
        if (room <= 0) {
          notify({
            title: "Video limit reached",
            description: `You can upload up to ${MAX_VIDEOS} videos.`,
            tone: "warning",
          });
          return;
        }
        addMediaItems("videos", items.slice(0, room));
      } else {
        addMediaItems(bucket, items);
      }
      notify({
        title: bucket === "videos" ? "Video Uploaded" : "Photo Uploaded",
        description:
          bucket === "documents"
            ? "Document photo added to this draft."
            : `${Math.min(items.length, bucket === "videos" ? MAX_VIDEOS - draft.videos.length : items.length)} file${items.length === 1 ? "" : "s"} added.`,
        tone: "success",
      });
    };

  return (
    <ListingStep
      title="Photos & Documents"
      description={`Add at least ${MIN_LISTING_PHOTOS} vehicle photos and at least ${MIN_VIDEOS} video (max ${MAX_VIDEOS}).`}
    >
      <div className="space-y-8">
        <ListingSection
          title="Vehicle Photos"
          description={`${draft.vehiclePhotos.length} of ${MIN_LISTING_PHOTOS} recommended photos added. Exterior, interior, engine bay, and detail shots.`}
        >
          <MediaUploadZone
            accept="image/*"
            items={draft.vehiclePhotos}
            onAdd={onAdd("vehiclePhotos")}
            onRemove={(id) => removeMediaItem("vehiclePhotos", id)}
          />
        </ListingSection>

        {!hideModifications ? (
          <ListingSection
            title="Modification Photos"
            description="Document upgrades, custom work, and unique features."
          >
            <MediaUploadZone
              accept="image/*"
              items={draft.modificationPhotos}
              onAdd={onAdd("modificationPhotos")}
              onRemove={(id) => removeMediaItem("modificationPhotos", id)}
            />
          </ListingSection>
        ) : null}

        <ListingSection
          title="Video"
          description={`Add at least ${MIN_VIDEOS} video of your vehicle. Limit ${MAX_VIDEOS} videos. (${draft.videos.length}/${MAX_VIDEOS})`}
        >
          <MediaUploadZone
            accept="video/*"
            variant="video"
            items={draft.videos}
            onAdd={onAdd("videos")}
            onRemove={(id) => removeMediaItem("videos", id)}
          />
        </ListingSection>

        <ListingSection
          title="Documents"
          description="Add photos of documents associated with this vehicle."
        >
          <MediaUploadZone
            accept="image/*,.pdf,.doc,.docx,.png,.jpg,.jpeg"
            variant="file"
            items={draft.documents}
            onAdd={onAdd("documents")}
            onRemove={(id) => removeMediaItem("documents", id)}
          />
        </ListingSection>
      </div>
    </ListingStep>
  );
}
