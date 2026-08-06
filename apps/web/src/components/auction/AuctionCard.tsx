"use client";

import React from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import type { Auction } from "@carasta/types";
import { AuctionTimerBar } from "./AuctionTimerBar";
import { formatPrice, formatMileage } from "@/lib/utils";
import { useWatchlist } from "@/lib/context/watchlist-context";
import { brand } from "@/theme/carastaTheme";

interface AuctionCardProps {
  auction: Auction;
  view?: "grid" | "list";
}

export function AuctionCard({ auction, view = "grid" }: AuctionCardProps) {
  const { isWatched, toggle } = useWatchlist();
  const watched = isWatched(auction.vehicle.id);
  const primaryImage = auction.vehicle.images[0];
  const isLive = auction.status === "live";

  if (view === "list") {
    return (
      <Card sx={{ "&:hover": { transform: "none" } }}>
        <CardActionArea
          component={Link}
          href={`/auctions/${auction.vehicle.id}`}
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
              <Typography variant="body2" color="text.secondary">
                {formatMileage(auction.vehicle.spec.mileage)} · {auction.vehicle.location.city}, {auction.vehicle.location.state}
              </Typography>
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
        <CardActionArea component={Link} href={`/auctions/${auction.vehicle.id}`}>
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
          href={`/auctions/${auction.vehicle.id}`}
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
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {formatMileage(auction.vehicle.spec.mileage)} · {auction.vehicle.spec.transmission}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-end", mt: "auto" }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.2 }}>
              Current bid
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
