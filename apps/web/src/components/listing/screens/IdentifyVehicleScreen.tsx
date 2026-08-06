"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Info, Loader2, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, FieldLabel } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";

type DecodeState = "idle" | "loading" | "success" | "failure";

/** Simulated decode — UI states only, no API. */
function mockDecodeVin(vin: string) {
  const clean = vin.trim().toUpperCase();
  if (clean.length < 11) {
    return { ok: false as const };
  }
  // Deterministic mock details from VIN characters.
  const year = 2000 + (clean.charCodeAt(9) % 25);
  return {
    ok: true as const,
    details: {
      vin: clean,
      year: String(year),
      make: clean.startsWith("W") ? "Porsche" : clean.startsWith("1") ? "Ford" : "BMW",
      model: clean.startsWith("W") ? "911" : clean.startsWith("1") ? "Mustang" : "M3",
      trim: "Base",
      engine: "3.0L",
      transmission: "Automatic",
      drivetrain: "RWD",
      exteriorColor: "Guards Red",
      interiorColor: "Black",
    },
  };
}

export function IdentifyVehicleScreen() {
  const { draft, setVinInput, updateDetails, addActivity } = useListingBuilder();
  const [decodeState, setDecodeState] = React.useState<DecodeState>("idle");

  const decode = () => {
    if (!draft.vinInput.trim()) return;
    setDecodeState("loading");
    window.setTimeout(() => {
      const result = mockDecodeVin(draft.vinInput);
      if (!result.ok) {
        setDecodeState("failure");
        return;
      }
      updateDetails(result.details);
      addActivity("VIN decoded", "identify");
      setDecodeState("success");
    }, 1200);
  };

  return (
    <ListingStep
      title="Identify Vehicle"
      description="Enter a VIN to prepare automatic vehicle details. You can always continue manually."
    >
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6">
        <div className="xl:col-span-3 space-y-5">
          <ListingSection title="VIN">
            <div>
              <FieldLabel htmlFor="vin">Vehicle Identification Number</FieldLabel>
              <Input
                id="vin"
                value={draft.vinInput}
                onChange={(e) => {
                  setVinInput(e.target.value.toUpperCase());
                  if (decodeState !== "idle" && decodeState !== "loading") {
                    setDecodeState("idle");
                  }
                }}
                placeholder="e.g. WP0AB2A99KS123456"
                className="font-mono tracking-wide uppercase"
                maxLength={17}
                disabled={decodeState === "loading"}
              />
              <FieldHint>17-character VIN. Decoding is simulated for this flow.</FieldHint>
            </div>

            {decodeState === "loading" ? (
              <div className="rounded-2xl border bg-muted/30 px-4 py-6 flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div>
                  <p className="text-sm font-medium">Decoding VIN…</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Importing year, make, model, and related details.
                  </p>
                </div>
              </div>
            ) : null}

            {decodeState === "success" ? (
              <div
                className="rounded-2xl border px-4 py-4 space-y-2"
                style={{
                  backgroundColor: "#dcfce7",
                  borderColor: "#86efac",
                }}
              >
                <div className="flex items-center gap-2" style={{ color: "#15803d" }}>
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <p className="text-sm font-semibold">VIN decoded successfully</p>
                </div>
                <p className="text-sm" style={{ color: "#166534" }}>
                  {[draft.details.year, draft.details.make, draft.details.model]
                    .filter(Boolean)
                    .join(" ") || "Vehicle details"}{" "}
                  were added to your listing. You can review them on the next step.
                </p>
              </div>
            ) : null}

            {decodeState === "failure" ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-4 space-y-3">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm font-semibold">Unable to decode VIN.</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Check the VIN and try again, or continue and enter vehicle details manually.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button type="button" onClick={decode}>
                    Retry
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/listing/details">Continue Without VIN</Link>
                  </Button>
                </div>
              </div>
            ) : null}

            {decodeState === "idle" || decodeState === "loading" ? (
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  type="button"
                  disabled={!draft.vinInput.trim() || decodeState === "loading"}
                  onClick={decode}
                >
                  {decodeState === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ScanSearch className="h-4 w-4" />
                  )}
                  Decode VIN
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/listing/details">Continue Without VIN</Link>
                </Button>
              </div>
            ) : null}
          </ListingSection>
        </div>

        <div className="xl:col-span-2">
          <div className="rounded-2xl border bg-muted/30 p-4 sm:p-5 space-y-3 h-full">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Info className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm">Why decode a VIN?</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              VIN decoding imports vehicle information automatically — year, make, model, trim,
              engine, and more — so you spend less time filling details by hand.
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
              <li>Faster listing setup</li>
              <li>Fewer manual entry mistakes</li>
              <li>You can always continue without decoding</li>
            </ul>
          </div>
        </div>
      </div>
    </ListingStep>
  );
}
