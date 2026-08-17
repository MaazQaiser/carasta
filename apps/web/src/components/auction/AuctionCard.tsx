"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import type { Auction, MarketplaceListingType, MarketplaceSaleType } from "@carasta/types";
import { formatPrice, formatMileage, formatTimeRemaining } from "@/lib/utils";
import { formatAuctionCountdown, ReserveMeterGauge } from "@/components/mobile-buyer/AuctionStatusCard";
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

const chipSx = {
  height: 22,
  fontSize: 10,
  fontWeight: 600,
  borderColor: brand.border,
  color: brand.inkSoft,
  bgcolor: "#fff",
  "& .MuiChip-label": { px: 0.85 },
} as const;

interface AuctionCardProps {
  auction: Auction;
  view?: "grid" | "list";
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function transmissionLabel(value: string) {
  if (value === "manual") return "Manual";
  if (value === "automatic") return "Automatic";
  if (value === "semi-automatic") return "Semi-Auto";
  return capitalize(value);
}

function reserveProgress(auction: Auction): number {
  if (auction.reserveMet) return 1;
  const reserve = auction.reservePrice ?? auction.vehicle.reservePrice;
  if (!reserve || reserve <= 0) return 0.2;
  return Math.max(0.08, Math.min(0.97, auction.currentBid / reserve));
}

function MarketplaceBadges({ auction }: { auction: Auction }) {
  const { vehicle } = auction;
  const listingLabel = vehicle.listingType ? LISTING_TYPE_LABELS[vehicle.listingType] : undefined;
  const saleLabel = vehicle.saleType
    ? SALE_TYPE_LABELS[vehicle.saleType]
    : auction.reservePrice
      ? SALE_TYPE_LABELS["reserve-auction"]
      : undefined;

  return (
    <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap" sx={{ mt: 1, rowGap: 0.5 }}>
      <Chip size="small" variant="outlined" label={capitalize(vehicle.condition)} sx={chipSx} />
      {listingLabel ? <Chip size="small" variant="outlined" label={listingLabel} sx={chipSx} /> : null}
      {saleLabel ? <Chip size="small" variant="outlined" label={saleLabel} sx={chipSx} /> : null}
      {vehicle.vinVerified ? <Chip size="small" variant="outlined" label="VIN Verified" sx={chipSx} /> : null}
      {vehicle.documentsAvailable ? (
        <Chip size="small" variant="outlined" label="Documents Available" sx={chipSx} />
      ) : null}
      {vehicle.carastaVerified ? (
        <Chip
          size="small"
          label="Carasta Verified"
          sx={{ ...chipSx, bgcolor: brand.ink, color: "#fff", borderColor: brand.ink }}
        />
      ) : null}
    </Stack>
  );
}

function TimeLeftBadge({ endTime, upcoming }: { endTime: string; upcoming?: boolean }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);
  const { label, urgent } = formatTimeRemaining(endTime);
  const text = upcoming ? `Starts in ${label}` : `${label} left`;

  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={{
        alignItems: "center",
        bgcolor: "rgba(15,15,15,0.82)",
        color: "#fff",
        px: 1.15,
        py: 0.45,
        borderRadius: 999,
      }}
    >
      <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: urgent && !upcoming ? brand.primary : brand.primary, flexShrink: 0 }} />
      <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.01em", fontVariantNumeric: "tabular-nums" }}>
        {text}
      </Typography>
    </Stack>
  );
}

function AuctionAppBidBar({ auction, href }: { auction: Auction; href: string }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const isUpcoming = auction.status === "upcoming";
  const isBuyNow = auction.vehicle.saleType === "buy-it-now";
  const cta = isUpcoming ? "View" : isBuyNow ? "Buy Now" : "Bid Now";
  const countdown = formatAuctionCountdown(isUpcoming ? auction.startTime : auction.endTime);
  const progress = reserveProgress(auction);
  const showReserve = Boolean(auction.reservePrice || auction.vehicle.reservePrice);

  return (
    <Box
      sx={{
        bgcolor: "#1b1464",
        px: 1.25,
        py: 1.1,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box sx={{ minWidth: 0, flexShrink: 0 }}>
        <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 13, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          {formatPrice(auction.currentBid)}
        </Typography>
        <Stack direction="row" spacing={0.4} sx={{ alignItems: "center", mt: 0.4, color: "rgba(255,255,255,0.92)" }}>
          <AccessTimeRoundedIcon sx={{ fontSize: 12 }} />
          <Typography sx={{ fontSize: 10, fontWeight: 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
            {isUpcoming ? `in ${countdown}` : countdown}
          </Typography>
        </Stack>
      </Box>
      <Box
        component={Link}
        href={href}
        sx={{
          flex: 1,
          minWidth: 0,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#fff",
          color: "#1b1464",
          borderRadius: "8px",
          fontWeight: 800,
          fontSize: 12,
          letterSpacing: "-0.01em",
          "&:hover": { bgcolor: "#f4f4f4" },
        }}
      >
        {cta}
      </Box>
      {showReserve ? (
        <Box
          component={Link}
          href={href}
          aria-label="Reserve meter"
          sx={{
            width: 36,
            height: 36,
            flexShrink: 0,
            bgcolor: "#fff",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": { bgcolor: "#f4f4f4" },
          }}
        >
          <ReserveMeterGauge progress={progress} size={32} />
        </Box>
      ) : null}
    </Box>
  );
}

export function AuctionCard({ auction, view = "grid" }: AuctionCardProps) {
  const { isWatched, toggle } = useWatchlist();
  const watched = isWatched(auction.vehicle.id);
  const primaryImage = auction.vehicle.images[0];
  const isUpcoming = auction.status === "upcoming";
  const detailHref = `/vehicles/${auction.vehicle.id}`;
  const locationLabel = `${auction.vehicle.location.city}, ${auction.vehicle.location.state}`;
  const metaLine = [
    formatMileage(auction.vehicle.spec.mileage),
    transmissionLabel(auction.vehicle.spec.transmission),
    locationLabel,
  ].join(" • ");
  const listMetaLine = [String(auction.vehicle.spec.year), metaLine].join(" • ");

  if (view === "list") {
    return (
      <Card sx={{ "&:hover": { transform: "none" } }}>
        <CardActionArea
          component={Link}
          href={detailHref}
          sx={{ display: "flex", alignItems: "stretch", p: 1.5, gap: 2 }}
        >
          <Box sx={{ width: 140, height: 96, borderRadius: 2, overflow: "hidden", flexShrink: 0, bgcolor: brand.soft }}>
            {primaryImage && (
              <CardMedia component="img" image={primaryImage.url} alt={primaryImage.alt} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography fontWeight={700} noWrap>{auction.vehicle.title}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {listMetaLine}
              </Typography>
              <MarketplaceBadges auction={auction} />
            </Box>
            <Box sx={{ textAlign: "right", flexShrink: 0 }}>
              <Typography variant="caption" color="text.secondary">{isUpcoming ? "Starting bid" : "Current bid"}</Typography>
              <Typography variant="h6" fontWeight={800}>{formatPrice(auction.currentBid)}</Typography>
            </Box>
          </Box>
        </CardActionArea>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
      <Box sx={{ position: "relative" }}>
        <CardActionArea component={Link} href={detailHref}>
          <CardMedia
            component="img"
            image={primaryImage?.url}
            alt={primaryImage?.alt ?? auction.vehicle.title}
            sx={{ aspectRatio: "16/10", objectFit: "cover", bgcolor: brand.soft }}
          />
        </CardActionArea>

        {auction.status !== "completed" && (
          <Box sx={{ position: "absolute", top: 10, left: 10 }}>
            <TimeLeftBadge endTime={isUpcoming ? auction.startTime : auction.endTime} upcoming={isUpcoming} />
          </Box>
        )}

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
            width: 34,
            height: 34,
            bgcolor: watched ? brand.primary : "rgba(255,255,255,0.95)",
            color: watched ? "#fff" : brand.ink,
            boxShadow: "0 6px 16px -10px rgba(20,20,20,0.45)",
            "&:hover": { bgcolor: watched ? brand.primaryDark : "#fff" },
          }}
        >
          {watched ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
        </IconButton>
      </Box>

      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2 }}>
        <Typography
          component={Link}
          href={detailHref}
          sx={{
            fontWeight: 800,
            fontSize: "1.02rem",
            letterSpacing: "-0.02em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            color: "text.primary",
            lineHeight: 1.25,
            "&:hover": { color: "primary.main" },
          }}
        >
          {auction.vehicle.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6 }} noWrap>
          {metaLine}
        </Typography>

        <MarketplaceBadges auction={auction} />
      </CardContent>
      <AuctionAppBidBar auction={auction} href={detailHref} />
    </Card>
  );
}
