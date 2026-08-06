"use client";

import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatTimeRemaining } from "@/lib/utils";
import { brand } from "@/theme/carastaTheme";

interface CountdownTimerProps {
  endTime: string;
  showIcon?: boolean;
  size?: "sm" | "default" | "lg";
}

export function CountdownTimer({ endTime, showIcon = true, size = "default" }: CountdownTimerProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const { label, urgent } = formatTimeRemaining(endTime);
  const fontSize = size === "sm" ? 12 : size === "lg" ? 20 : 14;

  return (
    <Stack direction="row" spacing={0.5} sx={{alignItems: "center", color: urgent ? brand.urgent : "text.secondary" }}>
      {showIcon && <AccessTimeIcon sx={{ fontSize: fontSize + 2 }} />}
      <Typography
        component="span"
        sx={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontWeight: 700,
          fontSize,
          fontVariantNumeric: "tabular-nums",
          color: "inherit",
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
}
