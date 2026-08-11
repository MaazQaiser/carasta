"use client";

import * as React from "react";
import Link from "next/link";
import { PublishedListingService } from "@/components/listing/services/published-listing-service";
import { mapAuctionToBuyerListing } from "../map-vehicle-to-buyer";
import { getBuyerListing } from "../demo-listings";
import { MobileBuyerShell } from "../MobileBuyerShell";
import { KeyValueList, Section } from "../primitives";
import type { BuyerListingType } from "../types";
import type { BuyerSellerInfo } from "../types";

function SellerProfileBody({
  seller,
  backHref,
  contactHref,
}: {
  seller: BuyerSellerInfo & {
    memberSince?: string;
    responseTime?: string;
    listingsSold?: number;
  };
  backHref: string;
  contactHref: string;
}) {
  return (
    <MobileBuyerShell title="Seller Profile" hideSticky>
      <div className="flex flex-col gap-6 px-5 pb-8 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1b1464] text-[18px] font-bold text-white">
            {seller.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="min-w-0">
            <h1 className="text-[22px] font-extrabold text-[#1c1c1e]">{seller.name}</h1>
            <p className="text-[13px] text-[#636366]">
              {seller.role}
              {seller.organization ? ` · ${seller.organization}` : ""}
            </p>
            {seller.verified ? (
              <span className="mt-1 inline-flex rounded-full bg-[#eef8f0] px-2 py-0.5 text-[10px] font-semibold text-[#2f7d4a]">
                Verified Seller
              </span>
            ) : null}
          </div>
        </div>

        <Section title="Seller Information">
          <KeyValueList
            items={[
              { label: "Location", value: seller.location || "—" },
              { label: "Rating", value: `★ ${seller.rating}` },
              {
                label: "Member since",
                value: seller.memberSince || "—",
              },
              {
                label: "Listings sold",
                value: String(seller.listingsSold ?? seller.listings),
              },
              {
                label: "Response time",
                value: seller.responseTime || "Usually within a day",
              },
              { label: "Active listings", value: String(seller.listings) },
            ]}
          />
        </Section>

        <div className="grid gap-2">
          <Link
            href={contactHref}
            className="flex h-11 items-center justify-center rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
          >
            Contact Seller
          </Link>
          <Link
            href={backHref}
            className="flex h-11 items-center justify-center rounded-lg border border-[#e5e5ea] text-[13px] font-semibold text-[#1c1c1e]"
          >
            Back to Listing
          </Link>
        </div>
      </div>
    </MobileBuyerShell>
  );
}

export function MobileBuyerSellerScreen({ type }: { type: BuyerListingType }) {
  const listing = getBuyerListing(type);
  if (!listing) {
    return (
      <MobileBuyerShell title="Seller" hideSticky>
        <div className="px-6 py-10 text-[14px] text-[#636366]">Seller not found.</div>
      </MobileBuyerShell>
    );
  }
  return (
    <SellerProfileBody
      seller={{
        ...listing.seller,
        memberSince: "2022",
        responseTime: "Usually within a day",
        listingsSold: listing.seller.listings,
      }}
      backHref={`/m/listings/${type}`}
      contactHref="/messages"
    />
  );
}

export function MobileBuyerLiveSellerScreen({ id }: { id: string }) {
  const [seller, setSeller] = React.useState<
    | (BuyerSellerInfo & {
        memberSince?: string;
        responseTime?: string;
        listingsSold?: number;
      })
    | null
    | undefined
  >(undefined);
  const [contactHref, setContactHref] = React.useState("/messages");

  React.useEffect(() => {
    const record = PublishedListingService.resolve(id);
    if (!record) {
      setSeller(null);
      return;
    }
    const listing = mapAuctionToBuyerListing(record.auction);
    setSeller({
      ...listing.seller,
      memberSince: listing.sellerMemberSince,
      responseTime: listing.sellerResponseTime,
      listingsSold: listing.sellerListingsSold,
    });
    if (listing.sellerId) setContactHref(`/messages?with=${listing.sellerId}`);
  }, [id]);

  if (seller === undefined) {
    return (
      <MobileBuyerShell title="Seller" hideSticky>
        <div className="px-6 py-10 text-[14px] text-[#636366]">Loading…</div>
      </MobileBuyerShell>
    );
  }

  if (!seller) {
    return (
      <MobileBuyerShell title="Seller" hideSticky>
        <div className="px-6 py-10 text-[14px] text-[#636366]">Seller not found.</div>
      </MobileBuyerShell>
    );
  }

  return (
    <SellerProfileBody
      seller={seller}
      backHref={`/m/listings/v/${id}`}
      contactHref={contactHref}
    />
  );
}
