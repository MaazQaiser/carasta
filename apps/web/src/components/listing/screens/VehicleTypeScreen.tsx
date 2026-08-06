"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { LISTING_TYPES } from "../config";
import type { ListingTypeId } from "../types";
import { ListingStep } from "../ListingStep";
import { useListingBuilder } from "../ListingBuilderContext";

export function VehicleTypeScreen() {
  const { draft, setListingType } = useListingBuilder();

  return (
    <ListingStep
      title="Vehicle Type"
      description="Choose the category that best matches this vehicle. Every listing flow shares this step."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {LISTING_TYPES.map((type) => {
          const Icon = type.icon;
          const selected = draft.listingTypeId === type.id;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setListingType(type.id as ListingTypeId)}
              className={cn(
                "relative text-left rounded-2xl border bg-background p-4 sm:p-5 transition-all min-h-[140px]",
                "hover:border-primary/50 hover:bg-primary/5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border"
              )}
            >
              {selected ? (
                <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3.5 w-3.5" />
                </span>
              ) : null}
              <div
                className={cn(
                  "mb-3 sm:mb-4 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl",
                  selected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base pr-8 leading-snug">{type.label}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                {type.description}
              </p>
            </button>
          );
        })}
      </div>
    </ListingStep>
  );
}
