"use client";

import React from "react";
import Link from "next/link";
import { Trophy } from "lucide-react";
import type { Auction, Vehicle } from "@carasta/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auction: Auction;
  vehicle: Vehicle;
};

/** Success modal when the signed-in user wins — navigation only, no payment. */
export function AuctionWonModal({ open, onOpenChange, auction, vehicle }: Props) {
  const winningBid = auction.finalPrice ?? auction.currentBid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="py-2 flex flex-col items-center text-center gap-4">
          <div className="h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
            <Trophy className="h-8 w-8 text-yellow-600" />
          </div>
          <DialogHeader className="items-center space-y-1">
            <DialogTitle className="text-xl">Congratulations!</DialogTitle>
            <DialogDescription>You won this auction.</DialogDescription>
          </DialogHeader>

          <div className="w-full rounded-xl border p-4 space-y-2 text-sm text-left">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Vehicle</span>
              <span className="font-medium text-right max-w-[60%]">{vehicle.title}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Winning Bid</span>
              <span className="font-bold">{formatPrice(winningBid)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Auction Reference</span>
              <span className="font-medium font-mono text-xs">{auction.id.toUpperCase()}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Next Step</span>
              <span className="font-medium text-right max-w-[60%]">Review your win details</span>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Continue
          </Button>
          <Link href={`/vehicles/${vehicle.id}`} onClick={() => onOpenChange(false)}>
            <Button variant="bid">View Vehicle</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
