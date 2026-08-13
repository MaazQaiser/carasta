"use client";

import { ChevronRight, Loader2 } from "lucide-react";
import { FieldLabel } from "../fields";
import { useOpenListingShopBuilder } from "./useOpenListingShopBuilder";
import type { ShopBuilderTarget } from "@/components/mobile-listing/shop-builder/shop-builder-session";
import type { ModificationEntry } from "../types";

export function ListingShopBuilderField({
  label = "Shop / Builder / Company",
  value,
  target,
  entryId,
  entry,
  placeholder = "Search or add a shop",
}: {
  label?: string;
  value: string;
  target: ShopBuilderTarget;
  entryId?: string;
  entry?: ModificationEntry | null;
  placeholder?: string;
}) {
  const { openShopBuilder, opening } = useOpenListingShopBuilder();

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <button
        type="button"
        onClick={() =>
          openShopBuilder({
            target,
            entryId: entryId ?? entry?.id,
            entry,
            label: "Shop / Builder",
          })
        }
        disabled={opening}
        className="relative flex h-10 w-full items-center rounded-md border border-input bg-background px-3 text-left text-sm outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-70"
      >
        <span className={value ? "pr-8 text-foreground" : "pr-8 text-muted-foreground"}>
          {opening ? "Opening…" : value || placeholder}
        </span>
        {opening ? (
          <Loader2 className="pointer-events-none absolute right-3 h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <ChevronRight className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}
