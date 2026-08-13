"use client";

import * as React from "react";
import { notificationService } from "@carasta/mock-data/services";
import {
  PublishedListingService,
  type PublishedListingRecord,
} from "@/components/listing/services/published-listing-service";

/**
 * Local demo: after Carasta "review", approve pending listings and notify the seller
 * (in-app notification + email acknowledgement via callback).
 */
export function useListingApprovalWatcher(options?: {
  minAgeMs?: number;
  pollMs?: number;
  onApproved?: (records: PublishedListingRecord[]) => void;
}) {
  const minAgeMs = options?.minAgeMs ?? 8_000;
  const pollMs = options?.pollMs ?? 4_000;
  const onApprovedRef = React.useRef(options?.onApproved);
  onApprovedRef.current = options?.onApproved;

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const notifyApproved = async (records: PublishedListingRecord[]) => {
      const toNotify = records.filter((r) => !r.approvalNotified);
      if (!toNotify.length) return;

      for (const record of toNotify) {
        const title = record.auction.vehicle.title;
        const href = `/m/listings/v/${record.auction.vehicle.id}`;
        await notificationService.create({
          type: "system",
          title: "Auction approved",
          message: `${title} was approved. Open it to share your listing.`,
          actionUrl: href,
          metadata: {
            auctionId: record.auction.id,
            vehicleId: record.auction.vehicle.id,
          },
        });
        PublishedListingService.markApprovalNotified(record.auction.id);
      }
      onApprovedRef.current?.(toNotify);
    };

    const tick = () => {
      const newly = PublishedListingService.approvePendingOlderThan(minAgeMs);
      void notifyApproved(newly);
    };

    tick();
    const id = window.setInterval(tick, pollMs);
    return () => window.clearInterval(id);
  }, [minAgeMs, pollMs]);
}
