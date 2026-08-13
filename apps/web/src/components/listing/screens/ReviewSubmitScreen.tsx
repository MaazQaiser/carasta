"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

/**
 * Legacy Review & Submit checklist is redundant with Listing Review.
 * Redirect sellers to Buyer View Preview where Submit to Carasta lives.
 */
export function ReviewSubmitScreen() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/listing/buyer-preview");
  }, [router]);

  return (
    <div className="rounded-2xl border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
      Redirecting to Buyer View Preview…
    </div>
  );
}
