"use client";

import * as React from "react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { AUCTION_SETTINGS_COPY } from "@/components/listing/auction-settings-copy";
import { MobileListingShell } from "../MobileListingShell";
import { MobileOptionSheet } from "../MobileOptionSheet";

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

export function MobileSaleSettingsScreen() {
  const { draft, updateSaleSettings } = useListingBuilder();
  const settings = draft.saleSettings;
  const [dateSheet, setDateSheet] = React.useState(false);

  return (
    <MobileListingShell
      stepId="settings"
      continueDisabled={false}
      continueHref="/mobile-listing/preview"
    >
      <div className="flex flex-col gap-5 px-6 pb-6 pt-4">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            {AUCTION_SETTINGS_COPY.title}
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">
            {AUCTION_SETTINGS_COPY.subtext}
          </p>
        </div>

        <div className="space-y-2">
          <Toggle
            label={AUCTION_SETTINGS_COPY.buyNowLabel}
            checked={Boolean(settings.buyNowPrice)}
            onChange={(checked) =>
              updateSaleSettings({
                buyNowPrice: checked ? settings.buyNowPrice || "150000" : "",
                reservePrice: checked ? "" : settings.reservePrice,
                saleType: deriveSaleType(
                  checked ? settings.buyNowPrice || "150000" : "",
                  checked ? "" : settings.reservePrice
                ),
              })
            }
          />
          <p className="text-[12px] leading-relaxed text-[#636366]">
            {AUCTION_SETTINGS_COPY.buyNowSubtext}
          </p>
          {settings.buyNowPrice ? (
            <Field label="Buy It Now price">
              <input
                value={formatMoneyDisplay(settings.buyNowPrice)}
                onChange={(event) =>
                  updateSaleSettings({
                    buyNowPrice: digitsOnly(event.target.value),
                    reservePrice: "",
                    saleType: deriveSaleType(digitsOnly(event.target.value), ""),
                  })
                }
                inputMode="decimal"
                className="h-10 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none"
              />
            </Field>
          ) : null}
        </div>

        <div className="space-y-2">
          <Toggle
            label={AUCTION_SETTINGS_COPY.reserveLabel}
            checked={Boolean(settings.reservePrice)}
            onChange={(checked) =>
              updateSaleSettings({
                reservePrice: checked ? settings.reservePrice || "100000" : "",
                buyNowPrice: checked ? "" : settings.buyNowPrice,
                saleType: deriveSaleType(
                  checked ? "" : settings.buyNowPrice,
                  checked ? settings.reservePrice || "100000" : ""
                ),
              })
            }
          />
          <p className="text-[12px] leading-relaxed text-[#636366]">
            {AUCTION_SETTINGS_COPY.reserveSubtext}
          </p>
          {settings.reservePrice ? (
            <Field label="Reserve Price">
              <input
                value={formatMoneyDisplay(settings.reservePrice)}
                onChange={(event) =>
                  updateSaleSettings({
                    reservePrice: digitsOnly(event.target.value),
                    buyNowPrice: "",
                    saleType: deriveSaleType("", digitsOnly(event.target.value)),
                  })
                }
                inputMode="decimal"
                className="h-10 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none"
              />
            </Field>
          ) : null}
          <p className="text-[11px] text-[#636366]">{AUCTION_SETTINGS_COPY.pricingNote}</p>
        </div>

        <Field label={AUCTION_SETTINGS_COPY.startPrompt}>
          <button
            type="button"
            onClick={() => setDateSheet(true)}
            className="h-10 w-full rounded-lg border border-[#e5e5ea] px-3 text-left text-[13px]"
          >
            ◷ {settings.preferredStartDate || "Select start date"}
          </button>
        </Field>

        <div className="space-y-2">
          <Toggle
            label={AUCTION_SETTINGS_COPY.shippingAvailableLabel}
            checked={settings.shipping === "available"}
            onChange={(checked) =>
              updateSaleSettings({ shipping: checked ? "available" : "" })
            }
          />
          <p className="text-[12px] leading-relaxed text-[#636366]">
            {AUCTION_SETTINGS_COPY.shippingAvailableSubtext}
          </p>
        </div>

        <div className="space-y-2">
          <Toggle
            label={AUCTION_SETTINGS_COPY.localPickupLabel}
            checked={settings.localPickup === "required"}
            onChange={(checked) =>
              updateSaleSettings({ localPickup: checked ? "required" : "" })
            }
          />
          <p className="text-[12px] leading-relaxed text-[#636366]">
            {AUCTION_SETTINGS_COPY.localPickupSubtext}
          </p>
        </div>
      </div>

      {dateSheet ? (
        <DateSheet
          onClose={() => setDateSheet(false)}
          onSelect={(date) => {
            updateSaleSettings({ preferredStartDate: date });
            setDateSheet(false);
          }}
        />
      ) : null}
    </MobileListingShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[12px] font-semibold text-[#636366]">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[13px] font-semibold text-[#1c1c1e]">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors ${
          checked ? "bg-[#1b1464]" : "bg-[#d1d1d6]"
        }`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
    </div>
  );
}

function DateSheet({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (date: string) => void;
}) {
  return (
    <MobileOptionSheet open title="Select Start Date" onClose={onClose}>
      <p className="text-[12px] text-[#636366]">August 2026</p>
      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[12px]">
        {Array.from({ length: 28 }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(`Aug ${index + 1}, 2026`)}
            className={`h-8 rounded-full ${
              index === 11 ? "bg-[#1b1464] text-white" : "hover:bg-[#f4f5fc]"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onSelect("Aug 12, 2026")}
        className="mt-5 h-11 w-full rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
      >
        Done
      </button>
    </MobileOptionSheet>
  );
}
