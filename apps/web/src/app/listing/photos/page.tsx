import type { Metadata } from "next";
import { PhotosDocumentsScreen } from "@/components/listing";

export const metadata: Metadata = { title: "Photos & Documents — Carasta" };

export default function ListingPhotosPage() {
  return <PhotosDocumentsScreen />;
}
