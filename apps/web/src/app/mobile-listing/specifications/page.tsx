import type { Metadata } from "next";
import { MobilePerformanceSpecsScreen } from "@/components/mobile-listing";

export const metadata: Metadata = { title: "Performance Specs — Carasta Listing" };

export default function MobileListingSpecificationsPage() {
  return <MobilePerformanceSpecsScreen />;
}
