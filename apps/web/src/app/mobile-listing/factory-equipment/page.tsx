import type { Metadata } from "next";
import { MobileFactoryEquipmentScreen } from "@/components/mobile-listing";

export const metadata: Metadata = { title: "Factory Equipment — Carasta Listing" };

export default function MobileFactoryEquipmentPage() {
  return <MobileFactoryEquipmentScreen />;
}
