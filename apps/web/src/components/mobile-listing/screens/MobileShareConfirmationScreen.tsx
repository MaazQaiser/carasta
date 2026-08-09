"use client";

import * as React from "react";
import Link from "next/link";
import { SubmissionSession } from "@/components/listing/services/submission-session";
import { MobileListingShell } from "../MobileListingShell";

function formatTimestamp(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function MobileShareConfirmationScreen() {
  const [destination, setDestination] = React.useState("—");
  const [sharedAt, setSharedAt] = React.useState<string | undefined>();

  React.useEffect(() => {
    const session = SubmissionSession.load();
    if (session?.destination) setDestination(session.destination);
    if (session?.sharedAt) setSharedAt(session.sharedAt);
  }, []);

  return (
    <MobileListingShell stepId="share-confirmation" hideFooter>
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e7f7e8] text-[#52b870]">
          ✓
        </div>
        <h1 className="mt-5 text-[27px] font-extrabold text-[#1c1c1e]">
          Listing Shared Successfully!
        </h1>
        <p className="mt-2 text-[14px] text-[#636366]">
          Your listing has been shared.
        </p>
        <div className="mt-6 w-full rounded-2xl border border-[#e5e5ea] px-4 py-3 text-left text-[13px]">
          <div className="flex justify-between gap-4 py-1">
            <span className="text-[#636366]">Destination</span>
            <span className="font-medium text-[#1c1c1e]">{destination}</span>
          </div>
          <div className="flex justify-between gap-4 py-1">
            <span className="text-[#636366]">Share timestamp</span>
            <span className="font-medium text-[#1c1c1e]">{formatTimestamp(sharedAt)}</span>
          </div>
        </div>
        <div className="mt-10 w-full space-y-3">
          <Link
            href="/profile?tab=listings"
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
          >
            Done
          </Link>
          <Link
            href="/mobile-listing/type"
            className="flex h-11 w-full items-center justify-center rounded-lg border border-[#1b1464] text-[13px] font-semibold text-[#1b1464]"
          >
            Create Another Listing
          </Link>
          <Link href="/" className="block text-[12px] text-[#636366] underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </MobileListingShell>
  );
}
