"use client";

import React from "react";
import Link from "next/link";
import { Gavel } from "lucide-react";
import type { Auction } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

type Props = {
  auction: Auction;
  /** Signed-in user lost (had bid / was watching as participant). */
  userLost?: boolean;
  className?: string;
};

/** Replaces the bid action area when the auction countdown has ended. */
export function AuctionEndedPanel({ auction, userLost = false, className }: Props) {
  const finalPrice = auction.finalPrice ?? auction.currentBid;
  const reserveLabel = auction.reservePrice
    ? auction.reserveMet
      ? "Reserve met"
      : "Reserve not met"
    : "No reserve";

  return (
    <div className={className ?? "space-y-4"}>
      <div className="text-center space-y-1">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-1">
          <Gavel className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="font-bold text-lg">Auction Ended</p>
        {userLost && (
          <p className="text-sm text-orange-600">You were outbid.</p>
        )}
        <p className="text-xs text-muted-foreground">Auction Completed</p>
      </div>

      <div className="rounded-xl border overflow-hidden">
        {[
          ["Final Price", formatPrice(finalPrice)],
          ["Reserve Status", reserveLabel],
          ...(auction.winner
            ? [["Winning Bid", formatPrice(finalPrice)] as [string, string]]
            : []),
        ].map(([label, value], i) => (
          <div
            key={label}
            className={`flex justify-between gap-3 px-3 py-2.5 text-sm ${
              i % 2 === 0 ? "bg-card" : "bg-muted/40"
            }`}
          >
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-right">{value}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Link href={`/auctions?make=${encodeURIComponent(auction.vehicle.spec.make)}`} className="block">
          <Button variant="default" className="w-full">
            {userLost ? "Browse Similar Vehicles" : "View Similar Vehicles"}
          </Button>
        </Link>
        <Link href="/auctions" className="block">
          <Button variant="outline" className="w-full">
            Return to Auctions
          </Button>
        </Link>
      </div>
    </div>
  );
}
