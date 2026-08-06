import type { Metadata } from "next";
import { postService } from "@carasta/mock-data/services";
import Link from "next/link";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Clubs" };

export default async function ClubsPage() {
  const result = await postService.getClubs();
  const clubs = result.data;

  return (
    <div className="mx-auto max-w-screen-xl px-4 lg:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Clubs</h1>
          <p className="text-muted-foreground mt-1">Find your people — join a club</p>
        </div>
        <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Create Club</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <div key={club.id} className="rounded-2xl border bg-card overflow-hidden hover:shadow-md transition-all">
            <div className="h-32 overflow-hidden bg-muted">
              {club.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={club.coverImage.url} alt={club.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{club.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{club.description}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{club.memberCount.toLocaleString()} members</span>
                <span>{club.postCount.toLocaleString()} posts</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {club.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] bg-muted px-2 py-0.5 rounded-full">#{tag}</span>
                ))}
              </div>
              <Button variant={club.isJoined ? "secondary" : "default"} size="sm" className="mt-3 w-full">
                {club.isJoined ? "Joined" : "Join Club"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
