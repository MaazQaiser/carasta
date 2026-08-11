import type { Metadata } from "next";
import { Suspense } from "react";
import { MobileBuyerLiveGalleryScreen } from "@/components/mobile-buyer/screens/MobileBuyerGalleryScreen";

export const metadata: Metadata = {
  title: "Gallery — Carasta",
};

export default async function MobileBuyerLiveGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="ml-phone-frame bg-black text-white">
          <div className="flex h-full items-center justify-center text-[14px]">Loading…</div>
        </div>
      }
    >
      <MobileBuyerLiveGalleryScreen id={id} />
    </Suspense>
  );
}
