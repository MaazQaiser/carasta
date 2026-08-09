import type { Metadata } from "next";
import { StockLightlyModifiedSpecsScreen } from "@/components/listing/specs";

export const metadata: Metadata = { title: "Stock Specifications — Carasta" };

export default function ListingStockSpecsPage() {
  return <StockLightlyModifiedSpecsScreen />;
}
