import type { Metadata } from "next";
import { RestoredSpecsRouteScreen } from "@/components/listing/screens/RestoredSpecsRouteScreen";

export const metadata: Metadata = { title: "Restored Specifications — Carasta" };

export default function ListingRestoredSpecsPage() {
  return <RestoredSpecsRouteScreen />;
}
