"use client";

import Link from "next/link";
import { ExternalLink, X } from "lucide-react";
import type { Vehicle } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface AttachedVehicleCardProps {
  vehicle: Vehicle;
  onRemove?: () => void;
  /** Read-only preview mode (no remove control). */
  compact?: boolean;
}

function statusLabel(status: Vehicle["status"]): string {
  switch (status) {
    case "in-auction":
      return "In Auction";
    case "active":
      return "For Sale";
    case "sold":
      return "Sold";
    case "upcoming":
      return "Upcoming";
    case "pending-review":
      return "Pending";
    case "draft":
      return "Draft";
    default:
      return status;
  }
}

function priceLabel(vehicle: Vehicle): string {
  if (vehicle.status === "in-auction") {
    return `Current Bid ${formatPrice(vehicle.startingPrice)}`;
  }
  return formatPrice(vehicle.startingPrice);
}

/**
 * Compact auction listing attachment — mirrors messages vehicle chip styling.
 */
export function AttachedVehicleCard({
  vehicle,
  onRemove,
  compact = false,
}: AttachedVehicleCardProps) {
  const image = vehicle.images[0];

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
      <div className="h-14 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt={image.alt || vehicle.title} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{vehicle.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{priceLabel(vehicle)}</p>
        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 capitalize">
            {statusLabel(vehicle.status)}
          </Badge>
          <Link
            href={`/vehicles/${vehicle.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View Listing
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
      {!compact && onRemove ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onRemove}
          aria-label="Remove attached listing"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
