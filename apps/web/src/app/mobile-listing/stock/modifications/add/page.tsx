import type { Metadata } from "next";
import { Suspense } from "react";
import { MobileStockLightModScreen } from "@/components/mobile-listing";

export const metadata: Metadata = {
  title: "Light Modification — Carasta Listing",
};

export default function MobileStockLightModAddPage() {
  return (
    <Suspense fallback={<div className="px-6 py-10 text-sm text-[#636366]">Loading…</div>}>
      <MobileStockLightModScreen />
    </Suspense>
  );
}
