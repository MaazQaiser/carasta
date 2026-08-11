"use client";

import * as React from "react";
import { MobileOptionList, MobileOptionSheet } from "../MobileOptionSheet";
import { useRouter } from "next/navigation";
import { MobileListingShell } from "../MobileListingShell";

const categories = ["Powertrain", "Exterior", "Interior", "Electronics", "Wheels & Tires", "Safety", "Other"];
const workerTypes = ["Professional Shop", "Current Owner / Shop", "Previous Owner", "Unknown"];

export function MobileAddModificationScreen() {
  const router = useRouter();
  const [category, setCategory] = React.useState("Exterior");
  const [workerSheet, setWorkerSheet] = React.useState(false);
  const [worker, setWorker] = React.useState("Professional Shop");

  return (
    <MobileListingShell stepId="modifications" continueDisabled>
      <div className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <div>
          <h1 className="text-[25px] font-extrabold text-[#1c1c1e]">Add Modification</h1>
          <p className="mt-1 text-[13px] text-[#636366]">Document an aftermarket part or change.</p>
        </div>
        <Field label="Category">
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 w-full rounded-lg border border-[#e5e5ea] bg-white px-3 text-[13px] outline-none">
            {categories.map((option) => <option key={option}>{option}</option>)}
          </select>
        </Field>
        <Field label="Modification"><input className="h-10 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none" placeholder="e.g. Carbon Fiber Rear Wing" /></Field>
        <Field label="Brand"><input className="h-10 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none" placeholder="e.g. APR" /></Field>
        <Field label="Description"><textarea className="min-h-20 w-full rounded-lg border border-[#e5e5ea] px-3 py-3 text-[13px] outline-none" placeholder="Describe the modification…" /></Field>
        <Field label="Was this professionally installed?">
          <button type="button" onClick={() => setWorkerSheet(true)} className="flex h-10 w-full items-center justify-between rounded-lg border border-[#e5e5ea] px-3 text-left text-[13px]">
            {worker}<span>⌄</span>
          </button>
        </Field>
        <Field label="Date / Location"><input className="h-10 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none" placeholder="e.g. April 2024, Dallas" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="h-10 rounded-lg border border-[#e5e5ea] text-[12px] font-medium">Upload</button>
          <button type="button" className="h-10 rounded-lg border border-[#e5e5ea] text-[12px] font-medium">+ Upload</button>
        </div>
        <button type="button" onClick={() => router.push("/mobile-listing/modifications")} className="h-11 rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white">
          Save Modification
        </button>
      </div>
      {workerSheet ? (
        <MobileOptionSheet open title="Work Performed By" onClose={() => setWorkerSheet(false)}>
          <MobileOptionList
            options={workerTypes}
            value={worker}
            onSelect={(option) => {
              setWorker(option);
              setWorkerSheet(false);
            }}
          />
        </MobileOptionSheet>
      ) : null}
    </MobileListingShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5"><span className="text-[12px] font-semibold text-[#636366]">{label}</span>{children}</label>;
}
