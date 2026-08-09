"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Keyboard, ScanLine, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingStep } from "../ListingStep";
import { useListingBuilder } from "../ListingBuilderContext";
import { VEHICLE_IDENTITY_TYPE_OPTIONS } from "../specs/options";
import { LISTING_PATHS } from "../listing-route-map";

const IDENTITY_DESCRIPTIONS: Record<string, string> = {
  "Modern VIN": "17-character VIN with optional decode",
  "Older VIN": "Pre-1981 or non-standard VIN format",
  "Serial Number": "Manufacturer serial number",
  "Chassis Number": "Chassis or frame number",
  "State Assigned VIN": "State-issued replacement VIN",
  "Manual Entry": "Enter vehicle identity details manually",
};

function MethodCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl border bg-card p-5 text-left transition-colors hover:bg-muted/40"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

/**
 * Identify step — method selection (mobile-aligned).
 * Manual VIN entry lives at /listing/identify/manual.
 */
export function IdentifyVehicleScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const [scanNote, setScanNote] = React.useState(false);
  const isRestored = draft.listingTypeId === "restored-restomod-custom";

  const selectIdentity = (identityType: string) => {
    const restoration = draft.modificationWorkspace.restoration;
    updateWorkspace({
      restoration: {
        ...restoration,
        identityType,
        identityValue: restoration.identityValue,
      },
    });
    router.push(
      `${LISTING_PATHS.identifyManual}?type=${encodeURIComponent(identityType)}`
    );
  };

  if (isRestored) {
    return (
      <ListingStep
        title="Identify Your Vehicle"
        description="Choose how this vehicle is identified. Decode failures never block listing creation."
      >
        <div className="grid gap-3 max-w-2xl">
          {VEHICLE_IDENTITY_TYPE_OPTIONS.map((method) => (
            <MethodCard
              key={method}
              icon={
                method.includes("VIN") ? (
                  <Keyboard className="h-5 w-5" />
                ) : (
                  <ScanLine className="h-5 w-5" />
                )
              }
              title={method}
              description={IDENTITY_DESCRIPTIONS[method] ?? "Enter identification details"}
              onClick={() => selectIdentity(method)}
            />
          ))}
        </div>
      </ListingStep>
    );
  }

  return (
    <ListingStep
      title="Identify Your Vehicle"
      description="Scan or enter a VIN, or continue without one. Decoding is optional and never blocks the listing."
    >
      <div className="grid gap-3 max-w-2xl">
        <MethodCard
          icon={<ScanLine className="h-5 w-5" />}
          title="Scan VIN Barcode"
          description="Use your camera to scan a VIN barcode"
          onClick={() => setScanNote(true)}
        />
        <MethodCard
          icon={<Keyboard className="h-5 w-5" />}
          title="Enter VIN Manually"
          description="Type the 17-character VIN"
          onClick={() => router.push(LISTING_PATHS.identifyManual)}
        />
        <MethodCard
          icon={<SkipForward className="h-5 w-5" />}
          title="Continue Without VIN"
          description="Enter vehicle details manually on the next step"
          onClick={() => router.push(LISTING_PATHS.details)}
        />
      </div>

      {scanNote ? (
        <div className="mt-6 max-w-2xl rounded-2xl border bg-muted/30 p-4 space-y-3">
          <p className="text-sm font-medium">Barcode scan coming soon</p>
          <p className="text-sm text-muted-foreground">
            Use manual VIN entry for now, or continue without a VIN.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => router.push(LISTING_PATHS.identifyManual)}>
              Enter VIN Manually
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href={LISTING_PATHS.details}>Continue Without VIN</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </ListingStep>
  );
}
