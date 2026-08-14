import type { Auction, MarketplaceListingType, MarketplaceSaleType, Vehicle } from "@carasta/types";
import { displayPerformanceClaimStatus } from "@/components/listing/specs/options";
import type {
  BuyerAccordionItem,
  BuyerBadge,
  BuyerDocumentItem,
  BuyerListingDemo,
  BuyerListingType,
  BuyerMediaItem,
  BuyerSellerInfo,
  BuyerSpecItem,
} from "./types";

export type BuyerSaleMode = "auction" | "fixed" | "hybrid";

export interface BuyerListingView extends BuyerListingDemo {
  vehicleId: string;
  auctionId?: string;
  saleMode: BuyerSaleMode;
  saleType?: MarketplaceSaleType;
  vinVerified: boolean;
  listingStatusLabel: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  mileageLabel: string;
  askingPrice?: number;
  currentBid?: number;
  reserveMet?: boolean;
  reservePrice?: number;
  bidCount?: number;
  auctionEndsAt?: string;
  views?: number;
  watcherCount?: number;
  leadingBidderUsername?: string;
  sellerUsername?: string;
  sellerId?: string;
  sellerMemberSince?: string;
  sellerResponseTime?: string;
  sellerListingsSold?: number;
}

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&auto=format&fit=crop";

function formatPrice(value?: number) {
  if (value == null || !Number.isFinite(value)) return "Price on request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMileage(value: number) {
  return `${new Intl.NumberFormat("en-US").format(value)} mi`;
}

export function mapMarketplaceTypeToBuyer(
  listingType?: MarketplaceListingType | null
): BuyerListingType {
  switch (listingType) {
    case "modified-performance":
      return "modified";
    case "restored-restomod-custom":
      return "restored";
    case "race-track-car":
      return "race";
    case "stock-lightly-modified":
    default:
      return "stock";
  }
}

function saleModeFromType(saleType?: MarketplaceSaleType): BuyerSaleMode {
  if (saleType === "buy-it-now" || saleType === "make-offer") return "fixed";
  if (saleType === "auction-buy-now") return "hybrid";
  return "auction";
}

function typeLabel(type: BuyerListingType) {
  switch (type) {
    case "modified":
      return "Modified / Performance";
    case "restored":
      return "Restored / Restomod / Custom";
    case "race":
      return "Race / Track Car";
    case "classic":
      return "Classic";
    default:
      return "Stock / Lightly Modified";
  }
}

function mediaFromVehicle(vehicle: Vehicle): BuyerMediaItem[] {
  const details = vehicle.listingDetails;
  const buckets = [
    ...(details?.media?.vehiclePhotos ?? []),
    ...(details?.media?.modificationPhotos ?? []),
    ...(details?.media?.videos ?? []),
  ];
  const fromBuckets: BuyerMediaItem[] = buckets.map((item) => ({
    id: item.id,
    url: item.url,
    alt: item.alt || vehicle.title,
    kind: details?.media?.videos?.some((v) => v.id === item.id) ? "video" : "image",
  }));
  const fromImages: BuyerMediaItem[] = (vehicle.images ?? []).map((img, index) => ({
    id: img.id || `img-${index}`,
    url: img.url,
    alt: img.alt || vehicle.title,
    kind: "image",
  }));
  const merged = [...fromBuckets, ...fromImages];
  const seen = new Set<string>();
  const unique = merged.filter((item) => {
    if (!item.url || seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
  return unique.length
    ? unique
    : [{ id: "placeholder", url: PLACEHOLDER, alt: vehicle.title, kind: "image" }];
}

function documentsFromVehicle(vehicle: Vehicle): BuyerDocumentItem[] {
  const docs = vehicle.listingDetails?.media?.supportingDocuments ?? [];
  return docs.map((doc) => ({
    id: doc.id,
    title: doc.name || doc.alt || "Document",
    subtitle: "Uploaded with listing",
    type: "PDF" as const,
  }));
}

function modsToAccordion(vehicle: Vehicle): BuyerAccordionItem[] {
  const mods = vehicle.listingDetails?.modifications ?? [];
  const byCategory = new Map<string, typeof mods>();
  for (const mod of mods) {
    const key = mod.categoryLabel || mod.categoryId || "Other";
    const list = byCategory.get(key) ?? [];
    list.push(mod);
    byCategory.set(key, list);
  }
  return Array.from(byCategory.entries()).map(([title, entries], index) => ({
    id: `cat-${index}`,
    title,
    summary: `${entries.length} item${entries.length === 1 ? "" : "s"}`,
    entries: entries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      detail: entry.description || entry.specifications,
      meta: [
        entry.partClassification,
        entry.partsBrand,
        entry.shopBuilder || entry.workPerformedBy,
        entry.installationDate,
      ]
        .filter(Boolean)
        .join(" · "),
    })),
  }));
}

function recordToPairs(record?: Record<string, string>): BuyerSpecItem[] {
  if (!record) return [];
  return Object.entries(record).map(([label, value]) => ({ label, value }));
}

function buildContent(vehicle: Vehicle, type: BuyerListingType): Record<string, unknown> {
  const details = vehicle.listingDetails;
  const condition = details?.conditionHistory;

  if (type === "stock") {
    return {
      features: details?.lightModifications ?? vehicle.features ?? [],
      condition: {
        overall: condition?.overallCondition || "—",
        accident: condition?.accidentHistory || "—",
        title: condition?.titleStatus || "—",
        notes: condition?.generalNotes || "",
      },
      ownership: condition?.ownershipHistory
        ? [
            {
              id: "own-1",
              title: "Ownership",
              detail: condition.ownershipHistory,
            },
          ]
        : [],
      service: condition?.serviceRecords
        ? [
            {
              id: "svc-1",
              title: "Service records",
              detail: condition.serviceRecords,
            },
          ]
        : [],
      specifications: [
        vehicle.spec.engineSize ? { label: "Engine", value: vehicle.spec.engineSize } : null,
        details?.factorySpecsNotes
          ? { label: "Factory notes", value: details.factorySpecsNotes }
          : null,
      ].filter(Boolean),
    };
  }

  if (type === "modified") {
    const perf = details?.performanceSummary;
    return {
      buildSummary: perf?.buildSummary || vehicle.description,
      currentSpecs: [
        { label: "Engine", value: perf?.currentEngine || vehicle.spec.engineSize || "—" },
        { label: "Transmission", value: perf?.transmission || vehicle.spec.transmission || "—" },
        { label: "Drivetrain", value: perf?.drivetrain || vehicle.spec.driveType || "—" },
        {
          label: "Horsepower",
          value: perf?.horsepower
            ? `${perf.horsepower} · ${displayPerformanceClaimStatus(perf.horsepowerStatus)}`
            : "—",
        },
        {
          label: "Torque",
          value: perf?.torque
            ? `${perf.torque} · ${displayPerformanceClaimStatus(perf.torqueStatus)}`
            : "—",
        },
        { label: "Fuel", value: perf?.fuelType || vehicle.spec.fuelType || "—" },
        { label: "Tuning", value: perf?.tuningPlatform || "—" },
      ],
      categories: modsToAccordion(vehicle),
      dyno: [
        {
          label: "HP Status",
          value: displayPerformanceClaimStatus(perf?.horsepowerStatus),
        },
        {
          label: "Torque Status",
          value: displayPerformanceClaimStatus(perf?.torqueStatus),
        },
      ],
      builder:
        details?.modifications?.find((m) => m.shopBuilder || m.workPerformedBy)?.shopBuilder ||
        details?.modifications?.find((m) => m.workPerformedBy)?.workPerformedBy ||
        "—",
    };
  }

  if (type === "restored") {
    const restoration = details?.restoration;
    return {
      buildType: restoration?.buildType || "—",
      mileageStatus: restoration?.mileageStatus || "—",
      restorationProfile: [
        { label: "Identity", value: restoration?.identityType || "—" },
        { label: "Identity value", value: restoration?.identityValue || "—" },
        { label: "Build type", value: restoration?.buildType || "—" },
        { label: "Build status", value: restoration?.buildStatus || "—" },
        { label: "Work performed by", value: restoration?.workPerformedBy || "—" },
        { label: "Shop / builder", value: restoration?.shopBuilder || "—" },
        { label: "Mileage status", value: restoration?.mileageStatus || "—" },
      ],
      matchingNumbers: recordToPairs(restoration?.factoryCorrect).slice(0, 8),
      authenticity: recordToPairs(restoration?.provenance).slice(0, 8),
      categories: modsToAccordion(vehicle),
      builder:
        restoration?.shopBuilder ||
        restoration?.provenance?.Builder ||
        restoration?.provenance?.["Restoration Shop"] ||
        "—",
      shop:
        restoration?.shopBuilder ||
        restoration?.provenance?.["Restoration Shop"] ||
        "—",
      timeline: (restoration?.timelineEvents ?? []).map((event) => ({
        id: event.id,
        title: [event.dateYear, event.title].filter(Boolean).join(" "),
        date: event.exactDate || event.dateYear,
        detail: event.description,
      })),
    };
  }

  // race
  const race = details?.race;
  return {
    raceHistory: (race?.history ?? []).slice(0, 4).map((h) => ({
      label: h.event,
      value: [h.result, h.date].filter(Boolean).join(" · ") || "—",
    })),
    timeline: (race?.history ?? []).map((h) => ({
      id: h.id,
      title: h.event,
      date: h.date,
      detail: [h.track, h.className, h.position, h.notes].filter(Boolean).join(" · "),
    })),
    competitionProfile: recordToPairs(race?.competition),
    organizedCompetition: race?.organizedCompetition || "",
    competitionHistory: race?.competitionHistory || "",
    documentationTypes: race?.documentationTypes ?? [],
    documentationOther: race?.documentationOther || "",
    sparesIncluded: race?.sparesIncluded || "",
    sparesDescription: race?.sparesDescription || "",
    knownRaceTrackIssues: race?.knownRaceTrackIssues || condition?.knownRaceTrackIssues || "",
    raceBuild: {
      narrative: race?.buildNarrative || "",
      workPerformedBy: race?.workPerformedBy || "",
      shopBuilder: race?.shopBuilder || "",
    },
    biography: {
      competitionHistory: race?.competitionHistory || vehicle.story || "",
      vehicleHistory: condition?.vehicleHistory || "",
      preparationNotes: race?.buildNarrative || race?.setup?.["Driver Notes"] || race?.setup?.["Crew Notes"] || "",
    },
    safetyChecklist: (race?.installedEquipment ?? []).map((label) => ({
      label,
      value: "Installed",
    })),
    safetyDates: recordToPairs(race?.safetyServiceDates),
    safetyNotes: race?.safetyNotes || "",
    certifications: [],
    modifications: modsToAccordion(vehicle),
    team: {
      raceTeam: race?.competition?.["Primary Use"] || "—",
      builder: race?.shopBuilder || race?.workPerformedBy || "—",
      dealer: "—",
    },
  };
}

function sellerInfo(vehicle: Vehicle): BuyerSellerInfo {
  const seller = vehicle.seller;
  return {
    name: seller.displayName || seller.username,
    location: vehicle.listingDetails?.sellerLocation || seller.location || vehicle.location?.city || "—",
    role: seller.isSeller ? "Seller" : seller.role,
    rating: seller.stats?.rating != null ? String(seller.stats.rating) : "New",
    listings: seller.stats?.totalListings ?? 1,
    verified: seller.isVerified,
    organization: seller.displayName !== seller.username ? seller.username : undefined,
  };
}

export function mapAuctionToBuyerListing(auction: Auction): BuyerListingView {
  const vehicle = auction.vehicle;
  const type = mapMarketplaceTypeToBuyer(vehicle.listingType);
  const saleMode = saleModeFromType(vehicle.saleType);
  const buyNow = vehicle.listingDetails?.buyNowPrice ?? vehicle.estimatedValue;
  const priceLabel =
    saleMode === "fixed"
      ? formatPrice(buyNow ?? vehicle.startingPrice)
      : `Current bid ${formatPrice(auction.currentBid)}`;

  const badges: BuyerBadge[] = [
    { label: typeLabel(type), tone: "brand" },
    vehicle.vinVerified || vehicle.spec.vin
      ? { label: "VIN Verified", tone: "success" }
      : { label: "VIN Optional", tone: "neutral" },
    { label: auction.status === "live" ? "Live" : auction.status, tone: "neutral" },
  ];

  const gallery = mediaFromVehicle(vehicle);
  const location =
    vehicle.listingDetails?.sellerLocation ||
    [vehicle.location?.city, vehicle.location?.state].filter(Boolean).join(", ") ||
    "—";

  return {
    type,
    id: vehicle.id,
    vehicleId: vehicle.id,
    auctionId: auction.id,
    title: vehicle.title,
    subtitle: `${typeLabel(type)} · ${vehicle.spec.trim || vehicle.spec.bodyStyle || "Vehicle"}`,
    priceLabel,
    location,
    sellerBadge: vehicle.seller.isVerified ? "Verified Seller" : "Seller",
    badges,
    gallery,
    quickSpecs: [
      { label: "Year", value: String(vehicle.spec.year) },
      { label: "Make", value: vehicle.spec.make },
      { label: "Model", value: vehicle.spec.model },
      { label: "Trim", value: vehicle.spec.trim || "—" },
      { label: "Mileage", value: formatMileage(vehicle.spec.mileage) },
      { label: "Transmission", value: String(vehicle.spec.transmission) },
      { label: "Engine", value: vehicle.spec.engineSize || "—" },
      { label: "Drivetrain", value: String(vehicle.spec.driveType).toUpperCase() },
      { label: "Exterior", value: vehicle.spec.exteriorColor },
      { label: "Interior", value: vehicle.spec.interiorColor },
    ],
    overview: vehicle.description,
    story: vehicle.story,
    documents: documentsFromVehicle(vehicle),
    seller: sellerInfo(vehicle),
    primaryCta:
      saleMode === "fixed" ? "Buy Now" : saleMode === "hybrid" ? "Place Bid" : "Place Bid",
    secondaryCta: saleMode === "fixed" ? "Make an Offer" : "Make an Offer",
    content: buildContent(vehicle, type),
    saleMode,
    saleType: vehicle.saleType,
    vinVerified: Boolean(vehicle.vinVerified || vehicle.spec.vin),
    listingStatusLabel: auction.status === "live" ? "Live Auction" : String(auction.status),
    year: String(vehicle.spec.year),
    make: vehicle.spec.make,
    model: vehicle.spec.model,
    trim: vehicle.spec.trim || "",
    mileageLabel: formatMileage(vehicle.spec.mileage),
    askingPrice: buyNow ?? vehicle.startingPrice,
    currentBid: auction.currentBid,
    reserveMet: auction.reserveMet,
    reservePrice: auction.reservePrice ?? vehicle.reservePrice,
    bidCount: auction.bidCount,
    auctionEndsAt: auction.endTime,
    views: vehicle.views ?? 0,
    watcherCount: auction.watcherCount ?? vehicle.watchlistCount ?? 0,
    leadingBidderUsername: auction.leadingBidder?.username,
    sellerUsername: vehicle.seller.username,
    sellerId: vehicle.seller.id,
    sellerMemberSince: vehicle.seller.joinedAt
      ? new Date(vehicle.seller.joinedAt).getFullYear().toString()
      : undefined,
    sellerResponseTime: vehicle.seller.stats?.responseRate != null
      ? `${vehicle.seller.stats.responseRate}% response`
      : "Usually within a day",
    sellerListingsSold: vehicle.seller.stats?.totalSales ?? 0,
  };
}
