"use client";

import React, { useState } from "react";
import { ShoppingBag, Heart, Star, X, Plus, Minus } from "lucide-react";
import type { MerchProduct, CartItem } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatPrice } from "@/lib/utils";

interface Props {
  products: MerchProduct[];
  featured: MerchProduct[];
}

const CATEGORIES = ["All", "apparel", "accessories", "car-care", "collectibles", "stickers", "lifestyle"];

export function MerchClient({ products, featured }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const filtered = category === "All" ? products : products.filter((p) => p.category === category);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: MerchProduct, variant?: MerchProduct["variants"][0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.variant?.id === variant?.id);
      if (existing) return prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, variant, quantity: 1 }];
    });
  };

  const toggleWishlist = (id: string) => setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground p-8 lg:p-12 mb-10">
        <Badge className="mb-4 bg-bid text-bid-foreground border-0">Carasta Store</Badge>
        <h1 className="text-3xl lg:text-5xl font-bold mb-3">Official Merch</h1>
        <p className="text-primary-foreground/80 text-lg max-w-xl">Premium gear for automotive enthusiasts. Represent your passion.</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors border shrink-0 capitalize",
                category === c ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border hover:border-primary/50"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Cart button */}
        <Button variant="outline" size="sm" className="relative gap-1.5 shrink-0 ml-4" onClick={() => setCartOpen(true)}>
          <ShoppingBag className="h-4 w-4" />
          Cart
          {cartCount > 0 && <Badge className="ml-1 h-4 px-1.5 text-[10px]">{cartCount}</Badge>}
        </Button>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <div key={product.id} className="group rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
            <div className="relative aspect-square overflow-hidden bg-muted">
              {product.images[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
              )}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={cn(
                  "absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
                  wishlist.includes(product.id) ? "bg-red-500 text-white" : "bg-black/30 text-white hover:bg-black/50"
                )}
              >
                <Heart className={cn("h-4 w-4", wishlist.includes(product.id) && "fill-current")} />
              </button>
              {product.compareAtPrice && (
                <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0 text-[10px]">
                  -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                </Badge>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground capitalize mb-1">{product.category}</p>
              <h3 className="font-semibold text-sm mb-2">{product.name}</h3>
              <div className="flex items-center gap-1 mb-3">
                <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{formatPrice(product.price)}</span>
                  {product.compareAtPrice && (
                    <span className="text-xs text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
                  )}
                </div>
                <Button
                  variant="bid"
                  size="sm"
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                >
                  {product.inStock ? "Add to Cart" : "Sold Out"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-sm bg-background border-l shadow-xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <h2 className="font-semibold">Shopping Cart ({cartCount})</h2>
              <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="font-medium">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.product.id}-${item.variant?.id}`} className="flex gap-3 p-3 rounded-xl border bg-card">
                    {item.product.images[0] && (
                      <div className="h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      {item.variant && <p className="text-xs text-muted-foreground">{item.variant.value}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => setCart((prev) => prev.map((c) => c.product.id === item.product.id ? { ...c, quantity: Math.max(1, c.quantity - 1) } : c))} className="h-6 w-6 rounded-full border flex items-center justify-center hover:bg-muted">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button onClick={() => setCart((prev) => prev.map((c) => c.product.id === item.product.id ? { ...c, quantity: c.quantity + 1 } : c))} className="h-6 w-6 rounded-full border flex items-center justify-center hover:bg-muted">
                          <Plus className="h-3 w-3" />
                        </button>
                        <span className="ml-auto text-sm font-bold">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t space-y-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <Button variant="bid" size="lg" className="w-full">Checkout</Button>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setCart([])}>Clear Cart</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
