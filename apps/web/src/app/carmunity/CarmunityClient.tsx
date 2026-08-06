"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, Plus, Users, X,
} from "lucide-react";
import type { Post, Club, Story, User as UserType } from "@carasta/types";
import { userService } from "@carasta/mock-data/services";
import { PostCard } from "@/components/community/PostCard";
import { CreatePostFab, CreatePostModal } from "@/components/community/create-post";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/context/auth-context";

interface Props {
  initialPosts: Post[];
  clubs: Club[];
  stories: Story[];
}

export function CarmunityClient({ initialPosts, clubs, stories }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [following, setFollowing] = useState<string[]>([]);
  const [joinedClubs, setJoinedClubs] = useState<string[]>(clubs.filter((c) => c.isJoined).map((c) => c.id));
  const [feedFilter, setFeedFilter] = useState<"for-you" | "following" | "builds" | "events">("for-you");

  // Search (independent, under composer)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTab, setSearchTab] = useState<"posts" | "people">("posts");
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [isPending, startTransition] = useTransition();

  const [createOpen, setCreateOpen] = useState(false);
  const [posts, setPosts] = useState(initialPosts);

  const filteredPosts = searchQuery.trim()
    ? posts.filter(
        (p) =>
          p.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.author.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.hashtags.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : posts;

  useEffect(() => {
    if (!searchQuery.trim() || searchTab !== "people") {
      setSearchResults([]);
      return;
    }
    const t = setTimeout(() => {
      startTransition(async () => {
        const results = await userService.searchUsers(searchQuery);
        setSearchResults(results);
      });
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery, searchTab]);

  // Deep-link entry: /carmunity?compose=1
  useEffect(() => {
    if (searchParams.get("compose") === "1" && user) {
      setCreateOpen(true);
      router.replace("/carmunity", { scroll: false });
    }
  }, [searchParams, user, router]);

  const openCreatePost = () => {
    if (!user) {
      router.push("/sign-in?redirect=/carmunity?compose=1");
      return;
    }
    setCreateOpen(true);
  };

  const feedPosts =
    feedFilter === "following"
      ? posts.filter((p) => following.includes(p.author.id))
      : feedFilter === "builds"
        ? posts.filter((p) => p.type === "build" || p.category === "build-update" || p.category === "restoration")
        : posts;

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-6">
      <div className="w-full max-w-[680px] mx-auto">
        {/* Stories — left-aligned, Add Story always first */}
        <div className="flex justify-start gap-3 overflow-x-auto scrollbar-hide pb-2 mb-5">
          <Link
            href={user ? "/carmunity" : "/sign-in?redirect=/carmunity"}
            className="flex flex-col items-center gap-1 shrink-0"
          >
            <div className="h-14 w-14 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted">
              {user?.avatar?.url ? (
                <div className="relative h-full w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar.url}
                    alt="Your story"
                    className="h-full w-full rounded-full object-cover opacity-80"
                  />
                  <span className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-background">
                    <Plus className="h-3 w-3" />
                  </span>
                </div>
              ) : (
                <Plus className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">Add story</span>
          </Link>
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center gap-1 shrink-0">
              <div className="h-14 w-14 rounded-full ring-2 ring-primary overflow-hidden cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={story.mediaUrl} alt={story.author.displayName} className="h-full w-full object-cover" />
              </div>
              <span className="text-[10px] text-muted-foreground max-w-[56px] truncate text-center">
                {story.author.username}
              </span>
            </div>
          ))}
        </div>

        {/* Composer entry — opens Create Post flow */}
        <div className="rounded-2xl border bg-card p-4 mb-4">
          <div className="flex gap-3 items-center">
            <Avatar className="h-9 w-9 shrink-0">
              {user ? (
                <>
                  <AvatarImage src={user.avatar?.url} />
                  <AvatarFallback>{user.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </>
              ) : (
                <AvatarFallback>?</AvatarFallback>
              )}
            </Avatar>
            <button
              type="button"
              className="flex-1 rounded-xl bg-muted/50 border px-4 py-2.5 text-sm text-left text-muted-foreground hover:bg-muted transition-colors"
              onClick={openCreatePost}
            >
              What&apos;s happening in your garage?
            </button>
            <Button
              type="button"
              variant="bid"
              size="sm"
              className="shrink-0 gap-1.5 hidden sm:inline-flex"
              onClick={openCreatePost}
            >
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </div>
        </div>

        {/* Search — independent, under composer */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full rounded-xl border bg-muted/30 pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search posts, people, hashtags…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {isSearching ? (
          <>
            <div className="flex justify-center gap-3 mb-5">
              {(["posts", "people"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSearchTab(t)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium border capitalize transition-colors",
                    searchTab === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "text-muted-foreground border-border hover:border-primary/50"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            {searchTab === "posts" ? (
              filteredPosts.length > 0 ? (
                <div className="space-y-5">
                  {filteredPosts.map((p) => (
                    <PostCard key={p.id} post={p} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-16 text-center">
                  <p className="font-semibold mb-1">No posts found</p>
                  <p className="text-sm text-muted-foreground">Try searching with different keywords</p>
                </div>
              )
            ) : isPending ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-xl border bg-card animate-pulse" />
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl border bg-card">
                    <Link href={`/profile/${u.username}`}>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={u.avatar?.url} />
                        <AvatarFallback>{u.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/profile/${u.username}`}
                        className="font-semibold text-sm hover:underline block truncate"
                      >
                        {u.displayName}
                      </Link>
                      <p className="text-xs text-muted-foreground">@{u.username}</p>
                    </div>
                    <Button
                      variant={following.includes(u.id) ? "secondary" : "outline"}
                      size="sm"
                      className="shrink-0 h-7 text-xs"
                      onClick={() =>
                        setFollowing((prev) =>
                          prev.includes(u.id) ? prev.filter((id) => id !== u.id) : [...prev, u.id]
                        )
                      }
                    >
                      {following.includes(u.id) ? "Following" : "Follow"}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-16 text-center">
                <p className="font-semibold mb-1">No people found</p>
                <p className="text-sm text-muted-foreground">Try a different name or username</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Feed filter tabs */}
            <div className="flex justify-start gap-3 mb-5 overflow-x-auto scrollbar-hide">
              {(["for-you", "following", "builds", "events"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFeedFilter(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors shrink-0 capitalize",
                    feedFilter === f
                      ? "bg-primary text-primary-foreground border-primary"
                      : "text-muted-foreground border-border hover:border-primary/50"
                  )}
                >
                  {f.replace("-", " ")}
                </button>
              ))}
            </div>

            {feedFilter === "events" ? (
              <div className="flex flex-col items-center py-16 text-center">
                <p className="text-muted-foreground">Car events coming soon.</p>
              </div>
            ) : feedPosts.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="font-semibold mb-1">
                  {feedFilter === "following" ? "Follow some creators" : "No posts yet"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {feedFilter === "following"
                    ? "Posts from people you follow will appear here."
                    : "Public posts from the community will appear here."}
                </p>
                {feedFilter !== "following" ? (
                  <Button variant="bid" size="sm" className="mt-4 gap-1.5" onClick={openCreatePost}>
                    <Plus className="h-4 w-4" />
                    Create Post
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="space-y-5">
                {feedPosts.map((post, index) => (
                  <React.Fragment key={post.id}>
                    <PostCard post={post} />
                    {index === 1 && clubs.length > 0 && (
                      <div className="rounded-2xl border bg-card p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-sm">Suggested Clubs</h3>
                          <span className="text-xs text-muted-foreground">Join a community</span>
                        </div>
                        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                          {clubs.slice(0, 6).map((club) => {
                            const joined = joinedClubs.includes(club.id);
                            return (
                              <div
                                key={club.id}
                                className="w-[180px] shrink-0 rounded-xl border bg-background overflow-hidden"
                              >
                                <div className="h-20 bg-muted relative">
                                  {club.coverImage && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={club.coverImage.url}
                                      alt={club.name}
                                      className="h-full w-full object-cover"
                                    />
                                  )}
                                </div>
                                <div className="p-3">
                                  <p className="text-sm font-semibold truncate">{club.name}</p>
                                  <p className="text-xs text-muted-foreground mb-2.5">
                                    {club.memberCount.toLocaleString()} members
                                  </p>
                                  <Button
                                    variant={joined ? "secondary" : "outline"}
                                    size="sm"
                                    className="w-full h-8 text-xs"
                                    onClick={() =>
                                      setJoinedClubs((prev) =>
                                        prev.includes(club.id)
                                          ? prev.filter((id) => id !== club.id)
                                          : [...prev, club.id]
                                      )
                                    }
                                  >
                                    {joined ? "Joined" : "Join"}
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {user ? <CreatePostFab onClick={openCreatePost} /> : null}

      <CreatePostModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onPublished={(post) => setPosts((prev) => [post, ...prev])}
      />
    </div>
  );
}
