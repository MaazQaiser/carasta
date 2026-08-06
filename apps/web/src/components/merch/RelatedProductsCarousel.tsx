"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MerchProduct } from "@carasta/types";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";

interface RelatedProductsCarouselProps {
  products: MerchProduct[];
  title?: string;
}

export function RelatedProductsCarousel({
  products,
  title = "Related Products",
}: RelatedProductsCarouselProps) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  if (!products.length) return null;

  const scroll = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 320), behavior: "smooth" });
  };

  return (
    <section className="mt-14">
      <div className="flex items-center justify-between mb-5 gap-3">
        <h2 className="text-lg font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => scroll(-1)}
            aria-label="Previous related products"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => scroll(1)}
            aria-label="Next related products"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1 snap-x snap-mandatory"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[260px] sm:w-[280px] shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
