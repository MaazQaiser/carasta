"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import type { Auction, MarketplaceListingType, MarketplaceSaleType } from "@carasta/types";
import { formatPrice, formatMileage, formatTimeRemaining } from "@/lib/utils";
import { useWatchlist } from "@/lib/context/watchlist-context";
import { brand } from "@/theme/carastaTheme";

const LISTING_TYPE_LABELS: Record<MarketplaceListingType, string> = {
  "stock-lightly-modified": "Stock / Lightly Modified",
  "modified-performance": "Modified / Performance",
  "restored-restomod-custom": "Restored / Restomod / Custom",
  "race-track-car": "Race / Track Car",
};

const SALE_TYPE_LABELS: Record<MarketplaceSaleType, string> = {
  "reserve-auction": "Reserve Auction",
  "buy-it-now": "Buy It Now",
  "auction-buy-now": "Auction + Buy Now",
  "make-offer": "Make Offer",
};

interface AuctionCardProps {
  auction: Auction;
  view?: "grid" | "list";
  /** Show seller Edit / Share actions at the bottom of the card. */
  showOwnerActions?: boolean;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function transmissionLabel(v: string) {
  if (v === "manual") return "Manual";
  if (v === "automatic") return "Automatic";
  if (v === "semi-automatic") return "Semi-Auto";
  return capitalize(v);
}

function reserveProgress(auction: Auction): number {
  if (auction.reserveMet) return 1;
  const reserve = auction.reservePrice ?? auction.vehicle.reservePrice;
  if (!reserve || reserve <= 0) return 0.18;
  return Math.max(0.06, Math.min(0.97, auction.currentBid / reserve));
}

/** Gradient bar matching the image's red → orange → yellow → green reserve meter. */
function ReserveBar({ progress }: { progress: number }) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  return (
    <Box sx={{ px: 2, pb: 1.75 }}>
      <Typography
        sx={{ fontSize: 10, fontWeight: 600, color: brand.muted, mb: 0.6, letterSpacing: "0.02em" }}
      >
        Reserve estimate
      </Typography>
      <Box sx={{ position: "relative", height: 6, borderRadius: 99, overflow: "hidden", bgcolor: "#F0F0F0" }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, #e53935 0%, #fb8c00 30%, #fdd835 60%, #43a047 100%)",
          }}
        />
        {/* White mask from right to hide unfilled portion */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: `${100 - pct}%`,
            bgcolor: "#F0F0F0",
          }}
        />
      </Box>
    </Box>
  );
}

/** Countdown pill overlaid on the image. */
function CountdownBadge({ endTime, upcoming }: { endTime: string; upcoming?: boolean }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);
  const { label, urgent } = formatTimeRemaining(endTime);
  const text = upcoming ? `Starts in ${label}` : `${label} left`;

  return (
    <Stack
      direction="row"
      spacing={0.65}
      sx={{
        alignItems: "center",
        bgcolor: "rgba(12,12,12,0.84)",
        backdropFilter: "blur(4px)",
        color: "#fff",
        px: 1.1,
        py: 0.5,
        borderRadius: 99,
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: urgent && !upcoming ? "#f87171" : "#4ade80",
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.01em",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        {text}
      </Typography>
    </Stack>
  );
}

/** Badge chips row matching the image style — small outlined pills with leading icons. */
function BadgePills({ auction }: { auction: Auction }) {
  const { vehicle } = auction;
  const conditionLabel = vehicle.condition ? capitalize(vehicle.condition) : null;
  const listingLabel = vehicle.listingType ? LISTING_TYPE_LABELS[vehicle.listingType] : null;
  const saleLabel = vehicle.saleType
    ? SALE_TYPE_LABELS[vehicle.saleType]
    : auction.reservePrice
      ? SALE_TYPE_LABELS["reserve-auction"]
      : null;

  const pillSx = {
    height: 24,
    fontSize: 10.5,
    fontWeight: 600,
    borderColor: brand.border,
    color: brand.inkSoft,
    bgcolor: "#fff",
    borderRadius: "6px",
    "& .MuiChip-label": { px: 0.85 },
    "& .MuiChip-icon": { fontSize: 12, color: brand.muted, ml: "5px", mr: "-2px" },
  } as const;

  return (
    <Stack direction="row" useFlexGap flexWrap="wrap" sx={{ gap: 0.6, mt: 1.25 }}>
      {conditionLabel ? (
        <Chip
          size="small"
          variant="outlined"
          icon={<StarOutlineRoundedIcon />}
          label={conditionLabel}
          sx={pillSx}
        />
      ) : null}
      {listingLabel ? (
        <Chip
          size="small"
          variant="outlined"
          icon={<BuildOutlinedIcon />}
          label={listingLabel}
          sx={pillSx}
        />
      ) : null}
      {saleLabel ? (
        <Chip
          size="small"
          variant="outlined"
          icon={<MonetizationOnOutlinedIcon />}
          label={saleLabel}
          sx={pillSx}
        />
      ) : null}
      {vehicle.vinVerified ? (
        <Chip
          size="small"
          variant="outlined"
          icon={<VerifiedUserOutlinedIcon />}
          label="VIN Verified"
          sx={pillSx}
        />
      ) : null}
      {vehicle.carastaVerified ? (
        <Chip
          size="small"
          label="Carasta Verified"
          sx={{ ...pillSx, bgcolor: brand.ink, color: "#fff", borderColor: brand.ink }}
        />
      ) : null}
    </Stack>
  );
}

/** Price + Bid Now / Buy Now CTA row. */
function BidRow({ auction, href }: { auction: Auction; href: string }) {
  const isUpcoming = auction.status === "upcoming";
  const isBuyNow = auction.vehicle.saleType === "buy-it-now";
  const bidLabel = isUpcoming ? "Starting bid" : "Current bid";

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        px: 2,
        pt: 1.5,
        pb: 1.25,
        borderTop: `1px solid ${brand.border}`,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: brand.muted,
            lineHeight: 1,
          }}
        >
          {bidLabel}
        </Typography>
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            color: brand.ink,
            mt: 0.3,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatPrice(auction.currentBid)}
        </Typography>
      </Box>

      {isUpcoming ? (
        /* Upcoming auction → icon-only arrow circle */
        <Box
          component={Link}
          href={href}
          aria-label="View auction"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            flexShrink: 0,
            bgcolor: brand.ink,
            color: "#fff",
            borderRadius: "50%",
            transition: "background 0.15s, transform 0.15s",
            "&:hover": { bgcolor: "#2a2a2a", transform: "scale(1.06)" },
          }}
        >
          <ArrowForwardRoundedIcon sx={{ fontSize: 20 }} />
        </Box>
      ) : (
        /* Live / completed → Bid Now / Buy Now pill button */
        <Box
          component={Link}
          href={href}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.6,
            bgcolor: brand.ink,
            color: "#fff",
            px: 2,
            py: 1.1,
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "background 0.15s",
            "&:hover": { bgcolor: "#2a2a2a" },
          }}
        >
          <GavelRoundedIcon sx={{ fontSize: 15 }} />
          {isBuyNow ? "Buy Now" : "Bid Now"}
        </Box>
      )}
    </Stack>
  );
}

export function AuctionCard({ auction, view = "grid", showOwnerActions = false }: AuctionCardProps) {
  const { isWatched, toggle } = useWatchlist();
  const watched = isWatched(auction.vehicle.id);
  const primaryImage = auction.vehicle.images[0];
  const isUpcoming = auction.status === "upcoming";
  const detailHref = `/vehicles/${auction.vehicle.id}`;

  const locationLabel = [auction.vehicle.location.city, auction.vehicle.location.state]
    .filter(Boolean)
    .join(", ");
  const metaLine = [
    formatMileage(auction.vehicle.spec.mileage),
    transmissionLabel(auction.vehicle.spec.transmission),
    locationLabel,
  ]
    .filter(Boolean)
    .join(" • ");

  const showReserve = Boolean(auction.reservePrice || auction.vehicle.reservePrice);
  const progress = reserveProgress(auction);

  // ─── List view ───
  if (view === "list") {
    return (
      <Card
        sx={{
          display: "flex",
          alignItems: "stretch",
          overflow: "hidden",
          borderRadius: "14px",
          border: `1px solid ${brand.border}`,
          boxShadow: "none",
          bgcolor: "#fff",
          "&:hover": { boxShadow: "0 4px 24px -8px rgba(0,0,0,0.12)" },
          transition: "box-shadow 0.2s",
        }}
      >
        <Box
          component={Link}
          href={detailHref}
          sx={{
            width: 140,
            height: 96,
            flexShrink: 0,
            bgcolor: brand.soft,
            overflow: "hidden",
            display: "block",
          }}
        >
          {primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage.url}
              alt={primaryImage.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : null}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 2, p: 1.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              component={Link}
              href={detailHref}
              sx={{ fontWeight: 700, fontSize: 14, color: "text.primary", "&:hover": { color: "primary.main" } }}
              noWrap
            >
              {auction.vehicle.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: 12 }}>
              {metaLine}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right", flexShrink: 0 }}>
            <Typography sx={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: brand.muted }}>
              {isUpcoming ? "Starting bid" : "Current bid"}
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", color: brand.ink }}>
              {formatPrice(auction.currentBid)}
            </Typography>
          </Box>
        </Box>
      </Card>
    );
  }

  // ─── Grid view ───
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "16px",
        border: `1px solid ${brand.border}`,
        boxShadow: "0 2px 12px -4px rgba(0,0,0,0.08)",
        bgcolor: "#fff",
        minWidth: 0,
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": {
          boxShadow: "0 8px 32px -8px rgba(0,0,0,0.16)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* ── Hero image ── */}
      <Box sx={{ position: "relative", flexShrink: 0 }}>
        <Box
          component={Link}
          href={detailHref}
          sx={{ display: "block", aspectRatio: "16/10", bgcolor: brand.soft, overflow: "hidden" }}
        >
          {primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage.url}
              alt={primaryImage.alt ?? auction.vehicle.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : null}
        </Box>

        {/* Countdown badge */}
        {auction.status !== "completed" ? (
          <Box sx={{ position: "absolute", top: 10, left: 10 }}>
            <CountdownBadge
              endTime={isUpcoming ? auction.startTime : auction.endTime}
              upcoming={isUpcoming}
            />
          </Box>
        ) : null}

        {/* Watchlist heart */}
        <IconButton
          size="small"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(auction.vehicle.id);
          }}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            bgcolor: watched ? brand.primary : "rgba(255,255,255,0.96)",
            color: watched ? "#fff" : brand.ink,
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
            "&:hover": { bgcolor: watched ? brand.primaryDark : "#fff" },
            transition: "background 0.15s",
          }}
        >
          {watched ? (
            <FavoriteIcon sx={{ fontSize: 16 }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 16 }} />
          )}
        </IconButton>
      </Box>

      {/* ── Content ── */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Box sx={{ px: 2, pt: 1.75, pb: 0.5 }}>
          {/* Title */}
          <Typography
            component={Link}
            href={detailHref}
            sx={{
              fontWeight: 800,
              fontSize: "1.05rem",
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
              color: brand.ink,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              "&:hover": { color: "#444" },
            }}
          >
            {auction.vehicle.title}
          </Typography>

          {/* Meta line */}
          <Typography
            noWrap
            sx={{ fontSize: 12.5, color: brand.muted, mt: 0.5, letterSpacing: "-0.005em" }}
          >
            {metaLine}
          </Typography>

          {/* Badge pills */}
          <BadgePills auction={auction} />
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* ── Bid row ── */}
        <BidRow auction={auction} href={detailHref} />

        {/* ── Reserve bar ── */}
        {showReserve ? <ReserveBar progress={progress} /> : null}

        {/* ── Owner actions (optional) ── */}
        {showOwnerActions ? (
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.25,
              borderTop: `1px solid ${brand.border}`,
            }}
          >
            <Box
              component={Link}
              href={`/vehicles/${auction.vehicle.id}/edit`}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                bgcolor: brand.soft,
                color: brand.inkSoft,
                px: 1.5,
                py: 0.6,
                borderRadius: 99,
                fontWeight: 600,
                fontSize: 12,
                "&:hover": { bgcolor: brand.border },
                transition: "background 0.15s",
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 14 }} />
              Edit
            </Box>
            <IconButton
              size="small"
              sx={{ color: brand.muted, "&:hover": { color: brand.ink } }}
              aria-label="Share"
            >
              <IosShareOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        ) : null}
      </Box>
    </Card>
  );
}
