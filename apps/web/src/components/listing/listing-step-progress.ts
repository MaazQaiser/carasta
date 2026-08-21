/**
 * Canonical step-progress resolver shared by /listing and /mobile-listing.
 * Both surfaces use the same 15-step index so they can never drift.
 */
import { MOBILE_LISTING_STEPS, MOBILE_LISTING_TOTAL_STEPS } from "@/components/mobile-listing/config";
import { LISTING_BASE } from "./listing-route-map";

export interface ListingStepProgress {
  index: number;
  total: number;
  label: string;
}

const MOBILE_BASE = "/mobile-listing";

/**
 * Resolves a mobile step id from a /listing/* pathname.
 * More granular than resolveListingProgressStepId — returns type-specific ids
 * (e.g. "stock-specifications") so the label reflects the actual branch.
 */
function webPathToMobileStepId(pathname: string): string | null {
  const path = pathname.split("?")[0] || pathname;

  if (path.includes("/modifications/add")) return null;
  if (path.startsWith(`${LISTING_BASE}/shop-builder`)) return null;
  if (path.startsWith(`${LISTING_BASE}/submitted`)) return "submitted";
  if (path.startsWith(`${LISTING_BASE}/share/confirmation`)) return "share-confirmation";
  if (path.startsWith(`${LISTING_BASE}/share/community`)) return "share-community";
  if (path.startsWith(`${LISTING_BASE}/share/external`)) return "share-external";
  if (path.startsWith(`${LISTING_BASE}/share`)) return null;

  if (path === `${LISTING_BASE}/type` || path.startsWith(`${LISTING_BASE}/type/`)) return "type";
  if (path === `${LISTING_BASE}/identify/manual` || path.startsWith(`${LISTING_BASE}/identify/manual`)) return "identify-manual";
  if (path.startsWith(`${LISTING_BASE}/identify`)) return "identify";
  if (path === `${LISTING_BASE}/details` || path.startsWith(`${LISTING_BASE}/details/`)) return "details";

  if (path.startsWith(`${LISTING_BASE}/stock/specifications`)) return "stock-specifications";
  if (path.startsWith(`${LISTING_BASE}/modified/specifications`)) return "modified-specifications";
  if (path.startsWith(`${LISTING_BASE}/restored/specifications`)) return "restored-specifications";
  if (path.startsWith(`${LISTING_BASE}/restored/timeline`)) return "restored-timeline";
  if (path.startsWith(`${LISTING_BASE}/restored/summary`)) return "restored-summary";
  if (path.startsWith(`${LISTING_BASE}/race/summary`)) return "race-summary";
  if (path.startsWith(`${LISTING_BASE}/race/specifications`)) return "race-specifications";
  if (path.startsWith(`${LISTING_BASE}/race/safety`)) return "race-safety";
  if (path.startsWith(`${LISTING_BASE}/race/biography`)) return "race-biography";
  if (path.startsWith(`${LISTING_BASE}/race/documentation`)) return "race-documentation";
  if (path.startsWith(`${LISTING_BASE}/race/spares`)) return "race-spares";
  if (path.startsWith(`${LISTING_BASE}/race/competition`)) return "race-competition";
  if (path.startsWith(`${LISTING_BASE}/specifications`)) return "specifications";

  if (path.startsWith(`${LISTING_BASE}/condition`) || path.startsWith(`${LISTING_BASE}/history`)) return "condition";
  if (path.startsWith(`${LISTING_BASE}/photos`)) return "photos";
  if (path.startsWith(`${LISTING_BASE}/notes`)) return "notes";
  if (path.startsWith(`${LISTING_BASE}/ai`)) return "ai";
  if (path.startsWith(`${LISTING_BASE}/settings`)) return "settings";
  if (path.startsWith(`${LISTING_BASE}/buyer-preview`)) return "buyer-preview";
  if (path.startsWith(`${LISTING_BASE}/preview`)) return "preview";
  if (path.startsWith(`${LISTING_BASE}/review`)) return "buyer-preview";

  return null;
}

/**
 * Resolves a mobile step id from a /mobile-listing/* pathname.
 */
function mobilePathToStepId(pathname: string): string | null {
  const path = pathname.split("?")[0] || pathname;

  if (path.includes("/modifications/add")) return null;
  if (path.startsWith(`${MOBILE_BASE}/shop-builder`)) return null;

  for (const step of MOBILE_LISTING_STEPS) {
    if (path === step.href || path.startsWith(`${step.href}/`)) return step.id;
  }
  return null;
}

/**
 * Returns step progress for any /listing/* or /mobile-listing/* pathname.
 * Returns null for nested flows (mod-add, shop-builder) that hide the progress bar.
 */
export function resolveListingStepProgress(pathname: string): ListingStepProgress | null {
  const isMobile = pathname.startsWith(MOBILE_BASE);
  const stepId = isMobile
    ? mobilePathToStepId(pathname)
    : webPathToMobileStepId(pathname);

  if (!stepId) return null;

  const match = MOBILE_LISTING_STEPS.find((s) => s.id === stepId);
  if (!match) return null;

  return {
    index: match.index,
    total: MOBILE_LISTING_TOTAL_STEPS,
    label: match.label,
  };
}
