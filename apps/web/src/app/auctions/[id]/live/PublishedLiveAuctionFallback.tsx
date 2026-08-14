"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Auction } from "@carasta/types";
import { LiveAuctionClient } from "./LiveAuctionClient";
import { PublishedListingService } from "@/components/listing/services/published-listing-service";
import { Button } from "@/components/ui/button";

/** Client fallback when mock auctionService misses a seller-published listing. */
export function PublishedLiveAuctionFallback({ id }: { id: string }) {
  const router = useRouter();
  const [auction, setAuction] = useState<Auction | null | undefined>(undefined);

  useEffect(() => {
    const record = PublishedListingService.resolve(id);
    const next = record?.auction ?? null;
    if (next && next.id !== id) {
      router.replace(`/auctions/${next.id}/live`);
      return;
    }
    setAuction(next);
  }, [id, router]);

  if (auction === undefined) {
    return (
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-16 text-center text-muted-foreground">
        Loading live room…
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">Auction not found</h1>
        <p className="text-sm text-muted-foreground">
          This live auction may have been published in another browser session.
        </p>
        <Button asChild variant="outline">
          <Link href="/auctions">Browse auctions</Link>
        </Button>
      </div>
    );
  }

  return <LiveAuctionClient initialAuction={auction} />;
}
