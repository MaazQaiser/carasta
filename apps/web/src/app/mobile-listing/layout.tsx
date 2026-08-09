"use client";

import * as React from "react";
import { ListingBuilderProvider } from "@/components/listing/ListingBuilderContext";
import { MobileListingRuntime } from "@/components/mobile-listing/MobileListingRuntime";

export default function MobileListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ListingBuilderProvider>
      <MobileListingRuntime>{children}</MobileListingRuntime>
    </ListingBuilderProvider>
  );
}
