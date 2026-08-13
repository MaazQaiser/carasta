import type { Metadata } from "next";
import { ReviewSubmitScreen } from "@/components/listing";

export const metadata: Metadata = { title: "Submit to Carasta — Carasta" };

export default function ListingReviewPage() {
  return <ReviewSubmitScreen />;
}
