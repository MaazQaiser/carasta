import type {
  CartItem,
  Order,
  PaymentMethodId,
  ShippingAddress,
  ShippingMethodId,
} from "@carasta/types";
import { computeTotals, estimatedDeliveryDate } from "./pricing";

const ORDER_KEY = "carasta.merch.last-order.v1";
const SAVED_LATER_KEY = "carasta.merch.saved-later.v1";

export const OrderSession = {
  save(order: Order) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  },

  load(): Order | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(ORDER_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as Order;
    } catch {
      return null;
    }
  },

  clear() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ORDER_KEY);
    }
  },

  placeOrder(input: {
    items: CartItem[];
    address: ShippingAddress;
    shippingMethod: ShippingMethodId;
    paymentMethod: PaymentMethodId;
    discount?: number;
  }): Order {
    const totals = computeTotals(
      input.items,
      input.shippingMethod,
      input.discount ?? 0
    );
    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      items: input.items,
      status: "confirmed",
      totals,
      total: totals.total,
      shippingAddress: input.address,
      shippingMethod: input.shippingMethod,
      paymentMethod: input.paymentMethod,
      estimatedDelivery: estimatedDeliveryDate(input.shippingMethod),
      createdAt: new Date().toISOString(),
    };
    this.save(order);
    return order;
  },
};

export const SavedForLater = {
  load(): CartItem[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(SAVED_LATER_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as CartItem[];
    } catch {
      return [];
    }
  },

  save(items: CartItem[]) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SAVED_LATER_KEY, JSON.stringify(items));
  },

  add(item: CartItem) {
    const current = this.load();
    const key = `${item.product.id}::${item.variant?.id ?? "default"}`;
    if (current.some((c) => `${c.product.id}::${c.variant?.id ?? "default"}` === key)) {
      return current;
    }
    const next = [...current, item];
    this.save(next);
    return next;
  },

  remove(productId: string, variantId?: string) {
    const key = `${productId}::${variantId ?? "default"}`;
    const next = this.load().filter(
      (c) => `${c.product.id}::${c.variant?.id ?? "default"}` !== key
    );
    this.save(next);
    return next;
  },
};
