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
import { MobileShareListingSheet } from "../MobileShareListingSheet";
import { useAuth } from "@/lib/context/auth-context";
import { useListingApprovalWatcher } from "@/components/listing/services/use-listing-approval-watcher";
import type { PublishedListingRecord } from "@/components/listing/services/published-listing-service";

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
  shareEnabled = true,
  autoOpenShare = false,
  pendingReview = false,
  approvalNotice = null,
  previewMode = false,
  onSharePromptHandled,
}: {
  listing: BuyerListingView;
  auction?: Auction | null;
  galleryBase: string;
  sellerHref: string;
  onAuctionUpdate?: (auction: Auction) => void;
  /** Share control on gallery — live auctions only. */
  shareEnabled?: boolean;
  /** One-time post-approval share menu for the seller. */
  autoOpenShare?: boolean;
  pendingReview?: boolean;
  approvalNotice?: string | null;
  /** Seller draft preview — same layout, bidding/Buy Now disabled. */
  previewMode?: boolean;
  onSharePromptHandled?: () => void;
}) {
  const router = useRouter();
  const { openPrimary, openSecondary, openContact, openActions, sheets } = useMobileBuyerActions(
    listing,
    auction,
    onAuctionUpdate
  );
  const [saved, setSaved] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const sharePromptHandled = React.useRef(false);
  const isAuction = listing.saleMode === "auction" || listing.saleMode === "hybrid";
  const currentBid = auction?.currentBid ?? listing.currentBid ?? listing.askingPrice ?? 0;
  const highestBid = Math.max(
    currentBid,
    auction?.bids?.reduce((max, bid) => Math.max(max, bid.amount), 0) ?? 0
  );
  const reserveProgress = reserveProgressFor(listing, auction);
  const actionsDisabled = pendingReview || previewMode;

  React.useEffect(() => {
    if (!autoOpenShare || sharePromptHandled.current || previewMode) return;
    sharePromptHandled.current = true;
    setShareOpen(true);
  }, [autoOpenShare, previewMode]);

  const closeShare = () => {
    setShareOpen(false);
    onSharePromptHandled?.();
  };

  const openGallery = (index: number) => {
    if (previewMode) return;
    router.push(`${galleryBase}?i=${index}`);
  };

  const scrollToStatus = () => {
    document
      .getElementById("buyer-auction-status")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const shell = (
    <MobileBuyerShell
      title={previewMode ? "Buyer View Preview" : "Carasta Listing"}
      stickyPrimary={actionsDisabled ? undefined : isAuction ? "Bid Now" : listing.primaryCta}
      stickySecondary={actionsDisabled ? undefined : listing.secondaryCta}
      onPrimary={actionsDisabled ? undefined : openPrimary}
      onSecondary={actionsDisabled ? undefined : openSecondary}
      hideSticky={actionsDisabled}
      auctionSticky={
        !actionsDisabled && isAuction
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
        {approvalNotice ? (
          <div className="rounded-xl border border-[#b7e4c7] bg-[#edf9f1] px-3 py-2 text-[12px] text-[#1b7a3d]">
            {approvalNotice}
          </div>
        ) : null}
        {pendingReview ? (
          <div className="rounded-xl border border-[#f5d78e] bg-[#fff8e8] px-3 py-3 text-[13px] leading-relaxed text-[#8b6500]">
            This listing is pending Carasta review. It is not live for buyers yet. We&apos;ll notify
            you in the app and by email once it&apos;s approved.
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
            {!isAuction && !pendingReview ? (
              <p className="shrink-0 text-[18px] font-extrabold text-[#1b1464]">
                {listing.priceLabel}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-7 items-center rounded-full bg-[#1b1464] px-2.5 text-[11px] font-semibold text-white">
              {previewMode ? "Preview" : pendingReview ? "Pending review" : listing.sellerBadge}
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
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7b78a3]">
                Year
              </p>
              <p className="mt-0.5 font-semibold text-[#1c1c1e]">{listing.year || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7b78a3]">
                Sale type
              </p>
              <p className="mt-0.5 font-semibold text-[#1c1c1e]">
                {isAuction ? "Auction" : "Fixed price"}
              </p>
            </div>
          </div>
        </div>

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
            {shareEnabled ? (
              <button
                type="button"
                aria-label="Share listing"
                onClick={() => setShareOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#1b1464] shadow-sm"
              >
                <Share2 className="h-4 w-4" />
              </button>
            ) : null}
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
        ) : (
          <Section title="Purchase Summary" collapsible={false}>
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#e5e5ea] bg-[#fafafa] p-3 text-[12px]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7b78a3]">
                  Asking price
                </p>
                <p className="mt-0.5 text-[15px] font-extrabold text-[#1b1464]">
                  {listing.priceLabel}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7b78a3]">
                  Status
                </p>
                <p className="mt-0.5 font-semibold text-[#1c1c1e]">{listing.listingStatusLabel}</p>
              </div>
            </div>
          </Section>
        )}

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

        <Section title="Seller Information" description="Who is selling this vehicle.">
          <SellerCard seller={listing.seller} onOpen={() => router.push(sellerHref)} />
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-[#e5e5ea] bg-[#fafafa] p-3 text-[12px]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7b78a3]">
                Location
              </p>
              <p className="mt-0.5 font-semibold text-[#1c1c1e]">{listing.location}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7b78a3]">
                Member since
              </p>
              <p className="mt-0.5 font-semibold text-[#1c1c1e]">
                {listing.sellerMemberSince || listing.seller.memberSince || "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7b78a3]">
                Response time
              </p>
              <p className="mt-0.5 font-semibold text-[#1c1c1e]">
                {listing.sellerResponseTime || listing.seller.responseTime || "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7b78a3]">
                Listings sold
              </p>
              <p className="mt-0.5 font-semibold text-[#1c1c1e]">
                {listing.sellerListingsSold ?? listing.seller.listingsSold ?? listing.seller.listings}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={actionsDisabled}
            onClick={openContact}
            className="mt-3 h-11 w-full rounded-lg border border-[#1b1464] text-[13px] font-semibold text-[#1b1464] disabled:opacity-50"
          >
            Contact Seller
          </button>
          <button
            type="button"
            disabled={actionsDisabled}
            onClick={openActions}
            className="mt-2 h-11 w-full rounded-lg border border-[#e5e5ea] text-[13px] font-semibold text-[#1c1c1e] disabled:opacity-50"
          >
            More purchase options
          </button>
          <button
            type="button"
            disabled={actionsDisabled}
            onClick={openPrimary}
            className="mt-2 h-11 w-full rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white disabled:opacity-50"
          >
            {isAuction ? "Bid Now" : listing.primaryCta}
          </button>
          {!isAuction ? (
            <button
              type="button"
              disabled={actionsDisabled}
              onClick={openSecondary}
              className="mt-2 h-11 w-full rounded-lg border border-[#1b1464] text-[13px] font-semibold text-[#1b1464] disabled:opacity-50"
            >
              {listing.secondaryCta}
            </button>
          ) : null}
        </Section>
      </div>
      {sheets}
      <MobileShareListingSheet
        open={shareOpen}
        onClose={closeShare}
        vehicleLabel={listing.title}
      />
    </MobileBuyerShell>
  );

  if (previewMode) {
    // Avoid nesting another phone frame — listing chrome already wraps this step.
    const children = React.Children.toArray(
      (shell as React.ReactElement<{ children?: React.ReactNode }>).props.children
    );
    return <>{children}</>;
  }

  return shell;
}

/** Exported for seller Buyer View Preview (draft → buyer layout). */
export function BuyerListingBody(
  props: React.ComponentProps<typeof ListingBody>
) {
  return <ListingBody {...props} />;
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
  const { user } = useAuth();
  const [listing, setListing] = React.useState<BuyerListingView | null | undefined>(undefined);
  const [auction, setAuction] = React.useState<Auction | null>(null);
  const [record, setRecord] = React.useState<PublishedListingRecord | null>(null);
  const [approvalNotice, setApprovalNotice] = React.useState<string | null>(null);

  const refresh = React.useCallback(() => {
    const next = PublishedListingService.resolve(id);
    if (!next) {
      setListing(null);
      setAuction(null);
      setRecord(null);
      return;
    }
    setRecord(next);
    setAuction(next.auction);
    setListing(mapAuctionToBuyerListing(next.auction));
  }, [id]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  useListingApprovalWatcher({
    onApproved: (approved) => {
      const match = approved.find(
        (r) => r.auction.id === id || r.auction.vehicle.id === id
      );
      if (match) {
        setApprovalNotice(
          `Approved — we also emailed you. Open this auction anytime from your profile Auctions/Listings tab.`
        );
        refresh();
      } else if (approved.length) {
        refresh();
      }
    },
  });

  if (listing === undefined) {
    return (
      <MobileBuyerShell title="Listing" hideSticky>
        <div className="px-6 py-10 text-[14px] text-[#636366]">Loading listing…</div>
      </MobileBuyerShell>
    );
  }

  if (!listing || !record) {
    return (
      <MobileBuyerShell title="Listing" hideSticky>
        <div className="px-6 py-10 text-[14px] text-[#636366]">
          Listing not found in this browser session. Publish a listing first, then open it here.
        </div>
      </MobileBuyerShell>
    );
  }

  const pendingReview = (record.moderationStatus ?? "approved") === "pending";
  const isSeller =
    Boolean(user?.id) &&
    (user!.id === record.sellerId || user!.id === record.auction.vehicle.seller.id);
  const shareEnabled = !pendingReview && auction?.status === "live";
  const autoOpenShare = Boolean(
    isSeller && !pendingReview && record.sharePromptPending && shareEnabled
  );

  return (
    <ListingBody
      listing={listing}
      auction={auction}
      galleryBase={`/m/listings/v/${listing.vehicleId}/gallery`}
      sellerHref={`/m/listings/v/${listing.vehicleId}/seller`}
      shareEnabled={shareEnabled}
      autoOpenShare={autoOpenShare}
      pendingReview={pendingReview}
      approvalNotice={approvalNotice}
      onSharePromptHandled={() => {
        PublishedListingService.clearSharePrompt(record.auction.id);
        setRecord((prev) => (prev ? { ...prev, sharePromptPending: false } : prev));
      }}
      onAuctionUpdate={(next) => {
        setAuction(next);
        setListing(mapAuctionToBuyerListing(next));
      }}
    />
  );
}
