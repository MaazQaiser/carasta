"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Settings, CheckCircle, Star, Car, Gavel, ShoppingBag, Heart } from "lucide-react";
import type { User } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface Props { user: User; isOwn: boolean }

export function ProfileClient({ user, isOwn }: Props) {
  const [isFollowing, setIsFollowing] = useState(false);

  const stats = [
    { label: "Vehicles Listed", value: user.stats.totalListings, icon: Car },
    { label: "Sales", value: user.stats.totalSales, icon: ShoppingBag },
    { label: "Bids Placed", value: user.stats.totalBids, icon: Gavel },
    { label: "Followers", value: user.stats.followersCount.toLocaleString(), icon: null },
    { label: "Following", value: user.stats.followingCount.toLocaleString(), icon: null },
  ];

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
              <MapPin className="h-3.5 w-3.5" />{user.location}
            </p>
          )}
        </div>

        <div className="flex gap-2 sm:pb-2">
          {isOwn ? (
            <>
              <Link href="/profile/settings">
                <Button variant="outline" size="sm" className="gap-1.5"><Settings className="h-4 w-4" /> Settings</Button>
              </Link>
              <Link href="/sell">
                <Button size="sm">Sell a Vehicle</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href={`/messages?with=${user.id}`}>
                <Button variant="outline" size="sm">Message</Button>
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

      {/* Bio + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          {user.bio && <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{user.bio}</p>}
          {user.stats.rating && (
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-semibold">{user.stats.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({user.stats.reviewCount} reviews)</span>
            </div>
          )}
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

      {/* Content tabs */}
      <Tabs defaultValue="garage">
        <TabsList className="mb-6">
          <TabsTrigger value="garage">Garage</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          {isOwn && <TabsTrigger value="bids">My Bids</TabsTrigger>}
          {isOwn && <TabsTrigger value="purchases">Purchases</TabsTrigger>}
          {isOwn && <TabsTrigger value="saved">Saved</TabsTrigger>}
          <TabsTrigger value="followers">Followers</TabsTrigger>
        </TabsList>

        <TabsContent value="garage">
          <div className="flex flex-col items-center py-12 text-center text-muted-foreground">
            <Car className="h-10 w-10 mb-3 opacity-30" />
            <p>Garage is empty</p>
            {isOwn && (
              <Link href="/garage" className="mt-3">
                <Button variant="outline" size="sm">Open Garage</Button>
              </Link>
            )}
          </div>
        </TabsContent>

        <TabsContent value="listings">
          <div className="flex flex-col items-center py-12 text-center text-muted-foreground">
            <Gavel className="h-10 w-10 mb-3 opacity-30" />
            <p>No active listings</p>
            {isOwn && (
              <Link href="/sell" className="mt-3">
                <Button variant="outline" size="sm">Create Listing</Button>
              </Link>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bids">
          <div className="flex flex-col items-center py-12 text-center text-muted-foreground">
            <Gavel className="h-10 w-10 mb-3 opacity-30" />
            <p>No active bids</p>
            <Link href="/auctions" className="mt-3">
              <Button variant="outline" size="sm">Browse Auctions</Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="purchases">
          <div className="flex flex-col items-center py-12 text-center text-muted-foreground">
            <ShoppingBag className="h-10 w-10 mb-3 opacity-30" />
            <p>No purchases yet</p>
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="flex flex-col items-center py-12 text-center text-muted-foreground">
            <Heart className="h-10 w-10 mb-3 opacity-30" />
            <p>No saved vehicles</p>
          </div>
        </TabsContent>

        <TabsContent value="followers">
          <div className="flex flex-col items-center py-12 text-center text-muted-foreground">
            <p>{user.stats.followersCount.toLocaleString()} followers</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
