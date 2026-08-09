import type { Metadata } from "next";
import { Suspense } from "react";
import { MobileRaceModScreen } from "@/components/mobile-listing";

export const metadata: Metadata = {
  title: "Race Entry — Carasta Listing",
};

export default function MobileRaceModAddPage() {
  return (
    <Suspense fallback={<div className="px-6 py-10 text-sm text-[#636366]">Loading…</div>}>
      <MobileRaceModScreen />
    </Suspense>
  );
}
