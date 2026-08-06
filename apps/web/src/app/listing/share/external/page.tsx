import type { Metadata } from "next";
import { ExternalShareScreen } from "@/components/listing";

export const metadata: Metadata = { title: "External Share — Carasta" };

export default function ListingExternalSharePage() {
  return <ExternalShareScreen />;
}
