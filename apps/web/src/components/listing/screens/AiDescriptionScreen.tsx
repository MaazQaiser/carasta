"use client";

import * as React from "react";
import { Loader2, RefreshCw, RotateCcw, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldHint, textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { useListingBuilder } from "../ListingBuilderContext";
import { useListingNotifications } from "../notifications/NotificationProvider";

type AiFlowState = "empty" | "generating" | "generated" | "editing";

function buildAiCopy(draft: {
  details: { year: string; make: string; model: string };
  ownerNotes: string;
}) {
  const vehicle =
    [draft.details.year, draft.details.make, draft.details.model].filter(Boolean).join(" ") ||
    "This vehicle";
  const notes = draft.ownerNotes.trim()
    ? `\n\nOwner notes: ${draft.ownerNotes.trim().slice(0, 180)}`
    : "";
  return {
    summary: `Generated from ${vehicle} details, condition cues, and owner notes. Review and edit before saving.`,
    description: `${vehicle} is presented with a clear, buyer-ready narrative covering condition highlights, provenance, and standout details.${notes}\n\nEdit this description to match your voice, then save it to the listing.`,
  };
}

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
      const copy = buildAiCopy(draft);
      setAiSummary(copy.summary);
      setAiDescription(copy.description);
      setAiOriginal(copy.description);
      setFlowState("generated");
      addActivity("Description generated", "ai");
      notify({
        title: "Description Generated",
        description: mode === "regenerate" ? "A new draft is ready to edit." : undefined,
        tone: "success",
      });
    }, 1100);
  };

  const handleResetToAi = () => {
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
    addActivity("Description generated", "ai");
    setFlowState("generated");
    notify({
      title: "Description Generated",
      description: "Saved to this listing draft.",
      tone: "success",
    });
  };

  const isEmpty = flowState === "empty" && !draft.aiDescription.trim();
  const isGenerating = flowState === "generating";

  return (
    <ListingStep
      title="AI Description"
      description="Generate a listing description, then edit and save — all inline on this step."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-muted/20 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm">Description generation summary</h3>
          </div>

          {isGenerating ? (
            <div className="min-h-28 flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Generating description…
            </div>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed min-h-28">
              {draft.aiSummary ||
                "Empty state — generate a description from vehicle details, condition, photos, and owner notes."}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => runGenerate("generate")}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate with AI
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => runGenerate("regenerate")}
              disabled={isGenerating || isEmpty}
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleResetToAi}
              disabled={isGenerating || (!aiOriginal.trim() && !draft.aiDescription.trim())}
            >
              <RotateCcw className="h-4 w-4" />
              Reset to AI Version
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-sm">
              {flowState === "editing" || draft.aiDescription.trim()
                ? "Edit Description"
                : "Editable description"}
            </h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleSave}
              disabled={isGenerating || !draft.aiDescription.trim()}
            >
              <Save className="h-4 w-4" />
              Save Description
            </Button>
          </div>
          <textarea
            className={`${textareaClassName} min-h-64`}
            value={draft.aiDescription}
            onChange={(e) => {
              setAiDescription(e.target.value);
              setFlowState(e.target.value.trim() ? "editing" : "empty");
            }}
            placeholder="Your listing description will appear here for editing..."
            disabled={isGenerating}
          />
          <FieldHint>
            {isGenerating
              ? "Please wait while the description is generated."
              : "Edit inline — you never leave this page."}
          </FieldHint>
        </div>
      </div>
    </ListingStep>
  );
}
