import type { CartItem, OrderTotals, ShippingMethodId } from "@carasta/types";
import { unitPrice } from "@/lib/context/cart-context";

export const TAX_RATE = 0.08;

export const SHIPPING_METHODS: {
  id: ShippingMethodId;
  label: string;
  description: string;
  price: number;
  eta: string;
}[] = [
  {
    id: "standard",
    label: "Standard Shipping",
    description: "Estimated delivery in 5–7 business days",
    price: 8.99,
    eta: "5–7 business days",
  },
  {
    id: "express",
    label: "Express Shipping",
    description: "Estimated delivery in 2–3 business days",
    price: 19.99,
    eta: "2–3 business days",
  },
  {
    id: "priority",
    label: "Priority Shipping",
    description: "Estimated delivery in 1–2 business days",
    price: 29.99,
    eta: "1–2 business days",
  },
];

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + unitPrice(item.product, item.variant) * item.quantity,
    0
  );
}

export function shippingCost(
  method: ShippingMethodId,
  subtotal: number
): number {
  if (method === "standard" && subtotal >= 100) return 0;
  return SHIPPING_METHODS.find((m) => m.id === method)?.price ?? 0;
}

export function taxAmount(subtotal: number, discount: number): number {
  return Math.max(0, (subtotal - discount) * TAX_RATE);
}

export function computeTotals(
  items: CartItem[],
  method: ShippingMethodId = "standard",
  discount = 0
): OrderTotals {
  const subtotal = cartSubtotal(items);
  const shipping = shippingCost(method, subtotal);
  const safeDiscount = Math.min(Math.max(0, discount), subtotal);
  const tax = taxAmount(subtotal, safeDiscount);
  const total = Math.max(0, subtotal - safeDiscount + shipping + tax);
  return {
    subtotal,
    shipping,
    tax,
    discount: safeDiscount,
    total,
  };
}

export function estimatedDeliveryDate(method: ShippingMethodId): string {
  const days = method === "priority" ? 2 : method === "express" ? 3 : 7;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
