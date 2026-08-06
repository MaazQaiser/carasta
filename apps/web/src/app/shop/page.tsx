import type { Metadata } from "next";
import { merchService } from "@carasta/mock-data/services";
import { ShopClient } from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop",
  description: "Official Carasta shop — apparel, accessories, car care and collectibles.",
};

export default async function ShopPage() {
  const products = await merchService.getProducts({ pageSize: 24 });
  const featured = await merchService.getFeatured(4);
  return <ShopClient products={products.data} featured={featured} />;
}
