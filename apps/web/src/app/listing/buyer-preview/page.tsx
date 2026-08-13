import type { Metadata } from "next";
import { ListingBuyerViewPreviewScreen } from "@/components/listing/screens/ListingBuyerViewPreviewScreen";

export const metadata: Metadata = { title: "Buyer View Preview — Carasta" };

export default function ListingBuyerPreviewPage() {
  return <ListingBuyerViewPreviewScreen />;
}
