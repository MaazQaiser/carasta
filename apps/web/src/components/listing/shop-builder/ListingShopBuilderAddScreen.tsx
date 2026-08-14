"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import { LISTING_PATHS } from "../listing-route-map";
import {
  ShopBuilderService,
  type ShopBuilderRecord,
} from "@/components/mobile-listing/shop-builder/shop-builder-service";
import {
  applyShopBuilderSelection,
  ShopBuilderSession,
} from "@/components/mobile-listing/shop-builder/shop-builder-session";

export function ListingShopBuilderAddScreen() {
  const router = useRouter();
  const { draft, replaceDraft } = useListingBuilder();
  const [name, setName] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");

  const canSave = name.trim().length > 1 && city.trim().length > 0 && state.trim().length > 0;
  const matches = ShopBuilderService.findSimilar(name, city, state);

  const selectExisting = (shop: ShopBuilderRecord) => {
    const session = ShopBuilderSession.load();
    if (!session?.returnTo) {
      router.replace(LISTING_PATHS.type);
      return;
    }
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

  const save = () => {
    const session = ShopBuilderSession.load();
    if (!session?.returnTo) {
      router.replace(LISTING_PATHS.type);
      return;
    }
    const record = ShopBuilderService.add({ name, city, state });
    const next = applyShopBuilderSelection(
      draft,
      session.target,
      record.name,
      session.entryId
    );
    replaceDraft(next);
    const returnTo = session.returnTo;
    ShopBuilderSession.clear();
    router.push(returnTo);
  };

  return (
    <ListingStep
      title="Add Shop / Builder"
      description="Add name, city, and state. Match an existing record when you can to avoid duplicates."
    >
      <ListingSection title="Details">
        <div className="grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="shop-name">Shop / Builder Name</FieldLabel>
            <Input
              id="shop-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Shop or builder name"
            />
          </div>
          <div>
            <FieldLabel htmlFor="shop-city">City</FieldLabel>
            <Input id="shop-city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="shop-state">State</FieldLabel>
            <Input id="shop-state" value={state} onChange={(e) => setState(e.target.value)} />
          </div>
        </div>

        {matches.length > 0 ? (
          <div className="mt-5 max-w-xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Possible matches — select one instead of adding a duplicate
            </p>
            <ul className="divide-y rounded-xl border">
              {matches.map((shop) => (
                <li key={shop.id}>
                  <button
                    type="button"
                    onClick={() => selectExisting(shop)}
                    className="flex w-full flex-col gap-0.5 px-4 py-3 text-left hover:bg-muted/40"
                  >
                    <span className="font-medium">{shop.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {[shop.city, shop.state].filter(Boolean).join(", ") || "Location not listed"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" disabled={!canSave} onClick={save}>
            Save &amp; Select
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(LISTING_PATHS.shopBuilder)}
          >
            Back to search
          </Button>
        </div>
      </ListingSection>
    </ListingStep>
  );
}
