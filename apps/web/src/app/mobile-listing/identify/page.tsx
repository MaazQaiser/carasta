import type { Metadata } from "next";
import { MobileVinPromptScreen } from "@/components/mobile-listing";

export const metadata: Metadata = { title: "Vehicle Information — Carasta Listing" };

export default function MobileListingIdentifyPage() {
  return <MobileVinPromptScreen />;
}
