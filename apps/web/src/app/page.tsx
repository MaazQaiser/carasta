import type { Metadata } from "next";
import { auctionService, postService } from "@carasta/mock-data/services";
import { HomePageClient } from "./HomePageClient";

export const metadata: Metadata = {
  title: "Carasta — Bid, Win & Connect",
};

export default async function HomePage() {
  const [featuredAuctions, endingSoon, upcomingAuctions, communityHighlights, carmunityFeed] =
    await Promise.all([
      auctionService.getFeaturedAuctions(6),
      auctionService.getEndingSoon(),
      auctionService.getUpcomingAuctions(),
      postService.getCommunityHighlights(4),
      postService.getFeed(1, 6),
    ]);

  return (
    <HomePageClient
      featuredAuctions={featuredAuctions}
      endingSoon={endingSoon}
      upcomingAuctions={upcomingAuctions}
      communityHighlights={communityHighlights}
      carmunityPosts={carmunityFeed.data}
    />
  );
}
