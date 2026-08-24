"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, MessageSquare, Phone, Video } from "lucide-react";
import type { Auction, Bid, User } from "@carasta/types";
import { auctionService, BidError } from "@carasta/mock-data/services";
import { placePublishedBid } from "@/lib/marketplace-listings";
import { PublishedListingService } from "@/components/listing/services/published-listing-service";
import { useAuth } from "@/lib/context/auth-context";
import { formatPrice } from "@/lib/utils";
import { MobileBuyerSheet } from "./MobileBuyerSheet";
import type { BuyerListingView } from "./map-vehicle-to-buyer";

type SheetKind =
  | "actions"
  | "bid"
  | "bid-success"
  | "offer"
  | "offer-success"
  | "contact"
  | "buy-success"
  | null;

const OFFER_STORAGE_KEY = "carasta.buyer.offers.v1";

function saveOffer(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(OFFER_STORAGE_KEY);
    const list = raw ? (JSON.parse(raw) as unknown[]) : [];
    const next = Array.isArray(list) ? [payload, ...list] : [payload];
    window.localStorage.setItem(OFFER_STORAGE_KEY, JSON.stringify(next.slice(0, 50)));
  } catch {
    // ignore
  }
}

function countdownLabel(endsAt?: string) {
  if (!endsAt) return "—";
  const ms = new Date(endsAt).getTime() - Date.now();
  if (ms <= 0) return "Ended";
  const hours = Math.floor(ms / 3_600_000);
  const mins = Math.floor((ms % 3_600_000) / 60_000);
  if (hours > 48) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  return `${hours}h ${mins}m`;
}

export function useMobileBuyerActions(
  listing: BuyerListingView,
  auction: Auction | null | undefined,
  onAuctionUpdate?: (auction: Auction) => void
) {
  const { user, isAuthenticated } = useAuth();
  const [sheet, setSheet] = React.useState<SheetKind>(null);
  const [bidAmount, setBidAmount] = React.useState("");
  const [autoBid, setAutoBid] = React.useState(false);
  const [offerAmount, setOfferAmount] = React.useState("");
  const [offerNotes, setOfferNotes] = React.useState("");
  const [financing, setFinancing] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [lastBid, setLastBid] = React.useState<Bid | null>(null);
  const [submittedOffer, setSubmittedOffer] = React.useState<number | null>(null);

  const currentBid = auction?.currentBid ?? listing.currentBid ?? listing.askingPrice ?? 0;
  const minBid =
    (auction?.minimumBidIncrement ?? Math.max(100, Math.round(currentBid * 0.02))) + currentBid;
  const isAuction = listing.saleMode === "auction" || listing.saleMode === "hybrid";

  const taxes = Math.round((listing.askingPrice ?? currentBid) * 0.08);
  const fees = 499;
  const shipping = 850;
  const total = (listing.askingPrice ?? currentBid) + taxes + fees + shipping;

  const openPrimary = React.useCallback(() => {
    setError("");
    if (isAuction) {
      setBidAmount(String(minBid));
      setSheet("bid");
      return;
    }
    setSheet("actions");
  }, [isAuction, minBid]);

  const openSecondary = React.useCallback(() => {
    setError("");
    setOfferAmount(String(listing.askingPrice ?? currentBid));
    setSheet("offer");
  }, [currentBid, listing.askingPrice]);

  const openContact = React.useCallback(() => setSheet("contact"), []);
  const openActions = React.useCallback(() => setSheet("actions"), []);

  const placeBid = async () => {
    if (!isAuthenticated) {
      setError("Sign in to place a bid.");
      return;
    }
    const amount = Number(bidAmount);
    if (!Number.isFinite(amount) || amount < minBid) {
      setError(`Minimum bid is ${formatPrice(minBid)}.`);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const auctionId = auction?.id || listing.auctionId;
      if (!auctionId) throw new Error("Auction not available.");
      let bid: Bid;
      let nextAuction: Auction | undefined;
      try {
        bid = await auctionService.placeBid(auctionId, amount, user as User);
      } catch (err) {
        const published = PublishedListingService.resolve(auctionId);
        if (!published) throw err;
        const placed = placePublishedBid(auctionId, amount, user as User | undefined);
        bid = placed.bid;
        nextAuction = placed.auction;
      }
      setLastBid(bid);
      if (nextAuction) onAuctionUpdate?.(nextAuction);
      setSheet("bid-success");
    } catch (err) {
      setError(
        err instanceof BidError || err instanceof Error ? err.message : "Unable to place bid."
      );
    } finally {
      setBusy(false);
    }
  };

  const submitOffer = () => {
    const amount = Number(offerAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid offer amount.");
      return;
    }
    saveOffer({
      vehicleId: listing.vehicleId,
      auctionId: listing.auctionId,
      amount,
      notes: offerNotes,
      financing,
      at: new Date().toISOString(),
    });
    setSubmittedOffer(amount);
    setSheet("offer-success");
  };

  const sheets = (
    <>
      <MobileBuyerSheet
        open={sheet === "actions"}
        title={isAuction ? "Auction Actions" : "Purchase Options"}
        onClose={() => setSheet(null)}
        footer={
          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => {
                if (isAuction) {
                  setBidAmount(String(minBid));
                  setSheet("bid");
                } else {
                  setSheet("buy-success");
                }
              }}
              className="h-11 rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
            >
              {isAuction ? "Place Bid" : "Buy Now"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOfferAmount(String(listing.askingPrice ?? currentBid));
                setSheet("offer");
              }}
              className="h-11 rounded-lg border border-[#1b1464] text-[13px] font-semibold text-[#1b1464]"
            >
              Make an Offer
            </button>
            <button
              type="button"
              onClick={() => setSheet("contact")}
              className="h-11 rounded-lg border border-[#e5e5ea] text-[13px] font-semibold text-[#1c1c1e]"
            >
              Contact Seller
            </button>
          </div>
        }
      >
        {isAuction ? (
          <div className="space-y-3">
            <Row label="Current highest bid" value={formatPrice(currentBid)} />
            <Row
              label="Reserve"
              value={listing.reserveMet || auction?.reserveMet ? "Met" : "Not met"}
            />
            <Row label="Bids" value={String(listing.bidCount ?? auction?.bidCount ?? 0)} />
            <Row label="Ends in" value={countdownLabel(listing.auctionEndsAt)} />
          </div>
        ) : (
          <div className="space-y-3">
            <Row label="Vehicle price" value={formatPrice(listing.askingPrice ?? 0)} />
            <Row label="Est. taxes" value={formatPrice(taxes)} />
            <Row label="Est. fees" value={formatPrice(fees)} />
            <Row label="Est. shipping" value={formatPrice(shipping)} />
            <Row label="Total estimated" value={formatPrice(total)} strong />
            <div className="rounded-xl bg-[#f4f5fc] px-3 py-3 text-[12px] text-[#1b1464]">
              Schedule inspection · Request vehicle history · Financing options
            </div>
          </div>
        )}
      </MobileBuyerSheet>

      <MobileBuyerSheet
        open={sheet === "bid"}
        title="Place Bid"
        onClose={() => setSheet(null)}
        footer={
          <button
            type="button"
            disabled={busy}
            onClick={placeBid}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white disabled:opacity-70"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Confirm Bid
          </button>
        }
      >
        <div className="space-y-4">
          <Row label="Current highest bid" value={formatPrice(currentBid)} />
          <Row label="Minimum next bid" value={formatPrice(minBid)} />
          <Row label="Auction ends" value={countdownLabel(listing.auctionEndsAt)} />
          <label className="block space-y-1.5">
            <span className="text-[12px] font-semibold text-[#636366]">Your bid amount</span>
            <input
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value.replace(/[^\d]/g, ""))}
              inputMode="numeric"
              className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[14px] outline-none focus:border-[#1b1464]"
            />
          </label>
          <label className="flex items-center gap-2 text-[13px] text-[#1c1c1e]">
            <input
              type="checkbox"
              checked={autoBid}
              onChange={(e) => setAutoBid(e.target.checked)}
              className="h-4 w-4 accent-[#1b1464]"
            />
            Enable auto bid up to this amount
          </label>
          {error ? <p className="text-[12px] font-medium text-[#b42318]">{error}</p> : null}
        </div>
      </MobileBuyerSheet>

      <MobileBuyerSheet
        open={sheet === "bid-success"}
        title="Bid Submitted"
        onClose={() => setSheet(null)}
        footer={
          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => {
                setBidAmount(String(minBid + (auction?.minimumBidIncrement ?? 100)));
                setSheet("bid");
              }}
              className="h-11 rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
            >
              Increase Bid
            </button>
            <button
              type="button"
              onClick={() => setSheet(null)}
              className="h-11 rounded-lg border border-[#e5e5ea] text-[13px] font-semibold text-[#1c1c1e]"
            >
              Close
            </button>
          </div>
        }
      >
        <SuccessHeader title="Your bid is in" />
        <div className="mt-4 space-y-3">
          <Row label="Your bid" value={formatPrice(lastBid?.amount ?? Number(bidAmount))} strong />
          <Row label="Current highest bid" value={formatPrice(currentBid)} />
          <Row label="Countdown" value={countdownLabel(listing.auctionEndsAt)} />
          <Row label="Auto bid" value={autoBid ? "Enabled" : "Off"} />
        </div>
      </MobileBuyerSheet>

      <MobileBuyerSheet
        open={sheet === "offer"}
        title="Make an Offer"
        onClose={() => setSheet(null)}
        footer={
          <button
            type="button"
            onClick={submitOffer}
            className="h-11 w-full rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
          >
            Submit Offer
          </button>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-[#e5e5ea] bg-[#fafafa] px-3 py-3">
            <p className="text-[14px] font-bold text-[#1c1c1e]">{listing.title}</p>
            <p className="mt-1 text-[12px] text-[#636366]">Asking {listing.priceLabel}</p>
          </div>
          <label className="block space-y-1.5">
            <span className="text-[12px] font-semibold text-[#636366]">Offer amount</span>
            <input
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value.replace(/[^\d]/g, ""))}
              inputMode="numeric"
              className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[14px] outline-none focus:border-[#1b1464]"
            />
          </label>
          <label className="flex items-center gap-2 text-[13px] text-[#1c1c1e]">
            <input
              type="checkbox"
              checked={financing}
              onChange={(e) => setFinancing(e.target.checked)}
              className="h-4 w-4 accent-[#1b1464]"
            />
            Financing required
          </label>
          <label className="block space-y-1.5">
            <span className="text-[12px] font-semibold text-[#636366]">Additional notes</span>
            <textarea
              value={offerNotes}
              onChange={(e) => setOfferNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[#e5e5ea] px-3 py-2 text-[13px] outline-none focus:border-[#1b1464]"
              placeholder="Deposit timing, inspection requests, contingencies…"
            />
          </label>
          {error ? <p className="text-[12px] font-medium text-[#b42318]">{error}</p> : null}
        </div>
      </MobileBuyerSheet>

      <MobileBuyerSheet
        open={sheet === "offer-success"}
        title="Offer Submitted"
        onClose={() => setSheet(null)}
        footer={
          <div className="grid gap-2">
            <Link
              href="/auctions"
              className="flex h-11 items-center justify-center rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
            >
              Continue Browsing
            </Link>
            <button
              type="button"
              onClick={() => setSheet(null)}
              className="h-11 rounded-lg border border-[#e5e5ea] text-[13px] font-semibold text-[#1c1c1e]"
            >
              Done
            </button>
          </div>
        }
      >
        <SuccessHeader title="Seller notified" />
        <div className="mt-4 space-y-3">
          <Row label="Offer amount" value={formatPrice(submittedOffer ?? 0)} strong />
          <Row label="Expected response" value={listing.sellerResponseTime || "Within 24 hours"} />
        </div>
      </MobileBuyerSheet>

      <MobileBuyerSheet
        open={sheet === "buy-success"}
        title="Purchase Intent"
        onClose={() => setSheet(null)}
        footer={
          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => setSheet("contact")}
              className="h-11 rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
            >
              Contact Seller
            </button>
            <button
              type="button"
              onClick={() => setSheet(null)}
              className="h-11 rounded-lg border border-[#e5e5ea] text-[13px] font-semibold text-[#1c1c1e]"
            >
              Close
            </button>
          </div>
        }
      >
        <SuccessHeader title="Ready to buy" />
        <div className="mt-4 space-y-3">
          <Row label="Vehicle price" value={formatPrice(listing.askingPrice ?? 0)} strong />
          <Row label="Est. total" value={formatPrice(total)} />
          <p className="text-[12px] leading-relaxed text-[#636366]">
            Contact the seller to finalize purchase, inspection, and payment details.
          </p>
        </div>
      </MobileBuyerSheet>

      <MobileBuyerSheet
        open={sheet === "contact"}
        title="Contact Seller"
        onClose={() => setSheet(null)}
      >
        <div className="space-y-2">
          {[
            {
              icon: MessageSquare,
              label: "Message Seller",
              href: listing.sellerId ? `/messages?with=${listing.sellerId}` : "/messages",
            },
            {
              icon: Phone,
              label: "Call / Schedule Viewing",
              href: listing.sellerId ? `/messages?with=${listing.sellerId}` : "/messages",
            },
            {
              icon: Video,
              label: "Request Walkaround Video",
              href: listing.sellerId ? `/messages?with=${listing.sellerId}` : "/messages",
            },
          ].map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex h-12 items-center gap-3 rounded-xl border border-[#e5e5ea] px-3 text-[13px] font-semibold text-[#1c1c1e]"
            >
              <Icon className="h-4 w-4 text-[#1b1464]" />
              {label}
            </Link>
          ))}
          <p className="pt-2 text-[12px] text-[#636366]">
            Ask for additional photos, a walkaround video, or vehicle history from messages.
          </p>
        </div>
      </MobileBuyerSheet>
    </>
  );

  return { openPrimary, openSecondary, openContact, openActions, sheets };
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] text-[#636366]">{label}</span>
      <span
        className={`text-right text-[13px] ${
          strong ? "font-extrabold text-[#1b1464]" : "font-semibold text-[#1c1c1e]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function SuccessHeader({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef8f0] text-[#2f7d4a]">
        <CheckCircle2 className="h-6 w-6" />
      </div>
      <p className="mt-3 text-[16px] font-bold text-[#1c1c1e]">{title}</p>
    </div>
  );
}
