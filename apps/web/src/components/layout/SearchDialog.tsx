"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";
import GavelIcon from "@mui/icons-material/Gavel";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { vehicleService } from "@carasta/mock-data/services";
import type { Vehicle } from "@carasta/types";
import { formatPrice } from "@/lib/utils";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUICK_LINKS = [
  { label: "Live Auctions", href: "/auctions?status=live", icon: <GavelIcon fontSize="small" /> },
  { label: "Ending Soon", href: "/auctions?status=ending-soon", icon: <TrendingUpIcon fontSize="small" /> },
  { label: "Porsche", href: "/auctions?make=Porsche", icon: <DirectionsCarIcon fontSize="small" /> },
  { label: "Ferrari", href: "/auctions?make=Ferrari", icon: <DirectionsCarIcon fontSize="small" /> },
];

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Vehicle[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const data = await vehicleService.search(query);
      setResults(data);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const navigate = (href: string) => {
    onOpenChange(false);
    setQuery("");
    router.push(href);
  };

  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <Box sx={{ px: 2, pt: 2, pb: 1, borderBottom: 1, borderColor: "divider" }}>
        <TextField
          autoFocus
          fullWidth
          placeholder="Search vehicles, auctions, users, brands…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Chip size="small" label="ESC" variant="outlined" sx={{ height: 22, fontSize: 10 }} />
              </InputAdornment>
            ),
          }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 999 } }}
        />
      </Box>
      <DialogContent sx={{ p: 0, maxHeight: "55vh" }}>
        {results.length > 0 && (
          <Box sx={{ p: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1.5, fontWeight: 700, letterSpacing: 0.6 }}>
              VEHICLES
            </Typography>
            <List dense>
              {results.map((v) => (
                <ListItemButton key={v.id} onClick={() => navigate(`/vehicles/${v.id}`)} sx={{ borderRadius: 2 }}>
                  <ListItemAvatar>
                    <Avatar variant="rounded" src={v.images[0]?.url} alt={v.title} sx={{ width: 48, height: 36 }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={v.title}
                    secondary={`${formatPrice(v.startingPrice)} · ${v.spec.mileage.toLocaleString()} mi`}
                    primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}

        {!query && (
          <Box sx={{ p: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1.5, fontWeight: 700, letterSpacing: 0.6 }}>
              QUICK LINKS
            </Typography>
            <List dense>
              {QUICK_LINKS.map((item) => (
                <ListItemButton key={item.href} onClick={() => navigate(item.href)} sx={{ borderRadius: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>{item.icon}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}

        {query && results.length === 0 && (
          <Stack sx={{alignItems: "center", py: 6 }} spacing={1}>
            <SearchIcon sx={{ fontSize: 40, color: "action.disabled" }} />
            <Typography color="text.secondary">No results for &quot;{query}&quot;</Typography>
            <Typography
              component="button"
              onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
              sx={{ border: 0, bgcolor: "transparent", color: "primary.main", cursor: "pointer", fontWeight: 600 }}
            >
              Search all results
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <Box sx={{ px: 2, py: 1, borderTop: 1, borderColor: "divider" }}>
        <Typography variant="caption" color="text.secondary">
          Press / or ⌘K to open · Enter to search all
        </Typography>
      </Box>
    </Dialog>
  );
}
