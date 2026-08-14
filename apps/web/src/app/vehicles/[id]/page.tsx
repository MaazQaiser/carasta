import type { Metadata } from "next";
import { vehicleService, auctionService } from "@carasta/mock-data/services";
import { VehicleDetailClient } from "./VehicleDetailClient";
import { PublishedListingFallback } from "./PublishedListingFallback";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await vehicleService.getVehicle(id);
  if (!vehicle) return { title: "Listing" };
  return {
    title: vehicle.title,
    description: vehicle.description,
    openGraph: {
      images: vehicle.images[0] ? [{ url: vehicle.images[0].url }] : [],
    },
  };
}

export default async function VehicleDetailPage({ params }: Props) {
  const { id } = await params;
  const [vehicle, similar, auction] = await Promise.all([
    vehicleService.getVehicle(id),
    vehicleService.getSimilarVehicles(id, 4),
    auctionService.getAuctionForVehicle(id),
  ]);

  // Listing Builder publishes client-side; fall back to localStorage records.
  if (!vehicle) {
    return <PublishedListingFallback id={id} />;
  }

  return <VehicleDetailClient vehicle={vehicle} auction={auction} similar={similar} />;
}
