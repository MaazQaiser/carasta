"use client";

import * as React from "react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
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
            Auction Settings
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">
            Choose how you would like your auction to run
          </p>
        </div>

        <div className="space-y-2">
          <Toggle
            label="Buy It Now"
            checked={Boolean(settings.buyNowPrice)}
            onChange={(checked) =>
              updateSaleSettings({ buyNowPrice: checked ? "150000" : "" })
            }
          />
          <p className="text-[12px] leading-relaxed text-[#636366]">
            Set a premium Buy Now price that lets a buyer purchase your vehicle immediately and end
            the auction early. Buy Now is only available during the first 24 hours of the auction
          </p>
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
        </div>

        <div className="space-y-2">
          <Toggle
            label="Reserve Price"
            checked={Boolean(settings.reservePrice)}
            onChange={(checked) =>
              updateSaleSettings({ reservePrice: checked ? "100000" : "" })
            }
          />
          <p className="text-[12px] leading-relaxed text-[#636366]">
            Set the minimum price you’re willing to accept. Your reserve will be reflected on the
            Reserve Meter until the reserve is lifted. If bidding does not meet the reserve, the
            vehicle will not sell
          </p>
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
        </div>

        <Field label="When do you want your auction to start?">
          <button
            type="button"
            onClick={() => setDateSheet(true)}
            className="h-10 w-full rounded-lg border border-[#e5e5ea] px-3 text-left text-[13px]"
          >
            ◷ {settings.preferredStartDate || "Select start date"}
          </button>
        </Field>

        <Toggle
          label="Shipping Available"
          checked={settings.shipping === "available"}
          onChange={(checked) =>
            updateSaleSettings({ shipping: checked ? "available" : "" })
          }
        />
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
