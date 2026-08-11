import type { Metadata } from "next";
import { Suspense } from "react";
import { MobileBuyerLiveDetailScreen } from "@/components/mobile-buyer/screens/MobileBuyerDetailScreen";

export const metadata: Metadata = {
  title: "Vehicle Listing — Carasta",
};

export default async function MobileBuyerLiveDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="ml-phone-frame">
          <div className="flex h-full items-center justify-center text-[14px] text-[#636366]">
            Loading listing…
          </div>
        </div>
      }
    >
      <MobileBuyerLiveDetailScreen id={id} />
    </Suspense>
  );
}
