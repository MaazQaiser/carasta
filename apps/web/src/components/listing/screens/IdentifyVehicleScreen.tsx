"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Keyboard, ScanLine, SkipForward } from "lucide-react";
import { ListingStep } from "../ListingStep";
import { LISTING_PATHS } from "../listing-route-map";
import { VIN_IDENTIFY_COPY } from "../vin-identify-copy";

function MethodCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: ReactNode;
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
 * Shared beginning screen for every listing flow.
 * Scan VIN → manual entry; Enter Manually; Continue Without VIN.
 */
export function IdentifyVehicleScreen() {
  const router = useRouter();

  return (
    <ListingStep title={VIN_IDENTIFY_COPY.title} description={VIN_IDENTIFY_COPY.subtext}>
      <div className="grid gap-3 max-w-2xl">
        <MethodCard
          icon={<ScanLine className="h-5 w-5" />}
          title={VIN_IDENTIFY_COPY.scan.title}
          description={VIN_IDENTIFY_COPY.scan.description}
          onClick={() => router.push(LISTING_PATHS.identifyManual)}
        />
        <MethodCard
          icon={<Keyboard className="h-5 w-5" />}
          title={VIN_IDENTIFY_COPY.manual.title}
          description={VIN_IDENTIFY_COPY.manual.description}
          onClick={() => router.push(LISTING_PATHS.identifyManual)}
        />
        <MethodCard
          icon={<SkipForward className="h-5 w-5" />}
          title={VIN_IDENTIFY_COPY.withoutVin.title}
          description={VIN_IDENTIFY_COPY.withoutVin.description}
          onClick={() => router.push(LISTING_PATHS.details)}
        />
      </div>
    </ListingStep>
  );
}
