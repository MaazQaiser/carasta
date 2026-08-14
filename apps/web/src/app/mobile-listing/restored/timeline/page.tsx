import type { Metadata } from "next";
import { MobileRestorationTimelineScreen } from "@/components/mobile-listing";

export const metadata: Metadata = {
  title: "Restoration Timeline — Carasta Listing",
};

export default function MobileRestorationTimelinePage() {
  return <MobileRestorationTimelineScreen />;
}
