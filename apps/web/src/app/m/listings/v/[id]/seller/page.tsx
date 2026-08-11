import type { Metadata } from "next";
import { MobileBuyerLiveSellerScreen } from "@/components/mobile-buyer/screens/MobileBuyerSellerScreen";

export const metadata: Metadata = {
  title: "Seller Profile — Carasta",
};

export default async function MobileBuyerLiveSellerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MobileBuyerLiveSellerScreen id={id} />;
}
