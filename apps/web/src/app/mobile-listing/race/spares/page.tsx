import type { Metadata } from "next";
import { MobileRaceSparesScreen } from "@/components/mobile-listing";

export const metadata: Metadata = {
  title: "Spares & Support Equipment — Carasta Listing",
};

export default function MobileRaceSparesPage() {
  return <MobileRaceSparesScreen />;
}
