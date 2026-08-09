"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { VEHICLE_IDENTITY_TYPE_OPTIONS } from "@/components/listing/specs/options";
import { MobileListingShell } from "../MobileListingShell";

interface VinOptionCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
}

function VinOptionCard({ icon, title, description, onClick, className }: VinOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-5 rounded-2xl border border-[#e5e5ea] bg-white text-left w-full transition-colors hover:border-[#c7c7cc] hover:bg-[#fafafa]",
        className
      )}
    >
      <div className="shrink-0 w-6 h-6">
        <Image src={icon} alt="" width={24} height={24} className="w-full h-full object-contain" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="text-[16px] font-bold text-[#1c1c1e] leading-normal">{title}</p>
        <p className="text-[13px] font-normal text-[#636366] leading-snug">{description}</p>
      </div>
      <div className="shrink-0 w-4 h-4">
        <Image
          src="/mobile-listing/chevron-right.svg"
          alt=""
          width={16}
          height={16}
          className="w-full h-full object-contain"
        />
      </div>
    </button>
  );
}

const IDENTITY_DESCRIPTIONS: Record<string, string> = {
  "Modern VIN": "17-character VIN with optional decode",
  "Older VIN": "Pre-1981 or non-standard VIN format",
  "Serial Number": "Manufacturer serial number",
  "Chassis Number": "Chassis or frame number",
  "State Assigned VIN": "State-issued replacement VIN",
  "Manual Entry": "Enter vehicle identity details manually",
};

export function MobileVinPromptScreen() {
  const router = useRouter();
  const { draft, updateWorkspace } = useListingBuilder();
  const [showMethodSheet, setShowMethodSheet] = React.useState(false);
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
      `/mobile-listing/identify/manual?type=${encodeURIComponent(identityType)}`
    );
  };

  if (isRestored) {
    return (
      <MobileListingShell stepId="identify" continueDisabled>
        <div className="flex flex-col gap-6 px-6 pt-4 pb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
              Identify Your Vehicle
            </h1>
            <p className="text-[15px] font-normal leading-[1.4] text-[#636366]">
              Choose how this vehicle is identified. Decode failures never block listing creation.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {VEHICLE_IDENTITY_TYPE_OPTIONS.map((method) => (
              <VinOptionCard
                key={method}
                icon={
                  method.includes("VIN")
                    ? "/mobile-listing/keyboard.svg"
                    : method === "Manual Entry"
                      ? "/mobile-listing/arrow-right.svg"
                      : "/mobile-listing/history.svg"
                }
                title={method}
                description={IDENTITY_DESCRIPTIONS[method] ?? "Enter identification details"}
                onClick={() => selectIdentity(method)}
              />
            ))}
          </div>
        </div>
      </MobileListingShell>
    );
  }

  return (
    <MobileListingShell stepId="identify" continueDisabled>
      <div className="flex flex-col gap-6 px-6 pt-4 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            Vehicle Information
          </h1>
          <p className="text-[15px] font-normal leading-[1.4] text-[#636366]">
            Start by identifying your vehicle. This helps us pre-fill critical details instantly.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <VinOptionCard
            icon="/mobile-listing/camera.svg"
            title="Scan VIN Barcode"
            description="Use your camera to scan the door jamb or windshield"
            onClick={() => setShowMethodSheet(true)}
          />
          <VinOptionCard
            icon="/mobile-listing/keyboard.svg"
            title="Enter VIN Manually"
            description="Type the 17-character vehicle code directly"
            onClick={() => router.push("/mobile-listing/identify/manual")}
          />
          <VinOptionCard
            icon="/mobile-listing/arrow-right.svg"
            title="Continue Without VIN"
            description="Manually input all technical spec cards later"
            onClick={() => router.push("/mobile-listing/details")}
          />
        </div>
      </div>

      {showMethodSheet ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40">
          <button
            type="button"
            aria-label="Close VIN method menu"
            className="absolute inset-0"
            onClick={() => setShowMethodSheet(false)}
          />
          <div className="relative w-full max-w-[440px] mx-auto rounded-t-[28px] bg-white p-6 pb-8">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#d1d1d6]" />
            <h2 className="text-[18px] font-bold text-[#1c1c1e]">Choose VIN Method</h2>
            <div className="mt-4 flex flex-col gap-2">
              <VinOptionCard
                icon="/mobile-listing/camera.svg"
                title="Scan VIN Barcode"
                description="Camera scanning coming soon"
                onClick={() => setShowMethodSheet(false)}
              />
              <VinOptionCard
                icon="/mobile-listing/keyboard.svg"
                title="Enter VIN Manually"
                description="Type your 17-character VIN"
                onClick={() => router.push("/mobile-listing/identify/manual")}
              />
              <VinOptionCard
                icon="/mobile-listing/arrow-right.svg"
                title="Continue Without VIN"
                description="Enter vehicle details manually"
                onClick={() => router.push("/mobile-listing/details")}
              />
            </div>
          </div>
        </div>
      ) : null}
    </MobileListingShell>
  );
}
