"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Plus } from "lucide-react";
import type { Post, Club, Story, User } from "@carasta/types";
import { PostCard } from "@/components/community/PostCard";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Props {
  initialPosts: Post[];
  clubs: Club[];
  stories: Story[];
  creators: User[];
}

export function CommunityClient({ initialPosts, clubs, stories, creators }: Props) {
  const [following, setFollowing] = useState<string[]>([]);
  const [joinedClubs, setJoinedClubs] = useState<string[]>(clubs.filter((c) => c.isJoined).map((c) => c.id));

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main feed */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Community</h1>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Create Post
            </Button>
          </div>

          {/* Stories */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-6">
            {/* Add story */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="h-14 w-14 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted">
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-[10px] text-muted-foreground">Your Story</span>
            </div>
            {stories.map((story) => (
              <div key={story.id} className="flex flex-col items-center gap-1 shrink-0">
                <div className="h-14 w-14 rounded-full ring-2 ring-bid overflow-hidden cursor-pointer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={story.mediaUrl} alt={story.author.displayName} className="h-full w-full object-cover" />
                </div>
                <span className="text-[10px] text-muted-foreground max-w-[56px] truncate text-center">{story.author.username}</span>
              </div>
            ))}
          </div>

          <Tabs defaultValue="for-you">
            <TabsList className="mb-6">
              <TabsTrigger value="for-you">For You</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="builds">Builds</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            <TabsContent value="for-you" className="space-y-6">
              {initialPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>
            <TabsContent value="following">
              <div className="flex flex-col items-center py-16 text-center">
                <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="font-semibold mb-1">Follow some creators</p>
                <p className="text-sm text-muted-foreground">Posts from people you follow will appear here.</p>
              </div>
            </TabsContent>
            <TabsContent value="builds" className="space-y-6">
              {initialPosts.filter((p) => p.type === "build").map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>
            <TabsContent value="events">
              <div className="flex flex-col items-center py-16 text-center">
                <p className="text-muted-foreground">Car events coming soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Suggested creators */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="font-semibold mb-4">Suggested Creators</h3>
            <div className="space-y-3">
              {creators.map((creator) => (
                <div key={creator.id} className="flex items-center gap-3">
                  <Link href={`/profile/${creator.username}`}>
                    <Avatar className="h-10 w-10 cursor-pointer">
                      <AvatarImage src={creator.avatar?.url} alt={creator.displayName} />
                      <AvatarFallback>{creator.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/profile/${creator.username}`} className="text-sm font-semibold hover:underline truncate block">
                      {creator.displayName}
                    </Link>
                    <p className="text-xs text-muted-foreground">{creator.stats.followersCount.toLocaleString()} followers</p>
                  </div>
                  <Button
                    variant={following.includes(creator.id) ? "secondary" : "outline"}
                    size="sm"
                    className="shrink-0 h-7 text-xs"
                    onClick={() => setFollowing((prev) => prev.includes(creator.id) ? prev.filter((id) => id !== creator.id) : [...prev, creator.id])}
                  >
                    {following.includes(creator.id) ? "Following" : "Follow"}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Clubs */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="font-semibold mb-4">Popular Clubs</h3>
            <div className="space-y-3">
              {clubs.slice(0, 4).map((club) => (
                <div key={club.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl overflow-hidden bg-muted shrink-0">
                    {club.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={club.coverImage.url} alt={club.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{club.name}</p>
                    <p className="text-xs text-muted-foreground">{club.memberCount.toLocaleString()} members</p>
                  </div>
                  <Button
                    variant={joinedClubs.includes(club.id) ? "secondary" : "outline"}
                    size="sm"
                    className="shrink-0 h-7 text-xs"
                    onClick={() => setJoinedClubs((prev) => prev.includes(club.id) ? prev.filter((id) => id !== club.id) : [...prev, club.id])}
                  >
                    {joinedClubs.includes(club.id) ? "Joined" : "Join"}
                  </Button>
                </div>
              ))}
            </div>
            <Link href="/community/clubs">
              <Button variant="ghost" size="sm" className="w-full mt-3 text-xs">View all clubs</Button>
            </Link>
          </div>

          {/* Trending hashtags */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="font-semibold mb-4">Trending</h3>
            <div className="flex flex-wrap gap-2">
              {["porsche", "911", "jdm", "musclecar", "supercar", "restoration", "carsandcoffee", "nsxr", "ferrari", "electric"].map((tag) => (
                <Link key={tag} href={`/community?tag=${tag}`}>
                  <span className="text-sm text-primary hover:underline cursor-pointer">#{tag}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
