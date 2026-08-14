"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MobileOptionList, MobileOptionSheet } from "../MobileOptionSheet";
import { MobileListingShell } from "../MobileListingShell";
import { SHARED_MODIFICATION_CATEGORIES } from "@/components/listing/specs/shared-modification-categories";
import {
  shouldShowShopBuilder,
  WORK_PERFORMED_BY_OPTIONS,
} from "@/components/listing/specs/options";

export function MobileAddModificationScreen() {
  const router = useRouter();
  const [category, setCategory] = React.useState(
    SHARED_MODIFICATION_CATEGORIES[0]?.id ?? "engine-performance"
  );
  const [workerSheet, setWorkerSheet] = React.useState(false);
  const [worker, setWorker] = React.useState("");

  return (
    <MobileListingShell stepId="modifications" continueDisabled>
      <div className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <div>
          <h1 className="text-[25px] font-extrabold text-[#1c1c1e]">Add Modification</h1>
          <p className="mt-1 text-[13px] text-[#636366]">Document an aftermarket part or change.</p>
        </div>
        <Field label="Category">
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-10 w-full rounded-lg border border-[#e5e5ea] bg-white px-3 text-[13px] outline-none"
          >
            {SHARED_MODIFICATION_CATEGORIES.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Modification"><input className="h-10 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none" placeholder="e.g. Carbon Fiber Rear Wing" /></Field>
        <Field label="Brand"><input className="h-10 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none" placeholder="e.g. APR" /></Field>
        <Field label="Description"><textarea className="min-h-20 w-full rounded-lg border border-[#e5e5ea] px-3 py-3 text-[13px] outline-none" placeholder="Describe the modification…" /></Field>
        <Field label="Work Performed By">
          <button type="button" onClick={() => setWorkerSheet(true)} className="flex h-10 w-full items-center justify-between rounded-lg border border-[#e5e5ea] px-3 text-left text-[13px]">
            {worker || "Select work performed by"}<span>⌄</span>
          </button>
        </Field>
        {shouldShowShopBuilder(worker) ? (
          <button
            type="button"
            className="flex h-10 w-full items-center justify-center rounded-lg border border-[#1b1464] text-[13px] font-semibold text-[#1b1464]"
          >
            Add Shop / Builder
          </button>
        ) : null}
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
            options={[...WORK_PERFORMED_BY_OPTIONS]}
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
