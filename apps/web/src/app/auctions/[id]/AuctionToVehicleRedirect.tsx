"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublishedListingService } from "@/components/listing/services/published-listing-service";
import { Button } from "@/components/ui/button";

/** Resolves seller-published listings, then sends them to `/vehicles/{vehicleId}`. */
export function AuctionToVehicleRedirect({ id }: { id: string }) {
  const router = useRouter();
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const record = PublishedListingService.resolve(id);
    if (record) {
      router.replace(`/vehicles/${record.auction.vehicle.id}`);
      return;
    }
    setMissing(true);
  }, [id, router]);

  if (!missing) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-sm text-muted-foreground">
        Opening listing…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-4">
      <h1 className="text-2xl font-bold">Listing not found</h1>
      <p className="text-sm text-muted-foreground">
        This listing may have been published in another browser session.
      </p>
      <Button asChild variant="outline">
        <Link href="/auctions">Browse auctions</Link>
      </Button>
    </div>
  );
}
