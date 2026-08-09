"use client";

import * as React from "react";
import { MobileListingShell } from "../MobileListingShell";

const equipment = [
  "Sport Package",
  "Premium Package",
  "Luxury Package",
  "Tour Package",
  "Carbon Ceramic Brakes (PCCB)",
  "Front Axle Lift System",
  "Sport Exhaust",
  "Chrono Package",
];

export function MobileFactoryEquipmentScreen() {
  const [selected, setSelected] = React.useState<string[]>([
    "Sport Package",
    "Premium Package",
    "Carbon Ceramic Brakes (PCCB)",
    "Front Axle Lift System",
    "Sport Exhaust",
  ]);

  return (
    <MobileListingShell
      stepId="factory-equipment"
      continueDisabled={false}
      continueHref="/mobile-listing/modifications"
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">Factory Equipment</h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">
            Select standard options detected from your VIN.
          </p>
        </div>
        <input
          placeholder="Search options…"
          className="h-10 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]"
        />
        <div className="space-y-3">
          {equipment.map((item) => {
            const checked = selected.includes(item);
            return (
              <label key={item} className="flex items-center gap-3 text-[13px] text-[#1c1c1e]">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setSelected((current) =>
                      checked ? current.filter((value) => value !== item) : [...current, item]
                    )
                  }
                  className="h-4 w-4 accent-[#1b1464]"
                />
                {item}
              </label>
            );
          })}
        </div>
      </div>
    </MobileListingShell>
  );
}
