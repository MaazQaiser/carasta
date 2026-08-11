"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Play, X, ZoomIn, ZoomOut } from "lucide-react";
import { PublishedListingService } from "@/components/listing/services/published-listing-service";
import { mapAuctionToBuyerListing } from "../map-vehicle-to-buyer";
import { getBuyerListing } from "../demo-listings";
import type { BuyerListingType } from "../types";
import type { BuyerMediaItem } from "../types";

function GalleryView({
  images,
  closeHref,
}: {
  images: BuyerMediaItem[];
  closeHref: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = Number(searchParams.get("i") || "0");
  const [index, setIndex] = React.useState(
    Number.isFinite(initial) ? Math.max(0, initial) : 0
  );
  const [zoom, setZoom] = React.useState(1);
  const touchStartX = React.useRef<number | null>(null);
  const current = images[Math.min(index, Math.max(images.length - 1, 0))];

  React.useEffect(() => {
    setZoom(1);
  }, [index]);

  if (!current) {
    return (
      <div className="ml-phone-frame bg-black text-white">
        <div className="flex h-full items-center justify-center text-[14px]">No media</div>
      </div>
    );
  }

  const go = (next: number) => {
    setIndex((prev) => {
      const value = prev + next;
      if (value < 0) return images.length - 1;
      if (value >= images.length) return 0;
      return value;
    });
  };

  return (
    <div className="ml-phone-frame bg-black text-white">
      <div className="ml-shell bg-black">
        <header className="flex h-12 shrink-0 items-center justify-between px-4">
          <button
            type="button"
            aria-label="Close gallery"
            onClick={() => router.push(closeHref)}
            className="flex h-9 w-9 items-center justify-center rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-[13px] font-semibold">
            {index + 1} / {images.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => setZoom((value) => Math.max(1, value - 0.5))}
              className="flex h-9 w-9 items-center justify-center rounded-lg"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => setZoom((value) => Math.min(3, value + 0.5))}
              className="flex h-9 w-9 items-center justify-center rounded-lg"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div
          className="relative flex flex-1 items-center justify-center overflow-hidden"
          onTouchStart={(e) => {
            touchStartX.current = e.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchStartX.current;
            const end = e.changedTouches[0]?.clientX;
            if (start == null || end == null) return;
            const delta = end - start;
            if (Math.abs(delta) < 40) return;
            go(delta < 0 ? 1 : -1);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={current.alt}
            className="max-h-full max-w-full object-contain transition-transform"
            style={{ transform: `scale(${zoom})` }}
          />
          {current.kind === "video" ? (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#1b1464]">
                <Play className="h-6 w-6 fill-current" />
              </span>
            </span>
          ) : null}
        </div>

        <div className="shrink-0 overflow-x-auto px-3 pb-5 pt-3">
          <div className="flex gap-2">
            {images.map((image, i) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                  i === index ? "border-white" : "border-transparent opacity-70"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileBuyerGalleryScreen({ type }: { type: BuyerListingType }) {
  const listing = getBuyerListing(type);
  return (
    <GalleryView images={listing?.gallery ?? []} closeHref={`/m/listings/${type}`} />
  );
}

export function MobileBuyerLiveGalleryScreen({ id }: { id: string }) {
  const [images, setImages] = React.useState<BuyerMediaItem[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const record = PublishedListingService.resolve(id);
    if (record) {
      setImages(mapAuctionToBuyerListing(record.auction).gallery);
    }
    setReady(true);
  }, [id]);

  if (!ready) {
    return (
      <div className="ml-phone-frame bg-black text-white">
        <div className="flex h-full items-center justify-center text-[14px]">Loading…</div>
      </div>
    );
  }

  return <GalleryView images={images} closeHref={`/m/listings/v/${id}`} />;
}
