import type { User } from "@carasta/types";
import type { ListingDraft } from "../types";
import type { ListingActivityEvent } from "./draft-service";
import { DraftService } from "./draft-service";
import { PublishedListingService } from "./published-listing-service";
import { createListingReference, SubmissionSession } from "./submission-session";
import { validateListingDraft } from "./validation-service";

export type ListingSubmitResult =
  | { ok: true; reference: string; auctionId: string }
  | { ok: false; reason: "validation"; errors: ReturnType<typeof validateListingDraft>["errors"] };

/**
 * Re-validate then publish. Warnings never block; required errors do.
 */
export function submitListingDraft(opts: {
  draft: ListingDraft;
  seller: User;
  activity: ListingActivityEvent[];
  submittedPath: string;
}): ListingSubmitResult {
  const validation = validateListingDraft(opts.draft);
  if (!validation.isValid) {
    return { ok: false, reason: "validation", errors: validation.errors };
  }

  const reference = createListingReference();
  const submittedAt = new Date().toISOString();
  const published = PublishedListingService.publish(opts.draft, opts.seller, reference);
  SubmissionSession.save({
    reference,
    submittedAt,
    auctionId: published.auction.id,
    vehicleId: published.auction.vehicle.id,
  });
  DraftService.save(opts.draft, { lastPath: opts.submittedPath, activity: opts.activity });

  return { ok: true, reference, auctionId: published.auction.id };
}
