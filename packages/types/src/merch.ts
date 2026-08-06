import type { Image } from "./common";

export type MerchCategory =
  | "apparel"
  | "accessories"
  | "car-care"
  | "collectibles"
  | "stickers"
  | "lifestyle";

export interface MerchProduct {
  id: string;
  name: string;
  description: string;
  category: MerchCategory;
  price: number;
  compareAtPrice?: number;
  images: Image[];
  /** Optional product videos for gallery. */
  videos?: MerchMedia[];
  variants: ProductVariant[];
  tags: string[];
  inStock: boolean;
  stockCount?: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface MerchMedia {
  id: string;
  url: string;
  alt?: string;
  type: "image" | "video";
  thumbnailUrl?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  inStock: boolean;
  priceModifier?: number;
}

export interface CartItem {
  product: MerchProduct;
  variant?: ProductVariant;
  quantity: number;
}

export type ShippingMethodId = "standard" | "express" | "priority";

export type PaymentMethodId = "credit" | "debit" | "apple-pay" | "google-pay";

export interface ShippingAddress {
  /** Full name — composed from first/last at checkout. */
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  totals: OrderTotals;
  /** @deprecated Prefer totals.total — kept for seed compatibility. */
  total: number;
  shippingAddress: ShippingAddress | string;
  shippingMethod: ShippingMethodId;
  paymentMethod: PaymentMethodId;
  estimatedDelivery: string;
  trackingNumber?: string;
  createdAt: string;
}
