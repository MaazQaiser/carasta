"use client";

import React from "react";
import Link from "next/link";
import { Plus, Car, TrendingUp, Trophy, Heart, Gavel } from "lucide-react";
import type { GarageEntry, GarageStats, ListingDraft } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatMileage } from "@/lib/utils";

interface Props {
  entries: GarageEntry[];
  stats: GarageStats;
  drafts: ListingDraft[];
}

function GarageVehicleCard({ entry }: { entry: GarageEntry }) {
  const img = entry.vehicle.images[0];
  return (
    <div className="rounded-2xl border bg-card overflow-hidden hover:shadow-md transition-all duration-200 group">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img.url} alt={img.alt} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        )}
        <div className="absolute top-3 left-3">
          <Badge variant={entry.type === "owned" ? "default" : entry.type === "wishlist" ? "upcoming" : "sold"} className="capitalize text-xs">
            {entry.type}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <Link href={`/vehicles/${entry.vehicle.id}`} className="font-semibold text-sm hover:underline line-clamp-2 block">
          {entry.vehicle.title}
        </Link>
        <p className="text-xs text-muted-foreground mt-1">
          {formatMileage(entry.vehicle.spec.mileage)} · {entry.vehicle.spec.transmission}
        </p>
        {entry.purchasePrice && (
          <p className="text-sm font-medium mt-2">{formatPrice(entry.purchasePrice)}</p>
        )}
        {entry.maintenanceHistory.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">{entry.maintenanceHistory.length} maintenance record(s)</p>
        )}
        <div className="flex gap-2 mt-3">
          <Link href={`/vehicles/${entry.vehicle.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs">View</Button>
          </Link>
          {entry.type === "owned" && (
            <Link href={`/listing`} className="flex-1">
              <Button variant="default" size="sm" className="w-full text-xs">Sell</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function GarageClient({ entries, stats, drafts }: Props) {
  const owned = entries.filter((e) => e.type === "owned");
  const sold = entries.filter((e) => e.type === "sold");
  const wishlist = entries.filter((e) => e.type === "wishlist");
  const wins = entries.filter((e) => e.type === "auction-win");

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Garage</h1>
          <p className="text-muted-foreground mt-1">Your personal automotive collection</p>
        </div>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {[
          { icon: Car, label: "Total Vehicles", value: stats.totalVehicles, color: "text-primary" },
          { icon: Car, label: "Owned", value: stats.ownedCount, color: "text-green-600" },
          { icon: TrendingUp, label: "Sold", value: stats.soldCount, color: "text-blue-600" },
          { icon: Heart, label: "Wishlist", value: stats.wishlistCount, color: "text-red-500" },
          { icon: Trophy, label: "Auction Wins", value: stats.auctionWins, color: "text-bid" },
          { icon: TrendingUp, label: "Total Invested", value: formatPrice(stats.totalInvested, true), color: "text-muted-foreground", wide: true },
        ].map(({ icon: Icon, label, value, color, wide }) => (
          <div key={label} className={`rounded-2xl border bg-card p-4 ${wide ? "col-span-2 sm:col-span-2" : ""}`}>
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`h-4 w-4 ${color}`} />
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="owned">
        <TabsList className="mb-6">
          <TabsTrigger value="owned">Owned <Badge variant="secondary" className="ml-1.5 text-[10px]">{stats.ownedCount}</Badge></TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist <Badge variant="secondary" className="ml-1.5 text-[10px]">{stats.wishlistCount}</Badge></TabsTrigger>
          <TabsTrigger value="wins">Auction Wins <Badge variant="secondary" className="ml-1.5 text-[10px]">{stats.auctionWins}</Badge></TabsTrigger>
          <TabsTrigger value="sold">Sold <Badge variant="secondary" className="ml-1.5 text-[10px]">{stats.soldCount}</Badge></TabsTrigger>
          <TabsTrigger value="drafts">Drafts <Badge variant="secondary" className="ml-1.5 text-[10px]">{drafts.length}</Badge></TabsTrigger>
        </TabsList>

        {[
          { key: "owned", data: owned },
          { key: "wishlist", data: wishlist },
          { key: "wins", data: wins },
          { key: "sold", data: sold },
        ].map(({ key, data }) => (
          <TabsContent key={key} value={key}>
            {data.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <Car className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="font-semibold mb-1">Nothing here yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {key === "owned" ? "Add vehicles to track your collection." :
                   key === "wishlist" ? "Save vehicles you want to follow." :
                   key === "wins" ? "Vehicles you've won at auction appear here." :
                   "Your sold vehicles will appear here."}
                </p>
                <Link href={key === "wishlist" || key === "wins" ? "/auctions" : "/listing"}>
                  <Button variant="outline" size="sm">{key === "owned" ? "Add Vehicle" : key === "wishlist" || key === "wins" ? "Browse Auctions" : "Sell a Vehicle"}</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.map((entry) => <GarageVehicleCard key={entry.id} entry={entry} />)}
              </div>
            )}
          </TabsContent>
        ))}

        <TabsContent value="drafts">
          {drafts.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <Gavel className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="font-semibold mb-1">No drafts</p>
              <Link href="/listing"><Button variant="outline" size="sm">Start a Listing</Button></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {drafts.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between p-4 rounded-2xl border bg-card">
                  <div>
                    <p className="font-medium">{draft.data.make} {draft.data.model} {draft.data.year ?? ""}</p>
                    <p className="text-sm text-muted-foreground">Step {draft.step} of 8 · Last updated {new Date(draft.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex gap-1">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className={`h-1.5 w-4 rounded-full ${i < draft.step ? "bg-primary" : "bg-muted"}`} />
                      ))}
                    </div>
                    <Link href={`/sell?draft=${draft.id}`}>
                      <Button size="sm">Continue</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
