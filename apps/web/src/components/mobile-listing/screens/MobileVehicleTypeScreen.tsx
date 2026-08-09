"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { MobileListingShell } from "../MobileListingShell";
import { MOBILE_LISTING_TYPES } from "../config";
import type { ListingTypeId } from "@/components/listing/types";

export function MobileVehicleTypeScreen() {
  const { draft, setListingType } = useListingBuilder();

  const selected = draft.listingTypeId as ListingTypeId | null;

  return (
    <MobileListingShell
      stepId="type"
      continueHref="/mobile-listing/identify"
      continueDisabled={!selected}
    >
      <div className="flex flex-col gap-6 px-6 pt-4 pb-6">
        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            What kind of vehicle are you listing?
          </h1>
          <p className="text-[15px] font-normal leading-[1.4] text-[#636366]">
            The questions shown next will adapt based on your vehicle.
          </p>
        </div>

        {/* Radio cards */}
        <div className="flex flex-col gap-3">
          {MOBILE_LISTING_TYPES.map((type) => {
            const isSelected = selected === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setListingType(type.id)}
                className={cn(
                  "relative flex items-center gap-4 p-5 rounded-2xl border text-left w-full transition-all",
                  isSelected
                    ? "border-[#1b1464] border-2 bg-[#f4f5fc]"
                    : "border-[#e5e5ea] border bg-white hover:border-[#c7c7cc]"
                )}
              >
                {/* Icon */}
                <div className="shrink-0 w-6 h-6">
                  <Image
                    src={type.icon}
                    alt=""
                    width={24}
                    height={24}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <p
                    className={cn(
                      "text-[16px] font-bold leading-normal",
                      isSelected ? "text-[#1b1464]" : "text-[#1c1c1e]"
                    )}
                  >
                    {type.label}
                  </p>
                  <p className="text-[13px] font-normal text-[#636366] leading-snug">
                    {type.description}
                  </p>
                </div>

                {/* Radio indicator */}
                <div className="shrink-0 w-5 h-5">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-[#1b1464] flex items-center justify-center">
                      <Image
                        src="/mobile-listing/check.svg"
                        alt="Selected"
                        width={10}
                        height={10}
                      />
                    </div>
                  ) : (
                    <Image
                      src="/mobile-listing/ellipse.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </MobileListingShell>
  );
}
