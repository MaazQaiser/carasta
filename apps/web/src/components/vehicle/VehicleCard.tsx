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
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import type { Vehicle } from "@carasta/types";
import { formatPrice, formatMileage } from "@/lib/utils";
import { useWatchlist } from "@/lib/context/watchlist-context";
import { useCompare } from "@/lib/context/compare-context";
import { brand } from "@/theme/carastaTheme";

interface VehicleCardProps {
  vehicle: Vehicle;
  view?: "grid" | "list";
  showCompare?: boolean;
}

export function VehicleCard({ vehicle, view = "grid", showCompare = false }: VehicleCardProps) {
  const { isWatched, toggle: toggleWatch } = useWatchlist();
  const { isInCompare, toggle: toggleCompare, canAdd } = useCompare();
  const watched = isWatched(vehicle.id);
  const inCompare = isInCompare(vehicle.id);
  const primaryImage = vehicle.images[0];

  if (view === "list") {
    return (
      <Card sx={{ "&:hover": { transform: "none" } }}>
        <CardActionArea component={Link} href={`/vehicles/${vehicle.id}`} sx={{ display: "flex", p: 1.5, gap: 2 }}>
          <Box sx={{ width: 140, height: 96, borderRadius: 2, overflow: "hidden", flexShrink: 0, bgcolor: "grey.100" }}>
            {primaryImage && (
              <CardMedia component="img" image={primaryImage.url} alt={primaryImage.alt} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography fontWeight={700} noWrap>{vehicle.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatMileage(vehicle.spec.mileage)} · {vehicle.spec.transmission} · {vehicle.location.city}, {vehicle.location.state}
              </Typography>
              <Stack direction="row" spacing={0.75} sx={{ mt: 0.75 }}>
                <Chip size="small" label={vehicle.condition} sx={{ textTransform: "capitalize", height: 22, fontSize: 11 }} />
                {vehicle.spec.fuelType === "electric" && <Chip size="small" label="EV" color="primary" sx={{ height: 22, fontSize: 11 }} />}
              </Stack>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h6" fontWeight={800} color="primary.main">{formatPrice(vehicle.startingPrice)}</Typography>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", justifyContent: "flex-end" }}>
                <VisibilityOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">{vehicle.views.toLocaleString()}</Typography>
              </Stack>
            </Box>
          </Box>
        </CardActionArea>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ position: "relative" }}>
        <CardActionArea component={Link} href={`/vehicles/${vehicle.id}`}>
          <CardMedia
            component="img"
            image={primaryImage?.url}
            alt={primaryImage?.alt ?? vehicle.title}
            sx={{ aspectRatio: "16/10", objectFit: "cover", bgcolor: "grey.100" }}
          />
        </CardActionArea>
        <Stack spacing={1} sx={{ position: "absolute", top: 8, right: 8 }}>
          <IconButton
            size="small"
            onClick={() => toggleWatch(vehicle.id)}
            sx={{ bgcolor: watched ? brand.urgent : "rgba(0,0,0,0.35)", color: "#fff", "&:hover": { bgcolor: watched ? "#B71C1C" : "rgba(0,0,0,0.55)" } }}
          >
            {watched ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
          {showCompare && (
            <IconButton
              size="small"
              disabled={!canAdd && !inCompare}
              onClick={() => toggleCompare(vehicle.id)}
              sx={{ bgcolor: inCompare ? brand.primary : "rgba(0,0,0,0.35)", color: "#fff" }}
            >
              <CompareArrowsIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
        {vehicle.status === "in-auction" && (
          <Box sx={{ position: "absolute", top: 12, left: 12 }}>
            <Chip size="small" label="● LIVE" color="error" sx={{ fontWeight: 700 }} />
          </Box>
        )}
      </Box>
      <CardContent sx={{ flex: 1 }}>
        <Typography
          component={Link}
          href={`/vehicles/${vehicle.id}`}
          fontWeight={700}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            color: "text.primary",
            mb: 0.5,
            "&:hover": { color: "primary.main" },
          }}
        >
          {vehicle.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
          {formatMileage(vehicle.spec.mileage)} · {vehicle.spec.transmission} · {vehicle.location.city}, {vehicle.location.state}
        </Typography>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {vehicle.status === "in-auction" ? "Current Bid" : "Asking Price"}
            </Typography>
            <Typography variant="h5" fontWeight={800} color="primary.main">{formatPrice(vehicle.startingPrice)}</Typography>
          </Box>
          <Chip size="small" label={vehicle.condition} sx={{ textTransform: "capitalize" }} />
        </Stack>
      </CardContent>
    </Card>
  );
}
