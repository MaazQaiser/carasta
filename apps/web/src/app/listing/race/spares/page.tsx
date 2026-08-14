import type { Metadata } from "next";
import { RaceSparesScreen } from "@/components/listing/screens/RaceSparesScreen";

export const metadata: Metadata = { title: "Spares & Support Equipment — Carasta" };

export default function ListingRaceSparesPage() {
  return <RaceSparesScreen />;
}
