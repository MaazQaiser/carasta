import type { Metadata } from "next";
import { RestorationTimelineScreen } from "@/components/listing/screens/RestorationTimelineScreen";

export const metadata: Metadata = { title: "Restoration Timeline — Carasta" };

export default function ListingRestorationTimelinePage() {
  return <RestorationTimelineScreen />;
}
