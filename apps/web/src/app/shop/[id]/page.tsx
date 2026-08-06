import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { merchService } from "@carasta/mock-data/services";
import { ProductDetailClient } from "./ProductDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await merchService.getProduct(id);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const [product, related] = await Promise.all([
    merchService.getProduct(id),
    merchService.getProducts({ pageSize: 8 }),
  ]);

  if (!product) notFound();

  const sameCategory = related.data.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  const fillers = related.data.filter(
    (p) => p.id !== product.id && p.category !== product.category
  );
  const relatedProducts = [...sameCategory, ...fillers].slice(0, 8);

  return <ProductDetailClient product={product} related={relatedProducts} />;
}
