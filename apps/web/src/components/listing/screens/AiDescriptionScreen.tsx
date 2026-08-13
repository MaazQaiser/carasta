"use client";

import * as React from "react";
import { Loader2, RefreshCw, RotateCcw, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldHint, textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { useListingBuilder } from "../ListingBuilderContext";
import { useListingNotifications } from "../notifications/NotificationProvider";
import {
  AI_DESCRIPTION_COPY,
  generateListingAiDescription,
  isAiDescriptionReady,
} from "../ai-description";

type AiFlowState = "empty" | "generating" | "generated" | "editing";

export function AiDescriptionScreen() {
  const { draft, setAiDescription, setAiSummary, addActivity } = useListingBuilder();
  const { notify } = useListingNotifications();
  const [aiOriginal, setAiOriginal] = React.useState(draft.aiDescription);
  const [flowState, setFlowState] = React.useState<AiFlowState>(
    draft.aiDescription.trim() ? "generated" : "empty"
  );

  const runGenerate = (mode: "generate" | "regenerate") => {
    setFlowState("generating");
    window.setTimeout(() => {
      const copy = generateListingAiDescription(draft);
      setAiSummary(copy.summary);
      setAiDescription(copy.description);
      setAiOriginal(copy.description);
      setFlowState("generated");
      addActivity(mode === "regenerate" ? "Description regenerated" : "Description generated", "ai");
      notify({
        title: mode === "regenerate" ? "Description regenerated" : "Description generated",
        description: "Drafted from your saved listing data and Owner’s Notes. Edit as needed.",
        tone: "success",
      });
    }, 1100);
  };

  const handleReset = () => {
    if (!aiOriginal.trim()) {
      setAiSummary("");
      setAiDescription("");
      setFlowState("empty");
      return;
    }
    setAiDescription(aiOriginal);
    setFlowState("generated");
  };

  const handleSave = () => {
    if (!isAiDescriptionReady(draft.aiDescription)) {
      notify({
        title: "Description too short",
        description: `Add at least ${AI_DESCRIPTION_COPY.minLength} characters before saving.`,
        tone: "warning",
      });
      return;
    }
    addActivity("Description saved", "ai");
    setAiOriginal(draft.aiDescription);
    setFlowState("generated");
    notify({
      title: "Description saved",
      description: "Saved to this listing draft. Edit anytime on this screen.",
      tone: "success",
    });
  };

  const isEmpty = flowState === "empty" && !draft.aiDescription.trim();
  const isGenerating = flowState === "generating";
  const isEditing = flowState === "editing";
  const count = draft.aiDescription.length;

  return (
    <ListingStep
      title={isEditing ? AI_DESCRIPTION_COPY.editTitle : AI_DESCRIPTION_COPY.title}
      description={isEditing ? AI_DESCRIPTION_COPY.editSubtext : AI_DESCRIPTION_COPY.subtext}
    >
      <div className="mx-auto max-w-3xl space-y-5">
        {isEmpty && !isGenerating ? (
          <div className="space-y-4 rounded-2xl border border-dashed bg-muted/20 p-8 text-center">
            <p className="text-sm text-muted-foreground">{AI_DESCRIPTION_COPY.emptyHint}</p>
            <Button type="button" onClick={() => runGenerate("generate")}>
              <Sparkles className="h-4 w-4" />
              Generate with AI
            </Button>
          </div>
        ) : null}

        {isGenerating ? (
          <div className="flex min-h-48 items-center justify-center gap-3 rounded-2xl border text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Generating description…
          </div>
        ) : null}

        {!isEmpty && !isGenerating ? (
          <>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {AI_DESCRIPTION_COPY.draftLabel}
              </p>
              <textarea
                className={`${textareaClassName} min-h-64`}
                value={draft.aiDescription}
                maxLength={AI_DESCRIPTION_COPY.maxLength}
                onChange={(e) => {
                  setAiDescription(e.target.value.slice(0, AI_DESCRIPTION_COPY.maxLength));
                  setFlowState(e.target.value.trim() ? "editing" : "empty");
                }}
                onFocus={() => {
                  if (draft.aiDescription.trim()) setFlowState("editing");
                }}
                placeholder="Your listing description will appear here for editing..."
              />
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>Minimum {AI_DESCRIPTION_COPY.minLength} characters</span>
                <span>
                  {count} / {AI_DESCRIPTION_COPY.maxLength}
                </span>
              </div>
            </div>

            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setAiDescription(aiOriginal);
                    setFlowState(aiOriginal.trim() ? "generated" : "empty");
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => runGenerate("regenerate")}
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                <Button type="button" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
            )}

            {draft.aiSummary ? (
              <FieldHint>{draft.aiSummary}</FieldHint>
            ) : null}
          </>
        ) : null}

        <p className="rounded-xl bg-muted/40 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
          {AI_DESCRIPTION_COPY.footnote} Seller-reported claims stay appropriately qualified and are
          not strengthened beyond what you entered.
        </p>
      </div>
    </ListingStep>
  );
}
