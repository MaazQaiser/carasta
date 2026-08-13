"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { VIN_IDENTIFY_COPY } from "@/components/listing/vin-identify-copy";
import { MobileListingShell } from "../MobileListingShell";

type ScreenState = "entry" | "loading" | "review" | "failed";

function decodeVin(vin: string) {
  const clean = vin.trim().toUpperCase();
  if (clean.length !== 17) return null;

  const isPorsche = clean.startsWith("W");
  return {
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
    factoryEquipment: isPorsche
      ? "Sport Chrono Package, PCCB, Front Axle Lift"
      : "M Sport Package, Harman Kardon, Carbon Trim",
  };
}

function isVinStyleIdentity(identityType: string) {
  return identityType === "Modern VIN" || identityType === "Older VIN" || !identityType;
}

export function MobileVinEntryScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { draft, setVinInput, updateDetails, updateWorkspace, addActivity, setVinImportedFields } =
    useListingBuilder();
  const [state, setState] = React.useState<ScreenState>("entry");

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
  }, [
    draft.modificationWorkspace.restoration,
    isRestored,
    typeFromQuery,
    updateWorkspace,
  ]);

  const persistIdentity = React.useCallback(
    (value: string) => {
      if (!isRestored) return;
      updateWorkspace({
        restoration: {
          ...draft.modificationWorkspace.restoration,
          identityType,
          identityValue: value,
        },
      });
    },
    [draft.modificationWorkspace.restoration, identityType, isRestored, updateWorkspace]
  );

  const continueManually = React.useCallback(() => {
    const value = draft.vinInput.trim();
    if (value) {
      updateDetails({ vin: value });
      persistIdentity(value);
    } else {
      persistIdentity("");
    }
    router.push("/mobile-listing/details");
  }, [draft.vinInput, persistIdentity, router, updateDetails]);

  const decode = React.useCallback(() => {
    const decoded = decodeVin(draft.vinInput);
    if (!decoded) {
      // Decode failure never blocks listing creation.
      const value = draft.vinInput.trim().toUpperCase();
      updateDetails({ vin: value });
      persistIdentity(value);
      setState("failed");
      return;
    }

    setState("loading");
    window.setTimeout(() => {
      updateDetails({
        vin: decoded.vin,
        year: decoded.year,
        make: decoded.make,
        model: decoded.model,
        trim: decoded.trim,
        engine: decoded.engine,
        transmission: decoded.transmission,
        drivetrain: decoded.drivetrain,
        exteriorColor: decoded.exteriorColor,
        interiorColor: decoded.interiorColor,
      });
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
          "factory-equipment:Packages": decoded.factoryEquipment,
        },
        ...(isRestored
          ? {
              restoration: {
                ...draft.modificationWorkspace.restoration,
                identityType,
                identityValue: decoded.vin,
              },
            }
          : {}),
      });
      addActivity("VIN decoded", "identify");
      setState("review");
    }, 1200);
  }, [
    addActivity,
    draft.modificationWorkspace.factorySpecOverrides,
    draft.modificationWorkspace.restoration,
    draft.vinInput,
    identityType,
    isRestored,
    persistIdentity,
    setVinImportedFields,
    updateDetails,
    updateWorkspace,
  ]);

  const identityReady = draft.vinInput.trim().length > 0;
  const canDecode = requiresModernLength
    ? draft.vinInput.length === 17
    : identityReady && vinStyle;

  // Failure uses in-screen Continue Manually — footer Continue stays disabled (Figma).
  // Review enables footer Continue. Manual Entry / non-VIN restored can continue from entry.
  const allowContinueWithoutReview =
    identityType === "Manual Entry" ||
    (isRestored && state === "entry" && (identityReady || !vinStyle));

  return (
    <MobileListingShell
      stepId="identify-manual"
      continueDisabled={
        state === "loading" ||
        state === "failed" ||
        (state !== "review" && !allowContinueWithoutReview)
      }
      continueHref={state === "review" ? "/mobile-listing/details" : undefined}
      onContinue={state === "review" ? undefined : continueManually}
    >
      <div className="flex flex-col gap-6 px-6 pt-4 pb-6">
        {state === "loading" ? (
          <div className="flex flex-1 min-h-[390px] flex-col items-center justify-center gap-5 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-[#e5e5ea] border-t-[#1b1464]" />
            <div className="space-y-2">
              <h1 className="text-[20px] font-bold text-[#1c1c1e]">Decoding VIN…</h1>
              <p className="max-w-[260px] text-[13px] leading-relaxed text-[#636366]">
                Retrieving vehicle details and specification history.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
                {isRestored && identityType !== "Modern VIN"
                  ? identityType
                  : VIN_IDENTIFY_COPY.title}
              </h1>
              <p className="text-[15px] leading-[1.4] text-[#636366]">
                {state === "review"
                  ? "Confirm or correct the details below."
                  : state === "failed"
                    ? VIN_IDENTIFY_COPY.failure.banner
                    : VIN_IDENTIFY_COPY.subtext}
              </p>
            </div>

            {state === "review" ? (
              <VinReviewForm />
            ) : (
              <div className="flex flex-col gap-4">
                {state === "failed" ? (
                  <div className="rounded-xl border border-[#fdba74] bg-[#fff2e6] px-4 py-3 text-[13px] text-[#9b4a00]">
                    {VIN_IDENTIFY_COPY.failure.banner}
                  </div>
                ) : null}

                {identityType === "Manual Entry" && isRestored ? (
                  <div className="rounded-xl bg-[#f4f5fc] px-4 py-3 text-[13px] text-[#1b1464]">
                    Manual Entry selected. Continue to enter year, make, model, and other details
                    yourself.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label htmlFor="vin" className="text-[12px] font-semibold text-[#636366]">
                      {isRestored && identityType !== "Modern VIN"
                        ? identityType
                        : "Vehicle Identification Number (VIN)"}
                    </label>
                    <input
                      id="vin"
                      maxLength={requiresModernLength ? 17 : 64}
                      autoCapitalize="characters"
                      value={draft.vinInput}
                      onChange={(event) => {
                        const next = event.target.value.toUpperCase();
                        setVinInput(next);
                        persistIdentity(next);
                        if (state === "failed") setState("entry");
                      }}
                      placeholder={
                        requiresModernLength
                          ? "WP0AB2A99KS123456"
                          : identityType === "Older VIN"
                            ? "Enter older VIN"
                            : `Enter ${identityType.toLowerCase()}`
                      }
                      className={cn(
                        "h-11 w-full rounded-lg border px-3 font-mono text-[13px] uppercase outline-none focus:ring-2",
                        state === "failed"
                          ? "border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]/15"
                          : "border-[#e5e5ea] focus:border-[#1b1464] focus:ring-[#1b1464]/15"
                      )}
                    />
                    <p className="text-[11px] text-[#636366]">
                      Typically found on the driver’s side door or pillar. Decode failure never
                      blocks listing creation.
                    </p>
                  </div>
                )}

                {state === "failed" ? (
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setState("entry")}
                      className="h-11 rounded-lg border border-[#1c1c1e] bg-white text-[14px] font-semibold text-[#1c1c1e]"
                    >
                      {VIN_IDENTIFY_COPY.failure.tryAgain}
                    </button>
                    <button
                      type="button"
                      onClick={continueManually}
                      className="h-11 rounded-lg bg-[#1b1464] text-[14px] font-semibold text-white"
                    >
                      {VIN_IDENTIFY_COPY.failure.continueManually}
                    </button>
                  </div>
                ) : (
                  <>
                    {vinStyle && identityType !== "Manual Entry" ? (
                      <button
                        type="button"
                        onClick={decode}
                        disabled={!canDecode}
                        className={cn(
                          "h-11 rounded-lg text-[14px] font-semibold transition-colors",
                          canDecode ? "bg-[#1b1464] text-white" : "bg-[#e5e5ea] text-[#9ca3af]"
                        )}
                      >
                        Decode VIN
                      </button>
                    ) : null}

                    <div className="flex items-center gap-3 text-[12px] text-[#636366] before:h-px before:flex-1 before:bg-[#e5e5ea] after:h-px after:flex-1 after:bg-[#e5e5ea]">
                      OR
                    </div>
                    <button
                      type="button"
                      onClick={continueManually}
                      className="text-[13px] font-medium text-[#1b1464] underline"
                    >
                      {VIN_IDENTIFY_COPY.withoutVin.title}
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </MobileListingShell>
  );
}

function VinReviewForm() {
  const { draft, updateDetails } = useListingBuilder();
  const fields = [
    ["Year", "year"],
    ["Make", "make"],
    ["Model", "model"],
    ["Trim", "trim"],
  ] as const;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-lg bg-[#e7f7e8] px-3 py-2 text-[12px] font-medium text-[#26742d]">
        {VIN_IDENTIFY_COPY.found.banner}
      </div>
      {fields.map(([label, key]) => (
        <label key={key} className="space-y-1">
          <span className="flex items-center gap-2 text-[12px] font-semibold text-[#636366]">
            {label}
            <span className="rounded-full bg-[#ecebff] px-2 py-0.5 text-[10px] font-semibold text-[#1b1464]">
              {VIN_IDENTIFY_COPY.found.importedBadge}
            </span>
          </span>
          <input
            value={draft.details[key]}
            onChange={(event) => updateDetails({ [key]: event.target.value })}
            className="h-10 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] text-[#1c1c1e] outline-none focus:border-[#1b1464]"
          />
        </label>
      ))}
    </div>
  );
}
