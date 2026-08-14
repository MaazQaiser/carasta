import type {
  Auction,
  MarketplaceListingType,
  MarketplaceSaleType,
  User,
  Vehicle,
  VehicleCondition,
  VehicleListingDetails,
  VehicleMediaAsset,
  VehicleModificationEntry,
  VehicleShippingOption,
} from "@carasta/types";
import type { ListingDraft, ListingMediaItem, ListingTypeId, ModificationEntry } from "../types";
import { humanizeKey } from "@/lib/listing-labels";
import { getRestorationBuildTypeLabel, normalizeRestorationCategoryId } from "../specs/restored-restomod";
import {
  FLOW4_SAFETY_COPY,
  SAFETY_EQUIPMENT_OPTIONS,
  documentationTypeLabels,
  installedSafetyLabels,
  isSafetyEquipmentDateId,
  primaryUseDisplayLabel,
  shouldShowCompetitionHistoryNarrative,
} from "../specs/race-track";
import {
  getSharedModificationCategoryLabel,
  normalizeModificationCategoryId,
} from "../specs/shared-modification-categories";
import {
  displayPerformanceClaimStatus,
  MODIFIED_PERFORMANCE_SPECS_CONFIG,
  RACE_TRACK_SPECS_CONFIG,
  RESTORED_RESTOMODE_SPECS_CONFIG,
  STOCK_LIGHTLY_MODIFIED_SPECS_CONFIG,
} from "../specs";

const STORAGE_KEY = "carasta.listing.published.v1";

export type ListingModerationStatus = "pending" | "approved";

export type PublishedListingRecord = {
  auction: Auction;
  reference: string;
  publishedAt: string;
  sellerId: string;
  /** Carasta review before the auction goes live for buyers. */
  moderationStatus?: ListingModerationStatus;
  approvedAt?: string;
  /** In-app + email approval notice already sent. */
  approvalNotified?: boolean;
  /**
   * After approval, open the share menu once the seller first opens the auction.
   * Cleared when they dismiss or complete share.
   */
  sharePromptPending?: boolean;
};

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&auto=format&fit=crop";

function canUseStorage() {
  return typeof window !== "undefined";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function parseMoney(value: string): number | undefined {
  const n = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function mapListingType(id: ListingTypeId | null): MarketplaceListingType | undefined {
  if (!id) return undefined;
  return id as MarketplaceListingType;
}

function mapSaleType(value: string): MarketplaceSaleType | undefined {
  const v = value.toLowerCase();
  if (v.includes("reserve")) return "reserve-auction";
  if (v.includes("buy") && v.includes("auction")) return "auction-buy-now";
  if (v.includes("buy")) return "buy-it-now";
  if (v.includes("offer")) return "make-offer";
  if (v.includes("auction")) return "reserve-auction";
  return value ? "reserve-auction" : undefined;
}

function mapCondition(value: string): VehicleCondition {
  const v = value.toLowerCase();
  if (v.includes("new")) return "like-new";
  if (v.includes("excellent")) return "excellent";
  if (v.includes("good")) return "good";
  if (v.includes("fair")) return "fair";
  if (v.includes("poor")) return "poor";
  return "excellent";
}

function mapShipping(value: string): VehicleShippingOption | undefined {
  const v = value.toLowerCase();
  if (v.includes("international")) return "International Shipping";
  if (v.includes("domestic") || v.includes("ship")) return "Domestic Shipping";
  if (v.includes("pickup")) return "Pickup Only";
  return undefined;
}

function mediaAssets(items: ListingMediaItem[], fallbackAlt: string): VehicleMediaAsset[] {
  return items
    .filter((item) => item.previewUrl)
    .map((item) => ({
      id: item.id,
      url: item.previewUrl!,
      alt: item.name || fallbackAlt,
      name: item.name,
    }));
}

function categoryLabelFor(listingType: MarketplaceListingType | undefined, categoryId: string) {
  const configs = {
    "stock-lightly-modified": STOCK_LIGHTLY_MODIFIED_SPECS_CONFIG,
    "modified-performance": MODIFIED_PERFORMANCE_SPECS_CONFIG,
    "restored-restomod-custom": RESTORED_RESTOMODE_SPECS_CONFIG,
    "race-track-car": RACE_TRACK_SPECS_CONFIG,
  } as const;
  const config = listingType ? configs[listingType] : undefined;
  const normalized =
    listingType === "restored-restomod-custom"
      ? normalizeRestorationCategoryId(categoryId)
      : normalizeModificationCategoryId(categoryId);
  return (
    config?.categories.find((c) => c.id === normalized)?.label ??
    getSharedModificationCategoryLabel(categoryId) ??
    humanizeKey(categoryId)
  );
}

function mapModificationEntries(
  entries: ModificationEntry[],
  listingType: MarketplaceListingType | undefined
): VehicleModificationEntry[] {
  return entries
    .filter((entry) => entry.title.trim() || entry.completed)
    .map((entry) => ({
      id: entry.id,
      categoryId: entry.categoryId,
      categoryLabel: categoryLabelFor(listingType, entry.categoryId),
      title: entry.title.trim() || "Modification",
      description: entry.description || undefined,
      typeOfWork: entry.typeOfWork || undefined,
      partsBrand: entry.partsBrand || undefined,
      manufacturer: entry.manufacturer || undefined,
      specifications: entry.specifications || undefined,
      workPerformedBy: entry.workPerformedBy || undefined,
      completedDuring: entry.completedDuring || undefined,
      shopBuilder: entry.shopBuilder || undefined,
      installationDate: entry.installationDate || undefined,
      additionalNotes: entry.additionalNotes || undefined,
      partClassification: entry.partClassification || undefined,
    }));
}

function filledRecord(record: Record<string, string>): Record<string, string> | undefined {
  const next: Record<string, string> = {};
  for (const [key, value] of Object.entries(record)) {
    if (value?.trim()) next[humanizeKey(key)] = value.trim();
  }
  return Object.keys(next).length > 0 ? next : undefined;
}

function mapListingDetailsFromDraft(
  draft: ListingDraft,
  listingType: MarketplaceListingType | undefined
): VehicleListingDetails {
  const ws = draft.modificationWorkspace;
  const mods = mapModificationEntries(ws.entries, listingType);
  const buyNow = parseMoney(draft.saleSettings.buyNowPrice);

  const details: VehicleListingDetails = {
    buyNowPrice: buyNow,
    shipping: mapShipping(draft.saleSettings.shipping),
    sellerLocation: draft.saleSettings.shippingLocation || undefined,
    conditionHistory: {
      vehicleHistory: draft.condition.vehicleHistory || undefined,
      accidentHistory: draft.condition.accidentHistory || undefined,
      titleStatus: draft.condition.titleStatus || undefined,
      serviceRecords: draft.condition.serviceRecords || undefined,
      overallCondition: draft.condition.overallCondition || undefined,
      ownershipHistory: draft.condition.ownershipHistory || undefined,
      generalNotes: draft.condition.generalNotes || undefined,
      numberOfKeys: draft.condition.numberOfKeys || undefined,
      warranty: draft.condition.warranty || undefined,
      knownRaceTrackIssues: ws.race.knownRaceTrackIssues?.trim() || undefined,
    },
    media: {
      vehiclePhotos: mediaAssets(draft.vehiclePhotos, "Vehicle photo"),
      modificationPhotos: mediaAssets(draft.modificationPhotos, "Modification photo"),
      supportingDocuments: mediaAssets(draft.documents, "Document"),
      videos: mediaAssets(draft.videos, "Video"),
    },
    modifications: mods.length > 0 ? mods : undefined,
  };

  if (listingType === "stock-lightly-modified") {
    details.factorySpecsNotes = [
      draft.details.engine && `Engine: ${draft.details.engine}`,
      draft.details.transmission && `Transmission: ${draft.details.transmission}`,
      draft.details.drivetrain && `Drivetrain: ${draft.details.drivetrain}`,
    ]
      .filter(Boolean)
      .join(" · ") || "Factory specifications as entered in Listing Builder.";
    details.lightModifications = mods.map((m) => m.title);
  }

  if (listingType === "modified-performance") {
    const p = ws.performanceSummary;
    details.performanceSummary = {
      currentEngine: p.currentEngine || draft.details.engine || undefined,
      transmission: p.transmission || draft.details.transmission || undefined,
      drivetrain: p.drivetrain || draft.details.drivetrain || undefined,
      horsepower: p.horsepower || undefined,
      horsepowerStatus: p.horsepower
        ? displayPerformanceClaimStatus(p.horsepowerStatus)
        : undefined,
      torque: p.torque || undefined,
      torqueStatus: p.torque ? displayPerformanceClaimStatus(p.torqueStatus) : undefined,
      fuelType: p.fuelType || undefined,
      tuningPlatform: p.tuningPlatform || undefined,
      buildSummary: p.buildSummary || undefined,
    };
  }

  if (listingType === "restored-restomod-custom") {
    const r = ws.restoration;
    details.restoration = {
      buildType: r.buildType
        ? getRestorationBuildTypeLabel(r.buildType, r.restomodSubcategory) ?? r.buildType
        : undefined,
      mileageStatus: r.mileageStatus || undefined,
      buildStatus: r.buildStatus || undefined,
      completionYear: r.completionYear || undefined,
      workPerformedBy: r.workPerformedBy || undefined,
      shopBuilder: r.shopBuilder || r.factoryCorrect.restorationShop || undefined,
      buildSummary: r.buildSummary || undefined,
      identityType: r.identityType || undefined,
      identityValue: r.identityValue || undefined,
      factoryCorrect: filledRecord(r.factoryCorrect as unknown as Record<string, string>),
      provenance: filledRecord(r.provenance as unknown as Record<string, string>),
      timelineEvents: (r.timelineEvents ?? [])
        .filter((event) => event.title.trim())
        .map((event) => ({
          id: event.id,
          title: event.title,
          dateYear: event.dateYear || undefined,
          exactDate: event.exactDate || undefined,
          datePrecision: event.datePrecision || undefined,
          eventType: event.eventType || undefined,
          description: event.description || undefined,
        })),
    };
  }

  if (listingType === "race-track-car") {
    const race = ws.race;
    const primaryUse = primaryUseDisplayLabel(race.competition);
    const installed = installedSafetyLabels(race);
    const dateRecord: Record<string, string> = {};
    for (const option of SAFETY_EQUIPMENT_OPTIONS) {
      if (!isSafetyEquipmentDateId(option.id)) continue;
      if (!(race.installedSafetyEquipment ?? []).includes(option.id)) continue;
      const value = race.safetyServiceDates?.[option.id]?.trim();
      if (value) dateRecord[`${option.label} — ${FLOW4_SAFETY_COPY.dateLabel}`] = value;
    }
    const notes = race.safetyEquipmentNotes?.trim();
    const safetyRecord: Record<string, string> = {};
    if (installed.length) safetyRecord["Installed equipment"] = installed.join(", ");
    Object.assign(safetyRecord, dateRecord);
    if (notes) safetyRecord["Safety Equipment Notes"] = notes;

    const organized = race.organizedCompetition?.trim();
    const historyNarrative =
      shouldShowCompetitionHistoryNarrative(organized) && race.competitionHistoryNarrative?.trim()
        ? race.competitionHistoryNarrative.trim()
        : undefined;
    const competitionRecord: Record<string, string> = {};
    if (primaryUse) competitionRecord["Primary Use"] = primaryUse;
    if (organized) competitionRecord["Organized competition"] = organized;
    if (historyNarrative) competitionRecord["Competition History"] = historyNarrative;

    details.race = {
      competition: Object.keys(competitionRecord).length ? competitionRecord : undefined,
      buildNarrative: race.buildNarrative?.trim() || undefined,
      workPerformedBy: race.workPerformedBy?.trim() || undefined,
      shopBuilder: race.shopBuilder?.trim() || race.identity.builder?.trim() || undefined,
      installedEquipment: installed.length ? installed : undefined,
      safetyNotes: notes || undefined,
      safetyServiceDates: Object.keys(dateRecord).length ? dateRecord : undefined,
      safety: Object.keys(safetyRecord).length ? safetyRecord : undefined,
      organizedCompetition: organized || undefined,
      competitionHistory: historyNarrative,
      documentationTypes: documentationTypeLabels(race.documentationTypes),
      documentationOther: race.documentationOther?.trim() || undefined,
      sparesIncluded: race.sparesIncluded?.trim() || undefined,
      sparesDescription:
        race.sparesIncluded === "Yes" ? race.sparesDescription?.trim() || undefined : undefined,
      knownRaceTrackIssues: race.knownRaceTrackIssues?.trim() || undefined,
    };
  }

  return details;
}

function parseLocation(raw: string): Vehicle["location"] {
  const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
  return {
    city: parts[0] || "Unknown",
    state: parts[1] || "",
    country: parts[2] || "US",
  };
}

function buildImages(draft: ListingDraft, title: string): Vehicle["images"] {
  const photos = draft.vehiclePhotos.filter((p) => p.previewUrl);
  if (photos.length === 0) {
    return [
      {
        id: `img-placeholder-${Date.now()}`,
        url: PLACEHOLDER_IMAGE,
        alt: title,
        isPrimary: true,
      },
    ];
  }
  return photos.map((photo, index) => ({
    id: photo.id,
    url: photo.previewUrl!,
    alt: photo.name || title,
    isPrimary: index === 0,
  }));
}

export function draftToAuction(
  draft: ListingDraft,
  seller: User,
  reference: string
): Auction {
  const year = Number(draft.details.year) || new Date().getFullYear();
  const make = draft.details.make || "Vehicle";
  const model = draft.details.model || "Listing";
  const title = [year, make, model, draft.details.trim].filter(Boolean).join(" ");
  const vehicleId = `listing-${Date.now().toString(36)}`;
  const auctionId = `auction-${vehicleId}`;
  const reserve = parseMoney(draft.saleSettings.reservePrice);
  const buyNow = parseMoney(draft.saleSettings.buyNowPrice);
  const starting = reserve ? Math.round(reserve * 0.75) : buyNow ? Math.round(buyNow * 0.7) : 1000;
  const now = new Date();
  const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const location = parseLocation(draft.saleSettings.shippingLocation || "");

  const vehicle: Vehicle = {
    id: vehicleId,
    title,
    slug: slugify(`${title}-${reference}`),
    spec: {
      make,
      model,
      year,
      trim: draft.details.trim || undefined,
      engineSize: draft.details.engine || undefined,
      fuelType: "gasoline",
      transmission: (draft.details.transmission?.toLowerCase().includes("auto")
        ? "automatic"
        : "manual") as Vehicle["spec"]["transmission"],
      driveType: (draft.details.drivetrain?.toLowerCase().includes("awd")
        ? "awd"
        : draft.details.drivetrain?.toLowerCase().includes("fwd")
          ? "fwd"
          : draft.details.drivetrain?.toLowerCase().includes("4wd")
            ? "4wd"
            : "rwd") as Vehicle["spec"]["driveType"],
      mileage: Number(draft.details.mileage) || 0,
      exteriorColor: draft.details.exteriorColor || "Unspecified",
      secondaryExteriorColor: draft.details.secondaryExteriorColor || undefined,
      interiorColor: draft.details.interiorColor || "Unspecified",
      vin: draft.details.vin || draft.vinInput || undefined,
    },
    condition: mapCondition(draft.condition.overallCondition),
    status: "pending-review",
    description:
      draft.aiDescription.trim() ||
      draft.ownerNotes.trim() ||
      `${title} listed via Carasta Listing Builder.`,
    story: draft.ownerNotes.trim() || undefined,
    images: buildImages(draft, title),
    location,
    seller: { ...seller, isSeller: true, role: seller.role === "buyer" ? "seller" : seller.role },
    features: [],
    reservePrice: reserve,
    startingPrice: starting,
    estimatedValue: buyNow ?? reserve,
    hasInspectionReport: draft.documents.length > 0,
    hasFinancingOptions: false,
    views: 0,
    watchlistCount: 0,
    listingType: mapListingType(draft.listingTypeId),
    saleType: mapSaleType(draft.saleSettings.saleType),
    vinVerified: Boolean(draft.details.vin || draft.vinInput),
    documentsAvailable: draft.documents.length > 0,
    listingDetails: mapListingDetailsFromDraft(draft, mapListingType(draft.listingTypeId)),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  const auction: Auction = {
    id: auctionId,
    vehicle,
    status: "upcoming",
    startingBid: starting,
    currentBid: starting,
    bidCount: 0,
    reserveMet: false,
    reservePrice: reserve,
    minimumBidIncrement: Math.max(100, Math.round(starting * 0.02)),
    startTime: now.toISOString(),
    endTime: end.toISOString(),
    participantCount: 0,
    watcherCount: 0,
    bids: [],
    autoShipping: Boolean(mapShipping(draft.saleSettings.shipping)),
    sellerNotes: draft.ownerNotes.trim() || undefined,
    createdAt: now.toISOString(),
  };

  return auction;
}

function isApproved(record: PublishedListingRecord) {
  return (record.moderationStatus ?? "approved") === "approved";
}

export const PublishedListingService = {
  load(): PublishedListingRecord[] {
    if (!canUseStorage()) return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as PublishedListingRecord[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveAll(records: PublishedListingRecord[]) {
    if (!canUseStorage()) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  },

  publish(draft: ListingDraft, seller: User, reference: string): PublishedListingRecord {
    const auction = draftToAuction(draft, seller, reference);
    const record: PublishedListingRecord = {
      auction,
      reference,
      publishedAt: new Date().toISOString(),
      sellerId: seller.id,
      moderationStatus: "pending",
      sharePromptPending: false,
      approvalNotified: false,
    };
    const next = [record, ...this.load().filter((r) => r.auction.id !== auction.id)];
    this.saveAll(next);
    return record;
  },

  /** Buyer-facing catalog — only approved / live auctions. */
  loadApproved(): PublishedListingRecord[] {
    return this.load().filter(isApproved);
  },

  getAuctionsForSeller(sellerId: string): Auction[] {
    return this.load()
      .filter((r) => r.sellerId === sellerId || r.auction.vehicle.seller.id === sellerId)
      .map((r) => r.auction);
  },

  getByAuctionId(auctionId: string): PublishedListingRecord | null {
    return this.load().find((r) => r.auction.id === auctionId) ?? null;
  },

  getByVehicleId(vehicleId: string): PublishedListingRecord | null {
    return this.load().find((r) => r.auction.vehicle.id === vehicleId) ?? null;
  },

  /** Resolve by auction id or vehicle id. */
  resolve(id: string): PublishedListingRecord | null {
    return (
      this.load().find(
        (r) => r.auction.id === id || r.auction.vehicle.id === id
      ) ?? null
    );
  },

  /**
   * Approve a pending listing (Carasta review complete).
   * Marks share prompt pending so the seller sees External Share once on first open.
   */
  approve(id: string): PublishedListingRecord | null {
    const records = this.load();
    const index = records.findIndex(
      (r) => r.auction.id === id || r.auction.vehicle.id === id
    );
    if (index < 0) return null;
    const current = records[index]!;
    if (isApproved(current)) return current;

    const now = new Date().toISOString();
    const auction: Auction = {
      ...current.auction,
      status: "live",
      startTime: now,
      vehicle: {
        ...current.auction.vehicle,
        status: "in-auction",
        updatedAt: now,
      },
    };
    const next: PublishedListingRecord = {
      ...current,
      auction,
      moderationStatus: "approved",
      approvedAt: now,
      sharePromptPending: true,
    };
    records[index] = next;
    this.saveAll(records);
    return next;
  },

  /**
   * Demo / local review: approve pending listings older than `minAgeMs`.
   * Returns newly approved records that still need seller notification.
   */
  approvePendingOlderThan(minAgeMs = 8_000): PublishedListingRecord[] {
    const now = Date.now();
    const newlyApproved: PublishedListingRecord[] = [];
    for (const record of this.load()) {
      if (isApproved(record)) continue;
      const age = now - new Date(record.publishedAt).getTime();
      if (age < minAgeMs) continue;
      const approved = this.approve(record.auction.id);
      if (approved) newlyApproved.push(approved);
    }
    return newlyApproved;
  },

  markApprovalNotified(id: string) {
    const records = this.load();
    const index = records.findIndex(
      (r) => r.auction.id === id || r.auction.vehicle.id === id
    );
    if (index < 0) return;
    records[index] = { ...records[index]!, approvalNotified: true };
    this.saveAll(records);
  },

  /** Call when seller dismisses or finishes the one-time post-approval share sheet. */
  clearSharePrompt(id: string) {
    const records = this.load();
    const index = records.findIndex(
      (r) => r.auction.id === id || r.auction.vehicle.id === id
    );
    if (index < 0) return;
    records[index] = { ...records[index]!, sharePromptPending: false };
    this.saveAll(records);
  },
};
