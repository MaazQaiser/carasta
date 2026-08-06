"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Auction, Vehicle } from "@carasta/types";
import { VehicleDetailClient } from "@/app/vehicles/[id]/VehicleDetailClient";
import { PublishedListingService } from "@/components/listing/services/published-listing-service";
import { Button } from "@/components/ui/button";

export function PublishedAuctionFallback({ id }: { id: string }) {
  const [resolved, setResolved] = useState<{
    vehicle: Vehicle;
    auction: Auction;
  } | null | undefined>(undefined);

  useEffect(() => {
    const record = PublishedListingService.resolve(id);
    if (!record) {
      setResolved(null);
      return;
    }
    setResolved({
      vehicle: record.auction.vehicle,
      auction: record.auction,
    });
  }, [id]);

  if (resolved === undefined) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-sm text-muted-foreground">
        Loading listing…
      </div>
    );
  }

  if (!resolved) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">Listing not found</h1>
        <p className="text-sm text-muted-foreground">
          This listing may have been published in another browser session.
        </p>
        <Button asChild variant="outline">
          <Link href="/profile?tab=listings">Back to Profile Listings</Link>
        </Button>
      </div>
    );
  }

  return (
    <VehicleDetailClient
      vehicle={resolved.vehicle}
      auction={resolved.auction}
      similar={[]}
    />
  );
}
