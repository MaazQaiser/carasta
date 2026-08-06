import type { Metadata } from "next";
import { merchService } from "@carasta/mock-data/services";
import { CartClient } from "./CartClient";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your Carasta Merch Store cart before checkout.",
};

export default async function CartPage() {
  const products = await merchService.getProducts({ pageSize: 12 });
  const featured = await merchService.getFeatured(6);
  const recommendations = [...featured, ...products.data]
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, 8);

  return <CartClient recommendations={recommendations} />;
}
