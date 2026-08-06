import type { Metadata } from "next";
import { vehicleService, auctionService } from "@carasta/mock-data/services";
import { VehicleDetailClient } from "@/app/vehicles/[id]/VehicleDetailClient";
import { PublishedAuctionFallback } from "./PublishedAuctionFallback";

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

export default async function AuctionDetailPage({ params }: Props) {
  const { id } = await params;
  const [vehicle, similar] = await Promise.all([
    vehicleService.getVehicle(id),
    vehicleService.getSimilarVehicles(id, 4),
  ]);

  // Listing Builder publishes client-side; fall back to localStorage records.
  if (!vehicle) {
    return <PublishedAuctionFallback id={id} />;
  }

  const allAuctions = await auctionService.getAuctions({ filters: {}, pageSize: 100 });
  const auction = allAuctions.data.find((a) => a.vehicle.id === vehicle.id) ?? null;

  return <VehicleDetailClient vehicle={vehicle} auction={auction} similar={similar} />;
}
