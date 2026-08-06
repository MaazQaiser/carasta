import type { Metadata } from "next";
import { ShareListingScreen } from "@/components/listing";

export const metadata: Metadata = { title: "Share Listing — Carasta" };

export default function ListingSharePage() {
  return <ShareListingScreen />;
}
