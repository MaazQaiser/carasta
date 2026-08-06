import type { Metadata } from "next";
import { OwnerNotesScreen } from "@/components/listing";

export const metadata: Metadata = { title: "Owner Notes — Carasta" };

export default function ListingNotesPage() {
  return <OwnerNotesScreen />;
}
