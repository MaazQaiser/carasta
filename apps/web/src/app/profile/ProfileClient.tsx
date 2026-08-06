"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  MapPin,
  Settings,
  CheckCircle,
  Star,
  Car,
  Gavel,
  ShoppingBag,
  Heart,
  Users,
  NotebookPen,
} from "lucide-react";
import type { Auction, GarageEntry, User } from "@carasta/types";
import type { ProfileBid, ProfilePurchase, ProfileTabData } from "@carasta/mock-data/services";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PostCard } from "@/components/community/PostCard";
import { PublishedListingService } from "@/components/listing/services/published-listing-service";
import { cn, formatPrice, formatMileage } from "@/lib/utils";

type ProfileMode = "system" | "community";

interface Props {
  user: User;
  isOwn: boolean;
  tabs: ProfileTabData;
}

function EmptyTab({
  icon: Icon,
  message,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center py-12 text-center text-muted-foreground">
      <Icon className="h-10 w-10 mb-3 opacity-30" />
      <p>{message}</p>
      {action}
    </div>
  );
}

function GarageCard({ entry }: { entry: GarageEntry }) {
  const img = entry.vehicle.images[0];
  return (
    <div className="rounded-2xl border bg-card overflow-hidden hover:shadow-md transition-all duration-200 group">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img.url}
            alt={img.alt}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : null}
        <div className="absolute top-3 left-3">
          <Badge
            variant={
              entry.type === "owned" ? "default" : entry.type === "wishlist" ? "upcoming" : "sold"
            }
            className="capitalize text-xs"
          >
            {entry.type === "auction-win" ? "Auction Win" : entry.type}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <Link
          href={`/vehicles/${entry.vehicle.id}`}
          className="font-semibold text-sm hover:underline line-clamp-2 block"
        >
          {entry.vehicle.title}
        </Link>
        <p className="text-xs text-muted-foreground mt-1">
          {formatMileage(entry.vehicle.spec.mileage)} · {entry.vehicle.spec.transmission}
        </p>
        {entry.purchasePrice ? (
          <p className="text-sm font-medium mt-2">{formatPrice(entry.purchasePrice)}</p>
        ) : null}
      </div>
    </div>
  );
}

function ListingCard({ auction }: { auction: Auction }) {
  const img = auction.vehicle.images[0];
  return (
    <Link
      href={`/vehicles/${auction.vehicle.id}`}
      className="rounded-2xl border bg-card overflow-hidden hover:shadow-md transition-all duration-200 block"
    >
      <div className="aspect-[16/10] bg-muted overflow-hidden">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="capitalize text-[10px]">
            {auction.status.replace("-", " ")}
          </Badge>
        </div>
        <p className="font-semibold text-sm line-clamp-2">{auction.vehicle.title}</p>
        <p className="text-sm font-medium mt-2">{formatPrice(auction.currentBid)}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{auction.bidCount} bids</p>
      </div>
    </Link>
  );
}

function BidRow({ bid }: { bid: ProfileBid }) {
  return (
    <Link
      href={`/vehicles/${bid.auction.vehicle.id}`}
      className="flex items-center gap-4 p-4 rounded-2xl border bg-card hover:shadow-sm transition-shadow"
    >
      <div className="h-16 w-24 rounded-xl overflow-hidden bg-muted shrink-0">
        {bid.auction.vehicle.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bid.auction.vehicle.images[0].url}
            alt={bid.auction.vehicle.images[0].alt}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{bid.auction.vehicle.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 capitalize">
          {bid.auction.status.replace("-", " ")} · Your bid {formatPrice(bid.amount)}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold">{formatPrice(bid.auction.currentBid)}</p>
        <Badge variant={bid.isLeading ? "default" : "secondary"} className="mt-1 text-[10px]">
          {bid.isLeading ? "Leading" : "Outbid"}
        </Badge>
      </div>
    </Link>
  );
}

function PurchaseRow({ purchase }: { purchase: ProfilePurchase }) {
  return (
    <Link
      href={`/vehicles/${purchase.vehicleId}`}
      className="flex items-center gap-4 p-4 rounded-2xl border bg-card hover:shadow-sm transition-shadow"
    >
      <div className="h-16 w-24 rounded-xl overflow-hidden bg-muted shrink-0">
        {purchase.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={purchase.imageUrl} alt={purchase.vehicleTitle} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{purchase.vehicleTitle}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Purchased {new Date(purchase.purchasedAt).toLocaleDateString()}
        </p>
      </div>
      <p className="text-sm font-semibold shrink-0">{formatPrice(purchase.amount)}</p>
    </Link>
  );
}

function FollowerRow({ follower }: { follower: User }) {
  return (
    <Link
      href={`/profile/${follower.username}`}
      className="flex items-center gap-3 p-3 rounded-2xl border bg-card hover:shadow-sm transition-shadow"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={follower.avatar?.url} alt={follower.displayName} />
        <AvatarFallback>{follower.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm truncate">{follower.displayName}</p>
        <p className="text-xs text-muted-foreground">@{follower.username}</p>
      </div>
      {follower.isVerified ? <Badge variant="secondary" className="text-[10px]">Verified</Badge> : null}
    </Link>
  );
}

export function ProfileClient({ user, isOwn, tabs }: Props) {
  const searchParams = useSearchParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [mode, setMode] = useState<ProfileMode>("system");
  const [systemTab, setSystemTab] = useState("garage");
  const [publishedListings, setPublishedListings] = useState<Auction[]>([]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "listings" || tab === "garage" || tab === "bids" || tab === "purchases" || tab === "saved" || tab === "followers" || tab === "following") {
      setMode("system");
      setSystemTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isOwn) {
      setPublishedListings([]);
      return;
    }
    setPublishedListings(PublishedListingService.getAuctionsForSeller(user.id));
  }, [isOwn, user.id]);

  const listings = useMemo(() => {
    const builderListings = isOwn
      ? publishedListings
      : PublishedListingService.getAuctionsForSeller(user.id);
    // Drop the fabricated profile fallback once real builder listings exist.
    const seed = tabs.listings.filter(
      (auction) =>
        auction.id !== "profile-listing-1" || builderListings.length === 0
    );
    const seen = new Set(builderListings.map((a) => a.id));
    return [...builderListings, ...seed.filter((a) => !seen.has(a.id))];
  }, [isOwn, publishedListings, tabs.listings, user.id]);

  const systemStats = [
    { label: "Vehicles Listed", value: Math.max(user.stats.totalListings, listings.length) },
    { label: "Sales", value: user.stats.totalSales },
    { label: "Bids Placed", value: user.stats.totalBids },
    { label: "Followers", value: user.stats.followersCount.toLocaleString() },
    { label: "Following", value: user.stats.followingCount.toLocaleString() },
  ];

  const communityStats = [
    { label: "Posts", value: tabs.posts.length },
    { label: "Followers", value: user.stats.followersCount.toLocaleString() },
    { label: "Following", value: user.stats.followingCount.toLocaleString() },
    { label: "Garage", value: tabs.garage.length },
    { label: "Auctions", value: listings.length + tabs.bids.length },
  ];

  const stats = mode === "system" ? systemStats : communityStats;
  const garageEntries = tabs.garage;
  const savedEntries =
    tabs.saved.length > 0 ? tabs.saved : tabs.garage.filter((e) => e.type === "wishlist");
  const communityGarage = tabs.garage.filter(
    (e) => e.type === "owned" || e.type === "auction-win"
  );

  return (
    <div className="mx-auto max-w-screen-xl px-4 lg:px-6 py-8">
      {/* Cover */}
      <div className="h-40 lg:h-56 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-muted overflow-hidden mb-0 relative">
        {user.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.coverImage.url} alt="Cover" className="h-full w-full object-cover" />
        )}
      </div>

      {/* Profile header */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16 px-4 mb-6">
        <div className="relative">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-background">
            <AvatarImage src={user.avatar?.url} alt={user.displayName} />
            <AvatarFallback className="text-2xl">{user.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {user.isVerified && (
            <div className="absolute bottom-0 right-0 h-8 w-8 bg-primary rounded-full flex items-center justify-center border-2 border-background">
              <CheckCircle className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 sm:pb-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            {user.isVerified && <Badge variant="secondary">✓ Verified</Badge>}
            {user.isSeller && <Badge variant="outline">Seller</Badge>}
          </div>
          <p className="text-muted-foreground">@{user.username}</p>
          {user.location && (
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3.5 w-3.5" />
              {user.location}
            </p>
          )}
        </div>

        <div className="flex gap-2 sm:pb-2">
          {isOwn ? (
            <>
              <Link href="/profile/settings">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Settings className="h-4 w-4" /> Settings
                </Button>
              </Link>
              {mode === "system" ? (
                <Link href="/listing">
                  <Button size="sm">Sell a Vehicle</Button>
                </Link>
              ) : (
                <Link href="/carmunity">
                  <Button size="sm">Open Carmunity</Button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href={`/messages?with=${user.id}`}>
                <Button variant="outline" size="sm">
                  Message
                </Button>
              </Link>
              <Button
                size="sm"
                variant={isFollowing ? "secondary" : "default"}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Profile mode switcher */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(
          [
            { id: "system" as const, label: "System Profile" },
            { id: "community" as const, label: "Community Profile" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
              mode === item.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/50"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Bio + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          {user.bio && <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{user.bio}</p>}
          {user.stats.rating && mode === "system" ? (
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-semibold">{user.stats.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({user.stats.reviewCount} reviews)</span>
            </div>
          ) : null}
          {mode === "community" ? (
            <p className="text-xs text-muted-foreground">
              Carmunity presence — posts, auctions, and garage.
            </p>
          ) : null}
        </div>
        <div className="lg:col-span-3">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {stats.map(({ label, value }) => (
              <div key={label} className="text-center p-3 rounded-xl border bg-card">
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator className="mb-6" />

      {mode === "system" ? (
        <Tabs value={systemTab} onValueChange={setSystemTab} key="system">
          <TabsList className="mb-6">
            <TabsTrigger value="garage">Garage</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            {isOwn && <TabsTrigger value="bids">My Bids</TabsTrigger>}
            {isOwn && <TabsTrigger value="purchases">Purchases</TabsTrigger>}
            {isOwn && <TabsTrigger value="saved">Saved</TabsTrigger>}
            <TabsTrigger value="followers">Followers</TabsTrigger>
          </TabsList>

          <TabsContent value="garage">
            {garageEntries.length === 0 ? (
              <EmptyTab
                icon={Car}
                message="Garage is empty"
                action={
                  isOwn ? (
                    <Link href="/garage" className="mt-3">
                      <Button variant="outline" size="sm">
                        Open Garage
                      </Button>
                    </Link>
                  ) : undefined
                }
              />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {garageEntries.map((entry) => (
                    <GarageCard key={entry.id} entry={entry} />
                  ))}
                </div>
                {isOwn ? (
                  <div className="flex justify-center pt-2">
                    <Link href="/garage">
                      <Button variant="outline" size="sm">
                        Open Garage
                      </Button>
                    </Link>
                  </div>
                ) : null}
              </div>
            )}
          </TabsContent>

          <TabsContent value="listings">
            {listings.length === 0 ? (
              <EmptyTab
                icon={Gavel}
                message="No active listings"
                action={
                  isOwn ? (
                    <Link href="/listing" className="mt-3">
                      <Button variant="outline" size="sm">
                        Create Listing
                      </Button>
                    </Link>
                  ) : undefined
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((auction) => (
                  <ListingCard key={auction.id} auction={auction} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bids">
            {tabs.bids.length === 0 ? (
              <EmptyTab
                icon={Gavel}
                message="No active bids"
                action={
                  <Link href="/auctions" className="mt-3">
                    <Button variant="outline" size="sm">
                      Browse Auctions
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-3">
                {tabs.bids.map((bid) => (
                  <BidRow key={bid.id} bid={bid} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="purchases">
            {tabs.purchases.length === 0 ? (
              <EmptyTab icon={ShoppingBag} message="No purchases yet" />
            ) : (
              <div className="space-y-3">
                {tabs.purchases.map((purchase) => (
                  <PurchaseRow key={purchase.id} purchase={purchase} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved">
            {savedEntries.length === 0 ? (
              <EmptyTab icon={Heart} message="No saved vehicles" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedEntries.map((entry) => (
                  <GarageCard key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="followers">
            {tabs.followers.length === 0 ? (
              <EmptyTab icon={Heart} message="No followers yet" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tabs.followers.map((follower) => (
                  <FollowerRow key={follower.id} follower={follower} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Tabs defaultValue="posts" key="community">
          <TabsList className="mb-6">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="bio">Bio</TabsTrigger>
            <TabsTrigger value="auctions">Auctions</TabsTrigger>
            <TabsTrigger value="garage">Garage</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            {isOwn ? (
              <Link
                href="/carmunity?compose=1"
                className="mb-5 flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-sm text-muted-foreground hover:border-primary/40 transition-colors"
              >
                <NotebookPen className="h-4 w-4" />
                Create a post in Carmunity…
              </Link>
            ) : null}
            {tabs.posts.length === 0 ? (
              <EmptyTab
                icon={Users}
                message="No posts yet"
                action={
                  isOwn ? (
                    <Link href="/carmunity?compose=1" className="mt-3">
                      <Button variant="outline" size="sm">
                        Create Post
                      </Button>
                    </Link>
                  ) : undefined
                }
              />
            ) : (
              <div className="space-y-5 max-w-2xl">
                {tabs.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bio">
            <div className="rounded-2xl border bg-card p-5 space-y-4 max-w-2xl">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</p>
                <p className="font-semibold mt-1">{user.displayName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Username</p>
                <p className="font-semibold mt-1">@{user.username}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bio</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {user.bio || "No bio yet."}
                </p>
              </div>
              {user.location ? (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Location
                  </p>
                  <p className="text-sm mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {user.location}
                  </p>
                </div>
              ) : null}
              {user.socialLinks ? (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Social
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.socialLinks.instagram ? (
                      <Badge variant="outline">Instagram</Badge>
                    ) : null}
                    {user.socialLinks.youtube ? <Badge variant="outline">YouTube</Badge> : null}
                    {user.socialLinks.website ? <Badge variant="outline">Website</Badge> : null}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No linked social profiles yet.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="auctions">
            {listings.length === 0 && tabs.bids.length === 0 ? (
              <EmptyTab icon={Gavel} message="No auction activity yet" />
            ) : (
              <div className="space-y-6">
                {listings.length > 0 ? (
                  <div>
                    <h3 className="font-semibold text-sm mb-3">Listings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {listings.map((auction) => (
                        <ListingCard key={auction.id} auction={auction} />
                      ))}
                    </div>
                  </div>
                ) : null}
                {tabs.bids.length > 0 ? (
                  <div>
                    <h3 className="font-semibold text-sm mb-3">Bids</h3>
                    <div className="space-y-3">
                      {tabs.bids.map((bid) => (
                        <BidRow key={bid.id} bid={bid} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </TabsContent>

          <TabsContent value="garage">
            {communityGarage.length === 0 ? (
              <EmptyTab
                icon={Car}
                message="Garage is empty"
                action={
                  isOwn ? (
                    <Link href="/garage" className="mt-3">
                      <Button variant="outline" size="sm">
                        Open Garage
                      </Button>
                    </Link>
                  ) : undefined
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {communityGarage.map((entry) => (
                  <GarageCard key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="followers">
            {tabs.followers.length === 0 ? (
              <EmptyTab icon={Users} message="No followers yet" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tabs.followers.map((follower) => (
                  <FollowerRow key={follower.id} follower={follower} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="following">
            {tabs.following.length === 0 ? (
              <EmptyTab icon={Users} message="Not following anyone yet" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tabs.following.map((person) => (
                  <FollowerRow key={person.id} follower={person} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
