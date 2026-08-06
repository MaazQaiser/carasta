"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Order } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

/** Shown when the cart is empty after a successful checkout. */
export function OrderPlacedBanner({ order }: { order: Order }) {
  const total = order.totals?.total ?? order.total;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:py-24 text-center">
      <div
        className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full"
        style={{ backgroundColor: "#dcfce7" }}
      >
        <CheckCircle2 className="h-11 w-11" style={{ color: "#15803d" }} aria-hidden />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
        Order placed successfully
      </h1>
      <p className="text-sm text-muted-foreground mb-1">Thank you for your purchase.</p>
      <p className="text-base font-semibold mb-1">
        Order number: <span className="tabular-nums">{order.id}</span>
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Total {formatPrice(total)} · Confirmation details are ready below.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="bid" size="lg" className="min-h-11" asChild>
          <Link href={`/shop/order/success?order=${encodeURIComponent(order.id)}`}>
            View Order Confirmation
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="min-h-11" asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
