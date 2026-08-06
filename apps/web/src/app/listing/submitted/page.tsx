import type { Metadata } from "next";
import { ListingSubmittedScreen } from "@/components/listing";

export const metadata: Metadata = { title: "Listing Submitted — Carasta" };

export default function ListingSubmittedPage() {
  return <ListingSubmittedScreen />;
}
