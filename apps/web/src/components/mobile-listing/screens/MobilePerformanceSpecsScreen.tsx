"use client";

import * as React from "react";
import { MobileOptionList, MobileOptionSheet } from "../MobileOptionSheet";
import { ChevronDown } from "lucide-react";
import { MobileListingShell } from "../MobileListingShell";

const specFields = [
  { label: "Engine", value: "4.0L Flat-6" },
  { label: "Transmission", value: "7-Speed PDK" },
  { label: "Drivetrain", value: "RWD" },
];

export function MobilePerformanceSpecsScreen() {
  const [statusSheet, setStatusSheet] = React.useState<"horsepower" | "torque" | null>(null);
  const [values, setValues] = React.useState({
    engine: "4.0L Flat-6",
    transmission: "7-Speed PDK",
    drivetrain: "RWD",
    horsepower: "520",
    torque: "346",
    buildSummary: "",
  });

  return (
    <MobileListingShell
      stepId="specifications"
      continueDisabled={false}
      continueHref="/mobile-listing/factory-equipment"
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            Performance Specs
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">
            Provide engine and modification details.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {specFields.map((field) => (
            <label key={field.label} className="space-y-1.5">
              <span className="text-[12px] font-semibold text-[#636366]">{field.label}</span>
              <div className="relative">
                <input
                  value={values[field.label.toLowerCase() as keyof typeof values] as string}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [field.label.toLowerCase()]: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 pr-10 text-[13px] outline-none focus:border-[#1b1464] focus:ring-2 focus:ring-[#1b1464]/15"
                />
                <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-[#636366]" />
              </div>
            </label>
          ))}

          <SpecNumberField label="Horsepower" value={values.horsepower} suffix="hp" onStatus={() => setStatusSheet("horsepower")} onChange={(horsepower) => setValues((current) => ({ ...current, horsepower }))} />
          <SpecNumberField label="Torque" value={values.torque} suffix="lb-ft" onStatus={() => setStatusSheet("torque")} onChange={(torque) => setValues((current) => ({ ...current, torque }))} />

          <label className="space-y-1.5">
            <span className="text-[12px] font-semibold text-[#636366]">Build Summary</span>
            <textarea
              value={values.buildSummary}
              onChange={(event) => setValues((current) => ({ ...current, buildSummary: event.target.value }))}
              placeholder="Describe your build in a few sentences…"
              className="min-h-28 w-full resize-none rounded-lg border border-[#e5e5ea] p-3 text-[13px] outline-none focus:border-[#1b1464] focus:ring-2 focus:ring-[#1b1464]/15"
            />
          </label>
        </div>
      </div>
      {statusSheet ? <StatusSheet label={statusSheet === "horsepower" ? "Horsepower" : "Torque"} onClose={() => setStatusSheet(null)} /> : null}
    </MobileListingShell>
  );
}

function SpecNumberField({
  label,
  value,
  suffix,
  onStatus,
  onChange,
}: {
  label: string;
  value: string;
  suffix: string;
  onStatus: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1.5">
      <span className="flex items-center justify-between text-[12px] font-semibold text-[#636366]">
        {label}
        <button type="button" onClick={onStatus} className="text-[10px] font-medium text-[#1b1464]">Factory Rated</button>
      </span>
      <div className="relative">
        <input
          value={value}
          inputMode="numeric"
          onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))}
          className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 pr-12 text-[13px] outline-none focus:border-[#1b1464] focus:ring-2 focus:ring-[#1b1464]/15"
        />
        <span className="pointer-events-none absolute right-3 top-3 text-[12px] text-[#636366]">{suffix}</span>
      </div>
    </label>
  );
}

function StatusSheet({ label, onClose }: { label: string; onClose: () => void }) {
  const [selected, setSelected] = React.useState("Factory Rated");
  const options = ["Factory Rated", "Estimated", "Dyno Verified", "Unknown"];

  return (
    <MobileOptionSheet open title={`${label} Status`} onClose={onClose}>
      <MobileOptionList
        options={options}
        value={selected}
        onSelect={(option) => {
          setSelected(option);
          onClose();
        }}
      />
    </MobileOptionSheet>
  );
}
