"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ShoppingBag } from "lucide-react";
import type { CartItem, MerchProduct } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CartLineItem,
  OrderSession,
  OrderSummaryCard,
  RelatedProductsCarousel,
  computeTotals,
} from "@/components/merch";
import { OrderPlacedBanner } from "@/components/merch/OrderPlacedBanner";
import { MerchWishlist } from "@/components/merch/merch-wishlist";
import {
  NotificationProvider,
  useListingNotifications,
} from "@/components/listing/notifications/NotificationProvider";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/context/cart-context";
import type { Order } from "@carasta/types";

interface Props {
  recommendations: MerchProduct[];
}

function CartView({ recommendations }: Props) {
  const { items, count, removeItem } = useCart();
  const { notify } = useListingNotifications();

  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState<{ tone: "success" | "error"; text: string } | null>(
    null
  );
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [pendingRemove, setPendingRemove] = useState<CartItem | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (items.length > 0) {
      setLastOrder(null);
      return;
    }
    setLastOrder(OrderSession.load());
  }, [items.length]);

  useEffect(() => {
    setWishlistIds(MerchWishlist.load());
    if (typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem("carasta.merch.discount");
    const code = window.sessionStorage.getItem("carasta.merch.promo");
    const parsed = raw ? Number(raw) : 0;
    if (Number.isFinite(parsed) && parsed > 0) {
      setDiscount(parsed);
      setPromoApplied(true);
      setPromo(code || "CARASTA10");
      setPromoMsg({ tone: "success", text: "Promo code applied" });
    }
  }, []);

  // Keep discount in sync when cart subtotal changes and promo is active
  useEffect(() => {
    if (!promoApplied) return;
    const sub = computeTotals(items).subtotal;
    const next = sub * 0.1;
    setDiscount(next);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("carasta.merch.discount", String(next));
    }
  }, [items, promoApplied]);

  const totals = useMemo(
    () => computeTotals(items, "standard", discount),
    [items, discount]
  );

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (code === "CARASTA10") {
      const sub = computeTotals(items).subtotal;
      const next = sub * 0.1;
      setDiscount(next);
      setPromoApplied(true);
      setPromoMsg({ tone: "success", text: "Success — CARASTA10 applied (10% off)." });
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("carasta.merch.discount", String(next));
        window.sessionStorage.setItem("carasta.merch.promo", code);
      }
      return;
    }
    setDiscount(0);
    setPromoApplied(false);
    setPromoMsg({ tone: "error", text: "Error — that promo code is not valid." });
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("carasta.merch.discount");
      window.sessionStorage.removeItem("carasta.merch.promo");
    }
  };

  const removePromo = () => {
    setPromo("");
    setDiscount(0);
    setPromoApplied(false);
    setPromoMsg(null);
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("carasta.merch.discount");
      window.sessionStorage.removeItem("carasta.merch.promo");
    }
  };

  const handleWishlist = (item: CartItem) => {
    const { added } = MerchWishlist.toggle(item.product.id);
    setWishlistIds(MerchWishlist.load());
    notify({
      title: added ? "Moved to Wishlist" : "Removed from Wishlist",
      description: added
        ? `${item.product.name} was saved to your wishlist.`
        : `${item.product.name} was removed from your wishlist.`,
      tone: "success",
    });
  };

  const confirmRemove = () => {
    if (!pendingRemove) return;
    removeItem(pendingRemove.product.id, pendingRemove.variant?.id);
    notify({
      title: "Item removed",
      description: `${pendingRemove.product.name} was removed from your cart.`,
      tone: "default",
    });
    setPendingRemove(null);
  };

  const itemLabel = count === 1 ? "Item" : "Items";

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8 pb-28 lg:pb-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <Link href="/shop" className="hover:text-foreground transition-colors">
              Merch
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li className="text-foreground font-medium">Shopping Cart</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold">
          Shopping Cart
          {count > 0 ? (
            <span className="text-muted-foreground font-semibold">
              {" "}
              ({count} {itemLabel})
            </span>
          ) : null}
        </h1>
      </div>

      {items.length === 0 ? (
        lastOrder === undefined ? (
          <div className="py-24 text-center text-sm text-muted-foreground">Loading…</div>
        ) : lastOrder ? (
          <OrderPlacedBanner order={lastOrder} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border bg-card">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-5">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h2 className="font-semibold text-lg mb-1">Your cart is empty</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Button variant="bid" asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <CartLineItem
                key={`${item.product.id}-${item.variant?.id ?? "default"}`}
                item={item}
                wishlisted={wishlistIds.includes(item.product.id)}
                onWishlist={handleWishlist}
                onRequestRemove={setPendingRemove}
              />
            ))}
          </div>

          {/* Sticky order summary */}
          <OrderSummaryCard
            totals={totals}
            primaryLabel="Proceed to Checkout"
            primaryHref="/shop/checkout"
            secondaryLabel="Continue Shopping"
            secondaryHref="/shop"
            shippingAtCheckout
            totalLabel="Grand Total"
            taxLabel="Estimated Tax"
            footerNote="Shipping calculated during checkout. Estimated delivery shown after shipping address is entered."
          >
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Promo Code</p>
              <div className="flex gap-2">
                <Input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Enter code"
                  className="h-9"
                  disabled={promoApplied}
                />
                {promoApplied ? (
                  <Button type="button" variant="outline" size="sm" onClick={removePromo}>
                    Remove
                  </Button>
                ) : (
                  <Button type="button" variant="outline" size="sm" onClick={applyPromo}>
                    Apply
                  </Button>
                )}
              </div>
              {promoMsg ? (
                <p
                  className={
                    promoMsg.tone === "success"
                      ? "text-[11px] text-green-700"
                      : "text-[11px] text-destructive"
                  }
                >
                  {promoMsg.text}
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground">Try CARASTA10 for 10% off.</p>
              )}
            </div>

            <div className="rounded-xl border border-dashed bg-muted/30 px-3 py-2.5">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Shipping calculated during checkout.
                <br />
                Estimated delivery shown after shipping address is entered.
              </p>
            </div>
          </OrderSummaryCard>
        </div>
      )}

      {recommendations.length > 0 ? (
        <RelatedProductsCarousel
          products={recommendations}
          title="You May Also Like"
        />
      ) : null}

      {/* Mobile sticky checkout */}
      {items.length > 0 ? (
        <div className="fixed inset-x-0 bottom-16 z-40 border-t bg-background/95 backdrop-blur px-4 py-3 lg:hidden">
          <div className="mx-auto max-w-screen-2xl flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted-foreground">Grand Total</p>
              <p className="text-sm font-bold tabular-nums">
                {formatPrice(
                  Math.max(0, totals.subtotal - totals.discount + totals.tax)
                )}
              </p>
            </div>
            <Button variant="bid" className="shrink-0" asChild>
              <Link href="/shop/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      ) : null}

      {/* Remove confirmation */}
      <Dialog
        open={Boolean(pendingRemove)}
        onOpenChange={(open) => !open && setPendingRemove(null)}
      >
        <DialogContent className="max-w-md sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle>Remove item?</DialogTitle>
            <DialogDescription>
              {pendingRemove
                ? `Remove “${pendingRemove.product.name}” from your shopping cart?`
                : "Remove this item from your shopping cart?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setPendingRemove(null)}>
              Keep item
            </Button>
            <Button type="button" variant="destructive" onClick={confirmRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function CartClient({ recommendations }: Props) {
  return (
    <NotificationProvider>
      <CartView recommendations={recommendations} />
    </NotificationProvider>
  );
}
