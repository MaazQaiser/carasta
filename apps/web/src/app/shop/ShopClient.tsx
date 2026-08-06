"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { MerchProduct } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/merch";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/context/cart-context";

interface Props {
  products: MerchProduct[];
  featured: MerchProduct[];
}

const CATEGORIES = [
  "All",
  "apparel",
  "accessories",
  "car-care",
  "collectibles",
  "stickers",
  "lifestyle",
];

export function ShopClient({ products, featured }: Props) {
  const { count } = useCart();
  const [category, setCategory] = useState("All");
  const [wishlist, setWishlist] = useState<string[]>([]);

  const filtered =
    category === "All" ? products : products.filter((p) => p.category === category);

  const toggleWishlist = (id: string) =>
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground p-8 lg:p-12 mb-10">
        <Badge className="mb-4 bg-bid text-bid-foreground border-0">Carasta Store</Badge>
        <h1 className="text-3xl lg:text-5xl font-bold mb-3">Official Shop</h1>
        <p className="text-primary-foreground/80 text-lg max-w-xl">
          Premium gear for automotive enthusiasts. Represent your passion.
        </p>
      </div>

      {featured.length > 0 ? (
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4">Featured</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wishlist={wishlist.includes(product.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        </section>
      ) : null}

      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors border shrink-0 capitalize",
                category === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "text-muted-foreground border-border hover:border-primary/50"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <Button variant="outline" size="sm" className="relative gap-1.5 shrink-0" asChild>
          <Link href="/shop/cart">
            <ShoppingBag className="h-4 w-4" />
            Cart
            {count > 0 ? (
              <Badge className="ml-1 h-4 px-1.5 text-[10px]">{count}</Badge>
            ) : null}
          </Link>
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="font-semibold mb-1">Stay tuned for the upcoming Shop items</h3>
          <p className="text-sm text-muted-foreground">New products are on their way.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wishlist={wishlist.includes(product.id)}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
