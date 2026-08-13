"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldHint, FieldLabel } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import type { ListingSaleSettings } from "../types";

const SALE_TYPES = ["Auction", "Buy Now", "Auction + Buy Now", "Make Offer"];
const SHIPPING_OPTIONS = [
  "Buyer arranged",
  "Seller arranged",
  "Enclosed transport available",
  "Local pickup only",
];

export function SaleSettingsScreen() {
  const { draft, updateSaleSettings } = useListingBuilder();
  const s = draft.saleSettings;

  const set = (key: keyof ListingSaleSettings, value: string) =>
    updateSaleSettings({ [key]: value });

  return (
    <ListingStep
      title="Auction Settings"
      description="Choose how you would like your auction to run"
    >
      <div className="space-y-6">
        <ListingSection title="Sale type">
          <FieldLabel htmlFor="sale-type">Sale Type</FieldLabel>
          <Select value={s.saleType || undefined} onValueChange={(v) => set("saleType", v)}>
            <SelectTrigger id="sale-type">
              <SelectValue placeholder="Select sale type" />
            </SelectTrigger>
            <SelectContent>
              {SALE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ListingSection>

        <ListingSection title="Buy It Now">
          <FieldHint>
            Set a premium Buy Now price that lets a buyer purchase your vehicle immediately and end
            the auction early. Buy Now is only available during the first 24 hours of the auction
          </FieldHint>
          <div className="mt-3">
            <FieldLabel htmlFor="buy-now-price">Buy Now Price</FieldLabel>
            <Input
              id="buy-now-price"
              value={s.buyNowPrice}
              onChange={(e) => set("buyNowPrice", e.target.value)}
              placeholder="e.g. 95000"
              inputMode="decimal"
            />
          </div>
        </ListingSection>

        <ListingSection title="Reserve Price">
          <FieldHint>
            Set the minimum price you’re willing to accept. Your reserve will be reflected on the
            Reserve Meter until the reserve is lifted. If bidding does not meet the reserve, the
            vehicle will not sell
          </FieldHint>
          <div className="mt-3">
            <FieldLabel htmlFor="reserve-price">Reserve Price</FieldLabel>
            <Input
              id="reserve-price"
              value={s.reservePrice}
              onChange={(e) => set("reservePrice", e.target.value)}
              placeholder="e.g. 75000"
              inputMode="decimal"
            />
          </div>
        </ListingSection>

        <ListingSection title="When do you want your auction to start?">
          <FieldLabel htmlFor="start-date">Start date</FieldLabel>
          <Input
            id="start-date"
            type="date"
            value={s.preferredStartDate}
            onChange={(e) => set("preferredStartDate", e.target.value)}
          />
        </ListingSection>

        <ListingSection title="Shipping Available">
          <FieldLabel htmlFor="shipping">Shipping</FieldLabel>
          <Select value={s.shipping || undefined} onValueChange={(v) => set("shipping", v)}>
            <SelectTrigger id="shipping">
              <SelectValue placeholder="Select shipping option" />
            </SelectTrigger>
            <SelectContent>
              {SHIPPING_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ListingSection>
      </div>
    </ListingStep>
  );
}
