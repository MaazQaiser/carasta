"use client";

import * as React from "react";
import { MobileOptionSheet } from "../MobileOptionSheet";
import { Camera, FolderOpen, ImageIcon, Move, Replace, Star, Trash2 } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import type { ListingMediaItem } from "@/components/listing/types";
import { MobileListingShell } from "../MobileListingShell";

const MIN_PHOTOS = 20;

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function MobilePhotosDocumentsScreen() {
  const { draft, addMediaItems } = useListingBuilder();
  const photos = draft.vehiclePhotos;
  const [sheet, setSheet] = React.useState<"add" | "actions" | null>(null);

  const addPhotos = () => {
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

  const progressPct = Math.min((photos.length / MIN_PHOTOS) * 100, 100);

  return (
    <MobileListingShell
      stepId="photos"
      continueDisabled={photos.length < MIN_PHOTOS}
      continueHref={photos.length >= MIN_PHOTOS ? "/mobile-listing/notes" : undefined}
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            Photos &amp; Documents
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">
            Add at least {MIN_PHOTOS} photos of your vehicle.
          </p>
        </div>
        <div className="flex gap-4 border-b border-[#e5e5ea] text-[13px] font-semibold">
          <button type="button" className="border-b-2 border-[#1b1464] px-1 pb-2 text-[#1b1464]">
            General
          </button>
          <button type="button" className="pb-2 text-[#636366]">
            Modifications
          </button>
          <button type="button" className="pb-2 text-[#636366]">
            Video
          </button>
          <button type="button" className="pb-2 text-[#636366]">
            Docs
          </button>
        </div>
        {photos.length ? (
          <>
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#1b1464]">
              <span>Upload Progress</span>
              <span>
                {photos.length} / {MIN_PHOTOS} Photos Uploaded
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-[#e5e5ea]">
              <div className="h-full bg-[#1b1464]" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setSheet("actions")}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#e5e5ea]"
                >
                  <img
                    src={photo.previewUrl || ""}
                    alt={photo.name || `Vehicle photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {index === 0 ? (
                    <span className="absolute left-1 top-1 rounded bg-[#1b1464] px-1 text-[8px] font-bold text-white">
                      COVER
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSheet("add")}
              className="h-10 w-full rounded-lg bg-[#f4f5fc] text-[12px] font-semibold text-[#1b1464]"
            >
              + Add More Photos
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setSheet("add")}
              className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-[#c7c7cc] bg-[#fafafa] text-center"
            >
              <Camera className="mb-3 h-6 w-6 text-[#1b1464]" />
              <span className="text-[13px] font-semibold text-[#1c1c1e]">Tap to add photos</span>
              <span className="mt-1 text-[11px] text-[#636366]">Upload from your camera roll</span>
            </button>
            <div className="rounded-lg bg-[#f4f5fc] p-3 text-[12px] leading-relaxed text-[#4b4877]">
              Tips: Use a mix of exterior, interior, engine bay, wheels, and detail photos. Clear
              photos build buyer confidence.
            </div>
          </>
        )}
      </div>
      {sheet === "add" ? (
        <PhotoSheet title="Add Photos" onClose={() => setSheet(null)} onChoose={addPhotos} />
      ) : null}
      {sheet === "actions" ? (
        <PhotoSheet
          title="Photo Actions"
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
}: {
  title: string;
  onClose: () => void;
  onChoose: () => void;
  actions?: boolean;
}) {
  const choices = actions
    ? [
        [Star, "Set as Auction Cover Photo"],
        [Move, "Move"],
        [Replace, "Replace"],
        [Trash2, "Delete"],
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
