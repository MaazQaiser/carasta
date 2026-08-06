import type { Metadata } from "next";
import { auctionService, vehicleService, postService } from "@carasta/mock-data/services";
import { HomePageClient } from "./HomePageClient";

export const metadata: Metadata = {
  title: "Carasta — Bid, Win & Connect",
};

export default async function HomePage() {
  const [featuredAuctions, endingSoon, upcomingAuctions, brands, communityHighlights] = await Promise.all([
    auctionService.getFeaturedAuctions(6),
    auctionService.getEndingSoon(),
    auctionService.getUpcomingAuctions(),
    vehicleService.getPopularBrands(),
    postService.getCommunityHighlights(4),
  ]);

  return (
    <HomePageClient
      featuredAuctions={featuredAuctions}
      endingSoon={endingSoon}
      upcomingAuctions={upcomingAuctions}
      brands={brands}
      communityHighlights={communityHighlights}
    />
  );
}
