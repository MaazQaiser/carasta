import type { Metadata } from "next";
import { ConditionHistoryScreen } from "@/components/listing";

export const metadata: Metadata = { title: "Condition & History — Carasta" };

export default function ListingHistoryPage() {
  return <ConditionHistoryScreen />;
}
