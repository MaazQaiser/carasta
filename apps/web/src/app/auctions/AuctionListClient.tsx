"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import { SlidersHorizontal, LayoutGrid, List, X, Heart, SearchX } from "lucide-react";
import type { Auction, AuctionStatus, AuctionSortField, AuctionFilters } from "@carasta/types";
import { auctionService } from "@carasta/mock-data/services";
import { AuctionCard } from "@/components/auction/AuctionCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";
import { useWatchlist } from "@/lib/context/watchlist-context";

const STATUS_TABS: { value: AuctionStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "ending-soon", label: "Ending Soon" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
];

const MAKES = ["All", "Aston Martin", "Chevrolet", "Dodge", "Ford", "Jaguar", "Mercedes-Benz", "Volkswagen"];
const TRANSMISSIONS = ["All", "automatic", "manual"];
const FUELS = ["All", "gasoline", "diesel", "electric", "hybrid"];

interface Props {
  initialStatus?: string;
  initialMake?: string;
  liveCount: number;
  endingSoonCount: number;
  upcomingCount: number;
}

type FilterChip = {
  id: string;
  label: string;
  clear: () => void;
};

export function AuctionListClient({ initialStatus, initialMake, liveCount, endingSoonCount, upcomingCount }: Props) {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [total, setTotal] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showFavourites, setShowFavourites] = useState(false);
  const { watchlist } = useWatchlist();

  const [status, setStatus] = useState<AuctionStatus | "all">((initialStatus as AuctionStatus) ?? "all");
  const [make, setMake] = useState(initialMake ?? "All");
  const [transmission, setTransmission] = useState("All");
  const [fuel, setFuel] = useState("All");
  const [sort, setSort] = useState<AuctionSortField>("ending-soon");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const clearFilters = () => {
    setMake("All");
    setTransmission("All");
    setFuel("All");
    setPriceMin("");
    setPriceMax("");
  };

  const loadAuctions = () => {
    startTransition(async () => {
      const filters: AuctionFilters = {};
      if (status !== "all") filters.status = status as AuctionStatus;
      if (make !== "All") filters.make = make;
      if (transmission !== "All") filters.transmission = transmission as AuctionFilters["transmission"];
      if (fuel !== "All") filters.fuelType = fuel;
      if (priceMin) filters.priceMin = parseInt(priceMin);
      if (priceMax) filters.priceMax = parseInt(priceMax);

      const result = await auctionService.getAuctions({ filters, sort, pageSize: 24 });
      setAuctions(result.data);
      setTotal(result.total);
    });
  };

  useEffect(() => { loadAuctions(); }, [status, make, transmission, fuel, sort, priceMin, priceMax]);

  const displayedAuctions = showFavourites
    ? auctions.filter((a) => watchlist.includes(a.vehicle.id))
    : auctions;

  const activeFilterChips = useMemo<FilterChip[]>(() => {
    const chips: FilterChip[] = [];
    if (make !== "All") chips.push({ id: "make", label: make, clear: () => setMake("All") });
    if (transmission !== "All") {
      chips.push({
        id: "transmission",
        label: transmission.charAt(0).toUpperCase() + transmission.slice(1),
        clear: () => setTransmission("All"),
      });
    }
    if (fuel !== "All") {
      chips.push({
        id: "fuel",
        label: fuel.charAt(0).toUpperCase() + fuel.slice(1),
        clear: () => setFuel("All"),
      });
    }
    if (priceMin) {
      chips.push({
        id: "priceMin",
        label: `From ${formatPrice(parseInt(priceMin, 10) || 0)}`,
        clear: () => setPriceMin(""),
      });
    }
    if (priceMax) {
      const max = parseInt(priceMax, 10) || 0;
      chips.push({
        id: "priceMax",
        label: max >= 100000 ? `Under ${formatPrice(max)}` : `Up to ${formatPrice(max)}`,
        clear: () => setPriceMax(""),
      });
    }
    return chips;
  }, [make, transmission, fuel, priceMin, priceMax]);

  const activeFilterCount = activeFilterChips.length;

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Auctions</h1>
        <p className="text-muted-foreground mt-1">{total} vehicles available</p>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value as AuctionStatus | "all")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors border",
              status === tab.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/50"
            )}
          >
            {tab.label}
            {tab.value === "live" && <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />}
            {tab.value === "live" && <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1">{liveCount}</Badge>}
            {tab.value === "ending-soon" && <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1">{endingSoonCount}</Badge>}
            {tab.value === "upcoming" && <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1">{upcomingCount}</Badge>}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters (desktop) */}
        <aside className="hidden lg:block w-56 shrink-0 space-y-6">
          <div className="rounded-2xl border bg-card p-4 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Filters</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <X className="h-3 w-3" /> Reset
                </button>
              )}
            </div>

            {/* Make */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Make</label>
              <Select value={make} onValueChange={setMake}>
                <SelectTrigger className="mt-1 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MAKES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Price Range</label>
              <div className="flex gap-2 mt-1">
                <Input placeholder="Min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="h-8 text-sm" type="number" />
                <Input placeholder="Max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="h-8 text-sm" type="number" />
              </div>
            </div>

            {/* Transmission */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Transmission</label>
              <Select value={transmission} onValueChange={setTransmission}>
                <SelectTrigger className="mt-1 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRANSMISSIONS.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Fuel */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fuel Type</label>
              <Select value={fuel} onValueChange={setFuel}>
                <SelectTrigger className="mt-1 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FUELS.map((f) => <SelectItem key={f} value={f} className="capitalize">{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden gap-1.5"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && <Badge className="h-4 px-1 text-[10px]">{activeFilterCount}</Badge>}
              </Button>
              <button
                onClick={() => setShowFavourites((v) => !v)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                  showFavourites
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50"
                )}
              >
                <Heart className={cn("h-3.5 w-3.5", showFavourites && "fill-current")} />
                Favourites
              </button>
              <span className="text-sm text-muted-foreground hidden sm:block">{showFavourites ? displayedAuctions.length : total} results</span>
            </div>

            <div className="flex items-center gap-2">
              <Select value={sort} onValueChange={(v) => setSort(v as AuctionSortField)}>
                <SelectTrigger className="w-44 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ending-soon">Ending Soon</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="highest-bid">Highest Bid</SelectItem>
                  <SelectItem value="lowest-price">Lowest Price</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex rounded-lg border overflow-hidden">
                <Button
                  variant={view === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={() => setView("grid")}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={view === "list" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={() => setView("list")}
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile filters */}
          {filtersOpen && (
            <div className="lg:hidden mb-4 rounded-2xl border bg-card p-4 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Make</label>
                <Select value={make} onValueChange={setMake}>
                  <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{MAKES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Transmission</label>
                <Select value={transmission} onValueChange={setTransmission}>
                  <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{TRANSMISSIONS.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Fuel</label>
                <Select value={fuel} onValueChange={setFuel}>
                  <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{FUELS.map((f) => <SelectItem key={f} value={f} className="capitalize">{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Active filter chips */}
          {activeFilterChips.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {activeFilterChips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={chip.clear}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-sm font-medium text-foreground hover:border-primary/50 transition-colors"
                >
                  {chip.label}
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
              >
                Clear All
              </button>
            </div>
          ) : null}

          {/* Grid / List */}
          {isPending ? (
            <div className={cn(view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-3")}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border bg-card animate-pulse aspect-[16/10]" />
              ))}
            </div>
          ) : displayedAuctions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                {showFavourites ? (
                  <Heart className="h-7 w-7 text-muted-foreground" />
                ) : (
                  <SearchX className="h-7 w-7 text-muted-foreground" />
                )}
              </div>
              <h3 className="font-semibold mb-1">
                {showFavourites ? "No saved auctions" : "No vehicles found"}
              </h3>
              <p className="text-sm text-muted-foreground mb-5 max-w-sm">
                {showFavourites
                  ? "Save auctions with the heart icon to see them here"
                  : "Try adjusting or clearing your filters."}
              </p>
              {!showFavourites && activeFilterCount > 0 ? (
                <Button type="button" onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : null}
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayedAuctions.map((auction) => <AuctionCard key={auction.id} auction={auction} />)}
            </div>
          ) : (
            <div className="space-y-3">
              {displayedAuctions.map((auction) => <AuctionCard key={auction.id} auction={auction} view="list" />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
