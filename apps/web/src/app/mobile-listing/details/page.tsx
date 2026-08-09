import type { Metadata } from "next";
import { MobileVehicleDetailsScreen } from "@/components/mobile-listing";

export const metadata: Metadata = { title: "Vehicle Details — Carasta Listing" };

export default function MobileListingDetailsPage() {
  return <MobileVehicleDetailsScreen />;
}
