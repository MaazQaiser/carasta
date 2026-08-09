import type { Metadata } from "next";
import { ModifiedSpecsRouteScreen } from "@/components/listing/screens/ModifiedSpecsRouteScreen";

export const metadata: Metadata = { title: "Modified Specifications — Carasta" };

export default function ListingModifiedSpecsPage() {
  return <ModifiedSpecsRouteScreen />;
}
