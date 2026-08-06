"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Heart, Shield, FileText, ChevronLeft, ChevronRight, TrendingUp,
  MapPin, Gauge, Fuel, Settings, Eye, Users, Share2, CheckCircle, ExternalLink,
  MessageCircle, Send, BadgeCheck
} from "lucide-react";
import type { Vehicle, Auction, Bid } from "@carasta/types";
import { MOCK_USERS } from "@carasta/mock-data";
import { auctionService, notificationService } from "@carasta/mock-data/services";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CountdownTimer } from "@/components/auction/CountdownTimer";
import { AuctionStatusBadge } from "@/components/auction/AuctionStatusBadge";
import { LeadingBidderBanner, OutbidBanner } from "@/components/auction/AuctionStateBanners";
import { AuctionEndedPanel } from "@/components/auction/AuctionEndedPanel";
import { AuctionWonModal } from "@/components/auction/AuctionWonModal";
import { BidHistoryList } from "@/components/auction/BidHistoryList";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import {
  PhotosDocumentsSection,
  SpecificationsModificationsSection,
  ConditionHistorySection,
  OwnerNotesSection,
} from "@/components/vehicle/VehicleListingParity";
import { BidModal } from "@/components/auction/BidModal";
import { EnterAuctionRoomModal } from "@/components/auction/EnterAuctionRoomModal";
import { cn, formatPrice, formatMileage } from "@/lib/utils";
import { listingTypeLabel, saleTypeLabel } from "@/lib/listing-labels";
import { useWatchlist } from "@/lib/context/watchlist-context";
import { useAuth } from "@/lib/context/auth-context";

interface Props {
  vehicle: Vehicle;
  auction: Auction | null;
  similar: Vehicle[];
}

interface MockComment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  time: string;
}

const MOCK_COMMENTS: MockComment[] = [
  { id: "c1", author: "Chris M.", text: "Stunning condition on this one — matching numbers?", time: "2h ago" },
  { id: "c2", author: "Paolo V.", text: "The interior shots would be great to see.", time: "4h ago" },
  { id: "c3", author: "Sarah K.", text: "Reserve looks reasonable given the mileage. Good luck to all bidders!", time: "6h ago" },
];

function CommentsSection({ vehicleId }: { vehicleId: string }) {
  const [comments, setComments] = useState<MockComment[]>(MOCK_COMMENTS);
  const [text, setText] = useState("");
  const { user } = useAuth();

  const submit = () => {
    if (!text.trim()) return;
    setComments((prev) => [
      { id: `c${Date.now()}`, author: user?.displayName ?? "You", text: text.trim(), time: "just now" },
      ...prev,
    ]);
    setText("");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MessageCircle className="h-5 w-5" /> Comments
      </h2>

      <div className="flex gap-3 mb-6">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={user?.avatar?.url} />
          <AvatarFallback className="text-xs">{user?.displayName?.slice(0, 2) ?? "?"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <input
            className="flex-1 rounded-xl border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder={user ? "Write a comment…" : "Sign in to comment"}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            disabled={!user}
          />
          <Button size="sm" variant="bid" onClick={submit} disabled={!text.trim() || !user}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback className="text-[10px]">{c.author.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold">{c.author}</span>
                <span className="text-xs text-muted-foreground">{c.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VehicleDetailClient({ vehicle, auction: initialAuction, similar }: Props) {
  const [activeImg, setActiveImg] = useState(0);
  const [bidOpen, setBidOpen] = useState(false);
  const [roomOpen, setRoomOpen] = useState(false);
  const [wonOpen, setWonOpen] = useState(false);
  const [auction, setAuction] = useState(initialAuction);
  const [userParticipated, setUserParticipated] = useState(false);
  const [leadingBannerDismissed, setLeadingBannerDismissed] = useState(false);
  const [outbidAmount, setOutbidAmount] = useState<number | null>(null);
  const completingRef = useRef(false);
  const endingSoonNotified = useRef(false);
  const { isWatched, toggle } = useWatchlist();
  const { user } = useAuth();
  const watched = isWatched(vehicle.id);
  const isLeading = !!(auction && user && auction.leadingBidder?.id === user.id);
  const isOwner = !!(user && vehicle.seller.id === user.id);
  const auctionEnded = auction?.status === "completed" || auction?.status === "cancelled";
  const userLost = !!(auctionEnded && userParticipated && !(user && auction?.winner?.id === user.id) && !isOwner);

  useEffect(() => {
    if (!user || !auction) return;
    if (auction.bids.some((b) => b.bidder.id === user.id) || auction.leadingBidder?.id === user.id) {
      setUserParticipated(true);
    }
  }, [user, auction]);

  useEffect(() => {
    if (isLeading) {
      setOutbidAmount(null);
      setLeadingBannerDismissed(false);
    }
  }, [isLeading]);

  const handleAuctionEnded = useCallback(async () => {
    if (!auction || completingRef.current || auction.status === "completed") return;
    completingRef.current = true;
    const completed = await auctionService.completeAuction(auction.id);
    if (!completed) {
      completingRef.current = false;
      return;
    }
    setAuction({ ...completed });

    const won = !!(user && completed.winner?.id === user.id);
    const participated =
      userParticipated || !!(user && completed.bids.some((b) => b.bidder.id === user.id));

    void notificationService.create({
      type: won ? "auction-won" : participated ? "auction-lost" : "auction-ended",
      title: won ? "Auction Won" : participated ? "Auction Lost" : "Auction Ended",
      message: won
        ? `Congratulations! You won ${vehicle.title}.`
        : participated
          ? `You were outbid on ${vehicle.title}.`
          : `${vehicle.title} has ended.`,
      actionUrl: `/vehicles/${vehicle.id}`,
      metadata: {
        auctionId: completed.id,
        vehicleId: vehicle.id,
        bidAmount: completed.finalPrice ?? completed.currentBid,
      },
    });

    if (won) setWonOpen(true);
  }, [auction, user, userParticipated, vehicle.id, vehicle.title]);

  const handleBidPlaced = (bid: Bid) => {
    setUserParticipated(true);
    setOutbidAmount(null);
    setLeadingBannerDismissed(false);
    setAuction((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentBid: bid.amount,
        bidCount: prev.bidCount + 1,
        bids: [bid, ...prev.bids],
        leadingBidder: bid.bidder,
        reserveMet: prev.reservePrice ? bid.amount >= prev.reservePrice : prev.reserveMet,
      };
    });
  };

  // Notify once when the auction enters the final hour.
  useEffect(() => {
    if (!auction || auctionEnded || endingSoonNotified.current) return;
    const tick = () => {
      const ms = new Date(auction.endTime).getTime() - Date.now();
      if (ms > 0 && ms < 3600000 && !endingSoonNotified.current) {
        endingSoonNotified.current = true;
        if (auction.status === "live") {
          setAuction((prev) => (prev ? { ...prev, status: "ending-soon" } : prev));
        }
        void notificationService.create({
          type: "auction-ending",
          title: "Auction Ending Soon",
          message: `${vehicle.title} is ending soon. Don't miss your chance.`,
          actionUrl: `/vehicles/${vehicle.id}`,
          metadata: { auctionId: auction.id, vehicleId: vehicle.id },
        });
      }
    };
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, [auction, auctionEnded, vehicle.id, vehicle.title]);

  // Placeholder rival bids on the detail page so outbid / leading banners can surface.
  useEffect(() => {
    if (!auction || auctionEnded) return;
    if (auction.status !== "live" && auction.status !== "ending-soon") return;

    const interval = setInterval(() => {
      setAuction((prev) => {
        if (!prev || prev.status === "completed") return prev;
        if (!(user && prev.leadingBidder?.id === user.id)) return prev;

        const increment = prev.minimumBidIncrement * (1 + Math.floor(Math.random() * 2));
        const newAmount = prev.currentBid + increment;
        const rival = MOCK_USERS[1]!;
        const newBid: Bid = {
          id: `sim-detail-${Date.now()}`,
          auctionId: prev.id,
          bidder: rival,
          amount: newAmount,
          isAutoBid: true,
          createdAt: new Date().toISOString(),
        };
        setOutbidAmount(newAmount);
        void notificationService.create({
          type: "outbid",
          title: "You have been outbid",
          message: `A new bid of ${formatPrice(newAmount)} was placed on ${vehicle.title}.`,
          actionUrl: `/vehicles/${vehicle.id}`,
          metadata: { auctionId: prev.id, vehicleId: vehicle.id, bidAmount: newAmount },
        });
        return {
          ...prev,
          currentBid: newAmount,
          bidCount: prev.bidCount + 1,
          bids: [newBid, ...prev.bids],
          leadingBidder: rival,
          reserveMet: prev.reservePrice ? newAmount >= prev.reservePrice : prev.reserveMet,
        };
      });
    }, 12000 + Math.random() * 8000);

    return () => clearInterval(interval);
  }, [auction?.id, auction?.status, auctionEnded, user, vehicle.id, vehicle.title]);

  const specs = [
    { icon: Gauge, label: "Mileage", value: formatMileage(vehicle.spec.mileage) },
    { icon: Fuel, label: "Fuel", value: vehicle.spec.fuelType },
    { icon: Settings, label: "Transmission", value: vehicle.spec.transmission },
    { icon: Settings, label: "Drive", value: vehicle.spec.driveType.toUpperCase() },
    ...(vehicle.spec.horsepower ? [{ icon: TrendingUp, label: "Power", value: `${vehicle.spec.horsepower} hp` }] : []),
    { icon: MapPin, label: "Location", value: `${vehicle.location.city}, ${vehicle.location.state}` },
  ];

  const typeLabel = listingTypeLabel(vehicle.listingType);
  const saleLabel = saleTypeLabel(vehicle.saleType);
  const listingDetails = vehicle.listingDetails;
  const buyNowPrice = listingDetails?.buyNowPrice;
  const shipping = listingDetails?.shipping;
  const sellerLocation =
    listingDetails?.sellerLocation ?? `${vehicle.location.city}, ${vehicle.location.state}`;
  const memberSince = vehicle.seller.joinedAt
    ? new Date(vehicle.seller.joinedAt).getFullYear()
    : null;

  const saleInfoRows: [string, string][] = [
    ...(saleLabel ? [["Sale Type", saleLabel] as [string, string]] : []),
    ...(auction?.reservePrice
      ? [["Reserve Status", auction.reserveMet ? "Reserve met" : "Reserve not yet met"] as [string, string]]
      : vehicle.reservePrice && vehicle.saleType === "reserve-auction"
        ? [["Reserve Status", "Reserve set"] as [string, string]]
        : []),
    ...(auction?.endTime
      ? [["Auction End Date", new Date(auction.endTime).toLocaleString()] as [string, string]]
      : []),
    ...(buyNowPrice ? [["Buy Now Price", formatPrice(buyNowPrice)] as [string, string]] : []),
    ...(shipping ? [["Shipping", shipping] as [string, string]] : []),
    ...(sellerLocation ? [["Seller Location", sellerLocation] as [string, string]] : []),
  ];

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/auctions" className="hover:text-foreground transition-colors">Auction</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate">{vehicle.title}</span>
      </nav>

      {auction && isLeading && !leadingBannerDismissed && !auctionEnded && (
        <div className="mb-6">
          <LeadingBidderBanner
            auction={auction}
            onDismiss={() => setLeadingBannerDismissed(true)}
          />
        </div>
      )}

      {auction && outbidAmount !== null && !isLeading && !auctionEnded && (
        <div className="mb-6">
          <OutbidBanner
            currentHighestBid={auction.currentBid}
            minimumNextBid={auction.currentBid + auction.minimumBidIncrement}
            onPlaceBid={() => setBidOpen(true)}
            onDismiss={() => setOutbidAmount(null)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Gallery + Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted">
              {vehicle.images[activeImg] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={vehicle.images[activeImg]!.url}
                  alt={vehicle.images[activeImg]!.alt}
                  className="h-full w-full object-cover"
                />
              )}
              {vehicle.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((i) => (i - 1 + vehicle.images.length) % vehicle.images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActiveImg((i) => (i + 1) % vehicle.images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-4 text-xs text-white bg-black/50 rounded-full px-2 py-1 backdrop-blur-sm">
                {activeImg + 1} / {vehicle.images.length}
              </div>
              <button
                onClick={() => toggle(vehicle.id)}
                className={cn(
                  "absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
                  watched ? "bg-red-500 text-white" : "bg-black/40 text-white hover:bg-black/60"
                )}
              >
                <Heart className={cn("h-5 w-5", watched && "fill-current")} />
              </button>
            </div>

            {vehicle.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {vehicle.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImg(i)}
                    className={cn("h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all", i === activeImg ? "border-primary" : "border-transparent opacity-60 hover:opacity-100")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <PhotosDocumentsSection vehicle={vehicle} />

          {/* Tabs */}
          <Tabs defaultValue="showroom">
            <TabsList className="w-full justify-start h-auto bg-transparent p-0 border-b rounded-none gap-4">
              {[
                { value: "showroom", label: "Showroom" },
                { value: "description", label: "Description" },
                { value: "notes", label: "Owner's Notes" },
                { value: "status", label: "Status" },
                { value: "comments", label: "Comments" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 px-0"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Showroom tab — gallery + video + overview */}
            <TabsContent value="showroom" className="mt-6 space-y-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">{vehicle.title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{vehicle.views.toLocaleString()} views</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" />{vehicle.watchlistCount} watching</span>
                  <span className="capitalize">{vehicle.condition} condition</span>
                  {typeLabel && <span>{typeLabel}</span>}
                  {saleLabel && <span>{saleLabel}</span>}
                </div>
                {(vehicle.vinVerified || vehicle.carastaVerified || vehicle.documentsAvailable) && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {vehicle.vinVerified && (
                      <span className="flex items-center gap-1.5 text-xs bg-muted px-3 py-1.5 rounded-full">
                        <BadgeCheck className="h-3.5 w-3.5 text-primary" /> VIN Verified
                      </span>
                    )}
                    {vehicle.carastaVerified && (
                      <span className="flex items-center gap-1.5 text-xs bg-muted px-3 py-1.5 rounded-full">
                        <Shield className="h-3.5 w-3.5 text-primary" /> Carasta Verified
                      </span>
                    )}
                    {vehicle.documentsAvailable && (
                      <span className="flex items-center gap-1.5 text-xs bg-muted px-3 py-1.5 rounded-full">
                        <FileText className="h-3.5 w-3.5 text-primary" /> Documents Verified
                      </span>
                    )}
                  </div>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">{vehicle.description}</p>

              {/* Spec grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-xl border bg-card">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium capitalize">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notable features */}
              {vehicle.features.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Notable Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((f) => (
                      <span key={f} className="flex items-center gap-1.5 text-sm bg-muted px-3 py-1.5 rounded-full">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Description / Build Sheet tab — identity always; type depth lives in Specs below */}
            <TabsContent value="description" className="mt-6">
              <div className="rounded-2xl border overflow-hidden">
                {[
                  ...(typeLabel ? [["Vehicle Type", typeLabel]] : []),
                  ...(saleLabel ? [["Sale Format", saleLabel]] : []),
                  ["Make", vehicle.spec.make],
                  ["Model", vehicle.spec.model],
                  ["Year", String(vehicle.spec.year)],
                  ...(vehicle.spec.trim ? [["Trim", vehicle.spec.trim]] : []),
                  ...(vehicle.spec.engineSize ? [["Engine", vehicle.spec.engineSize]] : []),
                  ...(vehicle.spec.horsepower ? [["Horsepower", `${vehicle.spec.horsepower} hp`]] : []),
                  ...(vehicle.spec.torque ? [["Torque", `${vehicle.spec.torque} lb-ft`]] : []),
                  ["Fuel Type", vehicle.spec.fuelType],
                  ["Transmission", vehicle.spec.transmission],
                  ["Drive Type", vehicle.spec.driveType.toUpperCase()],
                  ["Mileage", formatMileage(vehicle.spec.mileage)],
                  ["Exterior Color", vehicle.spec.exteriorColor],
                  ["Interior Color", vehicle.spec.interiorColor],
                  ...(vehicle.spec.doors ? [["Doors", String(vehicle.spec.doors)]] : []),
                  ...(vehicle.spec.seats ? [["Seats", String(vehicle.spec.seats)]] : []),
                  ...(vehicle.spec.bodyStyle ? [["Body Style", vehicle.spec.bodyStyle]] : []),
                  ...(vehicle.spec.vin ? [["VIN", vehicle.spec.vin]] : []),
                ].map(([label, value], i) => (
                  <div key={label} className={cn("flex justify-between px-4 py-3 text-sm", i % 2 === 0 ? "bg-card" : "bg-muted/40")}>
                    <span className="text-muted-foreground">{label}</span>
                    <span className={cn("font-medium text-right", label !== "VIN" && label !== "Vehicle Type" && label !== "Sale Format" && "capitalize")}>{value}</span>
                  </div>
                ))}
              </div>

              {vehicle.hasInspectionReport && (
                <div className="flex items-center justify-between p-4 rounded-xl border bg-card mt-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Inspection Report</p>
                      <p className="text-xs text-muted-foreground">Third-party vehicle inspection</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" /> View Report
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Owner's Notes tab */}
            <TabsContent value="notes" className="mt-6">
              {vehicle.story ? (
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                  <p>{vehicle.story}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No seller notes provided.</p>
              )}
            </TabsContent>

            {/* Status tab — bid panel on mobile */}
            <TabsContent value="status" className="mt-6 lg:hidden">
              {auction ? (
                <div className="rounded-2xl border bg-card p-5 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <AuctionStatusBadge auction={auction} />
                    <button onClick={() => { /* share */ }} className="text-muted-foreground hover:text-foreground shrink-0">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>

                  {auctionEnded ? (
                    <AuctionEndedPanel auction={auction} userLost={userLost} />
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <p className="text-4xl font-bold">{formatPrice(auction.currentBid)}</p>
                        {auction.reservePrice && !auction.reserveMet && (
                          <p className="text-xs text-orange-500 mt-1">Reserve not yet met</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted">
                        <span className="text-sm text-muted-foreground">Time remaining</span>
                        <CountdownTimer
                          endTime={auction.endTime}
                          size="default"
                          onEnded={handleAuctionEnded}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-center text-sm">
                        <div><p className="font-bold text-lg">{auction.bidCount}</p><p className="text-xs text-muted-foreground">Bids</p></div>
                        <div><p className="font-bold text-lg">{auction.participantCount}</p><p className="text-xs text-muted-foreground">Bidders</p></div>
                        <div><p className="font-bold text-lg">{auction.watcherCount}</p><p className="text-xs text-muted-foreground">Watching</p></div>
                      </div>

                      {(auction.status === "live" || auction.status === "ending-soon") && !isOwner && (
                        <div className="space-y-2">
                          {isLeading ? (
                            <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-bid/10 text-bid font-semibold text-sm">
                              <CheckCircle className="h-4 w-4" /> You&apos;re the highest bidder
                            </div>
                          ) : (
                            <Button variant="bid" size="lg" className="w-full text-base" onClick={() => setBidOpen(true)}>
                              Place Bid — min {formatPrice(auction.currentBid + auction.minimumBidIncrement)}
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="w-full" onClick={() => setRoomOpen(true)}>
                            Enter Live Auction Room
                          </Button>
                        </div>
                      )}

                      {isOwner && (auction.status === "live" || auction.status === "ending-soon") && (
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full text-sm">Lift Reserve</Button>
                          <Button variant="outline" className="w-full text-sm">Change Reserve Price</Button>
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Bid History</p>
                        <BidHistoryList bids={auction.bids} currentUserId={user?.id} limit={6} />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No auction associated with this vehicle.</p>
              )}
            </TabsContent>

            {/* Comments tab */}
            <TabsContent value="comments" className="mt-6">
              <CommentsSection vehicleId={vehicle.id} />
            </TabsContent>
          </Tabs>

          <SpecificationsModificationsSection vehicle={vehicle} />
          <ConditionHistorySection vehicle={vehicle} />
          <OwnerNotesSection vehicle={vehicle} />
        </div>

        {/* Right — Auction Panel */}
        <div className="space-y-4">
          {/* Auction block */}
          {auction ? (
            <div className="sticky top-20 rounded-2xl border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <AuctionStatusBadge auction={auction} />
                <button onClick={() => { /* share */ }} className="text-muted-foreground hover:text-foreground shrink-0">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>

              {auctionEnded ? (
                <AuctionEndedPanel auction={auction} userLost={userLost} />
              ) : (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Price</p>
                    <p className="text-4xl font-bold">{formatPrice(auction.currentBid)}</p>
                    {auction.reservePrice && !auction.reserveMet && (
                      <p className="text-xs text-orange-500 mt-1">Reserve not yet met</p>
                    )}
                    {auction.reservePrice && auction.reserveMet && (
                      <p className="text-xs text-green-600 mt-1">Reserve met</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted">
                    <span className="text-sm text-muted-foreground">Time remaining</span>
                    <CountdownTimer
                      endTime={auction.endTime}
                      size="default"
                      onEnded={handleAuctionEnded}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div>
                      <p className="font-bold text-lg">{auction.bidCount}</p>
                      <p className="text-xs text-muted-foreground">Bids</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{auction.participantCount}</p>
                      <p className="text-xs text-muted-foreground">Bidders</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{auction.watcherCount}</p>
                      <p className="text-xs text-muted-foreground">Watching</p>
                    </div>
                  </div>

                  {(auction.status === "live" || auction.status === "ending-soon") && (
                    <div className="space-y-2">
                      {isLeading ? (
                        <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-bid/10 text-bid font-semibold text-sm">
                          <CheckCircle className="h-4 w-4" /> You&apos;re the highest bidder
                        </div>
                      ) : !isOwner ? (
                        <Button
                          variant="bid"
                          size="lg"
                          className="w-full text-base"
                          onClick={() => setBidOpen(true)}
                        >
                          Place Bid — min {formatPrice(auction.currentBid + auction.minimumBidIncrement)}
                        </Button>
                      ) : null}
                      {!isOwner && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setRoomOpen(true)}
                        >
                          Enter Live Auction Room
                        </Button>
                      )}
                      {isOwner && (
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full text-sm">Lift Reserve</Button>
                          <Button variant="outline" className="w-full text-sm">Change Reserve Price</Button>
                        </div>
                      )}
                    </div>
                  )}

                  {auction.status === "upcoming" && (
                    <Button variant="outline" className="w-full">
                      Remind Me When Live
                    </Button>
                  )}

                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Bid History
                    </p>
                    <BidHistoryList bids={auction.bids} currentUserId={user?.id} limit={6} />
                  </div>

                  {saleInfoRows.length > 0 && (
                    <div className="rounded-xl border overflow-hidden">
                      {saleInfoRows.map(([label, value], i) => (
                        <div
                          key={label}
                          className={cn(
                            "flex justify-between gap-3 px-3 py-2.5 text-sm",
                            i % 2 === 0 ? "bg-card" : "bg-muted/40"
                          )}
                        >
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Buyer protection on all purchases</span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border bg-card p-5 space-y-3">
              <p className="font-semibold">
                {vehicle.saleType === "buy-it-now" ? "Buy Now Price" : "Asking Price"}
              </p>
              <p className="text-4xl font-bold">
                {formatPrice(buyNowPrice ?? vehicle.startingPrice)}
              </p>
              <Button variant="default" size="lg" className="w-full">
                {vehicle.saleType === "make-offer" ? "Make an Offer" : "Buy Now"}
              </Button>
              {saleInfoRows.length > 0 && (
                <div className="rounded-xl border overflow-hidden">
                  {saleInfoRows.map(([label, value], i) => (
                    <div
                      key={label}
                      className={cn(
                        "flex justify-between gap-3 px-3 py-2.5 text-sm",
                        i % 2 === 0 ? "bg-card" : "bg-muted/40"
                      )}
                    >
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>
              )}
              {vehicle.hasFinancingOptions && (
                <p className="text-xs text-center text-muted-foreground">Financing available from est. ${Math.round(vehicle.startingPrice / 72).toLocaleString()}/mo</p>
              )}
            </div>
          )}

          {/* Seller card */}
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground mb-3">Seller</p>
            <div className="flex items-center gap-3">
              <Link href={`/profile/${vehicle.seller.username}`}>
                <Avatar className="h-12 w-12 cursor-pointer">
                  <AvatarImage src={vehicle.seller.avatar?.url} alt={vehicle.seller.displayName} />
                  <AvatarFallback>{vehicle.seller.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link href={`/profile/${vehicle.seller.username}`} className="font-semibold hover:underline flex items-center gap-1">
                  {vehicle.seller.displayName}
                  {vehicle.seller.isVerified && <CheckCircle className="h-4 w-4 text-primary" />}
                </Link>
                <p className="text-xs text-muted-foreground">{vehicle.seller.stats.totalSales} vehicles sold</p>
              </div>
            </div>
            {(memberSince || vehicle.seller.stats.responseRate != null) && (
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                {memberSince && (
                  <p>
                    Member since <span className="font-medium text-foreground">{memberSince}</span>
                  </p>
                )}
                {vehicle.seller.stats.responseRate != null && (
                  <p>
                    Response rate{" "}
                    <span className="font-medium text-foreground">{vehicle.seller.stats.responseRate}%</span>
                  </p>
                )}
              </div>
            )}
            {vehicle.seller.stats.rating && (
              <div className="flex items-center gap-2 mt-3 text-sm">
                <span className="font-medium">★ {vehicle.seller.stats.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({vehicle.seller.stats.reviewCount} reviews)</span>
              </div>
            )}
            <Link href={`/messages?with=${vehicle.seller.id}`} className="mt-3 block">
              <Button variant="outline" size="sm" className="w-full">Message Seller</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Comments section (visible on desktop alongside tabs) */}
      <section className="mt-12">
        <CommentsSection vehicleId={vehicle.id} />
      </section>

      {/* Similar Vehicles */}
      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Vehicles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
        </section>
      )}

      <BidModal
        open={bidOpen}
        onOpenChange={setBidOpen}
        auction={auction}
        vehicle={vehicle}
        onBidPlaced={handleBidPlaced}
        onEnterLiveRoom={() => setRoomOpen(true)}
      />
      {auction && (
        <EnterAuctionRoomModal
          open={roomOpen}
          onOpenChange={setRoomOpen}
          auction={auction}
        />
      )}
      {auction && (
        <AuctionWonModal
          open={wonOpen}
          onOpenChange={setWonOpen}
          auction={auction}
          vehicle={vehicle}
        />
      )}
    </div>
  );
}
