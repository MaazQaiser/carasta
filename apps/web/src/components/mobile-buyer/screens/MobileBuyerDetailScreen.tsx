"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Heart, MapPin, Share2 } from "lucide-react";
import type { Auction } from "@carasta/types";
import { PublishedListingService } from "@/components/listing/services/published-listing-service";
import { mapAuctionToBuyerListing, type BuyerListingView } from "../map-vehicle-to-buyer";
import { useMobileBuyerActions } from "../MobileBuyerActions";
import { MobileBuyerShell } from "../MobileBuyerShell";
import { AuctionStatusCard } from "../AuctionStatusCard";
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
  ModifiedSections,
  RaceSections,
  RestoredSections,
  StockSections,
} from "../sections";
import { getBuyerListing } from "../demo-listings";
import type { BuyerListingType } from "../types";

function reserveProgressFor(listing: BuyerListingView, auction?: Auction | null) {
  if (listing.reserveMet || auction?.reserveMet) return 1;
  const reserve = listing.reservePrice ?? auction?.reservePrice;
  const bid = auction?.currentBid ?? listing.currentBid ?? 0;
  if (!reserve || reserve <= 0) return Math.min(0.55, Math.max(0.15, bid > 0 ? 0.45 : 0.2));
  return Math.max(0.05, Math.min(0.98, bid / reserve));
}

function ListingBody({
  listing,
  auction,
  galleryBase,
  sellerHref,
  onAuctionUpdate,
}: {
  listing: BuyerListingView;
  auction?: Auction | null;
  galleryBase: string;
  sellerHref: string;
  onAuctionUpdate?: (auction: Auction) => void;
}) {
  const router = useRouter();
  const { openPrimary, openSecondary, openContact, openActions, sheets } = useMobileBuyerActions(
    listing,
    auction,
    onAuctionUpdate
  );
  const [saved, setSaved] = React.useState(false);
  const isAuction = listing.saleMode === "auction" || listing.saleMode === "hybrid";
  const currentBid = auction?.currentBid ?? listing.currentBid ?? listing.askingPrice ?? 0;
  const highestBid = Math.max(
    currentBid,
    auction?.bids?.reduce((max, bid) => Math.max(max, bid.amount), 0) ?? 0
  );
  const reserveProgress = reserveProgressFor(listing, auction);

  const openGallery = (index: number) => {
    router.push(`${galleryBase}?i=${index}`);
  };

  const scrollToStatus = () => {
    document
      .getElementById("buyer-auction-status")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <MobileBuyerShell
      title="Carasta Listing"
      stickyPrimary={isAuction ? "Bid Now" : listing.primaryCta}
      stickySecondary={listing.secondaryCta}
      onPrimary={openPrimary}
      onSecondary={openSecondary}
      auctionSticky={
        isAuction
          ? {
              currentBid,
              endsAt: listing.auctionEndsAt ?? auction?.endTime,
              reserveProgress,
              onReservePress: scrollToStatus,
            }
          : null
      }
    >
      <div className="flex flex-col gap-6 px-5 pb-6 pt-4">
        <div className="relative">
          <GalleryHero images={listing.gallery} onOpen={openGallery} />
          <div className="absolute right-3 top-3 flex gap-2">
            <button
              type="button"
              aria-label="Save listing"
              onClick={() => setSaved((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#1b1464] shadow-sm"
            >
              <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
            </button>
            <button
              type="button"
              aria-label="Share listing"
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  void navigator.share({ title: listing.title, url: window.location.href });
                } else if (typeof navigator !== "undefined") {
                  void navigator.clipboard?.writeText(window.location.href);
                }
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#1b1464] shadow-sm"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isAuction ? (
          <div id="buyer-auction-status">
            <AuctionStatusCard
              currentBid={currentBid}
              highestBid={highestBid || currentBid}
              leadingBidder={
                listing.leadingBidderUsername ||
                auction?.leadingBidder?.username ||
                auction?.bids?.[0]?.bidder?.username
              }
              endsAt={listing.auctionEndsAt ?? auction?.endTime}
              bidCount={listing.bidCount ?? auction?.bidCount ?? 0}
              views={listing.views ?? auction?.vehicle.views ?? 0}
              watches={listing.watcherCount ?? auction?.watcherCount ?? 0}
              reserveProgress={reserveProgress}
              reserveMet={listing.reserveMet || auction?.reserveMet}
            />
          </div>
        ) : null}

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-[24px] font-extrabold leading-tight text-[#1c1c1e]">
                {listing.title}
              </h1>
              <p className="mt-1 text-[13px] text-[#636366]">{listing.subtitle}</p>
            </div>
            {!isAuction ? (
              <p className="shrink-0 text-[18px] font-extrabold text-[#1b1464]">
                {listing.priceLabel}
              </p>
            ) : null}
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

          <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#e5e5ea] bg-[#fafafa] p-3 text-[12px]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7b78a3]">
                Seller
              </p>
              <p className="mt-0.5 font-semibold text-[#1c1c1e]">{listing.seller.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7b78a3]">
                Mileage
              </p>
              <p className="mt-0.5 font-semibold text-[#1c1c1e]">{listing.mileageLabel}</p>
            </div>
          </div>
        </div>

        <Section title="Key Highlights">
          <SpecGrid items={listing.quickSpecs} />
        </Section>

        {listing.type === "stock" ? <StockSections listing={listing} /> : null}
        {listing.type === "classic" ? <ClassicSections listing={listing} /> : null}
        {listing.type === "modified" ? <ModifiedSections listing={listing} /> : null}
        {listing.type === "restored" ? <RestoredSections listing={listing} /> : null}
        {listing.type === "race" ? <RaceSections listing={listing} /> : null}

        <Section title="Documents" description="Records provided with this listing.">
          {listing.documents.length ? (
            <DocumentCards documents={listing.documents} />
          ) : (
            <p className="text-[13px] text-[#636366]">No documents uploaded.</p>
          )}
        </Section>

        <Section title="Seller Information">
          <SellerCard seller={listing.seller} onOpen={() => router.push(sellerHref)} />
          <button
            type="button"
            onClick={openContact}
            className="mt-3 h-11 w-full rounded-lg border border-[#1b1464] text-[13px] font-semibold text-[#1b1464]"
          >
            Contact Seller
          </button>
          <button
            type="button"
            onClick={openActions}
            className="mt-2 h-11 w-full rounded-lg border border-[#e5e5ea] text-[13px] font-semibold text-[#1c1c1e]"
          >
            More purchase options
          </button>
        </Section>
      </div>
      {sheets}
    </MobileBuyerShell>
  );
}

/** Demo type detail (design samples). */
export function MobileBuyerDetailScreen({ type }: { type: BuyerListingType }) {
  const demo = getBuyerListing(type);
  if (!demo) {
    return (
      <MobileBuyerShell title="Listing" hideSticky>
        <div className="px-6 py-10 text-[14px] text-[#636366]">Listing not found.</div>
      </MobileBuyerShell>
    );
  }

  const isAuctionDemo = type === "race" || type === "modified";
  const listing: BuyerListingView = {
    ...demo,
    vehicleId: demo.id,
    saleMode: isAuctionDemo ? "auction" : "fixed",
    vinVerified: true,
    listingStatusLabel: "Demo Listing",
    year: demo.quickSpecs.find((s) => s.label === "Year")?.value || "",
    make: "",
    model: "",
    trim: "",
    mileageLabel: demo.quickSpecs.find((s) => s.label === "Mileage")?.value || "—",
    askingPrice: Number(String(demo.priceLabel).replace(/[^0-9]/g, "")) || undefined,
    currentBid: isAuctionDemo
      ? Number(String(demo.priceLabel).replace(/[^0-9]/g, "")) || 12500
      : undefined,
    bidCount: isAuctionDemo ? 4 : undefined,
    auctionEndsAt: isAuctionDemo
      ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString()
      : undefined,
    views: isAuctionDemo ? 318 : undefined,
    watcherCount: isAuctionDemo ? 35 : undefined,
    leadingBidderUsername: isAuctionDemo ? "hassan3009" : undefined,
    reservePrice: isAuctionDemo ? 18000 : undefined,
    reserveMet: false,
    sellerResponseTime: "Usually within a day",
    sellerListingsSold: demo.seller.listings,
  };

  return (
    <ListingBody
      listing={listing}
      galleryBase={`/m/listings/${type}/gallery`}
      sellerHref={`/m/listings/${type}/seller`}
    />
  );
}

/** Live published listing detail by vehicle/auction id. */
export function MobileBuyerLiveDetailScreen({ id }: { id: string }) {
  const [listing, setListing] = React.useState<BuyerListingView | null | undefined>(undefined);
  const [auction, setAuction] = React.useState<Auction | null>(null);

  React.useEffect(() => {
    const record = PublishedListingService.resolve(id);
    if (!record) {
      setListing(null);
      setAuction(null);
      return;
    }
    setAuction(record.auction);
    setListing(mapAuctionToBuyerListing(record.auction));
  }, [id]);

  if (listing === undefined) {
    return (
      <MobileBuyerShell title="Listing" hideSticky>
        <div className="px-6 py-10 text-[14px] text-[#636366]">Loading listing…</div>
      </MobileBuyerShell>
    );
  }

  if (!listing) {
    return (
      <MobileBuyerShell title="Listing" hideSticky>
        <div className="px-6 py-10 text-[14px] text-[#636366]">
          Listing not found in this browser session. Publish a listing first, then open it here.
        </div>
      </MobileBuyerShell>
    );
  }

  return (
    <ListingBody
      listing={listing}
      auction={auction}
      galleryBase={`/m/listings/v/${listing.vehicleId}/gallery`}
      sellerHref={`/m/listings/v/${listing.vehicleId}/seller`}
      onAuctionUpdate={(next) => {
        setAuction(next);
        setListing(mapAuctionToBuyerListing(next));
      }}
    />
  );
}
