import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MobileBuyerGalleryScreen } from "@/components/mobile-buyer";
import type { BuyerListingType } from "@/components/mobile-buyer";

const TYPES: BuyerListingType[] = ["stock", "classic", "modified", "restored", "race"];

export const metadata: Metadata = {
  title: "Gallery — Carasta Listing",
};

export default async function MobileBuyerGalleryPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!TYPES.includes(type as BuyerListingType)) notFound();

  return (
    <Suspense
      fallback={
        <div className="ml-phone-frame bg-black text-white">
          <div className="flex h-full items-center justify-center text-[14px]">Loading gallery…</div>
        </div>
      }
    >
      <MobileBuyerGalleryScreen type={type as BuyerListingType} />
    </Suspense>
  );
}
