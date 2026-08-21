import type { Metadata } from "next";
import { ListingBuilderShell } from "@/components/listing";

export const metadata: Metadata = {
  title: "Carasta Listing",
};

export default function ListingBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ListingBuilderShell>{children}</ListingBuilderShell>;
}
