import type { ListingTypeId } from "@/components/listing/types";

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

export const MOBILE_LISTING_TYPES: MobileListingType[] = [
  {
    id: "stock-lightly-modified",
    label: "Stock / Lightly Modified",
    description:
      "Stock or mostly stock, with only minor performance upgrades or cosmetic changes",
    icon: "/mobile-listing/car.svg",
  },
  {
    id: "modified-performance",
    label: "Modified / Performance",
    description:
      "Significantly modified, with major upgrades to the powertrain, suspension, brakes, or exterior",
    icon: "/mobile-listing/wrench.svg",
  },
  {
    id: "restored-restomod-custom",
    label: "Restored / Restomod / Custom",
    description:
      "Restored, modernized, or custom-built, with extensive work completed on the body, chassis, powertrain, or interior",
    icon: "/mobile-listing/history.svg",
  },
  {
    id: "race-track-car",
    label: "Race / Track Car",
    description:
      "Purpose-built or heavily modified for racing, track use, or competition",
    icon: "/mobile-listing/flag.svg",
  },
];

/**
 * Shared 15-screen listing order used by every vehicle type.
 * Vehicle-specific specification screens remain under step 4.
 */
export const MOBILE_LISTING_STEPS: MobileListingStep[] = [
  { index: 1, total: MOBILE_LISTING_TOTAL_STEPS, id: "type", label: "Vehicle Type", href: "/mobile-listing/type" },
  { index: 2, total: MOBILE_LISTING_TOTAL_STEPS, id: "identify", label: "Identify Your Vehicle", href: "/mobile-listing/identify" },
  { index: 2, total: MOBILE_LISTING_TOTAL_STEPS, id: "identify-manual", label: "Identify Your Vehicle", href: "/mobile-listing/identify/manual" },
  { index: 3, total: MOBILE_LISTING_TOTAL_STEPS, id: "details", label: "Vehicle Details", href: "/mobile-listing/details" },
  // Step 4 — vehicle-specific specifications & modifications (shared wrapper + type branches)
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "specifications", label: "Specifications & Modifications", href: "/mobile-listing/specifications" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "factory-equipment", label: "Specifications & Modifications", href: "/mobile-listing/factory-equipment" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "modifications", label: "Specifications & Modifications", href: "/mobile-listing/modifications" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "stock-specifications", label: "Specifications & Light Modifications", href: "/mobile-listing/stock/specifications" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "stock-mod-add", label: "Specifications & Light Modifications", href: "/mobile-listing/stock/modifications/add" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "modified-specifications", label: "Specifications & Modifications", href: "/mobile-listing/modified/specifications" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "modified-mod-add", label: "Specifications & Modifications", href: "/mobile-listing/modified/modifications/add" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "restored-specifications", label: "Authenticity & Restoration", href: "/mobile-listing/restored/specifications" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "restored-mod-add", label: "Authenticity & Restoration", href: "/mobile-listing/restored/modifications/add" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "race-summary", label: "Competition Profile", href: "/mobile-listing/race/summary" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "race-biography", label: "Vehicle Biography", href: "/mobile-listing/race/biography" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "race-specifications", label: "Race Specifications & Modifications", href: "/mobile-listing/race/specifications" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "race-mod-add", label: "Race Specifications & Modifications", href: "/mobile-listing/race/modifications/add" },
  { index: 4, total: MOBILE_LISTING_TOTAL_STEPS, id: "race-competition", label: "Competition Profile", href: "/mobile-listing/race/competition" },
  { index: 5, total: MOBILE_LISTING_TOTAL_STEPS, id: "condition", label: "Condition & History", href: "/mobile-listing/condition" },
  { index: 6, total: MOBILE_LISTING_TOTAL_STEPS, id: "photos", label: "Photos & Documents", href: "/mobile-listing/photos" },
  { index: 7, total: MOBILE_LISTING_TOTAL_STEPS, id: "notes", label: "Owner Notes", href: "/mobile-listing/notes" },
  { index: 8, total: MOBILE_LISTING_TOTAL_STEPS, id: "ai", label: "AI Description", href: "/mobile-listing/ai" },
  { index: 9, total: MOBILE_LISTING_TOTAL_STEPS, id: "settings", label: "Sale Settings", href: "/mobile-listing/settings" },
  { index: 10, total: MOBILE_LISTING_TOTAL_STEPS, id: "preview", label: "Listing Preview", href: "/mobile-listing/preview" },
  { index: 11, total: MOBILE_LISTING_TOTAL_STEPS, id: "review", label: "Review & Submit", href: "/mobile-listing/review" },
  { index: 12, total: MOBILE_LISTING_TOTAL_STEPS, id: "submitted", label: "Listing Submitted", href: "/mobile-listing/submitted" },
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
  "restored-mod-add": "/mobile-listing/restored/specifications",
  condition: "/mobile-listing/modifications",
  photos: "/mobile-listing/condition",
  notes: "/mobile-listing/photos",
  ai: "/mobile-listing/notes",
  settings: "/mobile-listing/ai",
  preview: "/mobile-listing/settings",
  review: "/mobile-listing/preview",
  submitted: "/mobile-listing/review",
  "share-external": "/mobile-listing/submitted",
  "share-community": "/mobile-listing/share/external",
  "share-confirmation": "/mobile-listing/share/community",
  "race-summary": "/mobile-listing/details",
  "race-biography": "/mobile-listing/race/summary",
  "race-specifications": "/mobile-listing/race/biography",
  "race-mod-add": "/mobile-listing/race/specifications",
  "race-competition": "/mobile-listing/details",
  "shop-builder": "/mobile-listing/type",
  "shop-builder-add": "/mobile-listing/shop-builder",
};

export function getMobileStep(id: string): MobileListingStep | undefined {
  return MOBILE_LISTING_STEPS.find((s) => s.id === id);
}
