import type { Metadata } from "next";
import { MobileRaceDocumentationScreen } from "@/components/mobile-listing";

export const metadata: Metadata = {
  title: "Race / Track Documentation — Carasta Listing",
};

export default function MobileRaceDocumentationPage() {
  return <MobileRaceDocumentationScreen />;
}
