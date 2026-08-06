"use client";

import React from "react";
import { CheckCircle, Gavel, X } from "lucide-react";
import type { Auction } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/auction/CountdownTimer";
import { formatPrice } from "@/lib/utils";

type LeadingBannerProps = {
  auction: Auction;
  onDismiss: () => void;
};

/** Persistent dismissible banner when the signed-in user is leading. */
export function LeadingBidderBanner({ auction, onDismiss }: LeadingBannerProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-bid/30 bg-bid/5 px-4 py-3">
      <CheckCircle className="h-5 w-5 text-bid shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">You&apos;re currently the highest bidder.</p>
        <p className="text-xs text-muted-foreground mt-0.5">Good luck!</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
          <span>
            Current Bid <span className="font-semibold text-foreground">{formatPrice(auction.currentBid)}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            Time Remaining <CountdownTimer endTime={auction.endTime} size="sm" showIcon={false} />
          </span>
          <span className="capitalize">
            Status <span className="font-semibold text-foreground">{auction.status.replace("-", " ")}</span>
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground shrink-0 self-start sm:self-center"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

type OutbidBannerProps = {
  currentHighestBid: number;
  minimumNextBid: number;
  onPlaceBid: () => void;
  onDismiss?: () => void;
  /** Softer treatment for live room so it doesn't interrupt. */
  inline?: boolean;
};

export function OutbidBanner({
  currentHighestBid,
  minimumNextBid,
  onPlaceBid,
  onDismiss,
  inline = false,
}: OutbidBannerProps) {
  return (
    <div
      className={
        inline
          ? "flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-orange-300 bg-orange-50 dark:bg-orange-900/15 px-4 py-3"
          : "flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-orange-300 bg-orange-50 dark:bg-orange-900/15 px-4 py-3"
      }
    >
      <Gavel className="h-5 w-5 text-orange-600 shrink-0" />
      <div className="flex-1 min-w-0 text-sm">
        <p className="font-semibold text-orange-700 dark:text-orange-400">You have been outbid.</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
          <span>
            Current Highest Bid{" "}
            <span className="font-semibold text-foreground">{formatPrice(currentHighestBid)}</span>
          </span>
          <span>
            Minimum Next Bid{" "}
            <span className="font-semibold text-foreground">{formatPrice(minimumNextBid)}</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="bid" size="sm" onClick={onPlaceBid}>
          Place Another Bid
        </Button>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
