import type { Metadata } from "next";
import { ListingPreviewScreen } from "@/components/listing";

export const metadata: Metadata = { title: "Listing Preview — Carasta" };

export default function ListingPreviewPage() {
  return <ListingPreviewScreen />;
}
