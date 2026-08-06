"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Radio,
  LogIn, Shield, Gavel, Users, Clock, AlertCircle, CheckCircle, Loader2,
} from "lucide-react";
import type { Auction } from "@carasta/types";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "@/components/auction/CountdownTimer";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/lib/context/auth-context";

interface EnterAuctionRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auction: Auction;
}

type Step = "overview" | "joining";

const JOINED_KEY = "carasta-joined-rooms";

export function markRoomJoined(auctionId: string) {
  try {
    const raw = sessionStorage.getItem(JOINED_KEY);
    const ids: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    if (!ids.includes(auctionId)) {
      sessionStorage.setItem(JOINED_KEY, JSON.stringify([...ids, auctionId]));
    }
  } catch {
    /* ignore */
  }
}

export function hasJoinedRoom(auctionId: string): boolean {
  try {
    const raw = sessionStorage.getItem(JOINED_KEY);
    if (!raw) return false;
    return (JSON.parse(raw) as string[]).includes(auctionId);
  } catch {
    return false;
  }
}

export function EnterAuctionRoomModal({ open, onOpenChange, auction }: EnterAuctionRoomModalProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<Step>("overview");
  const [agreed, setAgreed] = useState(false);

  const minBid = auction.currentBid + auction.minimumBidIncrement;
  const image = auction.vehicle.images[0];

  const reset = () => {
    setStep("overview");
    setAgreed(false);
  };

  const handleClose = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleJoin = () => {
    if (!agreed) return;
    setStep("joining");
    markRoomJoined(auction.id);
    // Brief join animation, then enter the room
    window.setTimeout(() => {
      router.push(`/auctions/${auction.id}/live?joined=1`);
      handleClose(false);
    }, 900);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!isAuthenticated && (
          <div className="py-6 flex flex-col items-center text-center gap-4">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <LogIn className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Sign in to join</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                You need an account to enter the live auction room and place bids.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
              <Link href={`/sign-up?redirect=/auctions/${auction.id}/live`}>
                <Button variant="outline">Sign Up</Button>
              </Link>
              <Link href={`/sign-in?redirect=/auctions/${auction.id}/live`}>
                <Button variant="bid">Log In</Button>
              </Link>
            </div>
          </div>
        )}

        {isAuthenticated && step === "overview" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-red-500" /> Enter Live Auction Room
              </DialogTitle>
              <DialogDescription>
                Join the live room to bid in real time, watch the bid feed, and chat with other bidders.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-1">
              <div className="flex gap-3 rounded-xl border p-3">
                {image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="h-16 w-24 rounded-lg object-cover shrink-0 bg-muted"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge variant="live" className="text-[10px]">● LIVE</Badge>
                    <CountdownTimer endTime={auction.endTime} size="sm" showIcon={false} />
                  </div>
                  <p className="font-semibold text-sm truncate">{auction.vehicle.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Current bid {formatPrice(auction.currentBid)} · min next {formatPrice(minBid)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-xl border bg-muted/40 py-2.5 px-1">
                  <Users className="h-3.5 w-3.5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-bold">{auction.participantCount}</p>
                  <p className="text-[10px] text-muted-foreground">Bidders</p>
                </div>
                <div className="rounded-xl border bg-muted/40 py-2.5 px-1">
                  <Gavel className="h-3.5 w-3.5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-bold">{auction.bidCount}</p>
                  <p className="text-[10px] text-muted-foreground">Bids</p>
                </div>
                <div className="rounded-xl border bg-muted/40 py-2.5 px-1">
                  <Clock className="h-3.5 w-3.5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-bold tabular-nums">{formatPrice(minBid)}</p>
                  <p className="text-[10px] text-muted-foreground">Min bid</p>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <Shield className="h-3.5 w-3.5 shrink-0 mt-0.5 text-foreground" />
                  Bids are binding. If you win, you agree to complete the purchase.
                </li>
                <li className="flex gap-2">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-foreground" />
                  The room updates live — you may be outbid while watching.
                </li>
              </ul>

              <label className="flex items-start gap-2.5 rounded-xl border p-3 cursor-pointer hover:bg-muted/40 transition-colors">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[hsl(var(--bid))]"
                />
                <span className="text-sm leading-snug">
                  I understand auction rules and that bids placed as{" "}
                  <span className="font-semibold">{user?.username ?? "me"}</span> are binding.
                </span>
              </label>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
              <Button variant="bid" disabled={!agreed} onClick={handleJoin} className="gap-1.5">
                <Radio className="h-4 w-4" /> Join Room
              </Button>
            </DialogFooter>
          </>
        )}

        {isAuthenticated && step === "joining" && (
          <div className="py-10 flex flex-col items-center text-center gap-4">
            <div className="h-14 w-14 rounded-full bg-bid/10 flex items-center justify-center">
              <Loader2 className="h-7 w-7 text-bid animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Joining room…</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Connecting you to the live auction for {auction.vehicle.title}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-bid font-medium">
              <CheckCircle className="h-3.5 w-3.5" /> Rules accepted
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
