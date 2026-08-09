import type { Metadata } from "next";
import { Suspense } from "react";
import { MobileModifiedModScreen } from "@/components/mobile-listing";

export const metadata: Metadata = {
  title: "Add Modification — Carasta Listing",
};

export default function MobileModifiedModAddPage() {
  return (
    <Suspense fallback={<div className="px-6 py-10 text-sm text-[#636366]">Loading…</div>}>
      <MobileModifiedModScreen />
    </Suspense>
  );
}
