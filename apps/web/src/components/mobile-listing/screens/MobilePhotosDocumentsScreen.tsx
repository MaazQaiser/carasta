"use client";

import * as React from "react";
import { Camera, FolderOpen, ImageIcon, Move, Replace, Star, Trash2, Video } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import type { ListingMediaItem } from "@/components/listing/types";
import {
  collectBuildHistoryMedia,
  listingDocumentsHelper,
  listingPhotosHelper,
  LISTING_MEDIA_COPY,
  LISTING_MEDIA_LIMITS,
  showBuildHistorySection,
  showModificationPhotosSection,
  totalListingPhotos,
} from "@/components/listing/listing-media-library";
import { MobileListingShell } from "../MobileListingShell";
import { MobileOptionSheet } from "../MobileOptionSheet";

type TopTab = "photos" | "videos" | "documents";
type PhotoSection = "general" | "modifications" | "build-history";
type ActionKind = "cover" | "move" | "replace" | "delete";

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function MobilePhotosDocumentsScreen() {
  const {
    draft,
    addMediaItems,
    removeMediaItem,
    reorderMediaItems,
    setAuctionCoverPhotoId,
    syncCarriedForwardMedia,
  } = useListingBuilder();

  const showModifications = showModificationPhotosSection(draft);
  const buildHistory = collectBuildHistoryMedia(draft);
  const showBuildHistory = showBuildHistorySection(draft);
  const photos = draft.vehiclePhotos;
  const modPhotos = draft.modificationPhotos;
  const videos = draft.videos;
  const documents = draft.documents;
  const photoTotal = totalListingPhotos(draft);
  const coverId = draft.auctionCoverPhotoId ?? photos[0]?.id ?? null;

  const [tab, setTab] = React.useState<TopTab>("photos");
  const [photoSection, setPhotoSection] = React.useState<PhotoSection>("general");
  const [sheet, setSheet] = React.useState<"add" | "actions" | null>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    syncCarriedForwardMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  React.useEffect(() => {
    if (!showModifications && photoSection === "modifications") {
      setPhotoSection("general");
    }
    if (!showBuildHistory && photoSection === "build-history") {
      setPhotoSection("general");
    }
  }, [showModifications, showBuildHistory, photoSection]);

  const canContinue = photos.length >= LISTING_MEDIA_LIMITS.minPhotos;

  const activePhotoBucket =
    photoSection === "general" ? "vehiclePhotos" : "modificationPhotos";
  const activePhotoItems =
    photoSection === "general"
      ? photos
      : photoSection === "modifications"
        ? modPhotos
        : buildHistory;

  const addBatch = (bucket: "vehiclePhotos" | "modificationPhotos" | "documents" | "videos") => {
    if (bucket === "videos") {
      const room = LISTING_MEDIA_LIMITS.maxVideos - videos.length;
      if (room <= 0) {
        setSheet(null);
        return;
      }
      const batch: ListingMediaItem[] = [
        {
          id: createLocalId("video"),
          name: `Vehicle video ${videos.length + 1}`,
          previewUrl: `https://picsum.photos/seed/carasta-video-${videos.length + 1}/400/225`,
        },
      ];
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

    const room = LISTING_MEDIA_LIMITS.maxPhotos - photoTotal;
    if (room <= 0) {
      setSheet(null);
      return;
    }

    if (bucket === "modificationPhotos") {
      const start = modPhotos.length;
      const count = Math.min(4, room);
      const batch: ListingMediaItem[] = Array.from({ length: count }, (_, index) => {
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
    const count = Math.min(8, room);
    const batch: ListingMediaItem[] = Array.from({ length: count }, (_, index) => {
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

  const runAction = (kind: ActionKind) => {
    if (!selectedId || photoSection === "build-history") {
      setSheet(null);
      return;
    }

    if (tab === "photos") {
      const list = activePhotoItems;
      const index = list.findIndex((item) => item.id === selectedId);
      if (index < 0) {
        setSheet(null);
        return;
      }
      if (kind === "cover" && photoSection === "general") {
        setAuctionCoverPhotoId(selectedId);
      } else if (kind === "delete") {
        removeMediaItem(activePhotoBucket, selectedId);
      } else if (kind === "move" && index > 0) {
        reorderMediaItems(activePhotoBucket, index, index - 1);
      } else if (kind === "replace") {
        removeMediaItem(activePhotoBucket, selectedId);
        addBatch(activePhotoBucket);
        return;
      }
    } else if (tab === "videos") {
      const index = videos.findIndex((item) => item.id === selectedId);
      if (kind === "delete" && index >= 0) removeMediaItem("videos", selectedId);
      else if (kind === "move" && index > 0) reorderMediaItems("videos", index, index - 1);
      else if (kind === "replace" && index >= 0) {
        removeMediaItem("videos", selectedId);
        addBatch("videos");
        return;
      }
    } else {
      const index = documents.findIndex((item) => item.id === selectedId);
      if (kind === "delete" && index >= 0) removeMediaItem("documents", selectedId);
      else if (kind === "move" && index > 0) reorderMediaItems("documents", index, index - 1);
      else if (kind === "replace" && index >= 0) {
        removeMediaItem("documents", selectedId);
        addBatch("documents");
        return;
      }
    }

    setSelectedId(null);
    setSheet(null);
  };

  const tabs: { id: TopTab; label: string; badge?: number }[] = [
    { id: "photos", label: LISTING_MEDIA_COPY.photosTab, badge: photoTotal || undefined },
    { id: "videos", label: LISTING_MEDIA_COPY.videosTab, badge: videos.length || undefined },
    {
      id: "documents",
      label: LISTING_MEDIA_COPY.documentsTab,
      badge: documents.length || undefined,
    },
  ];

  const helper =
    tab === "photos"
      ? listingPhotosHelper(draft)
      : tab === "videos"
        ? LISTING_MEDIA_COPY.videosHelper
        : listingDocumentsHelper(draft);

  const photosAtCap = photoTotal >= LISTING_MEDIA_LIMITS.maxPhotos;
  const videosAtCap = videos.length >= LISTING_MEDIA_LIMITS.maxVideos;
  const buildHistoryOnly = photoSection === "build-history";

  return (
    <MobileListingShell
      stepId="photos"
      continueDisabled={!canContinue}
      continueHref={canContinue ? "/mobile-listing/notes" : undefined}
    >
      <div className="flex flex-col gap-5 px-6 pb-6 pt-4">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            {LISTING_MEDIA_COPY.screenTitle}
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">{helper}</p>
        </div>

        <div className="flex gap-4 overflow-x-auto border-b border-[#e5e5ea] text-[13px] font-semibold">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={
                tab === item.id
                  ? "relative shrink-0 border-b-2 border-[#1b1464] px-1 pb-2 text-[#1b1464]"
                  : "relative shrink-0 px-1 pb-2 text-[#636366]"
              }
            >
              {item.label}
              {item.badge ? (
                <span className="ml-1 rounded-full bg-[#1b1464] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {tab === "photos" ? (
          <PhotosTab
            photoSection={photoSection}
            setPhotoSection={setPhotoSection}
            showModifications={showModifications}
            showBuildHistory={showBuildHistory}
            photos={photos}
            modPhotos={modPhotos}
            buildHistory={buildHistory}
            photoTotal={photoTotal}
            coverId={coverId}
            photosAtCap={photosAtCap}
            onOpenAdd={() => setSheet("add")}
            onOpenActions={(id) => {
              setSelectedId(id);
              setSheet("actions");
            }}
          />
        ) : null}

        {tab === "videos" ? (
          <MediaGridTab
            items={videos}
            progressLabel={`Optional · ${videos.length} of ${LISTING_MEDIA_LIMITS.maxVideos}`}
            progressPct={Math.min((videos.length / LISTING_MEDIA_LIMITS.maxVideos) * 100, 100)}
            emptyLabel="Tap to add videos"
            emptyHint={`Optional · up to ${LISTING_MEDIA_LIMITS.maxVideos} videos, each up to 1 minute`}
            addLabel={
              videosAtCap
                ? `Video limit reached (${LISTING_MEDIA_LIMITS.maxVideos})`
                : "+ Add More Videos"
            }
            addDisabled={videosAtCap}
            variant="video"
            onOpenAdd={() => setSheet("add")}
            onOpenActions={(id) => {
              setSelectedId(id);
              setSheet("actions");
            }}
          />
        ) : null}

        {tab === "documents" ? (
          <MediaGridTab
            items={documents}
            progressLabel={`${documents.length} documents`}
            progressPct={Math.min(documents.length * 10, 100)}
            emptyLabel="Tap to add documents"
            emptyHint={listingDocumentsHelper(draft)}
            addLabel="+ Add More Documents"
            addDisabled={false}
            variant="document"
            onOpenAdd={() => setSheet("add")}
            onOpenActions={(id) => {
              setSelectedId(id);
              setSheet("actions");
            }}
          />
        ) : null}
      </div>

      {sheet === "add" && !buildHistoryOnly ? (
        <PhotoSheet
          title={
            tab === "videos"
              ? "Add Video"
              : tab === "documents"
                ? "Add Documents"
                : "Add Photos"
          }
          onClose={() => setSheet(null)}
          onChoose={() =>
            addBatch(
              tab === "videos"
                ? "videos"
                : tab === "documents"
                  ? "documents"
                  : activePhotoBucket
            )
          }
          mode={tab === "videos" ? "video" : "media"}
        />
      ) : null}
      {sheet === "actions" && !buildHistoryOnly ? (
        <PhotoSheet
          title={tab === "videos" ? "Video Actions" : "Photo Actions"}
          onClose={() => {
            setSelectedId(null);
            setSheet(null);
          }}
          onAction={runAction}
          mode="actions"
          showCover={tab === "photos" && photoSection === "general"}
        />
      ) : null}
    </MobileListingShell>
  );
}

function PhotosTab({
  photoSection,
  setPhotoSection,
  showModifications,
  showBuildHistory,
  photos,
  modPhotos,
  buildHistory,
  photoTotal,
  coverId,
  photosAtCap,
  onOpenAdd,
  onOpenActions,
}: {
  photoSection: PhotoSection;
  setPhotoSection: (section: PhotoSection) => void;
  showModifications: boolean;
  showBuildHistory: boolean;
  photos: ListingMediaItem[];
  modPhotos: ListingMediaItem[];
  buildHistory: ListingMediaItem[];
  photoTotal: number;
  coverId: string | null;
  photosAtCap: boolean;
  onOpenAdd: () => void;
  onOpenActions: (id: string) => void;
}) {
  const items =
    photoSection === "general"
      ? photos
      : photoSection === "modifications"
        ? modPhotos
        : buildHistory;
  const readOnly = photoSection === "build-history";
  const progressLabel = `${photoTotal} of ${LISTING_MEDIA_LIMITS.maxPhotos} max · ${photos.length} general`;
  const progressPct = Math.min((photos.length / LISTING_MEDIA_LIMITS.minPhotos) * 100, 100);

  const sectionChips: { id: PhotoSection; label: string; count: number }[] = [
    { id: "general", label: LISTING_MEDIA_COPY.generalPhotosTitle, count: photos.length },
    ...(showModifications
      ? [
          {
            id: "modifications" as const,
            label: LISTING_MEDIA_COPY.modificationPhotosTitle,
            count: modPhotos.length,
          },
        ]
      : []),
    ...(showBuildHistory
      ? [
          {
            id: "build-history" as const,
            label: LISTING_MEDIA_COPY.buildHistoryTitle,
            count: buildHistory.length,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-4">
      {sectionChips.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {sectionChips.map(({ id, label, count }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPhotoSection(id)}
              className={
                photoSection === id
                  ? "rounded-lg bg-[#1b1464] px-3 py-1.5 text-[12px] font-semibold text-white"
                  : "rounded-lg bg-[#f4f5fc] px-3 py-1.5 text-[12px] font-semibold text-[#1b1464]"
              }
            >
              {label}
              <span className="ml-1 opacity-80">({count})</span>
            </button>
          ))}
        </div>
      ) : null}

      <p className="text-[12px] leading-relaxed text-[#636366]">
        {photoSection === "general"
          ? LISTING_MEDIA_COPY.generalPhotosHelper
          : photoSection === "modifications"
            ? LISTING_MEDIA_COPY.modificationPhotosHelper
            : LISTING_MEDIA_COPY.buildHistoryHelper}
      </p>

      {items.length ? (
        <>
          {!readOnly ? (
            <>
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#1b1464]">
                <span>Upload Progress</span>
                <span>{progressLabel}</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-[#e5e5ea]">
                <div className="h-full bg-[#1b1464]" style={{ width: `${progressPct}%` }} />
              </div>
            </>
          ) : null}
          <div className="grid grid-cols-3 gap-2">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => (readOnly ? undefined : onOpenActions(item.id))}
                className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#e5e5ea]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.previewUrl || ""}
                  alt={item.name || `Photo ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-1 top-1 rounded bg-black/55 px-1 text-[8px] font-bold text-white">
                  {index + 1}
                </span>
                {photoSection === "general" && item.id === coverId ? (
                  <span className="absolute right-1 top-1 rounded bg-[#1b1464] px-1 text-[8px] font-bold text-white">
                    {LISTING_MEDIA_COPY.coverBadge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
          {!readOnly ? (
            <button
              type="button"
              disabled={photosAtCap}
              onClick={onOpenAdd}
              className="h-10 w-full rounded-lg bg-[#f4f5fc] text-[12px] font-semibold text-[#1b1464] disabled:opacity-50"
            >
              {photosAtCap
                ? `Photo limit reached (${LISTING_MEDIA_LIMITS.maxPhotos})`
                : "+ Add More Photos"}
            </button>
          ) : null}
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={onOpenAdd}
            className="flex min-h-44 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#c7c7cc] bg-[#fafafa] text-center"
          >
            <Camera className="mb-3 h-6 w-6 text-[#1b1464]" />
            <span className="text-[13px] font-semibold text-[#1c1c1e]">Tap to add photos</span>
            <span className="mt-1 px-6 text-[11px] text-[#636366]">
              Drag images or click to browse · max {LISTING_MEDIA_LIMITS.maxPhotos} total
            </span>
          </button>
          {photoSection === "general" ? (
            <div className="rounded-lg bg-[#f4f5fc] p-3 text-[12px] leading-relaxed text-[#4b4877]">
              Recommend: front/rear 3/4, both sides, wheels, engine bay, interior, dashboard, seats,
              trunk, undercarriage when possible, and any flaws.
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function MediaGridTab({
  items,
  progressLabel,
  progressPct,
  emptyLabel,
  emptyHint,
  addLabel,
  addDisabled,
  variant,
  onOpenAdd,
  onOpenActions,
}: {
  items: ListingMediaItem[];
  progressLabel: string;
  progressPct: number;
  emptyLabel: string;
  emptyHint: string;
  addLabel: string;
  addDisabled: boolean;
  variant: "video" | "document";
  onOpenAdd: () => void;
  onOpenActions: (id: string) => void;
}) {
  return items.length ? (
    <>
      <div className="flex items-center justify-between text-[11px] font-semibold text-[#1b1464]">
        <span>Upload Progress</span>
        <span>{progressLabel}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-[#e5e5ea]">
        <div className="h-full bg-[#1b1464]" style={{ width: `${progressPct}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpenActions(item.id)}
            className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#e5e5ea]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.previewUrl || ""}
              alt={item.name || `Media ${index + 1}`}
              className="h-full w-full object-cover"
            />
            {variant === "video" ? (
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
        onClick={onOpenAdd}
        className="h-10 w-full rounded-lg bg-[#f4f5fc] text-[12px] font-semibold text-[#1b1464] disabled:opacity-50"
      >
        {addLabel}
      </button>
    </>
  ) : (
    <button
      type="button"
      onClick={onOpenAdd}
      className="flex min-h-44 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#c7c7cc] bg-[#fafafa] text-center"
    >
      {variant === "video" ? (
        <Video className="mb-3 h-6 w-6 text-[#1b1464]" />
      ) : (
        <Camera className="mb-3 h-6 w-6 text-[#1b1464]" />
      )}
      <span className="text-[13px] font-semibold text-[#1c1c1e]">{emptyLabel}</span>
      <span className="mt-1 px-6 text-[11px] text-[#636366]">{emptyHint}</span>
    </button>
  );
}

function PhotoSheet({
  title,
  onClose,
  onChoose,
  onAction,
  mode,
  showCover = false,
}: {
  title: string;
  onClose: () => void;
  onChoose?: () => void;
  onAction?: (kind: ActionKind) => void;
  mode: "media" | "video" | "actions";
  showCover?: boolean;
}) {
  if (mode === "actions") {
    const choices: {
      icon: typeof Star;
      label: string;
      kind: ActionKind;
      show?: boolean;
      danger?: boolean;
    }[] = [
      { icon: Star, label: "Set as Auction Cover Photo", kind: "cover", show: showCover },
      { icon: Move, label: "Move", kind: "move", show: true },
      { icon: Replace, label: "Replace", kind: "replace", show: true },
      { icon: Trash2, label: "Delete", kind: "delete", show: true, danger: true },
    ];
    return (
      <MobileOptionSheet open title={title} onClose={onClose}>
        <div className="space-y-2">
          {choices
            .filter((c) => c.show)
            .map(({ icon: ItemIcon, label, kind, danger }) => (
              <button
                key={label}
                type="button"
                onClick={() => onAction?.(kind)}
                className={
                  danger
                    ? "flex h-11 w-full items-center gap-3 rounded-lg bg-[#f4f5fc] px-3 text-left text-[13px] font-medium text-[#c10606]"
                    : "flex h-11 w-full items-center gap-3 rounded-lg bg-[#f4f5fc] px-3 text-left text-[13px] font-medium text-[#1c1c1e]"
                }
              >
                <ItemIcon className={`h-4 w-4 ${danger ? "text-[#c10606]" : "text-[#1b1464]"}`} />
                {label}
              </button>
            ))}
        </div>
      </MobileOptionSheet>
    );
  }

  const choices =
    mode === "video"
      ? [
          { icon: Video, label: "Record Video", hint: "Capture up to 1 minute" },
          { icon: FolderOpen, label: "Files", hint: "Upload from files" },
        ]
      : [
          {
            icon: Camera,
            label: LISTING_MEDIA_COPY.addCamera,
            hint: LISTING_MEDIA_COPY.addCameraHint,
          },
          {
            icon: ImageIcon,
            label: LISTING_MEDIA_COPY.addGallery,
            hint: LISTING_MEDIA_COPY.addGalleryHint,
          },
          {
            icon: FolderOpen,
            label: LISTING_MEDIA_COPY.addFiles,
            hint: LISTING_MEDIA_COPY.addFilesHint,
          },
        ];

  return (
    <MobileOptionSheet open title={title} onClose={onClose}>
      <div className="space-y-2">
        {choices.map(({ icon: ItemIcon, label, hint }) => (
          <button
            key={label}
            type="button"
            onClick={onChoose}
            className="flex min-h-11 w-full items-center gap-3 rounded-lg bg-[#f4f5fc] px-3 py-2 text-left"
          >
            <ItemIcon className="h-4 w-4 shrink-0 text-[#1b1464]" />
            <span className="flex flex-col">
              <span className="text-[13px] font-medium text-[#1c1c1e]">{label}</span>
              <span className="text-[11px] text-[#636366]">{hint}</span>
            </span>
          </button>
        ))}
      </div>
    </MobileOptionSheet>
  );
}
