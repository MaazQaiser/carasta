"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useListingBuilder } from "../ListingBuilderContext";
import type { ModificationEntry } from "../types";
import { LISTING_PATHS } from "../listing-route-map";
import {
  persistModificationEntry,
  ShopBuilderSession,
  type ShopBuilderTarget,
} from "@/components/mobile-listing/shop-builder/shop-builder-session";

export function useOpenListingShopBuilder() {
  const router = useRouter();
  const pathname = usePathname();
  const { draft, replaceDraft } = useListingBuilder();
  const [opening, setOpening] = React.useState(false);

  React.useEffect(() => {
    router.prefetch(LISTING_PATHS.shopBuilder);
    router.prefetch(LISTING_PATHS.shopBuilderAdd);
  }, [router]);

  const openShopBuilder = React.useCallback(
    (options: {
      target: ShopBuilderTarget;
      entryId?: string;
      entry?: ModificationEntry | null;
      label?: string;
      returnTo?: string;
    }) => {
      if (opening) return;
      setOpening(true);

      if (options.entry) {
        replaceDraft(persistModificationEntry(draft, options.entry));
      }

      const returnTo =
        options.returnTo ||
        `${pathname}${typeof window !== "undefined" ? window.location.search : ""}`;

      ShopBuilderSession.start({
        returnTo,
        target: options.target,
        entryId: options.entryId ?? options.entry?.id,
        label: options.label,
      });

      router.push(LISTING_PATHS.shopBuilder);
      setOpening(false);
    },
    [draft, opening, pathname, replaceDraft, router]
  );

  return { openShopBuilder, opening };
}
