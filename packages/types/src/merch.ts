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
  variants: ProductVariant[];
  tags: string[];
  inStock: boolean;
  stockCount?: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
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

export interface Order {
  id: string;
  items: CartItem[];
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  shippingAddress: string;
  trackingNumber?: string;
  createdAt: string;
}
