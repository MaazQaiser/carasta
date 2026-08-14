import type { Metadata } from "next";
import { MobileRaceSafetyScreen } from "@/components/mobile-listing";

export const metadata: Metadata = {
  title: "Safety Equipment — Carasta Listing",
};

export default function MobileRaceSafetyPage() {
  return <MobileRaceSafetyScreen />;
}
