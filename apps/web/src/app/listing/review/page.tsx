import type { Metadata } from "next";
import { ReviewSubmitScreen } from "@/components/listing";

export const metadata: Metadata = { title: "Review & Submit — Carasta" };

export default function ListingReviewPage() {
  return <ReviewSubmitScreen />;
}
