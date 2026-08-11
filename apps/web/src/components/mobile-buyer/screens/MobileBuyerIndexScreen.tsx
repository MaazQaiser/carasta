"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PublishedListingService } from "@/components/listing/services/published-listing-service";
import { mapAuctionToBuyerListing } from "../map-vehicle-to-buyer";
import { BUYER_LISTING_INDEX, BUYER_LISTING_DEMOS } from "../demo-listings";
import { MobileBuyerShell } from "../MobileBuyerShell";

export function MobileBuyerIndexScreen() {
  const [published, setPublished] = React.useState<
    { id: string; title: string; priceLabel: string; cover?: string; typeLabel: string }[]
  >([]);

  React.useEffect(() => {
    const records = PublishedListingService.load();
    setPublished(
      records.map((record) => {
        const listing = mapAuctionToBuyerListing(record.auction);
        return {
          id: listing.vehicleId,
          title: listing.title,
          priceLabel: listing.priceLabel,
          cover: listing.gallery[0]?.url,
          typeLabel: listing.subtitle,
        };
      })
    );
  }, []);

  return (
    <MobileBuyerShell title="Buyer Listings" hideSticky>
      <div className="flex flex-col gap-5 px-6 pb-8 pt-4">
        <div>
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            Buyer Listing Experience
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-[#636366]">
            Open a published listing to buy, bid, make an offer, or contact the seller.
          </p>
        </div>

        {published.length ? (
          <section className="space-y-3">
            <h2 className="text-[13px] font-bold uppercase tracking-wide text-[#7b78a3]">
              Published listings
            </h2>
            {published.map((item) => (
              <Link
                key={item.id}
                href={`/m/listings/v/${item.id}`}
                className="block overflow-hidden rounded-xl border border-[#e5e5ea] bg-white"
              >
                <div className="aspect-[16/9] overflow-hidden bg-[#f2f2f7]">
                  {item.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.cover} alt={item.title} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="flex items-center gap-3 px-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-[#1c1c1e]">{item.title}</p>
                    <p className="mt-0.5 text-[12px] text-[#636366]">{item.typeLabel}</p>
                    <p className="mt-1 text-[12px] font-semibold text-[#1b1464]">
                      {item.priceLabel}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#636366]" />
                </div>
              </Link>
            ))}
          </section>
        ) : (
          <div className="rounded-xl border border-dashed border-[#d1d1d6] px-4 py-5 text-[13px] text-[#636366]">
            No published listings in this browser yet. Submit a listing from{" "}
            <Link href="/mobile-listing/type" className="font-semibold text-[#1b1464] underline">
              mobile listing
            </Link>{" "}
            to see it here.
          </div>
        )}

        <section className="space-y-3">
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-[#7b78a3]">
            Design samples
          </h2>
          {BUYER_LISTING_INDEX.map((item) => {
            const listing = BUYER_LISTING_DEMOS[item.type];
            const cover = listing.gallery[0];
            return (
              <Link
                key={item.type}
                href={`/m/listings/${item.type}`}
                className="block overflow-hidden rounded-xl border border-[#e5e5ea] bg-white"
              >
                <div className="aspect-[16/9] overflow-hidden bg-[#f2f2f7]">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover.url} alt={cover.alt} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="flex items-center gap-3 px-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-[#1c1c1e]">{item.label}</p>
                    <p className="mt-0.5 text-[12px] text-[#636366]">{item.description}</p>
                    <p className="mt-1 text-[12px] font-semibold text-[#1b1464]">
                      {listing.priceLabel}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#636366]" />
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </MobileBuyerShell>
  );
}
