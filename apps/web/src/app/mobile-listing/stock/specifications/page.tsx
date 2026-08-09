import type { Metadata } from "next";
import { MobileStockSpecsScreen } from "@/components/mobile-listing";

export const metadata: Metadata = {
  title: "Specifications & Light Modifications — Carasta Listing",
};

export default function MobileStockSpecificationsPage() {
  return <MobileStockSpecsScreen />;
}
