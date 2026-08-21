"use client";

import { Input } from "@/components/ui/input";
import { FieldHint, FieldLabel } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import { AUCTION_SETTINGS_COPY } from "../auction-settings-copy";
import { cn } from "@/lib/utils";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatMoneyDisplay(value: string) {
  const digits = digitsOnly(value);
  if (!digits) return "";
  return `$${Number(digits).toLocaleString("en-US")}`;
}

function deriveSaleType(buyNowPrice: string, reservePrice: string): string {
  if (buyNowPrice) return "Buy Now";
  if (reservePrice) return "Auction";
  return "Auction";
}

export function SaleSettingsScreen() {
  const { draft, updateSaleSettings } = useListingBuilder();
  const s = draft.saleSettings;
  const buyNowOn = Boolean(s.buyNowPrice);
  const reserveOn = Boolean(s.reservePrice);
  const shippingOn = s.shipping === "available";
  const localPickupOn = s.localPickup === "required";

  return (
    <ListingStep title={AUCTION_SETTINGS_COPY.title} description={AUCTION_SETTINGS_COPY.subtext}>
      <div className="space-y-6">
        <ListingSection title={AUCTION_SETTINGS_COPY.buyNowLabel}>
          <div className="flex items-start justify-between gap-4">
            <FieldHint>{AUCTION_SETTINGS_COPY.buyNowSubtext}</FieldHint>
            <Toggle
              checked={buyNowOn}
              onChange={(checked) =>
                updateSaleSettings({
                  buyNowPrice: checked ? s.buyNowPrice || "150000" : "",
                  reservePrice: checked ? "" : s.reservePrice,
                  saleType: deriveSaleType(checked ? s.buyNowPrice || "150000" : "", checked ? "" : s.reservePrice),
                })
              }
            />
          </div>
          {buyNowOn ? (
            <div className="mt-3">
              <FieldLabel htmlFor="buy-now-price">Buy It Now price</FieldLabel>
              <Input
                id="buy-now-price"
                value={formatMoneyDisplay(s.buyNowPrice)}
                onChange={(e) => {
                  const digits = digitsOnly(e.target.value);
                  updateSaleSettings({
                    buyNowPrice: digits,
                    reservePrice: "",
                    saleType: deriveSaleType(digits, ""),
                  });
                }}
                placeholder="$0"
                inputMode="decimal"
              />
            </div>
          ) : null}
        </ListingSection>

        <ListingSection title={AUCTION_SETTINGS_COPY.reserveLabel}>
          <div className="flex items-start justify-between gap-4">
            <FieldHint>{AUCTION_SETTINGS_COPY.reserveSubtext}</FieldHint>
            <Toggle
              checked={reserveOn}
              onChange={(checked) =>
                updateSaleSettings({
                  reservePrice: checked ? s.reservePrice || "100000" : "",
                  buyNowPrice: checked ? "" : s.buyNowPrice,
                  saleType: deriveSaleType(checked ? "" : s.buyNowPrice, checked ? s.reservePrice || "100000" : ""),
                })
              }
            />
          </div>
          {reserveOn ? (
            <div className="mt-3">
              <FieldLabel htmlFor="reserve-price">Reserve price</FieldLabel>
              <Input
                id="reserve-price"
                value={formatMoneyDisplay(s.reservePrice)}
                onChange={(e) => {
                  const digits = digitsOnly(e.target.value);
                  updateSaleSettings({
                    reservePrice: digits,
                    buyNowPrice: "",
                    saleType: deriveSaleType("", digits),
                  });
                }}
                placeholder="$0"
                inputMode="decimal"
              />
            </div>
          ) : null}
          <p className="mt-2 text-xs text-muted-foreground">{AUCTION_SETTINGS_COPY.pricingNote}</p>
        </ListingSection>

        <ListingSection title={AUCTION_SETTINGS_COPY.startPrompt}>
          <FieldLabel htmlFor="start-date">Start date</FieldLabel>
          <Input
            id="start-date"
            type="date"
            value={s.preferredStartDate}
            onChange={(e) => updateSaleSettings({ preferredStartDate: e.target.value })}
          />
        </ListingSection>

        <ListingSection title="Shipping & pickup">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{AUCTION_SETTINGS_COPY.shippingAvailableLabel}</p>
                <FieldHint>{AUCTION_SETTINGS_COPY.shippingAvailableSubtext}</FieldHint>
              </div>
              <Toggle
                checked={shippingOn}
                onChange={(checked) =>
                  updateSaleSettings({ shipping: checked ? "available" : "" })
                }
              />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{AUCTION_SETTINGS_COPY.localPickupLabel}</p>
                <FieldHint>{AUCTION_SETTINGS_COPY.localPickupSubtext}</FieldHint>
              </div>
              <Toggle
                checked={localPickupOn}
                onChange={(checked) =>
                  updateSaleSettings({ localPickup: checked ? "required" : "" })
                }
              />
            </div>
          </div>
        </ListingSection>
      </div>
    </ListingStep>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "block h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}
