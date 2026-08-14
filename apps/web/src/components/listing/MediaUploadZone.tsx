"use client";

import * as React from "react";
import { GripVertical, Trash2, Upload, FileText, Film, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ListingMediaItem } from "./types";

export function createListingMediaItems(files: FileList | null): ListingMediaItem[] {
  if (!files) return [];
  return Array.from(files).map((file) => {
    const sourceKey = `${file.name}|${file.size}|${file.lastModified}`;
    return {
      id: sourceKey,
      sourceKey,
      name: file.name,
      previewUrl:
        file.type.startsWith("image/") || file.type.startsWith("video/")
          ? URL.createObjectURL(file)
          : undefined,
      progress: 100,
    };
  });
}

export interface MediaUploadZoneProps {
  title?: string;
  description?: string;
  accept?: string;
  items: ListingMediaItem[];
  onAdd: (items: ListingMediaItem[]) => void;
  onRemove: (id: string) => void;
  /** When provided, enables move-left / move-right reorder controls. */
  onReorder?: (fromIndex: number, toIndex: number) => void;
  /** Auction cover photo id — shows COVER badge on matching item. */
  coverItemId?: string | null;
  onSetCover?: (id: string) => void;
  variant?: "image" | "file" | "video";
  compact?: boolean;
  className?: string;
}

/**
 * Shared drag & drop media uploader used by Photos & Documents and Specs entries.
 * UI only — no upload pipeline.
 */
export function MediaUploadZone({
  title,
  description,
  accept = "image/*",
  items,
  onAdd,
  onRemove,
  onReorder,
  coverItemId,
  onSetCover,
  variant = "image",
  compact = false,
  className,
}: MediaUploadZoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  const handleFiles = (files: FileList | null) => {
    const next = createListingMediaItems(files);
    if (next.length) onAdd(next);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {(title || description) && (
        <div>
          {title ? <h4 className="text-sm font-semibold">{title}</h4> : null}
          {description ? (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          ) : null}
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-2xl border border-dashed text-center transition-colors",
          compact ? "px-4 py-6" : "px-6 py-10",
          dragging ? "border-primary bg-primary/5" : "bg-muted/20"
        )}
      >
        <div
          className={cn(
            "mx-auto mb-3 flex items-center justify-center rounded-xl bg-muted text-muted-foreground",
            compact ? "h-9 w-9" : "h-11 w-11"
          )}
        >
          {variant === "video" ? (
            <Film className="h-4 w-4" />
          ) : variant === "file" ? (
            <FileText className="h-4 w-4" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </div>
        <p className="text-sm font-medium">Drag & drop files here</p>
        <p className="text-xs text-muted-foreground mt-1">or browse from your computer</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          Browse
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {items.length > 0 ? (
        <div
          className={cn(
            "grid gap-3",
            compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          )}
        >
          {items.map((item, index) => {
            const isVideoPreview =
              variant === "video" ||
              /\.(mp4|webm|mov|m4v)$/i.test(item.name) ||
              item.previewUrl?.startsWith("blob:");
            const showVideo =
              Boolean(item.previewUrl) &&
              (variant === "video" || /\.(mp4|webm|mov|m4v)$/i.test(item.name));

            return (
              <div
                key={item.id}
                className="group relative rounded-xl border bg-card overflow-hidden"
              >
                {coverItemId === item.id || (!coverItemId && index === 0 && onSetCover) ? (
                  <span className="absolute left-2 top-2 z-10 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                    Cover
                  </span>
                ) : null}
                <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                  {item.previewUrl && showVideo ? (
                    <video
                      src={item.previewUrl}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                    />
                  ) : item.previewUrl && !showVideo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground px-3">
                      {variant === "video" || isVideoPreview ? (
                        <Film className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                      <span className="text-[11px] text-center line-clamp-2">{item.name}</span>
                    </div>
                  )}
                </div>
                {(item.progress ?? 100) < 100 ? (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <div className="w-2/3 space-y-1.5 px-2">
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary/70 rounded-full transition-all"
                          style={{ width: `${item.progress ?? 0}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-center text-muted-foreground">
                        Uploading… {Math.round(item.progress ?? 0)}%
                      </p>
                    </div>
                  </div>
                ) : null}
                <div className="px-2.5 py-2 space-y-1.5">
                  <p className="text-xs font-medium truncate">{item.name}</p>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary/70 rounded-full transition-all"
                      style={{ width: `${item.progress ?? 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    {onReorder ? (
                      <div className="inline-flex items-center gap-0.5">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => onReorder(index, index - 1)}
                          className="text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-30"
                          aria-label="Move earlier"
                        >
                          <GripVertical className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-[11px] text-muted-foreground">Reorder</span>
                        <button
                          type="button"
                          disabled={index >= items.length - 1}
                          onClick={() => onReorder(index, index + 1)}
                          className="text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-30 px-1"
                          aria-label="Move later"
                        >
                          →
                        </button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <GripVertical className="h-3.5 w-3.5" />
                        Reorder
                      </span>
                    )}
                    <div className="inline-flex items-center gap-2">
                      {onSetCover && coverItemId !== item.id ? (
                        <button
                          type="button"
                          onClick={() => onSetCover(item.id)}
                          className="text-[11px] text-muted-foreground hover:text-foreground"
                        >
                          Set cover
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
