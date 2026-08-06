"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, MerchProduct, ProductVariant } from "@carasta/types";

const STORAGE_KEY = "carasta-merch-cart";

function lineKey(productId: string, variantId?: string) {
  return `${productId}::${variantId ?? "default"}`;
}

function itemKey(item: CartItem) {
  return lineKey(item.product.id, item.variant?.id);
}

function unitPrice(product: MerchProduct, variant?: ProductVariant) {
  return product.price + (variant?.priceModifier ?? 0);
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: MerchProduct, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  setQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clear: () => void;
  unitPrice: typeof unitPrice;
}

const CartContext = createContext<CartContextValue>({
  items: [],
  count: 0,
  subtotal: 0,
  addItem: () => {},
  removeItem: () => {},
  setQuantity: () => {},
  clear: () => {},
  unitPrice,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (product: MerchProduct, variant?: ProductVariant, quantity = 1) => {
      const qty = Math.max(1, quantity);
      setItems((prev) => {
        const key = lineKey(product.id, variant?.id);
        const existing = prev.find((item) => itemKey(item) === key);
        if (existing) {
          return prev.map((item) =>
            itemKey(item) === key ? { ...item, quantity: item.quantity + qty } : item
          );
        }
        return [...prev, { product, variant, quantity: qty }];
      });
    },
    []
  );

  const removeItem = useCallback((productId: string, variantId?: string) => {
    const key = lineKey(productId, variantId);
    setItems((prev) => prev.filter((item) => itemKey(item) !== key));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    const key = lineKey(productId, variantId);
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((item) => itemKey(item) !== key);
      return prev.map((item) =>
        itemKey(item) === key ? { ...item, quantity } : item
      );
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + unitPrice(item.product, item.variant) * item.quantity,
        0
      ),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      addItem,
      removeItem,
      setQuantity,
      clear,
      unitPrice,
    }),
    [items, count, subtotal, addItem, removeItem, setQuantity, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

export { lineKey, unitPrice };
