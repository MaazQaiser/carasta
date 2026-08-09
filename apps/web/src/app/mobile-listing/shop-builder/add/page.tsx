import type { Metadata } from "next";
import { MobileShopBuilderAddScreen } from "@/components/mobile-listing";

export const metadata: Metadata = {
  title: "Add Shop / Builder / Company — Carasta Listing",
};

export default function MobileShopBuilderAddPage() {
  return <MobileShopBuilderAddScreen />;
}
