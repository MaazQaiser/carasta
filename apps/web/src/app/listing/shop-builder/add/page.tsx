import type { Metadata } from "next";
import { ListingShopBuilderAddScreen } from "@/components/listing/shop-builder/ListingShopBuilderAddScreen";

export const metadata: Metadata = { title: "Add Shop / Builder — Carasta" };

export default function ListingShopBuilderAddPage() {
  return <ListingShopBuilderAddScreen />;
}
