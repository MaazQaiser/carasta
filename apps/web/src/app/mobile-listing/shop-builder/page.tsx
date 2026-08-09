import type { Metadata } from "next";
import { MobileShopBuilderScreen } from "@/components/mobile-listing";

export const metadata: Metadata = {
  title: "Shop / Builder / Company — Carasta Listing",
};

export default function MobileShopBuilderPage() {
  return <MobileShopBuilderScreen />;
}
