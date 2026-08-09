import type { Metadata } from "next";
import { RaceSummaryScreen } from "@/components/listing/screens/RaceSummaryScreen";

export const metadata: Metadata = { title: "Competition Profile — Carasta" };

export default function ListingRaceSummaryPage() {
  return <RaceSummaryScreen />;
}
