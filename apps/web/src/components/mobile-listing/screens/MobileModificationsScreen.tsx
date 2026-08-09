"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, Pencil } from "lucide-react";
import { MobileListingShell } from "../MobileListingShell";

const categories = [
  "Powertrain",
  "Drivetrain",
  "Wheels & Tires",
  "Exterior",
  "Interior",
  "Electronics / Audio",
  "Safety",
  "Factory Equipment",
  "Other",
];

const powertrain = [
  ["Engine", "4.0L Naturally Aspirated Boxer-6"],
  ["Horsepower", "520 hp"],
  ["Torque", "346 lb-ft"],
  ["Transmission", "7-Speed PDK Automatic"],
  ["Fluid Type", "Premium Unleaded"],
  ["Drive Type", "Rear-Wheel Drive"],
];

export function MobileModificationsScreen() {
  const [expanded, setExpanded] = React.useState<string | null>(null);

  return (
    <MobileListingShell
      stepId="modifications"
      continueDisabled={false}
      continueHref="/mobile-listing/condition"
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            Specifications &amp; Modifications
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">
            Review and edit your vehicle specifications.
          </p>
        </div>

        <div className="divide-y divide-[#e5e5ea] rounded-xl border border-[#e5e5ea]">
          {categories.map((category) => {
            const open = expanded === category;
            return (
              <div key={category}>
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : category)}
                  className="flex h-12 w-full items-center justify-between px-3 text-left"
                >
                  <span className="text-[13px] font-semibold text-[#1c1c1e]">
                    {category} <span className="ml-1 text-[10px] font-medium text-[#7b78a3]">VIN imported</span>
                  </span>
                  {open ? <ChevronDown className="h-4 w-4 text-[#636366]" /> : <ChevronRight className="h-4 w-4 text-[#636366]" />}
                </button>
                {open && category === "Powertrain" ? (
                  <div className="space-y-3 border-t border-[#e5e5ea] bg-[#fafafa] p-3">
                    {powertrain.map(([label, value]) => (
                      <div key={label} className="space-y-1">
                        <span className="text-[11px] font-semibold text-[#636366]">{label}</span>
                        <div className="flex h-10 items-center justify-between rounded-lg border border-[#e5e5ea] bg-white px-3">
                          <span className="text-[12px] text-[#1c1c1e]">{value}</span>
                          <Pencil className="h-3.5 w-3.5 text-[#636366]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <a
          href="/mobile-listing/modifications/add"
          className="flex h-11 items-center justify-center rounded-lg border border-[#1b1464] text-[13px] font-semibold text-[#1b1464]"
        >
          Add Modification
        </a>
      </div>
    </MobileListingShell>
  );
}
