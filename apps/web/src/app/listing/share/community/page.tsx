import type { Metadata } from "next";
import { CommunityShareScreen } from "@/components/listing";

export const metadata: Metadata = { title: "Carasta Community Share — Carasta" };

export default function ListingCommunitySharePage() {
  return <CommunityShareScreen />;
}
