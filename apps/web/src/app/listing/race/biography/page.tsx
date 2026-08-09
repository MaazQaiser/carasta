import type { Metadata } from "next";
import { RaceBiographyScreen } from "@/components/listing/screens/RaceBiographyScreen";

export const metadata: Metadata = { title: "Vehicle Biography — Carasta" };

export default function ListingRaceBiographyPage() {
  return <RaceBiographyScreen />;
}
