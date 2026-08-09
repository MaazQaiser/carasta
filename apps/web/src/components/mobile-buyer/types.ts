export type BuyerListingType = "stock" | "classic" | "restored" | "race";

export interface BuyerMediaItem {
  id: string;
  url: string;
  alt: string;
  kind?: "image" | "video";
}

export interface BuyerBadge {
  label: string;
  tone?: "brand" | "success" | "neutral";
}

export interface BuyerSpecItem {
  label: string;
  value: string;
}

export interface BuyerAccordionItem {
  id: string;
  title: string;
  summary?: string;
  body?: string;
  specs?: BuyerSpecItem[];
  photos?: BuyerMediaItem[];
  entries?: {
    id: string;
    title: string;
    detail?: string;
    meta?: string;
    photos?: BuyerMediaItem[];
  }[];
}

export interface BuyerTimelineItem {
  id: string;
  title: string;
  date?: string;
  detail?: string;
}

export interface BuyerDocumentItem {
  id: string;
  title: string;
  subtitle?: string;
  type: "PDF" | "Photo" | "Doc";
}

export interface BuyerSellerInfo {
  name: string;
  location: string;
  role: string;
  rating: string;
  listings: number;
  verified: boolean;
  organization?: string;
}

export interface BuyerListingDemo {
  type: BuyerListingType;
  id: string;
  title: string;
  subtitle: string;
  priceLabel: string;
  location: string;
  sellerBadge: string;
  badges: BuyerBadge[];
  gallery: BuyerMediaItem[];
  quickSpecs: BuyerSpecItem[];
  overview: string;
  story?: string;
  documents: BuyerDocumentItem[];
  seller: BuyerSellerInfo;
  primaryCta: string;
  secondaryCta: string;
  /** Type-specific payload rendered by section components. */
  content: Record<string, unknown>;
}
