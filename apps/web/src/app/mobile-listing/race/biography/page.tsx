import type { Metadata } from "next";
import { MobileRaceBiographyScreen } from "@/components/mobile-listing";

export const metadata: Metadata = {
  title: "Competition History — Carasta Listing",
};

export default function MobileRaceBiographyPage() {
  return <MobileRaceBiographyScreen />;
}
