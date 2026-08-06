"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Search } from "lucide-react";
import type { Vehicle, Auction, User, Post } from "@carasta/types";
import { vehicleService, auctionService, userService, postService } from "@carasta/mock-data/services";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { AuctionCard } from "@/components/auction/AuctionCard";
import { PostCard } from "@/components/community/PostCard";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface SearchResults {
  vehicles: Vehicle[];
  auctions: Auction[];
  users: User[];
  posts: Post[];
}

export function SearchResultsClient({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults>({ vehicles: [], auctions: [], users: [], posts: [] });
  const [isPending, startTransition] = useTransition();

  const runSearch = (q: string) => {
    if (!q.trim()) { setResults({ vehicles: [], auctions: [], users: [], posts: [] }); return; }
    startTransition(async () => {
      const [vehicles, users] = await Promise.all([
        vehicleService.search(q),
        userService.searchUsers(q),
      ]);
      const auctionResults = await auctionService.getAuctions({ pageSize: 4 });
      const postFeed = await postService.getFeed(1, 4);
      setResults({ vehicles, auctions: auctionResults.data.slice(0, 4), users, posts: postFeed.data.slice(0, 4) });
    });
  };

  useEffect(() => { if (initialQuery) runSearch(initialQuery); }, []);

  const totalResults = results.vehicles.length + results.auctions.length + results.users.length + results.posts.length;

  return (
    <div className="mx-auto max-w-screen-xl px-4 lg:px-6 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => { setQuery(e.target.value); runSearch(e.target.value); }}
            placeholder="Search vehicles, auctions, people, brands…"
            className="pl-10 h-12 text-base rounded-xl"
            autoFocus
          />
        </div>
        {query && <p className="text-sm text-muted-foreground mt-2">{isPending ? "Searching…" : `${totalResults} results for "${query}"`}</p>}
      </div>

      {!query ? (
        <div className="flex flex-col items-center py-24 text-center">
          <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Search Carasta</h2>
          <p className="text-muted-foreground">Find vehicles, auctions, sellers, and community posts</p>
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All <Badge variant="secondary" className="ml-1.5 text-[10px]">{totalResults}</Badge></TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles <Badge variant="secondary" className="ml-1.5 text-[10px]">{results.vehicles.length}</Badge></TabsTrigger>
            <TabsTrigger value="auctions">Auctions <Badge variant="secondary" className="ml-1.5 text-[10px]">{results.auctions.length}</Badge></TabsTrigger>
            <TabsTrigger value="people">People <Badge variant="secondary" className="ml-1.5 text-[10px]">{results.users.length}</Badge></TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-10">
            {results.vehicles.length > 0 && (
              <section>
                <h3 className="font-semibold mb-4">Vehicles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {results.vehicles.slice(0, 4).map((v) => <VehicleCard key={v.id} vehicle={v} />)}
                </div>
              </section>
            )}
            {results.auctions.length > 0 && (
              <section>
                <h3 className="font-semibold mb-4">Auctions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {results.auctions.slice(0, 4).map((a) => <AuctionCard key={a.id} auction={a} />)}
                </div>
              </section>
            )}
            {results.users.length > 0 && (
              <section>
                <h3 className="font-semibold mb-4">People</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.users.map((u) => (
                    <Link key={u.id} href={`/profile/${u.username}`}>
                      <div className="flex items-center gap-3 p-4 rounded-2xl border bg-card hover:shadow-md transition-all">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={u.avatar?.url} alt={u.displayName} />
                          <AvatarFallback>{u.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{u.displayName}</p>
                          <p className="text-sm text-muted-foreground">@{u.username} · {u.stats.followersCount.toLocaleString()} followers</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </TabsContent>

          <TabsContent value="vehicles">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          </TabsContent>

          <TabsContent value="auctions">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.auctions.map((a) => <AuctionCard key={a.id} auction={a} />)}
            </div>
          </TabsContent>

          <TabsContent value="people">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.users.map((u) => (
                <Link key={u.id} href={`/profile/${u.username}`}>
                  <div className="flex items-center gap-3 p-4 rounded-2xl border bg-card hover:shadow-md transition-all">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={u.avatar?.url} alt={u.displayName} />
                      <AvatarFallback>{u.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{u.displayName}</p>
                      <p className="text-sm text-muted-foreground">@{u.username} · {u.stats.followersCount.toLocaleString()} followers</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
