import type { Metadata } from "next";
import { SpecificationsRedirectScreen } from "@/components/listing/screens/SpecificationsRedirectScreen";

export const metadata: Metadata = { title: "Specifications — Carasta" };

export default function ListingSpecificationsPage() {
  return <SpecificationsRedirectScreen />;
}
