import type { Metadata } from "next";
import { ListingShopBuilderScreen } from "@/components/listing/shop-builder/ListingShopBuilderScreen";

export const metadata: Metadata = { title: "Shop / Builder — Carasta" };

export default function ListingShopBuilderPage() {
  return <ListingShopBuilderScreen />;
}
