"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ReserveMeterGauge } from "./AuctionStatusCard";

export function MobileBuyerShell({
  children,
  title = "Listing",
  stickyPrimary,
  stickySecondary,
  onPrimary,
  onSecondary,
  hideSticky,
  auctionSticky,
}: {
  children: React.ReactNode;
  title?: string;
  stickyPrimary?: string;
  stickySecondary?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  hideSticky?: boolean;
  /** Auction-style sticky bar (price + Bid Now + reserve gauge). */
  auctionSticky?: {
    currentBid: number;
    endsAt?: string;
    reserveProgress: number;
    onReservePress?: () => void;
  } | null;
}) {
  const router = useRouter();

  return (
    <div className="ml-phone-frame">
      <div className="ml-shell">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-[#e5e5ea] px-4">
          <button
            type="button"
            aria-label="Back"
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#1c1c1e]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <p className="text-[14px] font-semibold text-[#1c1c1e]">{title}</p>
          <span className="w-9" />
        </header>

        <div className="ml-shell-scroll">{children}</div>

        {!hideSticky && auctionSticky ? (
          <div className="shrink-0 bg-[#1b1464] px-3 pb-5 pt-3">
            <div className="flex items-center gap-2.5">
              <div className="min-w-0 shrink-0">
                <p className="text-[16px] font-extrabold leading-none text-white">
                  {formatPrice(auctionSticky.currentBid)}
                </p>
              </div>
              <button
                type="button"
                onClick={onPrimary}
                className="h-11 flex-1 rounded-lg bg-white text-[14px] font-bold text-[#1b1464]"
              >
                {stickyPrimary || "Bid Now"}
              </button>
              <button
                type="button"
                aria-label="Reserve meter"
                onClick={auctionSticky.onReservePress ?? onSecondary}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white"
              >
                <ReserveMeterGauge progress={auctionSticky.reserveProgress} size={40} />
              </button>
            </div>
          </div>
        ) : !hideSticky && stickyPrimary ? (
          <div className="shrink-0 border-t border-[#e5e5ea] bg-white px-4 pb-5 pt-3">
            <div className="grid grid-cols-2 gap-3">
              {stickySecondary ? (
                <button
                  type="button"
                  onClick={onSecondary}
                  className="h-11 rounded-lg border border-[#1b1464] text-[13px] font-semibold text-[#1b1464]"
                >
                  {stickySecondary}
                </button>
              ) : null}
              <button
                type="button"
                onClick={onPrimary}
                className={`h-11 rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white ${
                  stickySecondary ? "" : "col-span-2"
                }`}
              >
                {stickyPrimary}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
