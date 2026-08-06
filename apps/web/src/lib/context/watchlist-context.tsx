"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface WatchlistContextValue {
  watchlist: string[];
  toggle: (vehicleId: string) => void;
  isWatched: (vehicleId: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextValue>({
  watchlist: [],
  toggle: () => {},
  isWatched: () => false,
});

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("carasta-watchlist");
      if (stored) setWatchlist(JSON.parse(stored) as string[]);
    } catch {}
  }, []);

  const toggle = (vehicleId: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId];
      localStorage.setItem("carasta-watchlist", JSON.stringify(next));
      return next;
    });
  };

  const isWatched = (vehicleId: string) => watchlist.includes(vehicleId);

  return (
    <WatchlistContext.Provider value={{ watchlist, toggle, isWatched }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  return useContext(WatchlistContext);
}
