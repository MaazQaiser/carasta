"use client";

import Link from "next/link";
import { ListingStep } from "../ListingStep";
import { Button } from "@/components/ui/button";

/**
 * Legacy share hub from the old post-submit flow.
 * Sharing is available after approval from the live auction page (one-time prompt + share icon).
 */
export function ShareListingScreen() {
  return (
    <ListingStep
      title="Share Your Listing"
      description="Sharing is available after Carasta approves and schedules your auction — not immediately after submission."
    >
      <div className="max-w-xl space-y-4 rounded-2xl border bg-card p-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          After approval, the first time you open your live auction you may see a dismissible share
          menu. After that, use the share icon on the auction page. Live-auction viewers can share
          from the same control.
        </p>
        <Button type="button" asChild>
          <Link href="/profile?tab=auctions">Go to Auctions on your profile</Link>
        </Button>
      </div>
    </ListingStep>
  );
}
