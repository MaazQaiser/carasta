"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmissionSession } from "../services/submission-session";

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

export function ShareConfirmationScreen() {
  const [destination, setDestination] = React.useState("—");
  const [sharedAt, setSharedAt] = React.useState<string | undefined>();

  React.useEffect(() => {
    const session = SubmissionSession.load();
    if (session?.destination) setDestination(session.destination);
    if (session?.sharedAt) setSharedAt(session.sharedAt);
  }, []);

  return (
    <div className="mx-auto max-w-lg py-10 flex flex-col items-center text-center">
      <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-6">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold mb-3">Successfully Shared</h1>
      <div className="rounded-2xl border bg-muted/20 px-5 py-4 text-sm space-y-2 mb-8 w-full text-left">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Destination</span>
          <span className="font-medium">{destination}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Share timestamp</span>
          <span className="font-medium">{formatTimestamp(sharedAt)}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" asChild>
          <Link href="/profile?tab=auctions">Done</Link>
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/profile?tab=auctions">Back to Listing</Link>
        </Button>
        <Button type="button" variant="ghost" asChild>
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
