import type { ListingTypeId } from "./types";
import { LISTING_PATHS, afterDetailsHref } from "./listing-route-map";

/**
 * Canonical shared finish sequence after the adaptive vehicle section.
 * Do not invent parallel finish flows per listing type.
 */
export const SHARED_FINISH_SEQUENCE = [
  {
    id: "history",
    label: "Condition & History",
    webHref: LISTING_PATHS.condition,
    mobileHref: "/mobile-listing/condition",
  },
  {
    id: "photos",
    label: "Photos, Videos & Documents",
    webHref: LISTING_PATHS.photos,
    mobileHref: "/mobile-listing/photos",
  },
  {
    id: "notes",
    label: "Owner's Notes",
    webHref: LISTING_PATHS.notes,
    mobileHref: "/mobile-listing/notes",
  },
  {
    id: "ai",
    label: "AI Description",
    webHref: LISTING_PATHS.ai,
    mobileHref: "/mobile-listing/ai",
  },
  {
    id: "settings",
    label: "Auction Settings",
    webHref: LISTING_PATHS.settings,
    mobileHref: "/mobile-listing/settings",
  },
  {
    id: "preview",
    label: "Listing Review",
    webHref: LISTING_PATHS.preview,
    mobileHref: "/mobile-listing/preview",
  },
  {
    id: "buyer-preview",
    label: "Buyer View Preview",
    webHref: LISTING_PATHS.buyerPreview,
    mobileHref: "/mobile-listing/buyer-preview",
  },
  {
    id: "submitted",
    label: "Listing Submitted / Pending Review",
    webHref: LISTING_PATHS.submitted,
    mobileHref: "/mobile-listing/submitted",
  },
] as const;

/** Mobile adaptive entry after shared Vehicle Details (mirrors web `afterDetailsHref`). */
export function afterDetailsHrefMobile(typeId: ListingTypeId | null | undefined): string {
  switch (typeId) {
    case "stock-lightly-modified":
      return "/mobile-listing/stock/specifications";
    case "modified-performance":
      return "/mobile-listing/modified/specifications";
    case "restored-restomod-custom":
      return "/mobile-listing/restored/specifications";
    case "race-track-car":
      return "/mobile-listing/race/summary";
    default:
      return "/mobile-listing/specifications";
  }
}

/** Web adaptive entry after shared Vehicle Details. */
export { afterDetailsHref };
