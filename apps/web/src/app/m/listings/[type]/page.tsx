import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MobileBuyerDetailScreen } from "@/components/mobile-buyer";
import type { BuyerListingType } from "@/components/mobile-buyer";

const TYPES: BuyerListingType[] = ["stock", "classic", "modified", "restored", "race"];

export function generateStaticParams() {
  return TYPES.map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const labels: Record<string, string> = {
    stock: "Standard Vehicle Listing",
    classic: "Classic Vehicle Listing",
    modified: "Modified / Performance Listing",
    restored: "Restoration Listing",
    race: "Race / Competition Listing",
  };
  return {
    title: `${labels[type] || "Buyer Listing"} — Carasta`,
  };
}

export default async function MobileBuyerDetailPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!TYPES.includes(type as BuyerListingType)) notFound();
  return <MobileBuyerDetailScreen type={type as BuyerListingType} />;
}
