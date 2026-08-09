"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { MobileListingShell } from "../MobileListingShell";

const generatedCopy = `Presenting a well-specified enthusiast vehicle with a documented ownership history. This listing highlights the key factory equipment, performance specifications, and recent care so buyers can bid with confidence.`;

export function MobileAiDescriptionScreen() {
  const { draft, setAiDescription } = useListingBuilder();
  const [editing, setEditing] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);
  const hasDescription = Boolean(draft.aiDescription.trim());

  const generate = () => {
    setGenerating(true);
    window.setTimeout(() => {
      setAiDescription(generatedCopy);
      setGenerating(false);
      setEditing(false);
    }, 900);
  };

  return (
    <MobileListingShell
      stepId="ai"
      continueDisabled={!hasDescription}
      continueHref={hasDescription ? "/mobile-listing/settings" : undefined}
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            {editing ? "Edit Description" : "AI Description"}
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">
            {editing
              ? "Customize the AI-generated copy to your liking."
              : "Generate a listing description."}
          </p>
        </div>

        {!hasDescription && !generating ? (
          <button
            type="button"
            onClick={generate}
            className="h-11 w-full rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
          >
            Generate Description
          </button>
        ) : null}

        {generating ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-[#e5e5ea] text-[13px] text-[#636366]">
            <Loader2 className="h-5 w-5 animate-spin text-[#1b1464]" />
            Generating description…
          </div>
        ) : null}

        {hasDescription && !generating ? (
          <>
            <textarea
              value={draft.aiDescription}
              readOnly={!editing}
              onChange={(event) => setAiDescription(event.target.value)}
              className="min-h-64 w-full resize-none rounded-lg border border-[#1b1464] p-3 text-[13px] leading-relaxed outline-none read-only:bg-white"
            />
            {editing ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="h-10 rounded-lg border border-[#e5e5ea] text-[13px] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="h-10 rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-[1fr_auto_auto] gap-2">
                <button
                  type="button"
                  onClick={generate}
                  className="h-10 rounded-lg border border-[#e5e5ea] text-[12px] font-semibold"
                >
                  ↻ Regenerate
                </button>
                <button
                  type="button"
                  onClick={() => setAiDescription("")}
                  className="h-10 rounded-lg border border-[#e5e5ea] px-3 text-[12px]"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="h-10 rounded-lg bg-[#1b1464] px-4 text-[12px] font-semibold text-white"
                >
                  Edit
                </button>
              </div>
            )}
          </>
        ) : null}

        <div className="rounded-lg bg-[#f4f5fc] p-3 text-[12px] leading-relaxed text-[#4b4877]">
          Note: AI descriptions are based on your vehicle details and owner notes.
        </div>
      </div>
    </MobileListingShell>
  );
}
