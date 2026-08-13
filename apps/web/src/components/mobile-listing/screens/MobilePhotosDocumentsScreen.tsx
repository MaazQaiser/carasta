"use client";

import * as React from "react";
import { Camera, FolderOpen, ImageIcon, Move, Replace, Star, Trash2, Video } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import type { ListingMediaItem } from "@/components/listing/types";
import { MobileListingShell } from "../MobileListingShell";
import { MobileOptionSheet } from "../MobileOptionSheet";

const MIN_PHOTOS = 20;
const MIN_VIDEOS = 1;
const MAX_VIDEOS = 5;

type MediaTab = "general" | "modifications" | "video" | "documents";

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function MobilePhotosDocumentsScreen() {
  const { draft, addMediaItems } = useListingBuilder();
  const photos = draft.vehiclePhotos;
  const modPhotos = draft.modificationPhotos;
  const videos = draft.videos;
  const documents = draft.documents;

  const isStock =
    draft.listingTypeId === "stock-lightly-modified" &&
    draft.modificationWorkspace.hasModifications === false;

  const [tab, setTab] = React.useState<MediaTab>("general");
  const [sheet, setSheet] = React.useState<"add" | "actions" | null>(null);

  React.useEffect(() => {
    if (isStock && tab === "modifications") setTab("general");
  }, [isStock, tab]);

  const tabs: { id: MediaTab; label: string }[] = [
    { id: "general", label: "General" },
    ...(!isStock ? [{ id: "modifications" as const, label: "Modifications" }] : []),
    { id: "video", label: "Video" },
    { id: "documents", label: "Documents" },
  ];

  const canContinue = photos.length >= MIN_PHOTOS && videos.length >= MIN_VIDEOS;

  const addBatch = (bucket: "vehiclePhotos" | "modificationPhotos" | "documents" | "videos") => {
    if (bucket === "videos") {
      const room = MAX_VIDEOS - videos.length;
      if (room <= 0) {
        setSheet(null);
        return;
      }
      const count = Math.min(1, room);
      const batch: ListingMediaItem[] = Array.from({ length: count }, (_, index) => ({
        id: createLocalId("video"),
        name: `Vehicle video ${videos.length + index + 1}`,
        previewUrl: `https://picsum.photos/seed/carasta-video-${videos.length + index + 1}/400/225`,
      }));
      addMediaItems("videos", batch);
      setSheet(null);
      return;
    }

    if (bucket === "documents") {
      const start = documents.length;
      const batch: ListingMediaItem[] = Array.from({ length: 2 }, (_, index) => {
        const n = start + index + 1;
        return {
          id: createLocalId("doc"),
          name: `Document ${n}`,
          previewUrl: `https://picsum.photos/seed/carasta-doc-${n}/200/150`,
        };
      });
      addMediaItems("documents", batch);
      setSheet(null);
      return;
    }

    if (bucket === "modificationPhotos") {
      const start = modPhotos.length;
      const batch: ListingMediaItem[] = Array.from({ length: 4 }, (_, index) => {
        const n = start + index + 1;
        return {
          id: createLocalId("mod-photo"),
          name: `Modification photo ${n}`,
          previewUrl: `https://picsum.photos/seed/carasta-mod-${n}/200/150`,
        };
      });
      addMediaItems("modificationPhotos", batch);
      setSheet(null);
      return;
    }

    const start = photos.length;
    const batch: ListingMediaItem[] = Array.from({ length: 8 }, (_, index) => {
      const n = start + index + 1;
      return {
        id: createLocalId("photo"),
        name: `Vehicle photo ${n}`,
        previewUrl: `https://picsum.photos/seed/carasta-${n + 10}/200/150`,
      };
    });
    addMediaItems("vehiclePhotos", batch);
    setSheet(null);
  };

  const activeBucket =
    tab === "general"
      ? "vehiclePhotos"
      : tab === "modifications"
        ? "modificationPhotos"
        : tab === "video"
          ? "videos"
          : "documents";

  const activeItems =
    tab === "general"
      ? photos
      : tab === "modifications"
        ? modPhotos
        : tab === "video"
          ? videos
          : documents;

  const heading =
    tab === "general"
      ? `Add at least ${MIN_PHOTOS} photos of your vehicle.`
      : tab === "modifications"
        ? "Add photos of modifications and custom work."
        : tab === "video"
          ? `Add at least ${MIN_VIDEOS} video of your vehicle. Limit ${MAX_VIDEOS} videos.`
          : "Add photos of documents associated with this vehicle.";

  const progressLabel =
    tab === "general"
      ? `${photos.length} / ${MIN_PHOTOS} Photos Uploaded`
      : tab === "modifications"
        ? `${modPhotos.length} Modification Photos`
        : tab === "video"
          ? `${videos.length} / ${MAX_VIDEOS} Videos Uploaded`
          : `${documents.length} Documents Uploaded`;

  const progressPct =
    tab === "general"
      ? Math.min((photos.length / MIN_PHOTOS) * 100, 100)
      : tab === "video"
        ? Math.min((videos.length / MAX_VIDEOS) * 100, 100)
        : Math.min(activeItems.length * 20, 100);

  const addDisabled = tab === "video" && videos.length >= MAX_VIDEOS;

  return (
    <MobileListingShell
      stepId="photos"
      continueDisabled={!canContinue}
      continueHref={canContinue ? "/mobile-listing/notes" : undefined}
    >
      <div className="flex flex-col gap-5 px-6 pb-6 pt-4">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            Photos &amp; Documents
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">{heading}</p>
        </div>

        <div className="flex gap-4 overflow-x-auto border-b border-[#e5e5ea] text-[13px] font-semibold">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={
                tab === item.id
                  ? "shrink-0 border-b-2 border-[#1b1464] px-1 pb-2 text-[#1b1464]"
                  : "shrink-0 px-1 pb-2 text-[#636366]"
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        {activeItems.length ? (
          <>
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#1b1464]">
              <span>Upload Progress</span>
              <span>{progressLabel}</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-[#e5e5ea]">
              <div className="h-full bg-[#1b1464]" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {activeItems.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSheet("actions")}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#e5e5ea]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl || ""}
                    alt={item.name || `Media ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {tab === "general" && index === 0 ? (
                    <span className="absolute left-1 top-1 rounded bg-[#1b1464] px-1 text-[8px] font-bold text-white">
                      COVER
                    </span>
                  ) : null}
                  {tab === "video" ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <Video className="h-5 w-5 text-white" />
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={addDisabled}
              onClick={() => setSheet("add")}
              className="h-10 w-full rounded-lg bg-[#f4f5fc] text-[12px] font-semibold text-[#1b1464] disabled:opacity-50"
            >
              {tab === "video"
                ? videos.length >= MAX_VIDEOS
                  ? `Video limit reached (${MAX_VIDEOS})`
                  : "+ Add More Videos"
                : tab === "documents"
                  ? "+ Add More Documents"
                  : "+ Add More Photos"}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setSheet("add")}
              className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-[#c7c7cc] bg-[#fafafa] text-center"
            >
              {tab === "video" ? (
                <Video className="mb-3 h-6 w-6 text-[#1b1464]" />
              ) : (
                <Camera className="mb-3 h-6 w-6 text-[#1b1464]" />
              )}
              <span className="text-[13px] font-semibold text-[#1c1c1e]">
                {tab === "video"
                  ? "Tap to add video"
                  : tab === "documents"
                    ? "Tap to add documents"
                    : "Tap to add photos"}
              </span>
              <span className="mt-1 px-6 text-[11px] text-[#636366]">
                {tab === "video"
                  ? `Upload at least ${MIN_VIDEOS} video (max ${MAX_VIDEOS})`
                  : tab === "documents"
                    ? "Add photos of documents associated with this vehicle"
                    : "Upload from your camera roll"}
              </span>
            </button>
            {tab === "general" ? (
              <div className="rounded-lg bg-[#f4f5fc] p-3 text-[12px] leading-relaxed text-[#4b4877]">
                Tips: Use a mix of exterior, interior, engine bay, wheels, and detail photos. Clear
                photos build buyer confidence.
              </div>
            ) : null}
          </>
        )}
      </div>

      {sheet === "add" ? (
        <PhotoSheet
          title={
            tab === "video" ? "Add Video" : tab === "documents" ? "Add Documents" : "Add Photos"
          }
          onClose={() => setSheet(null)}
          onChoose={() => addBatch(activeBucket)}
          video={tab === "video"}
        />
      ) : null}
      {sheet === "actions" ? (
        <PhotoSheet
          title={tab === "video" ? "Video Actions" : "Media Actions"}
          onClose={() => setSheet(null)}
          onChoose={() => setSheet(null)}
          actions
        />
      ) : null}
    </MobileListingShell>
  );
}

function PhotoSheet({
  title,
  onClose,
  onChoose,
  actions = false,
  video = false,
}: {
  title: string;
  onClose: () => void;
  onChoose: () => void;
  actions?: boolean;
  video?: boolean;
}) {
  const choices = actions
    ? [
        [Star, "Set as Auction Cover Photo"],
        [Move, "Move"],
        [Replace, "Replace"],
        [Trash2, "Delete"],
      ]
    : video
      ? [
          [Video, "Record Video"],
          [FolderOpen, "Choose from Files"],
        ]
      : [
          [Camera, "Camera"],
          [ImageIcon, "Gallery"],
          [FolderOpen, "Files"],
        ];

  return (
    <MobileOptionSheet open title={title} onClose={onClose}>
      <div className="space-y-2">
        {choices.map(([Icon, label]) => {
          const ItemIcon = Icon as typeof Camera;
          return (
            <button
              key={label as string}
              type="button"
              onClick={onChoose}
              className="flex h-11 w-full items-center gap-3 rounded-lg bg-[#f4f5fc] px-3 text-left text-[13px] font-medium text-[#1c1c1e]"
            >
              <ItemIcon className="h-4 w-4 text-[#1b1464]" />
              {label as string}
            </button>
          );
        })}
      </div>
    </MobileOptionSheet>
  );
}
