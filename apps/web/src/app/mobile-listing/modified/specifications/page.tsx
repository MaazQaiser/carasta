import type { Metadata } from "next";
import { MobileModifiedSpecsScreen } from "@/components/mobile-listing";

export const metadata: Metadata = {
  title: "Specifications & Modifications — Carasta Listing",
};

export default function MobileModifiedSpecificationsPage() {
  return <MobileModifiedSpecsScreen />;
}
