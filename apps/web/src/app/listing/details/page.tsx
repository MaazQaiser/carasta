import type { Metadata } from "next";
import { VehicleDetailsScreen } from "@/components/listing";

export const metadata: Metadata = { title: "Vehicle Details — Carasta" };

export default function ListingDetailsPage() {
  return <VehicleDetailsScreen />;
}
