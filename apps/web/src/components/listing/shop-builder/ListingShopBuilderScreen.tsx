"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingStep } from "../ListingStep";
import { useListingBuilder } from "../ListingBuilderContext";
import { LISTING_PATHS } from "../listing-route-map";
import {
  ShopBuilderService,
  type ShopBuilderRecord,
} from "@/components/mobile-listing/shop-builder/shop-builder-service";
import {
  applyShopBuilderSelection,
  ShopBuilderSession,
  type ShopBuilderPickerSession,
} from "@/components/mobile-listing/shop-builder/shop-builder-session";

export function ListingShopBuilderScreen() {
  const router = useRouter();
  const { draft, replaceDraft } = useListingBuilder();
  const [query, setQuery] = React.useState("");
  const [session, setSession] = React.useState<ShopBuilderPickerSession | null>(null);
  const [ready, setReady] = React.useState(false);
  const [results, setResults] = React.useState<ShopBuilderRecord[]>([]);

  React.useEffect(() => {
    const loaded = ShopBuilderSession.load();
    setSession(loaded);
    setReady(true);
    if (!loaded?.returnTo) {
      router.replace(LISTING_PATHS.type);
      return;
    }
    setResults(ShopBuilderService.list());
  }, [router]);

  React.useEffect(() => {
    if (!ready || !session) return;
    setResults(ShopBuilderService.search(query));
  }, [query, ready, session]);

  const selectShop = (shop: ShopBuilderRecord) => {
    if (!session) return;
    const next = applyShopBuilderSelection(
      draft,
      session.target,
      shop.name,
      session.entryId
    );
    replaceDraft(next);
    const returnTo = session.returnTo;
    ShopBuilderSession.clear();
    router.push(returnTo);
  };

  if (!ready || !session) {
    return (
      <ListingStep title="Shop / Builder" description="Loading…">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </ListingStep>
    );
  }

  return (
    <ListingStep
      title={session.label || "Shop / Builder"}
      description="Search and select an existing shop first to avoid duplicates. Only add a new one if it isn’t listed."
    >
      <div className="max-w-xl space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, city, or type"
            className="pl-9"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {results.length} result{results.length === 1 ? "" : "s"}
          </p>
          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
              No matches. Try another search, then add a new Shop / Builder if needed.
            </div>
          ) : (
            <ul className="divide-y rounded-xl border">
              {results.map((shop) => (
                <li key={shop.id}>
                  <button
                    type="button"
                    onClick={() => selectShop(shop)}
                    className="flex w-full flex-col gap-0.5 px-4 py-3 text-left hover:bg-muted/40"
                  >
                    <span className="font-medium">{shop.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {[shop.city, shop.state, shop.type].filter(Boolean).join(" · ")}
                      {shop.custom ? " · Added by you" : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.push(LISTING_PATHS.shopBuilderAdd)}
        >
          <Plus className="h-4 w-4" />
          Add New Shop / Builder
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            const returnTo = session.returnTo;
            ShopBuilderSession.clear();
            router.push(returnTo);
          }}
        >
          Cancel
        </Button>
      </div>
    </ListingStep>
  );
}
