import type { Metadata } from "next";
import { ListingModAddScreen } from "@/components/listing/screens/ListingModAddScreen";

export const metadata: Metadata = { title: "Add Modification — Carasta" };

export default function ListingModifiedModAddPage() {
  return <ListingModAddScreen />;
}
