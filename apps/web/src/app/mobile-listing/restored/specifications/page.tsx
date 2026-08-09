import type { Metadata } from "next";
import { MobileRestoredSpecsScreen } from "@/components/mobile-listing";

export const metadata: Metadata = {
  title: "Authenticity & Restoration — Carasta Listing",
};

export default function MobileRestoredSpecificationsPage() {
  return <MobileRestoredSpecsScreen />;
}
