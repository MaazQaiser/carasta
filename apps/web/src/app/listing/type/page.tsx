import type { Metadata } from "next";
import { VehicleTypeScreen } from "@/components/listing";

export const metadata: Metadata = { title: "Vehicle Type — Carasta" };

export default function ListingTypePage() {
  return <VehicleTypeScreen />;
}
