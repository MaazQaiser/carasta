"use client";

import { evaluateListingCompletion } from "../services/completion-engine";
import { evaluateListingScore } from "../services/listing-score-service";
import { validateListingDraft } from "../services/validation-service";
import type { ListingDraft } from "../types";

export function useCompletion(draft: ListingDraft) {
  const completion = evaluateListingCompletion(draft);
  const score = evaluateListingScore(draft);
  const validation = validateListingDraft(draft);

  return {
    completion,
    score: score.score,
    recommendations: score.recommendations,
    validation,
  };
}
