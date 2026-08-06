"use client";

import { Star } from "lucide-react";
import type { MerchProduct } from "@carasta/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductReviews, getProductSpecs } from "./catalog-extras";

interface ProductInfoTabsProps {
  product: MerchProduct;
}

export function ProductInfoTabs({ product }: ProductInfoTabsProps) {
  const specs = getProductSpecs(product);
  const reviews = getProductReviews(product);

  return (
    <Tabs defaultValue="description" className="mt-12">
      <TabsList className="w-full justify-start overflow-x-auto scrollbar-hide h-auto flex-wrap sm:flex-nowrap bg-muted/60 p-1">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specs">Specifications</TabsTrigger>
        <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-5 rounded-2xl border bg-card p-5 sm:p-6">
        <h3 className="font-semibold mb-3">About this product</h3>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
        {product.tags.length > 0 ? (
          <p className="text-xs text-muted-foreground mt-4 capitalize">
            Tags: {product.tags.join(" · ")}
          </p>
        ) : null}
      </TabsContent>

      <TabsContent value="specs" className="mt-5 rounded-2xl border bg-card p-5 sm:p-6">
        <h3 className="font-semibold mb-4">Specifications</h3>
        <dl className="divide-y">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="grid grid-cols-2 gap-3 py-3 text-sm first:pt-0 last:pb-0"
            >
              <dt className="text-muted-foreground">{spec.label}</dt>
              <dd className="font-medium capitalize text-right sm:text-left">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </TabsContent>

      <TabsContent value="shipping" className="mt-5 rounded-2xl border bg-card p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Shipping</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Standard shipping arrives in 5–7 business days. Orders over $100 ship free with
            Standard. Express delivery is available at checkout (2–3 business days).
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Returns</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Unworn items can be returned within 30 days of delivery. Start a return from your
            order confirmation email. Final sale items and opened car-care kits are not eligible.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-5 rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Star className="h-5 w-5 text-yellow-500 fill-current" />
          <span className="font-semibold">{product.rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">
            based on {product.reviewCount} reviews
          </span>
        </div>
        <div className="space-y-4">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-xl border bg-background p-4">
              <div className="flex items-center justify-between gap-3 mb-1">
                <p className="text-sm font-semibold">{review.author}</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < review.rating
                          ? "text-yellow-500 fill-current"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm font-medium">{review.title}</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{review.body}</p>
              <p className="text-[11px] text-muted-foreground mt-2">{review.createdAt}</p>
            </article>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
