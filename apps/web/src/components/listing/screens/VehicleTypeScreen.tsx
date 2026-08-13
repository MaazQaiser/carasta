"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LISTING_TYPES, getListingTypeById } from "../config";
import type { ListingTypeId } from "../types";
import { ListingStep } from "../ListingStep";
import { useListingBuilder } from "../ListingBuilderContext";
import { ListingTypeChangeDialog } from "../ListingTypeChangeDialog";
import { hasCategorySpecificListingAnswers } from "../listing-type-utils";

export function VehicleTypeScreen() {
  const { draft, setListingType } = useListingBuilder();
  const [pendingTypeId, setPendingTypeId] = React.useState<ListingTypeId | null>(null);

  const requestTypeChange = (id: ListingTypeId) => {
    if (draft.listingTypeId === id) return;
    if (
      draft.listingTypeId &&
      hasCategorySpecificListingAnswers(draft)
    ) {
      setPendingTypeId(id);
      return;
    }
    setListingType(id);
  };

  return (
    <ListingStep
      title="What kind of vehicle are you listing?"
      description="The questions shown next will adapt based on your vehicle."
    >
      <div className="flex flex-col gap-3">
        {LISTING_TYPES.map((type) => {
          const Icon = type.icon;
          const selected = draft.listingTypeId === type.id;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => requestTypeChange(type.id as ListingTypeId)}
              className={cn(
                "relative flex items-start gap-4 text-left rounded-2xl border bg-background p-4 sm:p-5 transition-all w-full",
                "hover:border-primary/50 hover:bg-primary/5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  selected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0 pr-8">
                <h3 className="font-semibold text-sm sm:text-base leading-snug">{type.label}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {type.description}
                </p>
              </div>

              <span
                className={cn(
                  "absolute top-1/2 right-4 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border-2",
                  selected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/40 bg-transparent"
                )}
                aria-hidden
              >
                {selected ? <span className="h-2 w-2 rounded-full bg-primary-foreground" /> : null}
              </span>
            </button>
          );
        })}
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
    </ListingStep>
  );
}
