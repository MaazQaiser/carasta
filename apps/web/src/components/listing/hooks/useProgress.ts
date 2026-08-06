"use client";

import { usePathname } from "next/navigation";
import { LISTING_STEPS, getListingStepIndex } from "../config";
import { evaluateListingCompletion } from "../services/completion-engine";
import type { ListingDraft } from "../types";

export function useProgress(draft: ListingDraft) {
  const pathname = usePathname();
  const currentIndex = getListingStepIndex(pathname);
  const currentStep = currentIndex >= 0 ? LISTING_STEPS[currentIndex] : undefined;
  const completedSteps = Math.max(0, currentIndex);
  const remainingSteps = Math.max(0, LISTING_STEPS.length - currentIndex - 1);
  const completion = evaluateListingCompletion(draft);

  const estimatedMinutes = Math.max(2, remainingSteps * 2 + (completion.overallPercent < 50 ? 3 : 0));

  return {
    currentStep,
    currentIndex,
    completedSteps,
    remainingSteps,
    totalSteps: LISTING_STEPS.length,
    completionPercent: completion.overallPercent,
    estimatedCompletion: `~${estimatedMinutes} min remaining`,
    steps: LISTING_STEPS,
  };
}
