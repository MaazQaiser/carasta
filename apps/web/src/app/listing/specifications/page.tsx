import type { Metadata } from "next";
import { SpecificationsScreen } from "@/components/listing/specs";

export const metadata: Metadata = { title: "Specifications — Carasta" };

export default function ListingSpecificationsPage() {
  return <SpecificationsScreen />;
}
