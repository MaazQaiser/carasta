import type { Metadata } from "next";
import { Suspense } from "react";
import { MobileRestoredModScreen } from "@/components/mobile-listing";

export const metadata: Metadata = {
  title: "Restoration Entry — Carasta Listing",
};

export default function MobileRestoredModAddPage() {
  return (
    <Suspense fallback={<div className="px-6 py-10 text-sm text-[#636366]">Loading…</div>}>
      <MobileRestoredModScreen />
    </Suspense>
  );
}
