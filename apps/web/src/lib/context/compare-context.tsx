"use client";

import React, { createContext, useContext, useState } from "react";

interface CompareContextValue {
  compareList: string[];
  toggle: (vehicleId: string) => void;
  isInCompare: (vehicleId: string) => boolean;
  clear: () => void;
  canAdd: boolean;
}

const CompareContext = createContext<CompareContextValue>({
  compareList: [],
  toggle: () => {},
  isInCompare: () => false,
  clear: () => {},
  canAdd: true,
});

const MAX_COMPARE = 4;

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<string[]>([]);

  const toggle = (vehicleId: string) => {
    setCompareList((prev) => {
      if (prev.includes(vehicleId)) return prev.filter((id) => id !== vehicleId);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, vehicleId];
    });
  };

  const isInCompare = (vehicleId: string) => compareList.includes(vehicleId);
  const clear = () => setCompareList([]);

  return (
    <CompareContext.Provider value={{ compareList, toggle, isInCompare, clear, canAdd: compareList.length < MAX_COMPARE }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
