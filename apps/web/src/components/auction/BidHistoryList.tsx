"use client";

import React from "react";
import type { Bid } from "@carasta/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice, formatRelativeTime } from "@/lib/utils";

type Props = {
  bids: Bid[];
  currentUserId?: string;
  limit?: number;
  className?: string;
};

/** Newest-first bid history with timestamps and current-user highlight. */
export function BidHistoryList({ bids, currentUserId, limit = 8, className }: Props) {
  const sorted = [...bids].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const visible = sorted.slice(0, limit);

  if (visible.length === 0) {
    return <p className="text-sm text-muted-foreground">No bids yet.</p>;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {visible.map((bid) => {
        const isMine = !!currentUserId && bid.bidder.id === currentUserId;
        return (
          <div
            key={bid.id}
            className={cn(
              "flex items-center justify-between text-sm py-1.5 border-b last:border-0 rounded-lg px-1",
              isMine && "bg-bid/5"
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarImage src={bid.bidder.avatar?.url} alt={bid.bidder.username} />
                <AvatarFallback className="text-[10px]">
                  {bid.bidder.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={cn("text-xs truncate", isMine ? "font-semibold text-bid" : "text-muted-foreground")}>
                    {bid.bidder.username}
                  </span>
                  {isMine && (
                    <Badge variant="bid" className="text-[9px] h-3.5 px-1">
                      You
                    </Badge>
                  )}
                  {bid.isAutoBid && (
                    <Badge variant="secondary" className="text-[9px] h-3.5 px-1">
                      Auto
                    </Badge>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">{formatRelativeTime(bid.createdAt)}</p>
              </div>
            </div>
            <span className={cn("font-semibold shrink-0", isMine && "text-bid")}>
              {formatPrice(bid.amount)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
