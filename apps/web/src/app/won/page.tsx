import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, Gavel, Package, MapPin, ExternalLink, Plus } from "lucide-react";
import { auctionService } from "@carasta/mock-data/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Won Auctions — Carasta" };

export default async function WonAuctionsPage() {
  const result = await auctionService.getAuctions({ pageSize: 20 });
  const wonAuctions = result.data.filter((a) => a.status === "completed").slice(0, 6);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" /> Won Auctions
          </h1>
          <p className="text-muted-foreground mt-0.5">{wonAuctions.length} vehicles purchased</p>
        </div>
        <Link href="/auctions">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Gavel className="h-4 w-4" /> Browse Auctions
          </Button>
        </Link>
      </div>

      {wonAuctions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border bg-card">
          <Trophy className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="font-semibold text-lg mb-1">No Wins Yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Place bids on live auctions to win your dream car.</p>
          <Link href="/auctions">
            <Button variant="bid">Browse Live Auctions</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wonAuctions.map((auction) => {
            const img = auction.vehicle.images[0];
            return (
              <div key={auction.id} className="rounded-2xl border bg-card overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  {img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.url} alt={auction.vehicle.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-yellow-500 text-white border-0 gap-1">
                      <Trophy className="h-3 w-3" /> Won
                    </Badge>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold truncate">{auction.vehicle.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {auction.vehicle.location.city}, {auction.vehicle.location.state}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Final price</p>
                      <p className="text-lg font-bold">{formatPrice(auction.finalPrice ?? auction.currentBid)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Bids</p>
                      <p className="font-semibold">{auction.bidCount}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Link href={`/won/${auction.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-1.5">
                        <Package className="h-3.5 w-3.5" /> View Details
                      </Button>
                    </Link>
                    <Link href={`/vehicles/${auction.vehicle.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1.5">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
