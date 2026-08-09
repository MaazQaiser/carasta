import type { Metadata } from "next";
import { MobileBuyerIndexScreen } from "@/components/mobile-buyer";

export const metadata: Metadata = {
  title: "Buyer Listing Details — Carasta",
};

export default function MobileBuyerListingsPage() {
  return <MobileBuyerIndexScreen />;
}
