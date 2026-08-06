"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { getCountdownParts } from "@/lib/utils";
import { brand } from "@/theme/carastaTheme";

interface Props {
  endTime: string;
  /** "overlay" = compact glass pill for image overlay, "block" = boxed unit row */
  variant?: "overlay" | "block";
}

export function AuctionTimerBar({ endTime, variant = "overlay" }: Props) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const { days, hours, minutes, seconds, ended } = getCountdownParts(endTime);
  const pad = (n: number) => String(Math.max(0, n)).padStart(2, "0");

  if (variant === "overlay") {
    return (
      <Stack
        direction="row"
        spacing={0.75}
        sx={{
          alignItems: "center",
          bgcolor: "rgba(15,15,15,0.62)",
          backdropFilter: "blur(6px)",
          color: "#fff",
          px: 1.25,
          py: 0.5,
          borderRadius: 999,
          width: "fit-content",
        }}
      >
        <AccessTimeRoundedIcon sx={{ fontSize: 14, color: brand.primaryLight }} />
        <Typography sx={{ fontWeight: 700, fontSize: 12.5, letterSpacing: "0.01em", fontVariantNumeric: "tabular-nums" }}>
          {ended
            ? "Ended"
            : days > 0
              ? `${days}d ${pad(hours)}h ${pad(minutes)}m`
              : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`}
        </Typography>
      </Stack>
    );
  }

  const units = [
    { label: "Days", value: ended ? 0 : days },
    { label: "Hrs", value: ended ? 0 : hours },
    { label: "Min", value: ended ? 0 : minutes },
    { label: "Sec", value: ended ? 0 : seconds },
  ];

  return (
    <Stack direction="row" spacing={1}>
      {units.map((u) => (
        <Box
          key={u.label}
          sx={{
            textAlign: "center",
            minWidth: 46,
            py: 0.75,
            borderRadius: 1.5,
            bgcolor: brand.soft,
            border: `1px solid ${brand.border}`,
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: 16, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
            {pad(u.value)}
          </Typography>
          <Typography sx={{ fontSize: 9.5, color: brand.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {u.label}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}
