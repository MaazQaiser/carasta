"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldLabel } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import { LISTING_PATHS } from "../listing-route-map";
import { ShopBuilderService } from "@/components/mobile-listing/shop-builder/shop-builder-service";
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
  const [type, setType] = React.useState<"Shop" | "Builder" | "Company">("Shop");

  const canSave = name.trim().length > 1;

  const save = () => {
    const session = ShopBuilderSession.load();
    if (!session?.returnTo) {
      router.replace(LISTING_PATHS.type);
      return;
    }
    const record = ShopBuilderService.add({ name, city, state, type });
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
      description="Create a custom shop, builder, or company for this listing."
    >
      <ListingSection title="Details">
        <div className="grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="shop-name">Name</FieldLabel>
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
          <div>
            <FieldLabel>Type</FieldLabel>
            <Select
              value={type}
              onValueChange={(v) => setType(v as "Shop" | "Builder" | "Company")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Shop">Shop</SelectItem>
                <SelectItem value="Builder">Builder</SelectItem>
                <SelectItem value="Company">Company</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" disabled={!canSave} onClick={save}>
            Save &amp; Select
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(LISTING_PATHS.shopBuilder)}
          >
            Cancel
          </Button>
        </div>
      </ListingSection>
    </ListingStep>
  );
}
