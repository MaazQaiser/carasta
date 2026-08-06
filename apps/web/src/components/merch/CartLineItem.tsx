"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import type { CartItem } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuantityStepper } from "./QuantityStepper";
import { parseVariantDetails } from "./variant-display";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/context/cart-context";

interface CartLineItemProps {
  item: CartItem;
  compact?: boolean;
  wishlisted?: boolean;
  onWishlist?: (item: CartItem) => void;
  onRequestRemove?: (item: CartItem) => void;
}

export function CartLineItem({
  item,
  compact = false,
  wishlisted,
  onWishlist,
  onRequestRemove,
}: CartLineItemProps) {
  const { setQuantity, unitPrice } = useCart();
  const price = unitPrice(item.product, item.variant);
  const image = item.product.images[0];
  const lineTotal = price * item.quantity;
  const details = parseVariantDetails(item.variant);

  if (compact) {
    return (
      <div className="flex gap-3 p-3 rounded-xl border bg-card">
        <Link
          href={`/shop/${item.product.id}`}
          className="h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0"
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.url} alt={item.product.name} className="h-full w-full object-cover" />
          ) : null}
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{item.product.name}</p>
          {details.label ? (
            <p className="text-xs text-muted-foreground line-clamp-1">{details.label}</p>
          ) : null}
          <p className="text-xs text-muted-foreground mt-1">
            Qty {item.quantity} · {formatPrice(lineTotal)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 rounded-2xl border bg-card">
      <Link
        href={`/shop/${item.product.id}`}
        className="h-28 w-full sm:h-28 sm:w-28 rounded-xl overflow-hidden bg-muted shrink-0"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt={item.product.name} className="h-full w-full object-cover" />
        ) : null}
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground capitalize mb-1">
              {item.product.category.replace("-", " ")}
            </p>
            <Link
              href={`/shop/${item.product.id}`}
              className="text-sm font-semibold hover:underline line-clamp-2"
            >
              {item.product.name}
            </Link>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {details.size ? (
                <Badge variant="outline" className="text-[10px] font-normal">
                  Size: {details.size}
                </Badge>
              ) : null}
              {details.color ? (
                <Badge variant="outline" className="text-[10px] font-normal">
                  Color: {details.color}
                </Badge>
              ) : null}
              {details.style ? (
                <Badge variant="outline" className="text-[10px] font-normal">
                  Style: {details.style}
                </Badge>
              ) : null}
              {!details.size && !details.color && !details.style && details.label ? (
                <Badge variant="outline" className="text-[10px] font-normal">
                  {details.label}
                </Badge>
              ) : null}
            </div>

            <p className="text-sm font-bold mt-3">
              {formatPrice(price)}
              <span className="text-xs font-normal text-muted-foreground ml-1.5">unit</span>
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onWishlist ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={() => onWishlist(item)}
                aria-label={wishlisted ? "Remove from wishlist" : "Move to wishlist"}
              >
                <Heart
                  className={cn("h-4 w-4", wishlisted && "fill-current text-red-500")}
                />
              </Button>
            ) : null}
            {onRequestRemove ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={() => onRequestRemove(item)}
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground mb-1.5">Quantity</p>
            <QuantityStepper
              value={item.quantity}
              onChange={(qty) =>
                setQuantity(item.product.id, qty, item.variant?.id)
              }
              max={item.product.stockCount ?? 99}
            />
          </div>
          <div className="text-right ml-auto">
            <p className="text-[11px] text-muted-foreground mb-1">Item total</p>
            <p className="text-sm font-bold tabular-nums">{formatPrice(lineTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
