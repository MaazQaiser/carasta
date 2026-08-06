"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Send, ChevronLeft, ChevronRight, Users, Eye, TrendingUp,
  Maximize2, CheckCircle, Radio,
} from "lucide-react";
import type { Auction, Bid } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "@/components/auction/CountdownTimer";
import { BidModal } from "@/components/auction/BidModal";
import { AuctionStatusBadge } from "@/components/auction/AuctionStatusBadge";
import { LeadingBidderBanner, OutbidBanner } from "@/components/auction/AuctionStateBanners";
import { AuctionEndedPanel } from "@/components/auction/AuctionEndedPanel";
import { AuctionWonModal } from "@/components/auction/AuctionWonModal";
import { BidHistoryList } from "@/components/auction/BidHistoryList";
import { hasJoinedRoom, markRoomJoined } from "@/components/auction/EnterAuctionRoomModal";
import { BidChart } from "./BidChart";
import { MOCK_USERS } from "@carasta/mock-data";
import { auctionService, notificationService } from "@carasta/mock-data/services";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/lib/context/auth-context";

interface Props { initialAuction: Auction }

const CHAT_MESSAGES = [
  { id: "c1", user: "alex_motors", text: "Incredible car. Bid is going up fast!", time: "2m" },
  { id: "c2", user: "priya_wheels", text: "Reserve not met yet, I think this goes over 100k", time: "90s" },
  { id: "c3", user: "euro_garage", text: "Service history is immaculate. Seen it personally.", time: "60s" },
  { id: "c4", user: "muscle_mike", text: "Who else is auto bidding? 😅", time: "30s" },
];

const FAKE_BIDDERS = ["car_hunter99", "speed_demon", "topgear_fan", "veloce_auto", "porsche_addict"];

export function LiveAuctionClient({ initialAuction }: Props) {
  const { user, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [auction, setAuction] = useState(initialAuction);
  const [activeImg, setActiveImg] = useState(0);
  const [bidOpen, setBidOpen] = useState(false);
  const [wonOpen, setWonOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatMessages, setChatMessages] = useState(CHAT_MESSAGES);
  const [outbidAmount, setOutbidAmount] = useState<number | null>(null);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [leadingBannerDismissed, setLeadingBannerDismissed] = useState(false);
  const [userParticipated, setUserParticipated] = useState(false);
  const [bidPoints, setBidPoints] = useState<{ time: string; amount: number }[]>([
    { time: "Start", amount: initialAuction.startingBid },
    ...initialAuction.bids.slice().reverse().map((b, i) => ({ time: `${i + 1}m`, amount: b.amount })),
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const joinedHandled = useRef(false);
  const completingRef = useRef(false);

  const isLeading = !!(user && auction.leadingBidder?.id === user.id);
  const chatUsername = user?.username ?? "guest";
  const auctionEnded = auction.status === "completed" || auction.status === "cancelled";
  const isLive = !auctionEnded && (auction.status === "live" || auction.status === "ending-soon");
  const userWon = !!(auctionEnded && user && auction.winner?.id === user.id);
  const userLost = !!(auctionEnded && userParticipated && !userWon);

  useEffect(() => {
    if (!user) return;
    if (auction.bids.some((b) => b.bidder.id === user.id) || auction.leadingBidder?.id === user.id) {
      setUserParticipated(true);
    }
  }, [user, auction.bids, auction.leadingBidder?.id]);

  useEffect(() => {
    if (isLeading) {
      setOutbidAmount(null);
      setLeadingBannerDismissed(false);
    }
  }, [isLeading]);

  // Handle fresh join from the entry modal (?joined=1)
  useEffect(() => {
    if (joinedHandled.current) return;
    const justJoined = searchParams.get("joined") === "1";
    if (!justJoined && !hasJoinedRoom(auction.id)) return;

    joinedHandled.current = true;
    markRoomJoined(auction.id);

    if (justJoined) {
      setWelcomeVisible(true);
      setAuction((prev) => ({
        ...prev,
        participantCount: prev.participantCount + 1,
        watcherCount: prev.watcherCount + 1,
      }));
      setChatMessages((prev) => [
        ...prev,
        {
          id: `cm-join-${Date.now()}`,
          user: "auction-bot",
          text: `${chatUsername} joined the room`,
          time: "just now",
        },
      ]);
      router.replace(`/auctions/${auction.id}/live`, { scroll: false });
      const t = window.setTimeout(() => setWelcomeVisible(false), 6000);
      return () => window.clearTimeout(t);
    }
  }, [searchParams, auction.id, chatUsername, router]);

  const handleAuctionEnded = useCallback(async () => {
    if (completingRef.current || auction.status === "completed") return;
    completingRef.current = true;
    const completed = await auctionService.completeAuction(auction.id);
    if (!completed) {
      completingRef.current = false;
      return;
    }
    setAuction({ ...completed });
    setOutbidAmount(null);

    const won = !!(user && completed.winner?.id === user.id);
    const participated =
      userParticipated || !!(user && completed.bids.some((b) => b.bidder.id === user.id));

    void notificationService.create({
      type: won ? "auction-won" : participated ? "auction-lost" : "auction-ended",
      title: won ? "Auction Won" : participated ? "Auction Lost" : "Auction Ended",
      message: won
        ? `Congratulations! You won ${completed.vehicle.title}.`
        : participated
          ? `You were outbid on ${completed.vehicle.title}.`
          : `${completed.vehicle.title} has ended.`,
      actionUrl: `/auctions/${completed.id}/live`,
      metadata: {
        auctionId: completed.id,
        vehicleId: completed.vehicle.id,
        bidAmount: completed.finalPrice ?? completed.currentBid,
      },
    });

    setChatMessages((prev) => [
      ...prev,
      {
        id: `cm-end-${Date.now()}`,
        user: "auction-bot",
        text: won
          ? "Auction ended — congratulations, you won!"
          : "Auction ended. Bidding is closed.",
        time: "just now",
      },
    ]);

    if (won) setWonOpen(true);
  }, [auction.id, auction.status, user, userParticipated]);

  const handleBidPlaced = (bid: Bid) => {
    setOutbidAmount(null);
    setUserParticipated(true);
    setLeadingBannerDismissed(false);
    setAuction((prev) => ({
      ...prev,
      currentBid: bid.amount,
      bidCount: prev.bidCount + 1,
      bids: [bid, ...prev.bids].slice(0, 20),
      leadingBidder: bid.bidder,
      reserveMet: prev.reservePrice ? bid.amount >= prev.reservePrice : prev.reserveMet,
    }));
    setBidPoints((prev) => [...prev, { time: "Now", amount: bid.amount }].slice(-20));
    setChatMessages((prev) => [
      ...prev,
      {
        id: `cm-bid-${Date.now()}`,
        user: "auction-bot",
        text: `${bid.bidder.username} placed a bid of ${formatPrice(bid.amount)}`,
        time: "just now",
      },
    ]);
  };

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    if (!isAuthenticated) return;
    setChatMessages((prev) => [
      ...prev,
      { id: `cm-u-${Date.now()}`, user: chatUsername, text: chatMsg.trim(), time: "now" },
    ]);
    setChatMsg("");
  };

  // Placeholder live updates — rival bids, feed, timer-driven UI (no sockets).
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const increment = auction.minimumBidIncrement * (1 + Math.floor(Math.random() * 3));
      const newAmount = auction.currentBid + increment;
      const randomBidder = FAKE_BIDDERS[Math.floor(Math.random() * FAKE_BIDDERS.length)]!;
      const newBid: Bid = {
        id: `sim-${Date.now()}`,
        auctionId: auction.id,
        bidder: { ...MOCK_USERS[1]!, username: randomBidder, displayName: randomBidder },
        amount: newAmount,
        isAutoBid: Math.random() > 0.5,
        createdAt: new Date().toISOString(),
      };

      setAuction((prev) => {
        if (prev.status === "completed") return prev;
        const wasLeading = !!(user && prev.leadingBidder?.id === user.id);
        if (wasLeading) {
          setOutbidAmount(newAmount);
          void notificationService.create({
            type: "outbid",
            title: "You have been outbid",
            message: `A new bid of ${formatPrice(newAmount)} was placed on ${prev.vehicle.title}.`,
            actionUrl: `/auctions/${prev.id}/live`,
            metadata: { auctionId: prev.id, vehicleId: prev.vehicle.id, bidAmount: newAmount },
          });
        }
        return {
          ...prev,
          currentBid: newAmount,
          bidCount: prev.bidCount + 1,
          participantCount: prev.participantCount + (Math.random() > 0.7 ? 1 : 0),
          bids: [newBid, ...prev.bids].slice(0, 20),
          leadingBidder: newBid.bidder,
          reserveMet: prev.reservePrice ? newAmount >= prev.reservePrice : prev.reserveMet,
        };
      });

      setBidPoints((prev) => [...prev, { time: "Now", amount: newAmount }].slice(-20));

      const chatPhrases = [
        `${randomBidder} placed a bid of ${formatPrice(newAmount)}`,
        `${randomBidder} is now in the lead!`,
        `New bid from ${randomBidder}`,
      ];
      const phrase = chatPhrases[Math.floor(Math.random() * chatPhrases.length)]!;
      setChatMessages((prev) =>
        [...prev, { id: `cm-${Date.now()}`, user: "auction-bot", text: phrase, time: "just now" }].slice(-30)
      );
    }, 3500 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [isLive, auction.currentBid, auction.minimumBidIncrement, auction.id, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/vehicles/${auction.vehicle.id}`}>
          <Button variant="ghost" size="sm" className="gap-1.5"><ArrowLeft className="h-4 w-4" /> Back</Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">{auction.vehicle.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{auction.participantCount} bidders</span>
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{auction.watcherCount} watching</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated && isLive && (
            <Badge variant="secondary" className="gap-1 text-[11px]">
              <Radio className="h-3 w-3 text-red-500" /> In room
            </Badge>
          )}
          <AuctionStatusBadge auction={auction} />
        </div>
      </div>

      {welcomeVisible && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-bid/30 bg-bid/5 px-4 py-3">
          <CheckCircle className="h-5 w-5 text-bid shrink-0" />
          <div className="flex-1 text-sm">
            <span className="font-semibold">You&apos;re in the live room.</span>
            <span className="text-muted-foreground ml-1.5">
              Place a bid anytime — minimum is {formatPrice(auction.currentBid + auction.minimumBidIncrement)}.
            </span>
          </div>
          {!isLeading && isLive && (
            <Button variant="bid" size="sm" onClick={() => setBidOpen(true)}>Place Bid</Button>
          )}
          <button onClick={() => setWelcomeVisible(false)} className="text-muted-foreground hover:text-foreground shrink-0" aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      {isLeading && !leadingBannerDismissed && isLive && (
        <div className="mb-6">
          <LeadingBidderBanner
            auction={auction}
            onDismiss={() => setLeadingBannerDismissed(true)}
          />
        </div>
      )}

      {outbidAmount !== null && !isLeading && isLive && (
        <div className="mb-6">
          <OutbidBanner
            inline
            currentHighestBid={auction.currentBid}
            minimumNextBid={auction.currentBid + auction.minimumBidIncrement}
            onPlaceBid={() => setBidOpen(true)}
            onDismiss={() => setOutbidAmount(null)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Gallery + Chart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted">
            {auction.vehicle.images[activeImg] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={auction.vehicle.images[activeImg]!.url}
                alt={auction.vehicle.images[activeImg]!.alt}
                className="h-full w-full object-cover"
              />
            )}
            {auction.vehicle.images.length > 1 && (
              <>
                <button onClick={() => setActiveImg((i) => (i - 1 + auction.vehicle.images.length) % auction.vehicle.images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={() => setActiveImg((i) => (i + 1) % auction.vehicle.images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            <div className="absolute bottom-4 right-4">
              <Button variant="secondary" size="sm" className="gap-1.5 bg-black/40 text-white hover:bg-black/60 border-0">
                <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Bid History</h3>
              <Badge variant="secondary" className="text-[10px] ml-auto">{auction.bidCount} bids</Badge>
            </div>
            <BidChart data={bidPoints} currentBid={auction.currentBid} />
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              ["Year", String(auction.vehicle.spec.year)],
              ["Make", auction.vehicle.spec.make],
              ["Mileage", `${(auction.vehicle.spec.mileage / 1000).toFixed(0)}K mi`],
              ["Transmission", auction.vehicle.spec.transmission.slice(0, 4)],
              ["Fuel", auction.vehicle.spec.fuelType.slice(0, 3)],
              ...(auction.vehicle.spec.horsepower ? [["Power", `${auction.vehicle.spec.horsepower}hp`]] : []),
            ].map(([label, value]) => (
              <div key={label} className="text-center p-3 rounded-xl border bg-card">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold capitalize">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Bid Panel + Chat */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border bg-card p-5">
            {auctionEnded ? (
              <AuctionEndedPanel auction={auction} userLost={userLost} />
            ) : (
              <>
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">Current Bid</p>
                  <p className="text-5xl font-bold tabular-nums">{formatPrice(auction.currentBid)}</p>
                  {auction.reservePrice && !auction.reserveMet && (
                    <p className="text-xs text-orange-500 mt-1">Reserve not met</p>
                  )}
                  {auction.reservePrice && auction.reserveMet && (
                    <p className="text-xs text-green-600 mt-1">Reserve met</p>
                  )}
                </div>

                <div className="flex items-center justify-center py-3 px-4 rounded-xl bg-muted mb-4">
                  <CountdownTimer
                    endTime={auction.endTime}
                    size="lg"
                    onEnded={handleAuctionEnded}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{auction.bidCount}</p>
                    <p className="text-xs text-muted-foreground">Total Bids</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{auction.participantCount}</p>
                    <p className="text-xs text-muted-foreground">Active Bidders</p>
                  </div>
                </div>

                {isLive && (
                  isLeading ? (
                    <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-bid/10 text-bid font-semibold text-sm">
                      <CheckCircle className="h-4 w-4" /> You&apos;re the highest bidder
                    </div>
                  ) : (
                    <Button variant="bid" size="xl" className="w-full" onClick={() => setBidOpen(true)}>
                      Place Bid — min {formatPrice(auction.currentBid + auction.minimumBidIncrement)}
                    </Button>
                  )
                )}
              </>
            )}
          </div>

          <div className="rounded-2xl border bg-card p-4">
            <h3 className="font-semibold text-sm mb-3">Recent Bids</h3>
            <div className="max-h-44 overflow-y-auto">
              <BidHistoryList bids={auction.bids} currentUserId={user?.id} limit={8} />
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-4 flex flex-col h-64">
            <h3 className="font-semibold text-sm mb-3">Live Chat</h3>
            <div className="flex-1 overflow-y-auto space-y-2 mb-3 scrollbar-hide">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-xs">
                  <span className={msg.user === "auction-bot" ? "font-medium text-bid" : "font-medium text-primary"}>
                    {msg.user}
                  </span>
                  <span className="text-muted-foreground ml-1">{msg.text}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2">
              <Input
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                placeholder={isAuthenticated ? "Say something…" : "Sign in to chat"}
                className="h-8 text-sm"
                disabled={!isAuthenticated || auctionEnded}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendChat();
                }}
              />
              <Button size="icon" className="h-8 w-8 shrink-0" onClick={sendChat} disabled={!isAuthenticated || auctionEnded}>
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <BidModal
        open={bidOpen}
        onOpenChange={setBidOpen}
        auction={auction}
        vehicle={auction.vehicle}
        onBidPlaced={handleBidPlaced}
      />
      <AuctionWonModal
        open={wonOpen}
        onOpenChange={setWonOpen}
        auction={auction}
        vehicle={auction.vehicle}
      />
    </div>
  );
}
