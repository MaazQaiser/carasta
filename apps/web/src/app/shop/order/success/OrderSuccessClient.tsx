"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Download,
  FileText,
  HelpCircle,
  Mail,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type { MerchProduct, Order, PaymentMethodId, ShippingAddress } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckoutProgress,
  OrderSession,
  RelatedProductsCarousel,
  SHIPPING_METHODS,
  parseVariantDetails,
} from "@/components/merch";
import {
  NotificationProvider,
  useListingNotifications,
} from "@/components/listing/notifications/NotificationProvider";
import { formatPrice } from "@/lib/utils";
import { unitPrice } from "@/lib/context/cart-context";

interface Props {
  recommendations: MerchProduct[];
}

const PAYMENT_LABELS: Record<PaymentMethodId, string> = {
  credit: "Credit Card",
  debit: "Debit Card",
  "apple-pay": "Apple Pay",
  "google-pay": "Google Pay",
};

function formatAddress(address: ShippingAddress | string): string {
  if (typeof address === "string") return address;
  const streetLine = [address.street, address.apartment].filter(Boolean).join(", ");
  return [
    address.name,
    streetLine,
    `${address.city}, ${address.state} ${address.postalCode}`,
    address.country,
  ]
    .filter(Boolean)
    .join("\n");
}

function formatOrderDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function statusLabel(status: Order["status"]): string {
  switch (status) {
    case "confirmed":
      return "Processing";
    case "pending":
      return "Pending";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

function OrderSuccessView({ recommendations }: Props) {
  const searchParams = useSearchParams();
  const { notify } = useListingNotifications();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    const saved = OrderSession.load();
    // Prefer the most recent placed order so confirmation always surfaces after checkout.
    setOrder(saved);
  }, [searchParams]);

  if (order === undefined) {
    return (
      <div className="mx-auto max-w-[900px] px-4 lg:px-6 py-16 sm:py-24 text-center text-sm text-muted-foreground">
        Loading order…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-[900px] px-4 lg:px-6 py-16 sm:py-24 text-center">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
          <Package className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h1 className="text-2xl font-bold mb-2">No order found</h1>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Place an order from checkout to see your confirmation here.
        </p>
        <Button variant="bid" size="lg" className="min-h-11" asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const shippingLabel =
    SHIPPING_METHODS.find((m) => m.id === order.shippingMethod)?.label ??
    order.shippingMethod;
  const shippingEta =
    SHIPPING_METHODS.find((m) => m.id === order.shippingMethod)?.eta ??
    order.estimatedDelivery;
  const totals = order.totals ?? {
    subtotal: order.total,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: order.total,
  };
  const paymentLabel = PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod;

  const placeholderAction = (title: string, description: string) => {
    notify({ title, description, tone: "default" });
  };

  return (
    <div className="mx-auto max-w-[900px] px-4 lg:px-6 py-10 sm:py-14 space-y-10">
      <CheckoutProgress current="confirmation" />

      {/* Success header */}
      <header className="text-center space-y-4">
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: "#dcfce7" }}
        >
          <CheckCircle2 className="h-11 w-11" style={{ color: "#15803d" }} aria-hidden />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Order placed successfully
          </h1>
          <p className="text-base font-medium text-foreground">Thank you for your purchase.</p>
          <p className="text-lg font-semibold tracking-tight">
            Order number: <span className="tabular-nums">{order.id}</span>
          </p>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Your order has been received and is now being processed.
          </p>
        </div>
      </header>

      {/* Order summary card */}
      <section className="rounded-2xl border bg-card p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-lg">Order Summary</h2>
          <Badge variant="secondary" className="capitalize">
            {statusLabel(order.status)}
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Meta label="Order Number" value={order.id} />
          <Meta label="Order Date" value={formatOrderDate(order.createdAt)} />
          <Meta label="Estimated Delivery" value={order.estimatedDelivery} />
          <Meta label="Payment Method" value={paymentLabel} />
          <Meta label="Shipping Method" value={shippingLabel} />
          <Meta label="Order Status" value={statusLabel(order.status)} />
        </div>
        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Shipping Address
          </p>
          <p className="text-sm whitespace-pre-line leading-relaxed">
            {formatAddress(order.shippingAddress)}
          </p>
        </div>
      </section>

      {/* Purchased items */}
      <section className="rounded-2xl border bg-card p-5 sm:p-6 space-y-4">
        <h2 className="font-semibold text-lg">Purchased Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => {
            const price = unitPrice(item.product, item.variant);
            const details = parseVariantDetails(item.variant);
            const image = item.product.images[0];
            const lineTotal = price * item.quantity;
            return (
              <div
                key={`${item.product.id}-${item.variant?.id ?? "default"}`}
                className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border bg-background"
              >
                <Link
                  href={`/shop/${item.product.id}`}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-muted shrink-0"
                >
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image.url}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/shop/${item.product.id}`}
                    className="text-sm font-semibold hover:underline line-clamp-2"
                  >
                    {item.product.name}
                  </Link>
                  {details.label ? (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {details.label}
                    </p>
                  ) : null}
                  <p className="text-xs text-muted-foreground mt-2">
                    Qty {item.quantity} · {formatPrice(price)} each
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-muted-foreground">Subtotal</p>
                  <p className="text-sm font-bold tabular-nums">{formatPrice(lineTotal)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Payment summary */}
      <section className="rounded-2xl border bg-card p-5 sm:p-6 space-y-3">
        <h2 className="font-semibold text-lg mb-1">Payment Summary</h2>
        <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
        <Row
          label="Shipping"
          value={totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
        />
        <Row label="Tax" value={formatPrice(totals.tax)} />
        <Row
          label="Discount"
          value={
            totals.discount > 0 ? `−${formatPrice(totals.discount)}` : formatPrice(0)
          }
          muted={totals.discount > 0}
        />
        <div className="border-t pt-3 flex justify-between font-semibold text-base">
          <span>Grand Total</span>
          <span>{formatPrice(totals.total)}</span>
        </div>
      </section>

      {/* Delivery information */}
      <section className="rounded-2xl border bg-card p-5 sm:p-6 space-y-4">
        <h2 className="font-semibold text-lg">Delivery Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border bg-muted/30 p-4 flex gap-3">
            <Truck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Estimated delivery window</p>
              <p className="text-sm font-semibold">{order.estimatedDelivery}</p>
              <p className="text-xs text-muted-foreground mt-1">{shippingEta}</p>
            </div>
          </div>
          <div className="rounded-xl border bg-muted/30 p-4 flex gap-3">
            <Package className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Tracking information</p>
              <p className="text-sm font-semibold">
                {order.trackingNumber ?? "Available after dispatch"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Placeholder — tracking TBD</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 rounded-xl border border-dashed px-4 py-3">
          <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            You&apos;ll receive a shipping confirmation email once your order has been dispatched.
          </p>
        </div>
      </section>

      {/* Actions */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="bid" size="lg" className="flex-1 min-h-11 gap-2" asChild>
            <Link href="/shop">
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="flex-1 min-h-11" asChild>
            <Link href="/shop">Return to Store</Link>
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="flex-1 min-h-11 gap-2"
            onClick={() =>
              placeholderAction(
                "View Order Details",
                "Full order history will be available in a future update."
              )
            }
          >
            <FileText className="h-4 w-4" />
            View Order Details
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="flex-1 min-h-11 gap-2"
            onClick={() =>
              placeholderAction(
                "Download Receipt",
                "Receipt download is a placeholder in this preview."
              )
            }
          >
            <Download className="h-4 w-4" />
            Download Receipt
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="flex-1 min-h-11 gap-2"
            onClick={() =>
              placeholderAction(
                "Contact Support",
                "Support chat will be available soon. Email support@carasta.app."
              )
            }
          >
            <HelpCircle className="h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </section>

      {recommendations.length > 0 ? (
        <RelatedProductsCarousel
          products={recommendations}
          title="You May Also Like"
        />
      ) : null}
    </div>
  );
}

export function OrderSuccessClient({ recommendations }: Props) {
  return (
    <NotificationProvider>
      <OrderSuccessView recommendations={recommendations} />
    </NotificationProvider>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={muted ? "text-green-700 font-medium" : "font-medium"}>{value}</span>
    </div>
  );
}
