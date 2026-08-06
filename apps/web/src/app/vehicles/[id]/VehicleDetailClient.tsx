"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart, Shield, FileText, ChevronLeft, ChevronRight, TrendingUp,
  MapPin, Gauge, Fuel, Settings, Eye, Users, Share2, CheckCircle, ExternalLink,
  MessageCircle, Send
} from "lucide-react";
import type { Vehicle, Auction, Bid } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CountdownTimer } from "@/components/auction/CountdownTimer";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { BidModal } from "@/components/auction/BidModal";
import { EnterAuctionRoomModal } from "@/components/auction/EnterAuctionRoomModal";
import { cn, formatPrice, formatMileage } from "@/lib/utils";
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
  const [auction, setAuction] = useState(initialAuction);
  const { isWatched, toggle } = useWatchlist();
  const { user } = useAuth();
  const watched = isWatched(vehicle.id);
  const isLeading = !!(auction && user && auction.leadingBidder?.id === user.id);

  const isOwner = !!(user && vehicle.seller.id === user.id);

  const handleBidPlaced = (bid: Bid) => {
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

  const specs = [
    { icon: Gauge, label: "Mileage", value: formatMileage(vehicle.spec.mileage) },
    { icon: Fuel, label: "Fuel", value: vehicle.spec.fuelType },
    { icon: Settings, label: "Transmission", value: vehicle.spec.transmission },
    { icon: Settings, label: "Drive", value: vehicle.spec.driveType.toUpperCase() },
    ...(vehicle.spec.horsepower ? [{ icon: TrendingUp, label: "Power", value: `${vehicle.spec.horsepower} hp` }] : []),
    { icon: MapPin, label: "Location", value: `${vehicle.location.city}, ${vehicle.location.state}` },
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
                </div>
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

            {/* Description / Build Sheet tab */}
            <TabsContent value="description" className="mt-6">
              <div className="rounded-2xl border overflow-hidden">
                {[
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
                    <span className="font-medium capitalize">{value}</span>
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
                  <div className="flex items-center justify-between">
                    <div>
                      {auction.status === "live" && <Badge variant="live">● LIVE</Badge>}
                      {auction.status === "ending-soon" && <Badge variant="ending">⚡ Ending Soon</Badge>}
                      {auction.status === "upcoming" && <Badge variant="upcoming">Upcoming</Badge>}
                      {auction.status === "completed" && <Badge variant="sold">Completed</Badge>}
                    </div>
                    <button onClick={() => { /* share */ }} className="text-muted-foreground hover:text-foreground">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">{auction.status === "completed" ? "Final Price" : "Current Bid"}</p>
                    <p className="text-4xl font-bold">{formatPrice(auction.currentBid)}</p>
                    {auction.reservePrice && !auction.reserveMet && (
                      <p className="text-xs text-orange-500 mt-1">Reserve not yet met</p>
                    )}
                  </div>

                  {auction.status !== "completed" && (
                    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted">
                      <span className="text-sm text-muted-foreground">Time remaining</span>
                      <CountdownTimer endTime={auction.endTime} size="default" />
                    </div>
                  )}

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

                  {auction.bids.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Recent Bids</p>
                      <div className="space-y-2">
                        {auction.bids.slice(0, 4).map((bid) => (
                          <div key={bid.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={bid.bidder.avatar?.url} alt={bid.bidder.displayName} />
                                <AvatarFallback className="text-[10px]">{bid.bidder.displayName.slice(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span className="text-muted-foreground">{bid.bidder.username}</span>
                            </div>
                            <span className="font-medium">{formatPrice(bid.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
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
        </div>

        {/* Right — Auction Panel */}
        <div className="space-y-4">
          {/* Auction block */}
          {auction ? (
            <div className="sticky top-20 rounded-2xl border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  {auction.status === "live" && <Badge variant="live">● LIVE</Badge>}
                  {auction.status === "ending-soon" && <Badge variant="ending">⚡ Ending Soon</Badge>}
                  {auction.status === "upcoming" && <Badge variant="upcoming">Upcoming</Badge>}
                  {auction.status === "completed" && <Badge variant="sold">Completed</Badge>}
                </div>
                <button onClick={() => { /* share */ }} className="text-muted-foreground hover:text-foreground">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">{auction.status === "completed" ? "Final Price" : "Current Bid"}</p>
                <p className="text-4xl font-bold">{formatPrice(auction.currentBid)}</p>
                {auction.reservePrice && !auction.reserveMet && (
                  <p className="text-xs text-orange-500 mt-1">Reserve not yet met</p>
                )}
              </div>

              {auction.status !== "completed" && (
                <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted">
                  <span className="text-sm text-muted-foreground">Time remaining</span>
                  <CountdownTimer endTime={auction.endTime} size="default" />
                </div>
              )}

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

              {/* Bid history preview */}
              {auction.bids.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Recent Bids</p>
                  <div className="space-y-2">
                    {auction.bids.slice(0, 4).map((bid) => (
                      <div key={bid.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={bid.bidder.avatar?.url} alt={bid.bidder.displayName} />
                            <AvatarFallback className="text-[10px]">{bid.bidder.displayName.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground">{bid.bidder.username}</span>
                        </div>
                        <span className="font-medium">{formatPrice(bid.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                <Shield className="h-3.5 w-3.5" />
                <span>Buyer protection on all purchases</span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border bg-card p-5 space-y-3">
              <p className="font-semibold">Asking Price</p>
              <p className="text-4xl font-bold">{formatPrice(vehicle.startingPrice)}</p>
              <Button variant="default" size="lg" className="w-full">Make an Offer</Button>
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
      />
      {auction && (
        <EnterAuctionRoomModal
          open={roomOpen}
          onOpenChange={setRoomOpen}
          auction={auction}
        />
      )}
    </div>
  );
}
