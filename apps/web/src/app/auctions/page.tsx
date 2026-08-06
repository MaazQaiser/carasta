import type { Metadata } from "next";
import { auctionService } from "@carasta/mock-data/services";
import { AuctionListClient } from "./AuctionListClient";

export const metadata: Metadata = {
  title: "Auctions",
  description: "Browse live, upcoming, and recently completed vehicle auctions.",
};

export default async function AuctionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; make?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const [liveAuctions, endingSoon, upcomingAuctions] = await Promise.all([
    auctionService.getLiveAuctions(),
    auctionService.getEndingSoon(),
    auctionService.getUpcomingAuctions(),
  ]);

  return (
    <AuctionListClient
      initialStatus={params.status}
      initialMake={params.make}
      liveCount={liveAuctions.length}
      endingSoonCount={endingSoon.length}
      upcomingCount={upcomingAuctions.length}
    />
  );
}
