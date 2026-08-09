"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { getBuyerListing } from "../demo-listings";
import { MobileBuyerShell } from "../MobileBuyerShell";
import {
  Badge,
  DocumentCards,
  GalleryHero,
  Section,
  SellerCard,
  SpecGrid,
} from "../primitives";
import {
  ClassicSections,
  RaceSections,
  RestoredSections,
  StockSections,
} from "../sections";
import type { BuyerListingType } from "../types";

export function MobileBuyerDetailScreen({ type }: { type: BuyerListingType }) {
  const router = useRouter();
  const listing = getBuyerListing(type);

  if (!listing) {
    return (
      <MobileBuyerShell title="Listing" hideSticky>
        <div className="px-6 py-10 text-[14px] text-[#636366]">Listing not found.</div>
      </MobileBuyerShell>
    );
  }

  const openGallery = (index: number) => {
    router.push(`/m/listings/${type}/gallery?i=${index}`);
  };

  return (
    <MobileBuyerShell
      title="Carasta Listing"
      stickyPrimary={listing.primaryCta}
      stickySecondary={listing.secondaryCta}
      onPrimary={() => undefined}
      onSecondary={() => undefined}
    >
      <div className="flex flex-col gap-6 px-5 pb-6 pt-4">
        <GalleryHero images={listing.gallery} onOpen={openGallery} />

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-[24px] font-extrabold leading-tight text-[#1c1c1e]">
                {listing.title}
              </h1>
              <p className="mt-1 text-[13px] text-[#636366]">{listing.subtitle}</p>
            </div>
            <p className="shrink-0 text-[20px] font-extrabold text-[#1b1464]">
              {listing.priceLabel}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-7 items-center rounded-full bg-[#1b1464] px-2.5 text-[11px] font-semibold text-white">
              {listing.sellerBadge}
            </span>
            <span className="inline-flex items-center gap-1 text-[12px] text-[#636366]">
              <MapPin className="h-3.5 w-3.5" />
              {listing.location}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {listing.badges.map((badge) => (
              <Badge key={badge.label} {...badge} />
            ))}
          </div>
        </div>

        <Section title="Key Highlights">
          <SpecGrid items={listing.quickSpecs} />
        </Section>

        {listing.type === "stock" ? <StockSections listing={listing} /> : null}
        {listing.type === "classic" ? <ClassicSections listing={listing} /> : null}
        {listing.type === "restored" ? <RestoredSections listing={listing} /> : null}
        {listing.type === "race" ? <RaceSections listing={listing} /> : null}

        <Section
          title={listing.type === "classic" ? "Supporting Documents" : "Documents"}
          description="Downloadable records provided with this listing."
        >
          <DocumentCards documents={listing.documents} />
        </Section>

        <Section title="Seller Information">
          <SellerCard seller={listing.seller} />
        </Section>
      </div>
    </MobileBuyerShell>
  );
}
