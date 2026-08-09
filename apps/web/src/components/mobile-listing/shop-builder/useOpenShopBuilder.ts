"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import type { ModificationEntry } from "@/components/listing/types";
import { useMobileListingChrome } from "../MobileListingRuntime";
import {
  persistModificationEntry,
  ShopBuilderSession,
  type ShopBuilderTarget,
} from "./shop-builder-session";

export function useOpenShopBuilder() {
  const router = useRouter();
  const pathname = usePathname();
  const { draft, replaceDraft } = useListingBuilder();
  const { navigate } = useMobileListingChrome();
  const [opening, setOpening] = React.useState(false);

  React.useEffect(() => {
    router.prefetch("/mobile-listing/shop-builder");
    router.prefetch("/mobile-listing/shop-builder/add");
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

      navigate("/mobile-listing/shop-builder");
    },
    [draft, navigate, opening, pathname, replaceDraft]
  );

  return { openShopBuilder, opening };
}
