"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, Loader2, Pencil, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, FieldLabel } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import { LISTING_PATHS } from "../listing-route-map";
import { VIN_IDENTIFY_COPY } from "../vin-identify-copy";

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
 * Manual VIN / identity entry — decode failure never blocks continue.
 */
export function IdentifyManualScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { draft, setVinInput, updateDetails, updateWorkspace, addActivity, setVinImportedFields } =
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

  const continueManually = () => {
    const value = draft.vinInput.trim().toUpperCase();
    if (value) {
      updateDetails({ vin: value });
      persistIdentity(value);
    }
    router.push(LISTING_PATHS.details);
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
      setVinImportedFields([
        "vin",
        "year",
        "make",
        "model",
        "trim",
        "exteriorColor",
        "interiorColor",
        "engine",
        "transmission",
        "drivetrain",
      ]);
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
      // Auto-advance to Vehicle Details after successful decode (matches mobile UX)
      router.push(LISTING_PATHS.details);
    }, 1200);
  };

  const title =
    isRestored && identityType !== "Modern VIN"
      ? `Enter ${identityType}`
      : VIN_IDENTIFY_COPY.title;

  const canDecode = requiresModernLength
    ? draft.vinInput.length === 17
    : Boolean(draft.vinInput.trim()) && vinStyle;

  const importedFields = [
    ["Year", draft.details.year],
    ["Make", draft.details.make],
    ["Model", draft.details.model],
    ["Trim", draft.details.trim],
  ] as const;

  return (
    <ListingStep
      title={title}
      description={
        decodeState === "success"
          ? "Confirm or correct the details below — VIN-decoded values are editable."
          : decodeState === "failure"
            ? VIN_IDENTIFY_COPY.failure.banner
            : VIN_IDENTIFY_COPY.subtext
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6">
        <div className="xl:col-span-3 space-y-5">
          <ListingSection title={vinStyle ? "VIN" : "Identity value"}>
            {isRestored && identityType !== "Modern VIN" ? (
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
                className={
                  vinStyle
                    ? decodeState === "failure"
                      ? "font-mono tracking-wide uppercase border-destructive focus-visible:ring-destructive"
                      : "font-mono tracking-wide uppercase"
                    : undefined
                }
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
                className="rounded-2xl border px-4 py-4 space-y-3"
                style={{ backgroundColor: "#dcfce7", borderColor: "#86efac" }}
              >
                <div className="flex items-center gap-2" style={{ color: "#15803d" }}>
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <p className="text-sm font-semibold">{VIN_IDENTIFY_COPY.found.banner}</p>
                </div>
                <div className="space-y-2">
                  {importedFields.map(([label, value]) =>
                    value ? (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-3 rounded-xl border bg-white/80 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium text-muted-foreground">{label}</p>
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              {VIN_IDENTIFY_COPY.found.importedBadge}
                            </span>
                          </div>
                          <p className="text-sm font-semibold truncate">{value}</p>
                        </div>
                        <Pencil className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </div>
                    ) : null
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  You can edit these on the next Vehicle Details step.
                </p>
              </div>
            ) : null}

            {decodeState === "failure" ? (
              <div
                className="rounded-2xl border px-4 py-4 space-y-3"
                style={{ backgroundColor: "#fff2e6", borderColor: "#fdba74" }}
              >
                <div className="flex items-start gap-2" style={{ color: "#9b4a00" }}>
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold">{VIN_IDENTIFY_COPY.failure.banner}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={() => setDecodeState("idle")}>
                    {VIN_IDENTIFY_COPY.failure.tryAgain}
                  </Button>
                  <Button type="button" onClick={continueManually}>
                    {VIN_IDENTIFY_COPY.failure.continueManually}
                  </Button>
                </div>
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
                <Button type="button" variant="outline" asChild>
                  <Link href={LISTING_PATHS.details}>{VIN_IDENTIFY_COPY.withoutVin.title}</Link>
                </Button>
              </div>
            ) : null}
          </ListingSection>
        </div>
      </div>
    </ListingStep>
  );
}
