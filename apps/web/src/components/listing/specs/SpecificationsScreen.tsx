"use client";

import { useListingBuilder } from "../ListingBuilderContext";
import { SpecificationsPlaceholderScreen } from "../screens/SpecificationsPlaceholderScreen";
import { ModifiedPerformanceSpecsScreen } from "./ModifiedPerformanceSpecsScreen";
import { RestoredRestomodSpecsScreen } from "./RestoredRestomodSpecsScreen";
import { RaceTrackSpecsScreen } from "./RaceTrackSpecsScreen";
import { StockLightlyModifiedSpecsScreen } from "./StockLightlyModifiedSpecsScreen";

/**
 * Specs step router — swaps only the type-specific specifications experience.
 * All other listing steps stay shared.
 */
export function SpecificationsScreen() {
  const { draft } = useListingBuilder();

  if (draft.listingTypeId === "stock-lightly-modified") {
    return <StockLightlyModifiedSpecsScreen />;
  }

  if (draft.listingTypeId === "modified-performance") {
    return <ModifiedPerformanceSpecsScreen />;
  }

  if (draft.listingTypeId === "restored-restomod-custom") {
    return <RestoredRestomodSpecsScreen />;
  }

  if (draft.listingTypeId === "race-track-car") {
    return <RaceTrackSpecsScreen />;
  }

  return <SpecificationsPlaceholderScreen />;
}
