import type { MarketplaceListingType, MarketplaceSaleType } from "@carasta/types";

export const LISTING_TYPE_LABELS: Record<MarketplaceListingType, string> = {
  "stock-lightly-modified": "Stock / Lightly Modified",
  "modified-performance": "Modified / Performance",
  "restored-restomod-custom": "Restored / Restomod / Custom",
  "race-track-car": "Race / Track Car",
};

export const SALE_TYPE_LABELS: Record<MarketplaceSaleType, string> = {
  "reserve-auction": "Reserve Auction",
  "buy-it-now": "Buy It Now",
  "auction-buy-now": "Auction + Buy Now",
  "make-offer": "Make Offer",
};

export function listingTypeLabel(type?: MarketplaceListingType): string | null {
  return type ? LISTING_TYPE_LABELS[type] : null;
}

export function saleTypeLabel(type?: MarketplaceSaleType): string | null {
  return type ? SALE_TYPE_LABELS[type] : null;
}

/** Humanize camel/kebab keys for factory-correct / race record rows. */
export function humanizeKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
