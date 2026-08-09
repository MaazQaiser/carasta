import type { Metadata } from "next";
import { Suspense } from "react";
import { MobileVinEntryScreen } from "@/components/mobile-listing";

export const metadata: Metadata = { title: "Enter VIN — Carasta Listing" };

export default function MobileListingManualVinPage() {
  return (
    <Suspense fallback={<div className="px-6 py-10 text-sm text-[#636366]">Loading…</div>}>
      <MobileVinEntryScreen />
    </Suspense>
  );
}
