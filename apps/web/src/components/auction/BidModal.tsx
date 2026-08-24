"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Gavel, AlertCircle, CheckCircle, LogIn } from "lucide-react";
import type { Auction, Bid, Vehicle } from "@carasta/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "@/components/auction/CountdownTimer";
import { auctionService, BidError, notificationService } from "@carasta/mock-data/services";
import { formatPrice, cn } from "@/lib/utils";
import { useAuth } from "@/lib/context/auth-context";
import { placePublishedBid } from "@/lib/marketplace-listings";
import { PublishedListingService } from "@/components/listing/services/published-listing-service";

interface BidModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auction: Auction | null;
  vehicle: Vehicle;
  /** Called after a bid is successfully placed so parents can sync auction state. */
  onBidPlaced?: (bid: Bid) => void;
}

type BidState = "input" | "confirm" | "success" | "error";

export function BidModal({
  open,
  onOpenChange,
  auction,
  vehicle,
  onBidPlaced,
}: BidModalProps) {
  const { user, isAuthenticated } = useAuth();
  const [bidAmount, setBidAmount] = useState("");
  const [autoBid, setAutoBid] = useState(false);
  const [state, setState] = useState<BidState>("input");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [placedAmount, setPlacedAmount] = useState(0);

  useEffect(() => {
    if (open && auction) {
      setBidAmount("");
      setAutoBid(false);
      setState("input");
      setErrorMessage("");
    }
  }, [open, auction?.id]);

  if (!auction) return null;

  const minBid = auction.currentBid + auction.minimumBidIncrement;
  const quickAmounts = [minBid, minBid + auction.minimumBidIncrement, minBid + auction.minimumBidIncrement * 4];
  const isAlreadyLeading = !!(user && auction.leadingBidder?.id === user.id);
  const isLeadingAfterPlace = placedAmount > 0 && placedAmount >= auction.currentBid;

  const handleConfirm = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const amount = parseInt(bidAmount, 10);
    try {
      const previousReserveMet = auction.reserveMet;
      let bid: Bid;
      try {
        bid = await auctionService.placeBid(auction.id, amount, user ?? undefined, { autoBid });
      } catch (err) {
        const isMissing =
          err instanceof BidError && String(err.message).toLowerCase().includes("not found");
        const isPublished = Boolean(PublishedListingService.resolve(auction.id));
        if (!isMissing && !isPublished) throw err;
        bid = placePublishedBid(auction.id, amount, user ?? undefined, { autoBid }).bid;
      }
      setPlacedAmount(amount);
      onBidPlaced?.(bid);
      setState("success");

      void notificationService.create({
        type: "bid-submitted",
        title: "Bid Submitted",
        message: `Your bid of ${formatPrice(amount)} on ${vehicle.title} was submitted successfully.`,
        actionUrl: `/vehicles/${vehicle.id}`,
        metadata: { auctionId: auction.id, vehicleId: vehicle.id, bidAmount: amount },
      });

      if (!previousReserveMet && auction.reservePrice && amount >= auction.reservePrice) {
        void notificationService.create({
          type: "reserve-met",
          title: "Reserve Met",
          message: `The reserve has been met on ${vehicle.title}.`,
          actionUrl: `/vehicles/${vehicle.id}`,
          metadata: { auctionId: auction.id, vehicleId: vehicle.id, bidAmount: amount },
        });
      }
    } catch (err) {
      setErrorMessage(
        err instanceof BidError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
      );
      setState("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setState("input");
      setBidAmount("");
      setAutoBid(false);
      setErrorMessage("");
      setPlacedAmount(0);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!isAuthenticated && (
          <div className="py-8 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <LogIn className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Sign in to bid</h3>
              <p className="text-muted-foreground mt-1">You need an account to bid on {vehicle.title}.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Link href="/sign-up">
                <Button variant="outline">Sign Up</Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="bid">Log In</Button>
              </Link>
            </div>
          </div>
        )}

        {isAuthenticated && isAlreadyLeading && state === "input" && (
          <div className="py-8 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-bid/10 flex items-center justify-center">
              <Gavel className="h-8 w-8 text-bid" />
            </div>
            <div>
              <h3 className="font-bold text-xl">You&apos;re leading!</h3>
              <p className="text-muted-foreground mt-1">
                You&apos;re currently the highest bidder at {formatPrice(auction.currentBid)}.
              </p>
            </div>
            <Badge variant="bid" className="text-sm px-4 py-1">
              Leading Bidder
            </Badge>
            <Button onClick={handleClose} className="mt-2">
              Got it
            </Button>
          </div>
        )}

        {isAuthenticated && !isAlreadyLeading && state === "input" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" /> Place a Bid
              </DialogTitle>
              <DialogDescription>{vehicle.title}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current bid</span>
                <span className="font-semibold">{formatPrice(auction.currentBid)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Minimum bid</span>
                <span className="font-semibold text-bid">{formatPrice(minBid)}</span>
              </div>

              <div className="flex gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setBidAmount(amt.toString())}
                    className={cn(
                      "flex-1 rounded-lg border py-1.5 text-sm font-medium transition-colors hover:border-bid hover:text-bid",
                      bidAmount === amt.toString() && "border-bid bg-bid/10 text-bid"
                    )}
                  >
                    {formatPrice(amt)}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Your bid amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    $
                  </span>
                  <Input
                    type="number"
                    className="pl-7"
                    placeholder={minBid.toString()}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={minBid}
                  />
                </div>
              </div>
              {bidAmount && parseInt(bidAmount, 10) < minBid && (
                <div className="flex items-center gap-2 text-xs text-red-500">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Bid must be at least {formatPrice(minBid)}
                </div>
              )}
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoBid}
                  onChange={(e) => setAutoBid(e.target.checked)}
                  className="h-4 w-4 accent-foreground"
                />
                Enable auto bid up to this amount
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="bid"
                disabled={!bidAmount || parseInt(bidAmount, 10) < minBid}
                onClick={() => setState("confirm")}
              >
                Review Bid
              </Button>
            </DialogFooter>
          </>
        )}

        {state === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Your Bid</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
              <div className="rounded-xl border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vehicle</span>
                  <span className="font-medium text-right max-w-[60%]">{vehicle.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your bid</span>
                  <span className="font-bold text-lg">{formatPrice(parseInt(bidAmount, 10))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Auto bid</span>
                  <span className="font-medium">{autoBid ? "Enabled" : "Off"}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                By placing this bid you agree to purchase the vehicle if you win. Carasta&apos;s buyer
                protection applies.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setState("input")}>
                Back
              </Button>
              <Button variant="bid" onClick={handleConfirm} disabled={isLoading}>
                {isLoading ? "Placing bid…" : `Confirm ${formatPrice(parseInt(bidAmount, 10))}`}
              </Button>
            </DialogFooter>
          </>
        )}

        {state === "success" && (
          <div className="py-4 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Bid Submitted Successfully</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Your bid has been submitted successfully.
              </p>
            </div>

            {isLeadingAfterPlace && (
              <Badge variant="bid" className="text-sm px-4 py-1">
                You&apos;re currently leading
              </Badge>
            )}

            <div className="w-full rounded-xl border p-4 space-y-2 text-sm text-left">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Vehicle</span>
                <span className="font-medium text-right max-w-[60%]">{vehicle.title}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Submitted Bid</span>
                <span className="font-bold">{formatPrice(placedAmount)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Current Highest Bid</span>
                <span className="font-semibold">{formatPrice(auction.currentBid)}</span>
              </div>
              <div className="flex justify-between gap-3 items-center">
                <span className="text-muted-foreground">Auction Remaining Time</span>
                <CountdownTimer endTime={auction.endTime} size="sm" showIcon={false} />
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Auto bid</span>
                <span className="font-medium">{autoBid ? "Enabled" : "Off"}</span>
              </div>
            </div>

            <Button variant="bid" className="w-full" onClick={handleClose}>
              Close
            </Button>
          </div>
        )}

        {state === "error" && (
          <div className="py-8 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Bid Failed</h3>
              <p className="text-muted-foreground mt-1">
                {errorMessage || "Something went wrong. Please try again."}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={() => setState("input")}>Try Again</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
