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
const DURATIONS = ["3 days", "5 days", "7 days", "10 days", "14 days"];
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
      title="Sale Settings"
      description="Configure how this vehicle will be offered. Shared settings for every listing type."
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="reserve-price">Reserve Price</FieldLabel>
            <Input
              id="reserve-price"
              value={s.reservePrice}
              onChange={(e) => set("reservePrice", e.target.value)}
              placeholder="e.g. 75000"
              inputMode="decimal"
            />
          </div>
          <div>
            <FieldLabel htmlFor="buy-now-price">Buy Now Price</FieldLabel>
            <Input
              id="buy-now-price"
              value={s.buyNowPrice}
              onChange={(e) => set("buyNowPrice", e.target.value)}
              placeholder="e.g. 95000"
              inputMode="decimal"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="start-date">Preferred Start Date</FieldLabel>
            <Input
              id="start-date"
              type="date"
              value={s.preferredStartDate}
              onChange={(e) => set("preferredStartDate", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="duration">Auction Duration</FieldLabel>
            <Select
              value={s.auctionDuration || undefined}
              onValueChange={(v) => set("auctionDuration", v)}
            >
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map((duration) => (
                  <SelectItem key={duration} value={duration}>
                    {duration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <ListingSection title="Shipping">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
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
            </div>
            <div>
              <FieldLabel htmlFor="shipping-location">Shipping Location</FieldLabel>
              <Input
                id="shipping-location"
                value={s.shippingLocation}
                onChange={(e) => set("shippingLocation", e.target.value)}
                placeholder="e.g. Los Angeles, CA"
              />
            </div>
          </div>
          <FieldHint>No validation or pricing rules yet — settings only.</FieldHint>
        </ListingSection>
      </div>
    </ListingStep>
  );
}
