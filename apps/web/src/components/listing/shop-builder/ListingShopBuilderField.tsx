"use client";

import { ChevronRight, Loader2, Plus } from "lucide-react";
import { FieldLabel } from "../fields";
import { useOpenListingShopBuilder } from "./useOpenListingShopBuilder";
import type { ShopBuilderTarget } from "@/components/mobile-listing/shop-builder/shop-builder-session";
import type { ModificationEntry } from "../types";

export function ListingShopBuilderField({
  label = "Shop / Builder",
  value,
  target,
  entryId,
  entry,
  placeholder = "Add Shop / Builder",
  emptyAction = false,
}: {
  label?: string;
  value: string;
  target: ShopBuilderTarget;
  entryId?: string;
  entry?: ModificationEntry | null;
  placeholder?: string;
  /** Render a full-width Add Shop / Builder button when no shop is selected. */
  emptyAction?: boolean;
}) {
  const { openShopBuilder, opening } = useOpenListingShopBuilder();

  const open = () =>
    openShopBuilder({
      target,
      entryId: entryId ?? entry?.id,
      entry,
      label: "Shop / Builder",
    });

  if (emptyAction && !value.trim()) {
    return (
      <button
        type="button"
        onClick={open}
        disabled={opening}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-primary text-sm font-semibold text-primary disabled:opacity-70"
      >
        {opening ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        {opening ? "Opening…" : "Add Shop / Builder"}
      </button>
    );
  }

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <button
        type="button"
        onClick={open}
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
