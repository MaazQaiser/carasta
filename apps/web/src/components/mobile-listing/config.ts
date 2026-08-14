import type { ListingTypeId } from "@/components/listing/types";
import { LISTING_TYPES } from "@/components/listing/config";

export interface MobileListingType {
  id: ListingTypeId;
  label: string;
  description: string;
  icon: string;
}

export interface MobileListingStep {
  index: number;
  total: number;
  id: string;
  label: string;
  href: string;
}

export const MOBILE_LISTING_TOTAL_STEPS = 15;

/** Mobile-only icon assets; labels/descriptions come from shared LISTING_TYPES. */
export const MOBILE_LISTING_TYPE_ICONS: Record<ListingTypeId, string> = {
  "stock-lightly-modified": "/mobile-listing/car.svg",
  "modified-performance": "/mobile-listing/wrench.svg",
  "restored-restomod-custom": "/mobile-listing/history.svg",
  "race-track-car": "/mobile-listing/flag.svg",
};

/** @deprecated Prefer LISTING_TYPES + MOBILE_LISTING_TYPE_ICONS — kept for any legacy imports. */
export const MOBILE_LISTING_TYPES: MobileListingType[] = LISTING_TYPES.map((type) => ({
  id: type.id,
  label: type.label,
  description: type.description,
  icon: MOBILE_LISTING_TYPE_ICONS[type.id],
}));

/**
 * Shared 15-screen listing order used by every vehicle type.
 * Vehicle-specific specification screens remain under step 4.
 */
export const MOBILE_LISTING_STEPS: MobileListingStep[] = [
  { index: 1, total: MOBILE_LISTING_TOTAL_STEPS, id: "type", label: "Vehicle Type", href: "/mobile-listing/type" },
  { index: 2, total: MOBILE_LISTING_TOTAL_STEPS, id: "identify", label: "Vehicle Information", href: "/mobile-listing/identify" },
  { index: 2, total: MOBILE_LISTING_TOTAL_STEPS, id: "identify-manual", label: "Vehicle Information", href: "/mobile-listing/identify/manual" },
  { index: 3, total: MOBILE_LISTING_TOTAL_STEPS, id: "details", label: "Vehicle Details", href: "/mobile-listing/details" },
  // Step 4 — vehicle-specific specifications & modifications (shared wrapper + type branches)
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "specifications", label: "Specifications & Modifications", href: "/mobile-listing/specifications" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "factory-equipment", label: "Specifications & Modifications", href: "/mobile-listing/factory-equipment" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "modifications", label: "Specifications & Modifications", href: "/mobile-listing/modifications" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "stock-specifications", label: "Specifications & Light Modifications", href: "/mobile-listing/stock/specifications" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "stock-mod-add", label: "Specifications & Light Modifications", href: "/mobile-listing/stock/modifications/add" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "modified-specifications", label: "Specifications & Modifications", href: "/mobile-listing/modified/specifications" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "modified-mod-add", label: "Specifications & Modifications", href: "/mobile-listing/modified/modifications/add" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "restored-specifications", label: "Build & Restoration", href: "/mobile-listing/restored/specifications" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "restored-timeline", label: "Restoration Timeline", href: "/mobile-listing/restored/timeline" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "restored-summary", label: "Build Summary", href: "/mobile-listing/restored/summary" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "restored-mod-add", label: "Build & Restoration", href: "/mobile-listing/restored/modifications/add" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "race-summary", label: "Race / Track Use", href: "/mobile-listing/race/summary" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "race-biography", label: "Competition History", href: "/mobile-listing/race/biography" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "race-specifications", label: "Race / Track Build", href: "/mobile-listing/race/specifications" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "race-safety", label: "Safety Equipment", href: "/mobile-listing/race/safety" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "race-documentation", label: "Race / Track Documentation", href: "/mobile-listing/race/documentation" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "race-spares", label: "Spares & Support Equipment", href: "/mobile-listing/race/spares" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "race-mod-add", label: "Race Specifications & Modifications", href: "/mobile-listing/race/modifications/add" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "race-competition", label: "Race / Track Use", href: "/mobile-listing/race/competition" },
  { index: 5, total: MOBILE_LISTING_TOTAL_STEPS, id: "condition", label: "Condition & History", href: "/mobile-listing/condition" },
  { index: 6, total: MOBILE_LISTING_TOTAL_STEPS, id: "photos", label: "Photos, Videos & Documents", href: "/mobile-listing/photos" },
  { index: 7, total: MOBILE_LISTING_TOTAL_STEPS, id: "notes", label: "Owner's Notes", href: "/mobile-listing/notes" },
  { index: 8, total: MOBILE_LISTING_TOTAL_STEPS, id: "ai", label: "AI Description", href: "/mobile-listing/ai" },
  { index: 9, total: MOBILE_LISTING_TOTAL_STEPS, id: "settings", label: "Auction Settings", href: "/mobile-listing/settings" },
  { index: 10, total: MOBILE_LISTING_TOTAL_STEPS, id: "preview", label: "Listing Review", href: "/mobile-listing/preview" },
  { index: 11, total: MOBILE_LISTING_TOTAL_STEPS, id: "buyer-preview", label: "Buyer View Preview", href: "/mobile-listing/buyer-preview" },
  { index: 12, total: MOBILE_LISTING_TOTAL_STEPS, id: "submitted", label: "Listing Submitted / Pending Review", href: "/mobile-listing/submitted" },
  { index: 13, total: MOBILE_LISTING_TOTAL_STEPS, id: "share-external", label: "External Share", href: "/mobile-listing/share/external" },
  { index: 14, total: MOBILE_LISTING_TOTAL_STEPS, id: "share-community", label: "Carasta Community Share", href: "/mobile-listing/share/community" },
  { index: 15, total: MOBILE_LISTING_TOTAL_STEPS, id: "share-confirmation", label: "Share Confirmation", href: "/mobile-listing/share/confirmation" },
];

/** Canonical shared back navigation for consistent cross-type routing. */
export const MOBILE_SHARED_BACK_HREF: Record<string, string> = {
  type: "/",
  identify: "/mobile-listing/type",
  "identify-manual": "/mobile-listing/identify",
  details: "/mobile-listing/identify",
  specifications: "/mobile-listing/details",
  "factory-equipment": "/mobile-listing/specifications",
  modifications: "/mobile-listing/factory-equipment",
  "stock-specifications": "/mobile-listing/details",
  "stock-mod-add": "/mobile-listing/stock/specifications",
  "modified-specifications": "/mobile-listing/details",
  "modified-mod-add": "/mobile-listing/modified/specifications",
  "restored-specifications": "/mobile-listing/details",
  "restored-timeline": "/mobile-listing/restored/specifications",
  "restored-summary": "/mobile-listing/restored/timeline",
  "restored-mod-add": "/mobile-listing/restored/specifications",
  condition: "/mobile-listing/stock/specifications",
  photos: "/mobile-listing/condition",
  notes: "/mobile-listing/photos",
  ai: "/mobile-listing/notes",
  settings: "/mobile-listing/ai",
  preview: "/mobile-listing/settings",
  "buyer-preview": "/mobile-listing/preview",
  review: "/mobile-listing/buyer-preview",
  submitted: "/mobile-listing/buyer-preview",
  "share-external": "/profile?tab=listings",
  "share-community": "/profile?tab=listings",
  "share-confirmation": "/profile?tab=listings",
  "race-summary": "/mobile-listing/details",
  "race-specifications": "/mobile-listing/race/summary",
  "race-safety": "/mobile-listing/race/specifications",
  "race-biography": "/mobile-listing/race/safety",
  "race-documentation": "/mobile-listing/race/biography",
  "race-spares": "/mobile-listing/race/documentation",
  "race-mod-add": "/mobile-listing/race/specifications",
  "race-competition": "/mobile-listing/details",
  "shop-builder": "/mobile-listing/type",
  "shop-builder-add": "/mobile-listing/shop-builder",
};

export function getMobileStep(id: string): MobileListingStep | undefined {
  return MOBILE_LISTING_STEPS.find((s) => s.id === id);
}
