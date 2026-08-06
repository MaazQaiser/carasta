"use client";

import * as React from "react";

const ListingStepFooterContext = React.createContext<React.ReactNode>(null);

export function ListingStepFooterProvider({
  footer,
  children,
}: {
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <ListingStepFooterContext.Provider value={footer ?? null}>
      {children}
    </ListingStepFooterContext.Provider>
  );
}

export function useListingStepFooter() {
  return React.useContext(ListingStepFooterContext);
}
