"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import {
  AI_DESCRIPTION_COPY,
  generateListingAiDescription,
  isAiDescriptionReady,
} from "@/components/listing/ai-description";
import { MobileListingShell } from "../MobileListingShell";

export function MobileAiDescriptionScreen() {
  const { draft, setAiDescription, setAiSummary, addActivity } = useListingBuilder();
  const [editing, setEditing] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);
  const [aiOriginal, setAiOriginal] = React.useState(draft.aiDescription);
  const hasDescription = Boolean(draft.aiDescription.trim());
  const canContinue = isAiDescriptionReady(draft.aiDescription);

  const generate = (mode: "generate" | "regenerate") => {
    setGenerating(true);
    setEditing(false);
    window.setTimeout(() => {
      const copy = generateListingAiDescription(draft);
      setAiSummary(copy.summary);
      setAiDescription(copy.description);
      setAiOriginal(copy.description);
      setGenerating(false);
      addActivity(mode === "regenerate" ? "Description regenerated" : "Description generated", "ai");
    }, 900);
  };

  const handleSave = () => {
    if (!isAiDescriptionReady(draft.aiDescription)) return;
    setAiOriginal(draft.aiDescription);
    setEditing(false);
    addActivity("Description saved", "ai");
  };

  const handleCancelEdit = () => {
    setAiDescription(aiOriginal);
    setEditing(false);
  };

  const handleReset = () => {
    if (!aiOriginal.trim()) {
      setAiDescription("");
      setAiSummary("");
      setEditing(false);
      return;
    }
    setAiDescription(aiOriginal);
    setEditing(false);
  };

  return (
    <MobileListingShell
      stepId="ai"
      continueDisabled={!canContinue}
      continueHref={canContinue ? "/mobile-listing/settings" : undefined}
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            {editing ? AI_DESCRIPTION_COPY.editTitle : AI_DESCRIPTION_COPY.title}
          </h1>
          <p className="text-[15px] leading-[1.4] text-[#636366]">
            {editing ? AI_DESCRIPTION_COPY.editSubtext : AI_DESCRIPTION_COPY.subtext}
          </p>
        </div>

        {!hasDescription && !generating ? (
          <button
            type="button"
            onClick={() => generate("generate")}
            className="h-11 w-full rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
          >
            ✧ Generate with AI
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
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#636366]">
                {AI_DESCRIPTION_COPY.draftLabel}
              </p>
              <textarea
                value={draft.aiDescription}
                readOnly={!editing}
                maxLength={AI_DESCRIPTION_COPY.maxLength}
                onChange={(event) =>
                  setAiDescription(event.target.value.slice(0, AI_DESCRIPTION_COPY.maxLength))
                }
                onFocus={() => {
                  if (!editing) setEditing(true);
                }}
                className="min-h-64 w-full resize-none rounded-lg border border-[#1b1464] p-3 text-[13px] leading-relaxed outline-none read-only:bg-white"
              />
              <div className="flex items-center justify-between text-[11px] text-[#636366]">
                <span>Minimum {AI_DESCRIPTION_COPY.minLength} characters</span>
                <span>
                  {draft.aiDescription.length} / {AI_DESCRIPTION_COPY.maxLength}
                </span>
              </div>
            </div>

            {editing ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="h-10 rounded-lg border border-[#1b1464] text-[13px] font-semibold text-[#1b1464]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!isAiDescriptionReady(draft.aiDescription)}
                  className="h-10 rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-[1fr_auto_auto] gap-2">
                <button
                  type="button"
                  onClick={() => generate("regenerate")}
                  className="h-10 rounded-lg border border-[#e5e5ea] text-[12px] font-semibold"
                >
                  ↻ Regenerate
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="h-10 rounded-lg border border-[#e5e5ea] px-3 text-[12px]"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="h-10 rounded-lg bg-[#1b1464] px-4 text-[12px] font-semibold text-white"
                >
                  Save
                </button>
              </div>
            )}
          </>
        ) : null}

        <div className="rounded-lg bg-[#f4f5fc] p-3 text-[12px] leading-relaxed text-[#4b4877]">
          {AI_DESCRIPTION_COPY.footnote} Seller-reported claims stay appropriately qualified.
        </div>
      </div>
    </MobileListingShell>
  );
}
