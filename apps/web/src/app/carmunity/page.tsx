import type { Metadata } from "next";
import { postService, userService, notificationService } from "@carasta/mock-data/services";
import { CarmunityClient } from "./CarmunityClient";

export const metadata: Metadata = {
  title: "Carmunity",
  description: "Discover builds, photos, and stories from the Carasta automotive community.",
};

export default async function CarmunityPage() {
  const [feed, clubs, stories, creators, notifications] = await Promise.all([
    postService.getFeed(1, 12),
    postService.getClubs(),
    postService.getStories(),
    userService.getCreators(8),
    notificationService.getNotifications(),
  ]);

  return (
    <CarmunityClient
      initialPosts={feed.data}
      clubs={clubs.data}
      stories={stories}
      creators={creators}
      notifications={notifications}
    />
  );
}
