import type { Metadata } from "next";
import { ListingBuilderShell } from "@/components/listing";

export const metadata: Metadata = {
  title: "Listing Builder — Carasta",
};

export default function ListingBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ListingBuilderShell>{children}</ListingBuilderShell>;
}
