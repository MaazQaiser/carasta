import type { Metadata } from "next";
import { ConditionHistoryScreen } from "@/components/listing";

export const metadata: Metadata = { title: "Condition — Carasta" };

export default function ListingConditionPage() {
  return <ConditionHistoryScreen />;
}
