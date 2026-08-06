"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Star } from "lucide-react";
import type { MerchProduct } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/context/cart-context";

interface ProductCardProps {
  product: MerchProduct;
  wishlist?: boolean;
  onToggleWishlist?: (id: string) => void;
}

export function ProductCard({ product, wishlist, onToggleWishlist }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const href = `/shop/${product.id}`;

  return (
    <div className="group rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={href} className="absolute inset-0 block">
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0].url}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : null}
        </Link>
        {onToggleWishlist ? (
          <button
            type="button"
            onClick={() => onToggleWishlist(product.id)}
            className={cn(
              "absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
              wishlist ? "bg-red-500 text-white" : "bg-black/30 text-white hover:bg-black/50"
            )}
            aria-label={wishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("h-4 w-4", wishlist && "fill-current")} />
          </button>
        ) : null}
        {product.compareAtPrice ? (
          <Badge className="absolute top-3 left-3 z-10 bg-red-500 text-white border-0 text-[10px]">
            -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
          </Badge>
        ) : null}
        {!product.inStock ? (
          <div className="absolute inset-0 z-[5] bg-black/40 flex items-center justify-center pointer-events-none">
            <span className="text-white font-semibold text-sm">Sold Out</span>
          </div>
        ) : null}
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground capitalize mb-1">{product.category}</p>
        <Link href={href} className="font-semibold text-sm mb-2 hover:underline line-clamp-2 block">
          {product.name}
        </Link>
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
          <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold">{formatPrice(product.price)}</span>
            {product.compareAtPrice ? (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
          </div>
          <Button
            variant="bid"
            size="sm"
            className="shrink-0"
            disabled={!product.inStock}
            onClick={() => {
              if (product.variants.length > 1) {
                router.push(href);
                return;
              }
              addItem(product, product.variants[0]);
            }}
          >
            {product.inStock ? (product.variants.length > 1 ? "View" : "Add to Cart") : "Sold Out"}
          </Button>
        </div>
      </div>
    </div>
  );
}
