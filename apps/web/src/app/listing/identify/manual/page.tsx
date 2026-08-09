import type { Metadata } from "next";
import { Suspense } from "react";
import { IdentifyManualScreen } from "@/components/listing/screens/IdentifyManualScreen";

export const metadata: Metadata = { title: "Enter VIN — Carasta" };

export default function ListingIdentifyManualPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}>
      <IdentifyManualScreen />
    </Suspense>
  );
}
