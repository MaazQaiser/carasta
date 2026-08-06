"use client";

import Link from "next/link";
import { Globe2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingStep } from "../ListingStep";

export function ShareListingScreen() {
  return (
    <ListingStep
      title="Share Listing"
      description="Choose where to share your newly submitted listing."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
        <div className="rounded-2xl border bg-card p-5 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Globe2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">External Share</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Share to Instagram, Facebook, X, Email, or copy a link with an editable caption.
            </p>
          </div>
          <Button type="button" asChild>
            <Link href="/listing/share/external">Continue</Link>
          </Button>
        </div>

        <div className="rounded-2xl border bg-card p-5 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Carasta Community</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Publish to Carmunity with tags, location, and photos from your listing.
            </p>
          </div>
          <Button type="button" asChild>
            <Link href="/listing/share/community">Continue</Link>
          </Button>
        </div>
      </div>
    </ListingStep>
  );
}
