"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { VIN_IDENTIFY_COPY } from "@/components/listing/vin-identify-copy";
import { MobileListingShell } from "../MobileListingShell";

interface VinOptionCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

function VinOptionCard({ icon, title, description, onClick }: VinOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border border-[#e5e5ea] bg-white p-5 text-left transition-colors hover:border-[#c7c7cc] hover:bg-[#fafafa]"
      )}
    >
      <div className="h-6 w-6 shrink-0">
        <Image src={icon} alt="" width={24} height={24} className="h-full w-full object-contain" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-[16px] font-bold leading-normal text-[#1c1c1e]">{title}</p>
        <p className="text-[13px] font-normal leading-snug text-[#636366]">{description}</p>
      </div>
      <div className="h-4 w-4 shrink-0">
        <Image
          src="/mobile-listing/chevron-right.svg"
          alt=""
          width={16}
          height={16}
          className="h-full w-full object-contain"
        />
      </div>
    </button>
  );
}

/**
 * Shared VIN prompt for every adaptive listing flow.
 * Continue Without VIN stays available for classics, race, kit, and custom vehicles.
 */
export function MobileVinPromptScreen() {
  const router = useRouter();

  return (
    <MobileListingShell stepId="identify" continueDisabled>
      <div className="flex flex-col gap-6 px-6 pb-6 pt-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            {VIN_IDENTIFY_COPY.title}
          </h1>
          <p className="text-[15px] font-normal leading-[1.4] text-[#636366]">
            {VIN_IDENTIFY_COPY.subtext}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <VinOptionCard
            icon="/mobile-listing/camera.svg"
            title={VIN_IDENTIFY_COPY.scan.title}
            description={VIN_IDENTIFY_COPY.scan.description}
            onClick={() => router.push("/mobile-listing/identify/manual")}
          />
          <VinOptionCard
            icon="/mobile-listing/keyboard.svg"
            title={VIN_IDENTIFY_COPY.manual.title}
            description={VIN_IDENTIFY_COPY.manual.description}
            onClick={() => router.push("/mobile-listing/identify/manual")}
          />
          <VinOptionCard
            icon="/mobile-listing/arrow-right.svg"
            title={VIN_IDENTIFY_COPY.withoutVin.title}
            description={VIN_IDENTIFY_COPY.withoutVin.description}
            onClick={() => router.push("/mobile-listing/details")}
          />
        </div>
      </div>
    </MobileListingShell>
  );
}
