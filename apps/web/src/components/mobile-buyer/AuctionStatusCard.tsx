"use client";

import * as React from "react";
import { formatPrice } from "@/lib/utils";

export function formatAuctionEndsAt(iso?: string) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export function formatAuctionCountdown(iso?: string) {
  if (!iso) return "—";
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "Ended";
  const totalHours = Math.floor(ms / 3_600_000);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const mins = Math.floor((ms % 3_600_000) / 60_000);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

/** Semi-circular reserve progress gauge (0–1). */
export function ReserveMeterGauge({
  progress,
  size = 72,
  className = "",
}: {
  progress: number;
  size?: number;
  className?: string;
}) {
  const uid = React.useId().replace(/:/g, "");
  const gradId = `reserveArcGrad-${uid}`;
  const clamped = Math.max(0, Math.min(1, progress));
  const angle = -90 + clamped * 180;
  const r = size * 0.36;
  const cx = size / 2;
  const cy = size * 0.62;
  const needleLen = r * 0.88;
  const rad = (angle * Math.PI) / 180;
  const nx = cx + Math.cos(rad) * needleLen;
  const ny = cy + Math.sin(rad) * needleLen;

  return (
    <svg
      width={size}
      height={size * 0.72}
      viewBox={`0 0 ${size} ${size * 0.72}`}
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e53935" />
          <stop offset="35%" stopColor="#fb8c00" />
          <stop offset="65%" stopColor="#fdd835" />
          <stop offset="100%" stopColor="#43a047" />
        </linearGradient>
      </defs>
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={size * 0.11}
        strokeLinecap="round"
      />
      <line
        x1={cx}
        y1={cy}
        x2={nx}
        y2={ny}
        stroke="#4fc3f7"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={3.5} fill="#4fc3f7" />
    </svg>
  );
}

export function AuctionStatusCard({
  currentBid,
  highestBid,
  leadingBidder,
  endsAt,
  bidCount,
  views,
  watches,
  reserveProgress,
  reserveMet,
}: {
  currentBid: number;
  highestBid: number;
  leadingBidder?: string;
  endsAt?: string;
  bidCount: number;
  views: number;
  watches: number;
  /** 0–1 estimate toward reserve */
  reserveProgress: number;
  reserveMet?: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-2xl bg-[#1c1c1e] px-4 pb-3 pt-4 text-white">
      <h2 className="text-[16px] font-bold tracking-tight">Auction Status</h2>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="pr-3">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4fc3f7]" />
            <p className="text-[12px] font-medium text-[#aeaeb2]">Current Bid</p>
          </div>
          {leadingBidder ? (
            <p className="mt-1 text-[12px] text-[#aeaeb2]">
              By: <span className="font-semibold text-[#4fc3f7]">{leadingBidder}</span>
            </p>
          ) : (
            <p className="mt-1 text-[12px] text-[#aeaeb2]">No bids yet</p>
          )}
          <p className="mt-2 text-[28px] font-extrabold leading-none tracking-tight">
            {formatPrice(currentBid)}
          </p>
        </div>
        <div className="border-l border-[#3a3a3c] pl-3">
          <p className="text-[12px] font-medium text-[#aeaeb2]">Highest Bid</p>
          <p className="mt-7 text-[28px] font-extrabold leading-none tracking-tight">
            {formatPrice(highestBid)}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between rounded-full bg-[#2c2c2e] px-3.5 py-2.5 text-[12px]">
          <p className="text-[#d1d1d6]">
            Auction Ends:{" "}
            <span className="font-semibold text-white">{formatAuctionEndsAt(endsAt)}</span>
          </p>
          <p className="shrink-0 text-[#d1d1d6]">
            Total Bids: <span className="font-semibold text-white">{bidCount}</span>
          </p>
        </div>
        <div className="rounded-full bg-[#2c2c2e] px-3.5 py-2.5 text-center text-[12px] text-[#d1d1d6]">
          {views.toLocaleString()} Views • {watches.toLocaleString()} Watches
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#2c2c2e] px-3.5 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold text-white">
            Reserve Meter{reserveMet ? " · Met" : ""}
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-[#8e8e93]">
            Progress shown is an estimate toward reserve
          </p>
        </div>
        <ReserveMeterGauge progress={reserveProgress} size={78} />
      </div>
    </section>
  );
}
