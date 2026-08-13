"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { LISTING_TYPES, getListingTypeById } from "@/components/listing/config";
import { ListingTypeChangeDialog } from "@/components/listing/ListingTypeChangeDialog";
import { hasCategorySpecificListingAnswers } from "@/components/listing/listing-type-utils";
import type { ListingTypeId } from "@/components/listing/types";
import { MobileListingShell } from "../MobileListingShell";
import { MOBILE_LISTING_TYPE_ICONS } from "../config";

export function MobileVehicleTypeScreen() {
  const { draft, setListingType } = useListingBuilder();
  const [pendingTypeId, setPendingTypeId] = React.useState<ListingTypeId | null>(null);

  const selected = draft.listingTypeId as ListingTypeId | null;

  const requestTypeChange = (id: ListingTypeId) => {
    if (selected === id) return;
    if (selected && hasCategorySpecificListingAnswers(draft)) {
      setPendingTypeId(id);
      return;
    }
    setListingType(id);
  };

  return (
    <MobileListingShell
      stepId="type"
      continueHref="/mobile-listing/identify"
      continueDisabled={!selected}
    >
      <div className="flex flex-col gap-6 px-6 pt-4 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            What kind of vehicle are you listing?
          </h1>
          <p className="text-[15px] font-normal leading-[1.4] text-[#636366]">
            The questions shown next will adapt based on your vehicle.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {LISTING_TYPES.map((type) => {
            const isSelected = selected === type.id;
            const icon = MOBILE_LISTING_TYPE_ICONS[type.id];
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => requestTypeChange(type.id)}
                className={cn(
                  "relative flex items-center gap-4 p-5 rounded-2xl border text-left w-full transition-all",
                  isSelected
                    ? "border-[#1b1464] border-2 bg-[#f4f5fc]"
                    : "border-[#e5e5ea] border bg-white hover:border-[#c7c7cc]"
                )}
              >
                <div className="shrink-0 w-6 h-6">
                  <Image
                    src={icon}
                    alt=""
                    width={24}
                    height={24}
                    className="w-full h-full object-contain"
                  />
                </div>

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

      <ListingTypeChangeDialog
        open={pendingTypeId != null}
        onOpenChange={(open) => {
          if (!open) setPendingTypeId(null);
        }}
        fromLabel={getListingTypeById(draft.listingTypeId)?.label}
        toLabel={pendingTypeId ? getListingTypeById(pendingTypeId)?.label : undefined}
        onConfirm={() => {
          if (pendingTypeId) setListingType(pendingTypeId);
          setPendingTypeId(null);
        }}
      />
    </MobileListingShell>
  );
}
