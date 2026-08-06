import { Suspense } from "react";
import type { Metadata } from "next";
import { postService } from "@carasta/mock-data/services";
import { CarmunityClient } from "./CarmunityClient";

export const metadata: Metadata = {
  title: "Carmunity",
  description: "Discover builds, photos, and stories from the Carasta automotive community.",
};

export default async function CarmunityPage() {
  const [feed, clubs, stories] = await Promise.all([
    postService.getFeed(1, 12),
    postService.getClubs(),
    postService.getStories(),
  ]);

  return (
    <Suspense fallback={<div className="mx-auto max-w-[680px] px-4 py-10 text-sm text-muted-foreground">Loading Carmunity…</div>}>
      <CarmunityClient
        initialPosts={feed.data}
        clubs={clubs.data}
        stories={stories}
      />
    </Suspense>
  );
}
