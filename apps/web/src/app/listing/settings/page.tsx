import type { Metadata } from "next";
import { SaleSettingsScreen } from "@/components/listing";

export const metadata: Metadata = { title: "Sale Settings — Carasta" };

export default function ListingSettingsPage() {
  return <SaleSettingsScreen />;
}
