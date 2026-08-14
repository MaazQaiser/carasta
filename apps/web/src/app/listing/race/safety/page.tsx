import type { Metadata } from "next";
import { RaceSafetyScreen } from "@/components/listing/screens/RaceSafetyScreen";

export const metadata: Metadata = { title: "Safety Equipment — Carasta" };

export default function ListingRaceSafetyPage() {
  return <RaceSafetyScreen />;
}
