import type { Metadata } from "next";
import { IdentifyVehicleScreen } from "@/components/listing";

export const metadata: Metadata = { title: "Identify Vehicle — Carasta" };

export default function ListingIdentifyPage() {
  return <IdentifyVehicleScreen />;
}
