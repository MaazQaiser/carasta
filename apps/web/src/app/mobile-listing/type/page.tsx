import type { Metadata } from "next";
import { MobileVehicleTypeScreen } from "@/components/mobile-listing";

export const metadata: Metadata = { title: "Vehicle Type — Carasta Listing" };

export default function MobileListingTypePage() {
  return <MobileVehicleTypeScreen />;
}
