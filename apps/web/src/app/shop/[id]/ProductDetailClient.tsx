"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Heart,
  Share2,
  ShoppingBag,
  Star,
} from "lucide-react";
import type { MerchProduct, ProductVariant } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ProductGallery,
  ProductInfoTabs,
  QuantityStepper,
  RelatedProductsCarousel,
  VariantChips,
  initialVariantSelection,
} from "@/components/merch";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/context/cart-context";

interface Props {
  product: MerchProduct;
  related: MerchProduct[];
}

export function ProductDetailClient({ product, related }: Props) {
  const router = useRouter();
  const { addItem, count } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [selectedByGroup, setSelectedByGroup] = useState<Record<string, string>>(() =>
    initialVariantSelection(product.variants)
  );

  const selectedVariants = useMemo(
    () =>
      Object.values(selectedByGroup)
        .map((id) => product.variants.find((v) => v.id === id))
        .filter(Boolean) as ProductVariant[],
    [product.variants, selectedByGroup]
  );

  const price =
    product.price +
    selectedVariants.reduce((sum, v) => sum + (v.priceModifier ?? 0), 0);

  const selectionComplete = useMemo(() => {
    const groups = new Set(product.variants.map((v) => v.name || "Option"));
    return [...groups].every((g) => Boolean(selectedByGroup[g]));
  }, [product.variants, selectedByGroup]);

  const canAdd =
    product.inStock &&
    selectionComplete &&
    selectedVariants.every((v) => v.inStock);

  const handleAdd = () => {
    if (!canAdd || !selectedVariants.length) return;
    const composite: ProductVariant = {
      id: Object.values(selectedByGroup).sort().join("+"),
      name: "Options",
      value: selectedVariants.map((v) => `${v.name}: ${v.value}`).join(" · "),
      inStock: selectedVariants.every((v) => v.inStock),
      priceModifier: selectedVariants.reduce((sum, v) => sum + (v.priceModifier ?? 0), 0),
    };
    addItem(product, composite, quantity);
    setAdded(true);
  };

  const handleSelectVariant = (v: ProductVariant) => {
    const group = v.name || "Option";
    setSelectedByGroup((prev) => ({ ...prev, [group]: v.id }));
    setAdded(false);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareNote("Link copied");
      setTimeout(() => setShareNote(null), 2000);
    } catch {
      setShareNote("Unable to share");
      setTimeout(() => setShareNote(null), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => router.push("/shop")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Merch Store
        </button>
        <Button variant="outline" size="sm" className="gap-1.5 relative" asChild>
          <Link href="/shop/cart">
            <ShoppingBag className="h-4 w-4" />
            Cart
            {count > 0 ? (
              <Badge className="ml-1 h-4 px-1.5 text-[10px]">{count}</Badge>
            ) : null}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images}
            videos={product.videos}
            productName={product.name}
          />
        </div>

        {/* Sticky purchase panel */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28 rounded-2xl border bg-card p-5 sm:p-6 space-y-5">
            <div>
              <p className="text-xs text-muted-foreground capitalize mb-2">{product.category}</p>
              <h1 className="text-2xl lg:text-3xl font-bold">{product.name}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
              {product.inStock ? (
                <Badge variant="secondary">
                  In stock{product.stockCount ? ` · ${product.stockCount}` : ""}
                </Badge>
              ) : (
                <Badge variant="destructive">Sold out</Badge>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatPrice(price)}</span>
              {product.compareAtPrice ? (
                <>
                  <span className="text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <Badge className="bg-red-500 text-white border-0">
                    Sale
                  </Badge>
                </>
              ) : null}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {product.variants.length > 0 ? (
              <VariantChips
                variants={product.variants}
                selectedByGroup={selectedByGroup}
                onSelect={handleSelectVariant}
              />
            ) : null}

            <div>
              <p className="text-sm font-medium mb-2">Quantity</p>
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                max={product.stockCount ?? 99}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="bid"
                size="lg"
                className="w-full gap-2"
                disabled={!canAdd}
                onClick={handleAdd}
              >
                {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                {added ? "Added to Cart" : "Add to Cart"}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setWishlisted((w) => !w)}
                >
                  <Heart className={cn("h-4 w-4", wishlisted && "fill-current text-red-500")} />
                  Wishlist
                </Button>
                <Button type="button" variant="outline" className="gap-2" onClick={() => void handleShare()}>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {added ? (
              <p className="text-sm text-muted-foreground">
                Item added.{" "}
                <Link href="/shop/cart" className="text-primary font-medium hover:underline">
                  View cart
                </Link>{" "}
                or{" "}
                <Link href="/shop" className="text-primary font-medium hover:underline">
                  continue shopping
                </Link>
                .
              </p>
            ) : null}
            {shareNote ? (
              <p className="text-xs text-muted-foreground">{shareNote}</p>
            ) : null}
          </div>
        </div>
      </div>

      <ProductInfoTabs product={product} />

      <RelatedProductsCarousel
        products={related}
        title={`Related in ${product.category.replace("-", " ")}`}
      />
    </div>
  );
}
