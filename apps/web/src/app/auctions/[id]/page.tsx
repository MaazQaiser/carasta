import { redirect } from "next/navigation";
import { auctionService, vehicleService } from "@carasta/mock-data/services";
import { AuctionToVehicleRedirect } from "./AuctionToVehicleRedirect";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * `/auctions/:id` is not a listing page.
 * Listing URLs are `/vehicles/{vehicleId}`.
 * This route only exists to bounce old / mixed IDs to the canonical listing.
 */
export default async function AuctionDetailRedirect({ params }: Props) {
  const { id } = await params;

  const [auction, vehicle, auctionForVehicle] = await Promise.all([
    auctionService.getAuction(id),
    vehicleService.getVehicle(id),
    auctionService.getAuctionForVehicle(id),
  ]);

  if (auction) redirect(`/vehicles/${auction.vehicle.id}`);
  if (vehicle) redirect(`/vehicles/${vehicle.id}`);
  if (auctionForVehicle) redirect(`/vehicles/${auctionForVehicle.vehicle.id}`);

  return <AuctionToVehicleRedirect id={id} />;
}
