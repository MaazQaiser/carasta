"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BUYER_LISTING_INDEX, BUYER_LISTING_DEMOS } from "../demo-listings";
import { MobileBuyerShell } from "../MobileBuyerShell";

export function MobileBuyerIndexScreen() {
  return (
    <MobileBuyerShell title="Buyer Listings" hideSticky>
      <div className="flex flex-col gap-5 px-6 pb-8 pt-4">
        <div>
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
            Buyer Listing Details
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-[#636366]">
            Explore how each seller flow presents to buyers — from stock vehicles to race cars.
          </p>
        </div>

        <div className="space-y-3">
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
        </div>
      </div>
    </MobileBuyerShell>
  );
}
