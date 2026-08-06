import type { Metadata } from "next";
import { ShareConfirmationScreen } from "@/components/listing";

export const metadata: Metadata = { title: "Share Confirmation — Carasta" };

export default function ListingShareConfirmationPage() {
  return <ShareConfirmationScreen />;
}
