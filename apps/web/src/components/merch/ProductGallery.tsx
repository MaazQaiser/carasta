"use client";

import * as React from "react";
import { Expand, Film, ZoomIn, ZoomOut } from "lucide-react";
import type { Image } from "@carasta/types";
import type { MerchMedia } from "@carasta/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type GalleryItem =
  | { id: string; type: "image"; url: string; alt: string }
  | { id: string; type: "video"; url: string; alt: string; thumbnailUrl?: string };

interface ProductGalleryProps {
  images: Image[];
  videos?: MerchMedia[];
  productName: string;
}

export function toGalleryItems(
  images: Image[],
  videos: MerchMedia[] = [],
  productName: string
): GalleryItem[] {
  const imgs: GalleryItem[] = images.map((img) => ({
    id: img.id,
    type: "image",
    url: img.url,
    alt: img.alt || productName,
  }));
  const vids: GalleryItem[] = videos
    .filter((v) => v.type === "video")
    .map((v) => ({
      id: v.id,
      type: "video" as const,
      url: v.url,
      alt: v.alt || productName,
      thumbnailUrl: v.thumbnailUrl,
    }));
  return [...imgs, ...vids];
}

export function ProductGallery({ images, videos = [], productName }: ProductGalleryProps) {
  const items = React.useMemo(
    () => toGalleryItems(images, videos, productName),
    [images, videos, productName]
  );
  const [active, setActive] = React.useState(0);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);

  const current = items[active] ?? items[0];

  React.useEffect(() => {
    if (!fullscreen) setZoom(1);
  }, [fullscreen, active]);

  if (!current) {
    return <div className="aspect-square rounded-2xl border bg-muted" />;
  }

  return (
    <>
      <div>
        <div className="relative aspect-square rounded-2xl border bg-muted overflow-hidden group">
          {current.type === "video" ? (
            <video
              key={current.id}
              src={current.url}
              controls
              className="h-full w-full object-cover"
              poster={current.thumbnailUrl}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.url}
              alt={current.alt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            {current.type === "image" ? (
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="h-9 w-9 rounded-full bg-black/45 text-white flex items-center justify-center hover:bg-black/60"
                aria-label="Open fullscreen viewer"
              >
                <Expand className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          {current.type === "video" ? (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/55 text-white text-[11px] px-2.5 py-1">
              <Film className="h-3 w-3" /> Video
            </span>
          ) : null}
        </div>

        {items.length > 1 ? (
          <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "relative h-16 w-16 rounded-xl overflow-hidden border shrink-0",
                  active === i ? "border-primary ring-2 ring-primary/30" : "border-border"
                )}
              >
                {item.type === "video" ? (
                  <>
                    {item.thumbnailUrl || images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnailUrl || images[0]!.url}
                        alt={item.alt}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center">
                        <Film className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <Film className="h-3.5 w-3.5 text-white" />
                    </span>
                  </>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
                )}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden sm:rounded-2xl border-0 bg-black [&>button]:text-white [&>button]:right-3 [&>button]:top-3">
          <DialogTitle className="sr-only">{productName} gallery</DialogTitle>
          <div className="relative flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 pr-14 text-white">
              <p className="text-sm font-medium truncate pr-4">{productName}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center"
                  onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center"
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="relative h-[70vh] overflow-auto flex items-center justify-center bg-black">
              {current.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.url}
                  alt={current.alt}
                  className="max-h-full object-contain transition-transform origin-center"
                  style={{ transform: `scale(${zoom})` }}
                />
              ) : (
                <video src={current.url} controls className="max-h-full max-w-full" />
              )}
            </div>
            {items.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
                {items.map((item, i) => (
                  <button
                    key={`fs-${item.id}`}
                    type="button"
                    onClick={() => setActive(i)}
                    className={cn(
                      "h-14 w-14 rounded-lg overflow-hidden border shrink-0",
                      active === i ? "border-white" : "border-white/30"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        item.type === "image"
                          ? item.url
                          : item.thumbnailUrl || images[0]?.url || ""
                      }
                      alt={item.alt}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
