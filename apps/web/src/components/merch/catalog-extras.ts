import type { MerchProduct } from "@carasta/types";

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

/** Derived catalog enrichment — keeps seed data lean. */
export function getProductSpecs(product: MerchProduct): ProductSpec[] {
  const base: ProductSpec[] = [
    { label: "SKU", value: product.id.toUpperCase() },
    { label: "Category", value: product.category.replace("-", " ") },
    { label: "Availability", value: product.inStock ? "In stock" : "Sold out" },
  ];
  if (product.stockCount != null) {
    base.push({ label: "Units available", value: String(product.stockCount) });
  }
  if (product.variants.length) {
    const groups = [...new Set(product.variants.map((v) => v.name))];
    base.push({ label: "Options", value: groups.join(", ") });
  }
  if (product.tags.length) {
    base.push({ label: "Tags", value: product.tags.join(", ") });
  }
  return base;
}

export function getProductReviews(product: MerchProduct): ProductReview[] {
  const templates: Omit<ProductReview, "id">[] = [
    {
      author: "Alex M.",
      rating: 5,
      title: "Exactly what I wanted",
      body: "Quality feels premium and shipping was quick. Perfect for meets.",
      createdAt: "2024-11-12",
    },
    {
      author: "Jordan K.",
      rating: 4,
      title: "Great everyday piece",
      body: "Fits true to size. Color matches the photos. Would buy again.",
      createdAt: "2024-09-03",
    },
    {
      author: "Sam R.",
      rating: Math.max(3, Math.round(product.rating)),
      title: "Solid Carasta gear",
      body: product.description,
      createdAt: "2024-07-21",
    },
  ];
  return templates.slice(0, Math.min(3, Math.max(1, Math.ceil(product.reviewCount / 80)))).map(
    (r, i) => ({ ...r, id: `${product.id}-rev-${i}` })
  );
}

export function getProductVideos(product: MerchProduct) {
  return product.videos ?? [];
}
