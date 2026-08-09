import type { Metadata } from "next";
import { RaceSpecsRouteScreen } from "@/components/listing/screens/RaceSpecsRouteScreen";

export const metadata: Metadata = { title: "Race Specifications — Carasta" };

export default function ListingRaceSpecsPage() {
  return <RaceSpecsRouteScreen />;
}
