import type { Metadata } from "next";
import { MobileRaceSpecsScreen } from "@/components/mobile-listing";

export const metadata: Metadata = {
  title: "Race / Track Build — Carasta Listing",
};

export default function MobileRaceSpecificationsPage() {
  return <MobileRaceSpecsScreen />;
}
