import type { Metadata } from "next";
import { Suspense } from "react";
import { auctionService } from "@carasta/mock-data/services";
import { LiveAuctionClient } from "./LiveAuctionClient";
import { PublishedLiveAuctionFallback } from "./PublishedLiveAuctionFallback";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const auction = await auctionService.getAuction(id);
  if (!auction) return { title: "Live Auction" };
  return { title: `LIVE: ${auction.vehicle.title}` };
}

export default async function LiveAuctionPage({ params }: Props) {
  const { id } = await params;
  const auction = await auctionService.getAuction(id);

  if (!auction) {
    return (
      <Suspense
        fallback={
          <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-16 text-center text-muted-foreground">
            Loading live room…
          </div>
        }
      >
        <PublishedLiveAuctionFallback id={id} />
      </Suspense>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-16 text-center text-muted-foreground">
          Loading live room…
        </div>
      }
    >
      <LiveAuctionClient initialAuction={auction} />
    </Suspense>
  );
}
