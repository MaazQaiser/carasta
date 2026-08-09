"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, FieldLabel } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";

type DecodeState = "idle" | "loading" | "success" | "failure";

function mockDecodeVin(vin: string) {
  const clean = vin.trim().toUpperCase();
  if (clean.length !== 17) return { ok: false as const };

  const isPorsche = clean.startsWith("W");
  return {
    ok: true as const,
    details: {
      vin: clean,
      year: isPorsche ? "2018" : "2020",
      make: isPorsche ? "Porsche" : "BMW",
      model: isPorsche ? "911 GT3" : "M3",
      trim: isPorsche ? "GT3 RS" : "Competition",
      engine: isPorsche ? "4.0L Flat-6" : "3.0L Twin-Turbo I6",
      transmission: isPorsche ? "7-Speed PDK" : "6-Speed Manual",
      drivetrain: isPorsche ? "RWD" : "AWD",
      exteriorColor: isPorsche ? "British Racing Green" : "Alpine White",
      interiorColor: isPorsche ? "Black Leather" : "Black Leather",
    },
    factoryEquipment: isPorsche
      ? "Sport Chrono Package, PCCB, Front Axle Lift"
      : "M Sport Package, Harman Kardon, Carbon Trim",
  };
}

function isVinStyleIdentity(identityType: string) {
  return identityType === "Modern VIN" || identityType === "Older VIN" || !identityType;
}

/**
 * Manual VIN / identity entry — decode failure never blocks continue (mobile-aligned).
 */
export function IdentifyManualScreen() {
  const searchParams = useSearchParams();
  const { draft, setVinInput, updateDetails, updateWorkspace, addActivity } =
    useListingBuilder();
  const [decodeState, setDecodeState] = React.useState<DecodeState>("idle");

  const isRestored = draft.listingTypeId === "restored-restomod-custom";
  const typeFromQuery = searchParams.get("type") ?? "";
  const identityType =
    typeFromQuery || draft.modificationWorkspace.restoration.identityType || "Modern VIN";
  const vinStyle = isVinStyleIdentity(identityType);
  const requiresModernLength = identityType === "Modern VIN";

  React.useEffect(() => {
    if (!isRestored || !typeFromQuery) return;
    if (draft.modificationWorkspace.restoration.identityType === typeFromQuery) return;
    updateWorkspace({
      restoration: {
        ...draft.modificationWorkspace.restoration,
        identityType: typeFromQuery,
      },
    });
  }, [draft.modificationWorkspace.restoration, isRestored, typeFromQuery, updateWorkspace]);

  const persistIdentity = (value: string) => {
    if (!isRestored) return;
    updateWorkspace({
      restoration: {
        ...draft.modificationWorkspace.restoration,
        identityType,
        identityValue: value,
      },
    });
  };

  const decode = () => {
    const result = mockDecodeVin(draft.vinInput);
    if (!result.ok) {
      const value = draft.vinInput.trim().toUpperCase();
      updateDetails({ vin: value });
      persistIdentity(value);
      setDecodeState("failure");
      return;
    }

    setDecodeState("loading");
    window.setTimeout(() => {
      updateDetails(result.details);
      updateWorkspace({
        factorySpecOverrides: {
          ...(draft.modificationWorkspace.factorySpecOverrides ?? {}),
          "factory-equipment:Packages": result.factoryEquipment,
        },
        ...(isRestored
          ? {
              restoration: {
                ...draft.modificationWorkspace.restoration,
                identityType,
                identityValue: result.details.vin,
              },
            }
          : {}),
      });
      addActivity("VIN decoded", "identify");
      setDecodeState("success");
    }, 1200);
  };

  const title =
    isRestored && identityType !== "Modern VIN"
      ? `Enter ${identityType}`
      : "Enter VIN Manually";

  const canDecode = requiresModernLength
    ? draft.vinInput.length === 17
    : Boolean(draft.vinInput.trim()) && vinStyle;

  return (
    <ListingStep
      title={title}
      description="Decode when possible. Failures never block listing creation — continue manually anytime."
    >
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6">
        <div className="xl:col-span-3 space-y-5">
          <ListingSection title={vinStyle ? "VIN" : "Identity value"}>
            {isRestored ? (
              <p className="text-sm text-muted-foreground mb-3">
                Identity method: <span className="font-medium text-foreground">{identityType}</span>
              </p>
            ) : null}
            <div>
              <FieldLabel htmlFor="vin-manual">
                {vinStyle ? "Vehicle Identification Number" : identityType}
              </FieldLabel>
              <Input
                id="vin-manual"
                value={draft.vinInput}
                onChange={(e) => {
                  setVinInput(e.target.value.toUpperCase());
                  if (decodeState !== "idle" && decodeState !== "loading") {
                    setDecodeState("idle");
                  }
                }}
                placeholder={vinStyle ? "e.g. WP0AB2A99KS123456" : `Enter ${identityType}`}
                className={vinStyle ? "font-mono tracking-wide uppercase" : undefined}
                maxLength={vinStyle && requiresModernLength ? 17 : undefined}
                disabled={decodeState === "loading"}
              />
              <FieldHint>
                {requiresModernLength
                  ? "17-character Modern VIN. Decoding is simulated for this flow."
                  : "Enter the identity value, then continue. Decode is optional."}
              </FieldHint>
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
                style={{ backgroundColor: "#dcfce7", borderColor: "#86efac" }}
              >
                <div className="flex items-center gap-2" style={{ color: "#15803d" }}>
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <p className="text-sm font-semibold">VIN decoded successfully</p>
                </div>
                <p className="text-sm" style={{ color: "#166534" }}>
                  {[draft.details.year, draft.details.make, draft.details.model]
                    .filter(Boolean)
                    .join(" ") || "Vehicle details"}{" "}
                  were added. Continue to review on the details step.
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
                  You can retry or continue — decode failure never blocks the listing.
                </p>
                <Button type="button" onClick={decode}>
                  Retry
                </Button>
              </div>
            ) : null}

            {decodeState === "idle" || decodeState === "loading" ? (
              <div className="flex flex-wrap gap-3 pt-2">
                {vinStyle ? (
                  <Button
                    type="button"
                    disabled={!canDecode || decodeState === "loading"}
                    onClick={decode}
                  >
                    {decodeState === "loading" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ScanSearch className="h-4 w-4" />
                    )}
                    Decode VIN
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => {
                      const value = draft.vinInput.trim();
                      updateDetails({ vin: value });
                      persistIdentity(value);
                    }}
                  >
                    Save identity value
                  </Button>
                )}
              </div>
            ) : null}
          </ListingSection>
        </div>
      </div>
    </ListingStep>
  );
}
