import type { Metadata } from "next";
import { RaceBiographyScreen } from "@/components/listing/screens/RaceBiographyScreen";

export const metadata: Metadata = { title: "Competition History — Carasta" };

export default function ListingRaceBiographyPage() {
  return <RaceBiographyScreen />;
}
