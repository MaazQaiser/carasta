import type { Metadata } from "next";
import { MobileModificationsScreen } from "@/components/mobile-listing";

export const metadata: Metadata = { title: "Specifications & Modifications — Carasta Listing" };

export default function MobileModificationsPage() {
  return <MobileModificationsScreen />;
}
