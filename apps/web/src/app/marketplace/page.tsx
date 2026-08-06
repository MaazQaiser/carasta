import type { Metadata } from "next";
import { MarketplaceClient } from "./MarketplaceClient";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Browse vehicles for sale — classic cars, supercars, EVs and more from verified sellers.",
};

export default function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  return <MarketplaceClient />;
}
