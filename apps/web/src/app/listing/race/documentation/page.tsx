import type { Metadata } from "next";
import { RaceDocumentationScreen } from "@/components/listing/screens/RaceDocumentationScreen";

export const metadata: Metadata = { title: "Race / Track Documentation — Carasta" };

export default function ListingRaceDocumentationPage() {
  return <RaceDocumentationScreen />;
}
