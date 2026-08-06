import type { Metadata } from "next";
import { auctionService } from "@carasta/mock-data/services";
import Link from "next/link";
import { BarChart3, Eye, TrendingUp, Users, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { SellerAnalyticsChart } from "@/app/sell/listings/SellerAnalyticsChart";

export const metadata: Metadata = { title: "My Listings — Carasta" };

export default async function ListPage() {
  const result = await auctionService.getAuctions({ pageSize: 12 });
  const myAuctions = result.data.slice(0, 5);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Listings</h1>
          <p className="text-muted-foreground mt-0.5">Track bids, views, and auction performance</p>
        </div>
        <Link href="/list/new">
          <Button>
            <Plus className="h-4 w-4 mr-1.5" /> New Listing
          </Button>
        </Link>
      </div>

      {/* Analytics overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Views", value: "8,420", icon: Eye, color: "text-blue-500" },
          { label: "Active Bids", value: "47", icon: TrendingUp, color: "text-bid" },
          { label: "Watchers", value: "312", icon: Users, color: "text-purple-500" },
          { label: "Avg. Bid", value: "$84K", icon: BarChart3, color: "text-green-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Bid trend chart */}
      <div className="rounded-2xl border bg-card p-6 mb-8">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4" /> Bid Activity (Last 7 Days)
        </h3>
        <SellerAnalyticsChart />
      </div>

      {/* Listings table */}
      <div className="rounded-2xl border overflow-hidden">
        <div className="px-4 py-3 bg-muted/30 flex items-center justify-between">
          <h3 className="font-semibold text-sm">Active Listings</h3>
        </div>
        <div className="divide-y">
          {myAuctions.map((auction) => (
            <div key={auction.id} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/20">
              <div className="h-12 w-16 rounded-xl overflow-hidden bg-muted shrink-0">
                {auction.vehicle.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={auction.vehicle.images[0].url} alt={auction.vehicle.title} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{auction.vehicle.title}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{auction.watcherCount} watchers</span>
                  <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{auction.bidCount} bids</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold">{formatPrice(auction.currentBid)}</p>
                <Badge variant={auction.status === "live" ? "live" : "ending"} className="text-[10px] mt-1">{auction.status}</Badge>
              </div>
              <Link href={`/auctions/${auction.vehicle.id}`}>
                <Button variant="ghost" size="sm" className="text-xs">Manage</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
