import type { Metadata } from "next";
import { Suspense } from "react";
import { merchService } from "@carasta/mock-data/services";
import { OrderSuccessClient } from "./OrderSuccessClient";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Carasta Merch Store order was placed successfully.",
};

export default async function OrderSuccessPage() {
  const [products, featured] = await Promise.all([
    merchService.getProducts({ pageSize: 12 }),
    merchService.getFeatured(6),
  ]);
  const recommendations = [...featured, ...products.data]
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, 8);

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[900px] px-4 py-24 text-center text-sm text-muted-foreground">
          Loading order…
        </div>
      }
    >
      <OrderSuccessClient recommendations={recommendations} />
    </Suspense>
  );
}
