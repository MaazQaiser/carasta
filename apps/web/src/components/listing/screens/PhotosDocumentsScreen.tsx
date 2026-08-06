"use client";

import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { MediaUploadZone } from "../MediaUploadZone";
import { useListingBuilder } from "../ListingBuilderContext";
import { useListingNotifications } from "../notifications/NotificationProvider";
import type { ListingMediaItem } from "../types";

export function PhotosDocumentsScreen() {
  const { draft, addMediaItems, removeMediaItem } = useListingBuilder();
  const { notify } = useListingNotifications();

  const onAdd =
    (bucket: "vehiclePhotos" | "modificationPhotos" | "documents" | "videos") =>
    (items: ListingMediaItem[]) => {
      addMediaItems(bucket, items);
      notify({
        title: "Photo Uploaded",
        description:
          bucket === "documents"
            ? "Document added to this draft."
            : `${items.length} file${items.length === 1 ? "" : "s"} added.`,
        tone: "success",
      });
    };

  return (
    <ListingStep
      title="Photos & Documents"
      description="Build a desktop media workspace for photos, documents, and video. Upload logic comes later."
    >
      <div className="space-y-8">
        <ListingSection
          title="Vehicle Photos"
          description="Exterior, interior, engine bay, and detail shots."
        >
          <MediaUploadZone
            accept="image/*"
            items={draft.vehiclePhotos}
            onAdd={onAdd("vehiclePhotos")}
            onRemove={(id) => removeMediaItem("vehiclePhotos", id)}
          />
        </ListingSection>

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

        <ListingSection
          title="Documents"
          description="Title, service records, inspection reports, and receipts."
        >
          <MediaUploadZone
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            variant="file"
            items={draft.documents}
            onAdd={onAdd("documents")}
            onRemove={(id) => removeMediaItem("documents", id)}
          />
        </ListingSection>

        <ListingSection
          title="Video"
          description="Walkaround or start-up video for buyers."
        >
          <MediaUploadZone
            accept="video/*"
            variant="video"
            items={draft.videos}
            onAdd={onAdd("videos")}
            onRemove={(id) => removeMediaItem("videos", id)}
          />
        </ListingSection>
      </div>
    </ListingStep>
  );
}
