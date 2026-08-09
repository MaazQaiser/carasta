"use client";

import * as React from "react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { MobileListingShell } from "../MobileListingShell";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatMoneyDisplay(value: string) {
  const digits = digitsOnly(value);
  if (!digits) return "";
  return `$${Number(digits).toLocaleString("en-US")}`;
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
      <div className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            Sale Settings
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">
            Set your preferred sale details.
          </p>
        </div>

        <Toggle
          label="Buy It Now"
          checked={Boolean(settings.buyNowPrice)}
          onChange={(checked) =>
            updateSaleSettings({ buyNowPrice: checked ? "150000" : "" })
          }
        />
        {settings.buyNowPrice ? (
          <Field label="Buy It Now price">
            <input
              value={formatMoneyDisplay(settings.buyNowPrice)}
              onChange={(event) =>
                updateSaleSettings({ buyNowPrice: digitsOnly(event.target.value) })
              }
              inputMode="decimal"
              className="h-10 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none"
            />
          </Field>
        ) : null}

        <Toggle
          label="Set Reserve Price"
          checked={Boolean(settings.reservePrice)}
          onChange={(checked) =>
            updateSaleSettings({ reservePrice: checked ? "100000" : "" })
          }
        />
        {settings.reservePrice ? (
          <Field label="Reserve price">
            <input
              value={formatMoneyDisplay(settings.reservePrice)}
              onChange={(event) =>
                updateSaleSettings({ reservePrice: digitsOnly(event.target.value) })
              }
              inputMode="decimal"
              className="h-10 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none"
            />
          </Field>
        ) : null}

        <Field label="Auction Schedule">
          <button
            type="button"
            onClick={() => setDateSheet(true)}
            className="h-10 w-full rounded-lg border border-[#e5e5ea] px-3 text-left text-[13px]"
          >
            ◷ {settings.preferredStartDate || "Select start date"}
          </button>
        </Field>

        <Field label="Auction Duration">
          <select
            value={settings.auctionDuration || "7 Days"}
            onChange={(event) =>
              updateSaleSettings({ auctionDuration: event.target.value })
            }
            className="h-10 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px]"
          >
            <option>7 Days</option>
            <option>10 Days</option>
            <option>14 Days</option>
          </select>
        </Field>

        <Toggle
          label="Shipping Available"
          checked={settings.shipping === "available"}
          onChange={(checked) =>
            updateSaleSettings({ shipping: checked ? "available" : "" })
          }
        />

        <Field label="Terms / Shipping">
          <textarea
            value={settings.shippingLocation}
            onChange={(event) =>
              updateSaleSettings({ shippingLocation: event.target.value })
            }
            placeholder="Add any shipping, pickup, or sale terms…"
            className="min-h-32 w-full rounded-lg border border-[#e5e5ea] p-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </Field>

        <button
          type="button"
          className="h-10 rounded-lg border border-[#1b1464] text-[13px] font-semibold text-[#1b1464]"
        >
          ✧ Generate with AI
        </button>
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
    <div className="flex items-center justify-between">
      <span className="text-[13px] font-semibold text-[#1c1c1e]">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`h-5 w-9 rounded-full p-0.5 transition-colors ${
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
    <div className="fixed inset-0 z-50 flex items-end bg-black/40">
      <button className="absolute inset-0" aria-label="Close date picker" onClick={onClose} />
      <div className="relative mx-auto w-full max-w-[440px] rounded-t-[28px] bg-white p-6 pb-8">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#d1d1d6]" />
        <h2 className="text-[18px] font-bold">Select Start Date</h2>
        <p className="mt-1 text-[12px] text-[#636366]">August 2026</p>
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
      </div>
    </div>
  );
}
