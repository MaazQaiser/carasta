"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  Home, Search, PlusCircle, Bell, User, Plus, Users, Image as ImageIcon,
  Video, Send, X, Heart, MessageCircle, Repeat2, Share2, Flag, MoreHorizontal,
  TrendingUp, Gavel, Trophy, UserPlus, Car, Shield, Check,
} from "lucide-react";
import type { Post, Club, Story, User as UserType, Notification, NotificationType } from "@carasta/types";
import { userService } from "@carasta/mock-data/services";
import { PostCard } from "@/components/community/PostCard";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useAuth } from "@/lib/context/auth-context";

type Tab = "feed" | "search" | "compose" | "notifications" | "profile";

interface Props {
  initialPosts: Post[];
  clubs: Club[];
  stories: Story[];
  creators: UserType[];
  notifications: Notification[];
}

/* ── Guest placeholder ──────────────────────────────────── */
function GuestPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <User className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="font-semibold text-lg mb-1">Sign up to {label}</p>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Create an account to unlock the full Carmunity experience.
      </p>
      <div className="flex gap-3">
        <Link href="/sign-up">
          <Button variant="bid" size="sm">Sign Up</Button>
        </Link>
        <Link href="/sign-in">
          <Button variant="outline" size="sm">Log In</Button>
        </Link>
      </div>
    </div>
  );
}

/* ── Notification icon map ────────────────────────────────── */
const NOTIF_ICON: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  outbid: TrendingUp,
  "auction-ending": Gavel,
  "auction-won": Trophy,
  "auction-lost": Gavel,
  comment: MessageCircle,
  like: Heart,
  follower: UserPlus,
  "vehicle-sold": Car,
  "new-bid": Gavel,
  "offer-received": Car,
  "offer-accepted": Check,
  "offer-declined": Car,
  system: Shield,
};

const NOTIF_COLOR: Record<NotificationType, string> = {
  outbid: "text-red-500 bg-red-50",
  "auction-ending": "text-orange-500 bg-orange-50",
  "auction-won": "text-yellow-500 bg-yellow-50",
  "auction-lost": "text-muted-foreground bg-muted",
  comment: "text-blue-500 bg-blue-50",
  like: "text-pink-500 bg-pink-50",
  follower: "text-purple-500 bg-purple-50",
  "vehicle-sold": "text-green-500 bg-green-50",
  "new-bid": "text-amber-600 bg-amber-50",
  "offer-received": "text-blue-500 bg-blue-50",
  "offer-accepted": "text-green-500 bg-green-50",
  "offer-declined": "text-red-500 bg-red-50",
  system: "text-muted-foreground bg-muted",
};

function getNotifLink(n: Notification): string {
  if (n.actionUrl) return n.actionUrl;
  if (["auction-won", "auction-ending", "outbid", "new-bid", "auction-lost"].includes(n.type)) {
    const id = n.metadata?.vehicleId ?? n.metadata?.auctionId;
    return id ? `/auctions/${id}` : "/auctions";
  }
  if (["comment", "like"].includes(n.type)) {
    return n.metadata?.postId ? `/carmunity/posts/${n.metadata.postId}` : "/carmunity";
  }
  if (n.type === "follower") {
    return n.metadata?.userId ? `/profile/${n.metadata.userId}` : "/carmunity?tab=profile";
  }
  return "/carmunity";
}

/* ══════════════════════════════════════════════════════════ */
export function CarmunityClient({ initialPosts, clubs, stories, creators, notifications: initialNotifications }: Props) {
  const { user, isGuest } = useAuth();
  const [tab, setTab] = useState<Tab>("feed");
  const [following, setFollowing] = useState<string[]>([]);
  const [joinedClubs, setJoinedClubs] = useState<string[]>(clubs.filter((c) => c.isJoined).map((c) => c.id));

  // Feed sub-tab
  const [feedFilter, setFeedFilter] = useState<"for-you" | "following" | "builds" | "events">("for-you");

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTab, setSearchTab] = useState<"posts" | "people">("posts");
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [isPending, startTransition] = useTransition();

  const filteredPosts = searchQuery.trim()
    ? initialPosts.filter((p) =>
        p.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.hashtags.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : initialPosts;

  useEffect(() => {
    if (!searchQuery.trim() || searchTab !== "people") { setSearchResults([]); return; }
    const t = setTimeout(() => {
      startTransition(async () => {
        const results = await userService.searchUsers(searchQuery);
        setSearchResults(results);
      });
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery, searchTab]);

  // Compose
  const [composeText, setComposeText] = useState("");
  const [composeMedia, setComposeMedia] = useState<string[]>([]);
  const [posts, setPosts] = useState(initialPosts);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionResults, setMentionResults] = useState<UserType[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (val: string) => {
    setComposeText(val);
    const match = val.match(/@(\w*)$/);
    if (match) {
      const q = match[1] ?? "";
      setMentionQuery(q);
      if (q.length >= 1) {
        userService.searchUsers(q).then(setMentionResults);
      } else {
        setMentionResults([]);
      }
    } else {
      setMentionQuery("");
      setMentionResults([]);
    }
  };

  const insertMention = (username: string) => {
    setComposeText((prev) => prev.replace(/@\w*$/, `@${username} `));
    setMentionResults([]);
    setMentionQuery("");
  };

  const handleCreatePost = () => {
    if (!composeText.trim()) return;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: user!,
      caption: composeText.trim(),
      images: composeMedia.map((url, i) => ({ id: `img-${i}`, url, alt: "post image", width: 800, height: 600 })),
      hashtags: [...(composeText.match(/#(\w+)/g) ?? [])].map((h) => h.slice(1)),
      likes: 0,
      commentCount: 0,
      comments: [],
      shares: 0,
      views: 0,
      isLiked: false,
      type: "photo",
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
    setComposeText("");
    setComposeMedia([]);
    setTab("feed");
  };

  // Notifications
  const [notifs, setNotifs] = useState(initialNotifications);
  const [notifFilter, setNotifFilter] = useState<"all" | "auctions" | "social" | "system">("all");

  const filteredNotifs = notifs.filter((n) => {
    if (notifFilter === "all") return true;
    if (notifFilter === "auctions") return ["outbid", "auction-ending", "auction-won", "auction-lost", "new-bid"].includes(n.type);
    if (notifFilter === "social") return ["comment", "like", "follower"].includes(n.type);
    return ["vehicle-sold", "system", "offer-received", "offer-accepted", "offer-declined"].includes(n.type);
  });

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  const markRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));

  /* ── Tab content ───────────────────────────────────────── */
  const feedPosts =
    feedFilter === "following"
      ? posts.filter((p) => following.includes(p.author.id))
      : feedFilter === "builds"
      ? posts.filter((p) => p.type === "build")
      : posts;

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-6">
      {/* Sub-navigation */}
      <div className="flex items-center gap-1 border-b mb-6 overflow-x-auto scrollbar-hide">
        {(
          [
            { value: "feed", icon: Home, label: "Feed", badge: 0 },
            { value: "search", icon: Search, label: "Search", badge: 0 },
            { value: "compose", icon: PlusCircle, label: "Add Post", badge: 0 },
            { value: "notifications", icon: Bell, label: "Notifications", badge: unreadCount },
            { value: "profile", icon: User, label: "Profile", badge: 0 },
          ] satisfies { value: Tab; icon: React.ComponentType<{ className?: string }>; label: string; badge: number }[]
        ).map(({ value, icon: Icon, label, badge }) => (
          <button
            key={value}
            onClick={() => setTab(value as Tab)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors shrink-0",
              tab === value
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
            {badge && badge > 0 && (
              <span className="h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── FEED ─────────────────────────────────────────── */}
      {tab === "feed" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Stories */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-5">
              {user && (
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="h-14 w-14 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted">
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">Your Story</span>
                </div>
              )}
              {stories.map((story) => (
                <div key={story.id} className="flex flex-col items-center gap-1 shrink-0">
                  <div className="h-14 w-14 rounded-full ring-2 ring-primary overflow-hidden cursor-pointer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={story.mediaUrl} alt={story.author.displayName} className="h-full w-full object-cover" />
                  </div>
                  <span className="text-[10px] text-muted-foreground max-w-[56px] truncate text-center">{story.author.username}</span>
                </div>
              ))}
            </div>

            {/* Inline composer (for logged-in users) */}
            {user && (
              <div className="rounded-2xl border bg-card p-4 mb-6">
                <div className="flex gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={user.avatar?.url} />
                    <AvatarFallback>{user.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <button
                    className="flex-1 rounded-xl bg-muted/50 border px-4 py-2.5 text-sm text-left text-muted-foreground hover:bg-muted transition-colors"
                    onClick={() => setTab("compose")}
                  >
                    What&apos;s happening in your garage?
                  </button>
                </div>
              </div>
            )}

            {/* Feed filter tabs */}
            <div className="flex gap-3 mb-5 overflow-x-auto scrollbar-hide">
              {(["for-you", "following", "builds", "events"] as const).map((f) => (
                <button
                  key={f}
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
              </div>
            ) : (
              <div className="space-y-5">
                {feedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block space-y-6">
            {/* Suggested creators */}
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="font-semibold mb-4">Suggested Creators</h3>
              <div className="space-y-3">
                {creators.slice(0, 5).map((creator) => (
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
                      onClick={() => setFollowing((prev) =>
                        prev.includes(creator.id) ? prev.filter((id) => id !== creator.id) : [...prev, creator.id]
                      )}
                    >
                      {following.includes(creator.id) ? "Following" : "Follow"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular clubs */}
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
                      onClick={() =>
                        setJoinedClubs((prev) =>
                          prev.includes(club.id) ? prev.filter((id) => id !== club.id) : [...prev, club.id]
                        )
                      }
                    >
                      {joinedClubs.includes(club.id) ? "Joined" : "Join"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending hashtags */}
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="font-semibold mb-4">Trending</h3>
              <div className="flex flex-wrap gap-2">
                {["porsche", "911", "jdm", "musclecar", "supercar", "restoration", "carsandcoffee", "nsxr", "ferrari", "electric"].map((tag) => (
                  <Link key={tag} href={`/carmunity?tag=${tag}`}>
                    <span className="text-sm text-primary hover:underline cursor-pointer">#{tag}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SEARCH ───────────────────────────────────────── */}
      {tab === "search" && (
        <div className="max-w-2xl mx-auto">
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              className="w-full rounded-xl border bg-muted/30 pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search posts, people, hashtags…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setSearchQuery("")}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {searchQuery ? (
            <>
              <div className="flex gap-3 mb-5">
                {(["posts", "people"] as const).map((t) => (
                  <button
                    key={t}
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
                    {filteredPosts.map((p) => <PostCard key={p.id} post={p} />)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-16 text-center">
                    <p className="font-semibold mb-1">No posts found</p>
                    <p className="text-sm text-muted-foreground">Try searching with different keywords</p>
                  </div>
                )
              ) : (
                isPending ? (
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
                          <Link href={`/profile/${u.username}`} className="font-semibold text-sm hover:underline block truncate">{u.displayName}</Link>
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
                )
              )}
            </>
          ) : (
            <div className="flex flex-col items-center py-16 text-center">
              <Search className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="font-semibold mb-1">Try searching something</p>
              <p className="text-sm text-muted-foreground">Your search results will show up here</p>
            </div>
          )}
        </div>
      )}

      {/* ── COMPOSE ──────────────────────────────────────── */}
      {tab === "compose" && (
        !user && !isGuest ? (
          <GuestPlaceholder label="share posts, photos, and connect with the Carasta community" />
        ) : !user ? (
          <GuestPlaceholder label="share posts, photos, and connect with the Carasta community" />
        ) : (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-5">Create Post</h2>
            <div className="rounded-2xl border bg-card p-5 space-y-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={user.avatar?.url} />
                  <AvatarFallback>{user.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 relative">
                  <textarea
                    className="w-full rounded-xl border bg-muted/30 px-4 py-3 text-sm min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="What's happening? Use @ to mention someone, # for hashtags…"
                    value={composeText}
                    onChange={(e) => handleTextChange(e.target.value)}
                  />
                  {/* @mention dropdown */}
                  {mentionResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-xl border bg-background shadow-lg overflow-hidden">
                      {mentionResults.slice(0, 5).map((u) => (
                        <button
                          key={u.id}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-left"
                          onClick={() => insertMention(u.username)}
                        >
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={u.avatar?.url} />
                            <AvatarFallback className="text-[10px]">{u.displayName.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{u.displayName}</p>
                            <p className="text-xs text-muted-foreground">@{u.username}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Media previews */}
              {composeMedia.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {composeMedia.map((url, i) => (
                    <div key={i} className="relative h-20 w-20 rounded-xl overflow-hidden border bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="preview" className="h-full w-full object-cover" />
                      <button
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                        onClick={() => setComposeMedia((prev) => prev.filter((_, j) => j !== i))}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex gap-1">
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-4 w-4" /> Photo
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    <Video className="h-4 w-4" /> Video
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      files.forEach((f) => {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setComposeMedia((prev) => [...prev, ev.target?.result as string]);
                        };
                        reader.readAsDataURL(f);
                      });
                    }}
                  />
                </div>
                <Button
                  variant="bid"
                  size="sm"
                  className="gap-1.5"
                  onClick={handleCreatePost}
                  disabled={!composeText.trim() && composeMedia.length === 0}
                >
                  <Send className="h-4 w-4" /> Create Post
                </Button>
              </div>
            </div>
          </div>
        )
      )}

      {/* ── NOTIFICATIONS ─────────────────────────────────── */}
      {tab === "notifications" && (
        !user ? (
          <GuestPlaceholder label="receive notifications and stay up to date" />
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </h2>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="text-xs" onClick={markAllRead}>Mark all read</Button>
              )}
            </div>

            <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
              {(["all", "auctions", "social", "system"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setNotifFilter(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium border capitalize transition-colors shrink-0",
                    notifFilter === f
                      ? "bg-primary text-primary-foreground border-primary"
                      : "text-muted-foreground border-border hover:border-primary/50"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            {filteredNotifs.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="font-semibold mb-1">No Notifications</p>
                <p className="text-sm text-muted-foreground">You don&apos;t have any notifications yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredNotifs.map((n) => {
                  const Icon = NOTIF_ICON[n.type] ?? Bell;
                  const color = NOTIF_COLOR[n.type] ?? "text-muted-foreground bg-muted";
                  return (
                    <Link
                      key={n.id}
                      href={getNotifLink(n)}
                      onClick={() => markRead(n.id)}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors",
                        !n.isRead && "bg-primary/5"
                      )}
                    >
                      <div className={cn("h-9 w-9 rounded-full flex items-center justify-center shrink-0", color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm", !n.isRead && "font-semibold")}>{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(n.createdAt)}</p>
                      </div>
                      {!n.isRead && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )
      )}

      {/* ── PROFILE ──────────────────────────────────────── */}
      {tab === "profile" && (
        !user ? (
          <GuestPlaceholder label="create your profile and connect with others" />
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Profile header */}
            <div className="rounded-2xl border bg-card overflow-hidden mb-6">
              {user.coverImage && (
                <div className="h-32 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={user.coverImage.url} alt="cover" className="w-full h-full object-cover" />
                </div>
              )}
              <div className={cn("p-5", user.coverImage ? "-mt-10" : "")}>
                <div className="flex items-end justify-between">
                  <Avatar className="h-20 w-20 ring-4 ring-background">
                    <AvatarImage src={user.avatar?.url} />
                    <AvatarFallback className="text-2xl">{user.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Link href="/profile">
                    <Button variant="outline" size="sm">Edit Profile</Button>
                  </Link>
                </div>
                <div className="mt-3">
                  <h2 className="text-xl font-bold flex items-center gap-1.5">
                    {user.displayName}
                    {user.isVerified && <Check className="h-4 w-4 text-primary" />}
                  </h2>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                  {user.bio && <p className="text-sm mt-2">{user.bio}</p>}
                </div>
                <div className="flex gap-5 mt-4 text-sm">
                  <div><span className="font-bold">{user.stats.totalListings}</span> <span className="text-muted-foreground">Listings</span></div>
                  <div><span className="font-bold">{user.stats.followersCount.toLocaleString()}</span> <span className="text-muted-foreground">Followers</span></div>
                  <div><span className="font-bold">{user.stats.followingCount}</span> <span className="text-muted-foreground">Following</span></div>
                </div>
              </div>
            </div>

            {/* User posts */}
            <h3 className="font-semibold mb-4">Your Posts</h3>
            {posts.filter((p) => p.author.id === user.id).length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center rounded-2xl border bg-card">
                <p className="text-muted-foreground">You haven&apos;t posted anything yet.</p>
                <Button className="mt-4" variant="bid" size="sm" onClick={() => setTab("compose")}>Create your first post</Button>
              </div>
            ) : (
              <div className="space-y-5">
                {posts.filter((p) => p.author.id === user.id).map((p) => <PostCard key={p.id} post={p} />)}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
