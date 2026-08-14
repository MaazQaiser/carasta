import type { Metadata } from "next";
import { MobileRestoredBuildSummaryScreen } from "@/components/mobile-listing";

export const metadata: Metadata = {
  title: "Build Summary — Carasta Listing",
};

export default function MobileRestoredBuildSummaryPage() {
  return <MobileRestoredBuildSummaryScreen />;
}
