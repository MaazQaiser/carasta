import type { Metadata } from "next";
import { AiDescriptionScreen } from "@/components/listing";

export const metadata: Metadata = { title: "AI Description — Carasta" };

export default function ListingAiPage() {
  return <AiDescriptionScreen />;
}
