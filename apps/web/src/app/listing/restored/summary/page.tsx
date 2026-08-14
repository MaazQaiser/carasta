import type { Metadata } from "next";
import { RestoredBuildSummaryScreen } from "@/components/listing/screens/RestoredBuildSummaryScreen";

export const metadata: Metadata = { title: "Build Summary — Carasta" };

export default function ListingRestoredSummaryPage() {
  return <RestoredBuildSummaryScreen />;
}
