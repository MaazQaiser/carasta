"use client";
import { MobileOptionList, MobileOptionSheet } from "../MobileOptionSheet";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { MobileListingShell } from "../MobileListingShell";

const fields = ["Accidents", "Warranty", "Service History", "Vehicle Condition", "Title Status"];

export function MobileConditionHistoryScreen() {
  const [condition, setCondition] = React.useState("Very Good");
  const [title, setTitle] = React.useState("Clean");
  const [sheet, setSheet] = React.useState<"condition" | "title" | null>(null);

  return (
    <MobileListingShell stepId="condition" continueDisabled={false} continueHref="/mobile-listing/photos">
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">Condition &amp; History</h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">Tell buyers about your vehicle’s history and condition.</p>
        </div>
        <div className="rounded-lg bg-[#e7f7e8] px-3 py-2 text-[12px] text-[#26742d]">
          Vehicle history report found — 0 accidents reported, clean title.
        </div>
        <div className="space-y-3">
          {fields.slice(0, 3).map((label) => <StaticSelect key={label} label={label} value={label === "Accidents" ? "None reported" : label === "Warranty" ? "No active warranty" : "Service records available"} />)}
          <StaticSelect label="Vehicle Condition" value={condition} onClick={() => setSheet("condition")} />
          <StaticSelect label="Title Status" value={title} onClick={() => setSheet("title")} />
          <div className="grid grid-cols-3 gap-2">
            {["1", "2", "3+"].map((count) => <button key={count} type="button" className={`h-9 rounded-lg border text-[12px] ${count === "2" ? "border-[#1b1464] bg-[#f4f5fc] text-[#1b1464]" : "border-[#e5e5ea]"}`}>{count} owners</button>)}
          </div>
        </div>
      </div>
      {sheet ? (
        <StatusSelectSheet
          title={sheet === "condition" ? "Vehicle Condition" : "Title Status"}
          options={sheet === "condition" ? ["Excellent", "Very Good", "Good", "Fair", "Project"] : ["Clean", "Salvage", "Rebuilt", "Lien", "Unknown"]}
          value={sheet === "condition" ? condition : title}
          onClose={() => setSheet(null)}
          onSelect={(value) => { if (sheet === "condition") setCondition(value); else setTitle(value); setSheet(null); }}
        />
      ) : null}
    </MobileListingShell>
  );
}

function StaticSelect({ label, value, onClick }: { label: string; value: string; onClick?: () => void }) {
  return <label className="block space-y-1.5"><span className="text-[12px] font-semibold text-[#636366]">{label}</span><button type="button" onClick={onClick} className="flex h-10 w-full items-center justify-between rounded-lg border border-[#e5e5ea] px-3 text-left text-[13px] text-[#1c1c1e]">{value}<ChevronDown className="h-4 w-4 text-[#636366]" /></button></label>;
}

function StatusSelectSheet({ title, options, value, onClose, onSelect }: { title: string; options: string[]; value: string; onClose: () => void; onSelect: (value: string) => void }) {
  return (
    <MobileOptionSheet open title={title} onClose={onClose}>
      <MobileOptionList options={options} value={value} onSelect={onSelect} />
    </MobileOptionSheet>
  );
}
