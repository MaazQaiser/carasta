"use client";

import React from "react";
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
import Divider from "@mui/material/Divider";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import type { Auction, MarketplaceListingType, MarketplaceSaleType } from "@carasta/types";
import { AuctionTimerBar } from "./AuctionTimerBar";
import { formatPrice, formatMileage } from "@/lib/utils";
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
  height: 20,
  fontSize: 10,
  fontWeight: 600,
  "& .MuiChip-label": { px: 0.75 },
} as const;

interface AuctionCardProps {
  auction: Auction;
  view?: "grid" | "list";
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function MarketplaceBadges({ auction }: { auction: Auction }) {
  const { vehicle } = auction;
  const listingLabel = vehicle.listingType
    ? LISTING_TYPE_LABELS[vehicle.listingType]
    : undefined;
  const saleLabel = vehicle.saleType
    ? SALE_TYPE_LABELS[vehicle.saleType]
    : auction.reservePrice
      ? SALE_TYPE_LABELS["reserve-auction"]
      : undefined;

  return (
    <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap" sx={{ mt: 0.75, rowGap: 0.5 }}>
      <Chip size="small" label={capitalize(vehicle.condition)} sx={chipSx} />
      {listingLabel ? <Chip size="small" variant="outlined" label={listingLabel} sx={chipSx} /> : null}
      {saleLabel ? <Chip size="small" variant="outlined" label={saleLabel} sx={chipSx} /> : null}
      {vehicle.vinVerified ? <Chip size="small" color="primary" variant="outlined" label="VIN Verified" sx={chipSx} /> : null}
      {vehicle.documentsAvailable ? (
        <Chip size="small" color="primary" variant="outlined" label="Documents Available" sx={chipSx} />
      ) : null}
      {vehicle.carastaVerified ? (
        <Chip size="small" color="primary" label="Carasta Verified" sx={chipSx} />
      ) : null}
    </Stack>
  );
}

export function AuctionCard({ auction, view = "grid" }: AuctionCardProps) {
  const { isWatched, toggle } = useWatchlist();
  const watched = isWatched(auction.vehicle.id);
  const primaryImage = auction.vehicle.images[0];
  const isLive = auction.status === "live";
  const detailHref = `/vehicles/${auction.vehicle.id}`;
  const locationLabel = `${auction.vehicle.location.city}, ${auction.vehicle.location.state}`;
  const metaLine = [
    String(auction.vehicle.spec.year),
    formatMileage(auction.vehicle.spec.mileage),
    capitalize(auction.vehicle.spec.transmission),
    locationLabel,
  ].join(" · ");

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
                {metaLine}
              </Typography>
              <MarketplaceBadges auction={auction} />
            </Box>
            <Box sx={{ textAlign: "right", flexShrink: 0 }}>
              <Typography variant="caption" color="text.secondary">Current bid</Typography>
              <Typography variant="h6" fontWeight={800}>{formatPrice(auction.currentBid)}</Typography>
            </Box>
          </Box>
        </CardActionArea>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Box sx={{ position: "relative" }}>
        <CardActionArea component={Link} href={detailHref}>
          <CardMedia
            component="img"
            image={primaryImage?.url}
            alt={primaryImage?.alt ?? auction.vehicle.title}
            sx={{ aspectRatio: "4/3", objectFit: "cover", bgcolor: brand.soft }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 42%)",
              pointerEvents: "none",
            }}
          />
        </CardActionArea>

        {isLive && (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              alignItems: "center",
              bgcolor: brand.urgent,
              color: "#fff",
              px: 1,
              py: 0.35,
              borderRadius: 999,
            }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#fff" }} />
            <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em" }}>LIVE</Typography>
          </Stack>
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
            bgcolor: watched ? brand.primary : "rgba(255,255,255,0.92)",
            color: watched ? "#fff" : brand.ink,
            backdropFilter: "blur(4px)",
            "&:hover": { bgcolor: watched ? brand.primaryDark : "#fff" },
          }}
        >
          {watched ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
        </IconButton>

        {auction.status !== "completed" && (
          <Box sx={{ position: "absolute", left: 12, bottom: 12 }}>
            <AuctionTimerBar endTime={auction.endTime} variant="overlay" />
          </Box>
        )}
      </Box>

      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2 }}>
        <Typography
          component={Link}
          href={detailHref}
          sx={{
            fontWeight: 700,
            fontSize: "1.02rem",
            letterSpacing: "-0.01em",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            color: "text.primary",
            "&:hover": { color: "primary.main" },
          }}
        >
          {auction.vehicle.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }} noWrap>
          {metaLine}
        </Typography>

        <MarketplaceBadges auction={auction} />

        <Divider sx={{ my: 1.5 }} />

        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-end", mt: "auto" }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.2 }}>
              {auction.vehicle.saleType === "buy-it-now" ? "Price" : "Current bid"}
            </Typography>
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
              {formatPrice(auction.currentBid)}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: brand.muted }}>
            <GavelRoundedIcon sx={{ fontSize: 15 }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {auction.bidCount ?? 0} bids
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
