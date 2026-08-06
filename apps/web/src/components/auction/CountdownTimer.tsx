"use client";

import React, { useEffect, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatTimeRemaining } from "@/lib/utils";
import { brand } from "@/theme/carastaTheme";

interface CountdownTimerProps {
  endTime: string;
  showIcon?: boolean;
  size?: "sm" | "default" | "lg";
  /** Fired once when the countdown reaches zero. */
  onEnded?: () => void;
}

export function CountdownTimer({
  endTime,
  showIcon = true,
  size = "default",
  onEnded,
}: CountdownTimerProps) {
  const [, setTick] = useState(0);
  const endedFired = useRef(false);

  useEffect(() => {
    endedFired.current = false;
  }, [endTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      const ms = new Date(endTime).getTime() - Date.now();
      if (ms <= 0 && !endedFired.current) {
        endedFired.current = true;
        onEnded?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, onEnded]);

  const { label, urgent } = formatTimeRemaining(endTime);
  const fontSize = size === "sm" ? 12 : size === "lg" ? 20 : 14;

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{ alignItems: "center", color: urgent ? brand.urgent : "text.secondary" }}
    >
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
