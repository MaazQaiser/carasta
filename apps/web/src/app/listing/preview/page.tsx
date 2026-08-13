import type { Metadata } from "next";
import { ListingPreviewScreen } from "@/components/listing";

export const metadata: Metadata = { title: "Listing Review — Carasta" };

export default function ListingPreviewPage() {
  return <ListingPreviewScreen />;
}
