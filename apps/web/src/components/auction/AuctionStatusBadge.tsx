"use client";

import React from "react";
import type { Auction } from "@carasta/types";
import { Badge } from "@/components/ui/badge";

type Props = {
  auction: Auction;
  /** When true, also show reserve met / not met as a secondary badge. */
  showReserve?: boolean;
  className?: string;
};

/** Maps auction lifecycle to existing Badge variants — no new badge styles. */
export function AuctionStatusBadge({ auction, showReserve = true, className }: Props) {
  const ended = auction.status === "completed" || auction.status === "cancelled";
  const sold = ended && !!auction.winner && (!auction.reservePrice || auction.reserveMet);

  return (
    <div className={className ? `flex flex-wrap items-center gap-2 ${className}` : "flex flex-wrap items-center gap-2"}>
      {auction.status === "live" && <Badge variant="live">● LIVE</Badge>}
      {auction.status === "ending-soon" && <Badge variant="ending">⚡ Ending Soon</Badge>}
      {auction.status === "upcoming" && <Badge variant="upcoming">Upcoming</Badge>}
      {ended && !sold && <Badge variant="secondary">Ended</Badge>}
      {sold && <Badge variant="sold">Sold</Badge>}
      {auction.status === "cancelled" && <Badge variant="outline">Cancelled</Badge>}

      {showReserve && auction.reservePrice != null && !ended && (
        auction.reserveMet ? (
          <Badge variant="sold">Reserve Met</Badge>
        ) : (
          <Badge variant="outline">Reserve Not Met</Badge>
        )
      )}
      {showReserve && ended && auction.reservePrice != null && (
        auction.reserveMet ? (
          <Badge variant="sold">Reserve Met</Badge>
        ) : (
          <Badge variant="outline">Reserve Not Met</Badge>
        )
      )}
    </div>
  );
}
