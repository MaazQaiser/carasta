import type { Metadata } from "next";
import { MobileBuyerSellerScreen } from "@/components/mobile-buyer/screens/MobileBuyerSellerScreen";
import type { BuyerListingType } from "@/components/mobile-buyer";
import { notFound } from "next/navigation";

const TYPES: BuyerListingType[] = ["stock", "classic", "modified", "restored", "race"];

export const metadata: Metadata = {
  title: "Seller Profile — Carasta",
};

export default async function MobileBuyerDemoSellerPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!TYPES.includes(type as BuyerListingType)) notFound();
  return <MobileBuyerSellerScreen type={type as BuyerListingType} />;
}
