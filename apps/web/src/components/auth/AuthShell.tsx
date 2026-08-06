"use client";

import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CarastaLogo } from "@/components/brand/CarastaLogo";
import { brand } from "@/theme/carastaTheme";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: number;
  showLogo?: boolean;
}

export function AuthShell({
  title,
  subtitle,
  children,
  maxWidth = 420,
  showLogo = true,
}: AuthShellProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        px: 2,
        py: { xs: 2, md: 4 },
        minHeight: "calc(100vh - 180px)",
      }}
    >
      <Box sx={{ width: "100%", maxWidth }}>
        <Stack spacing={1.5} sx={{ alignItems: "center", textAlign: "center", mb: 3.5 }}>
          {showLogo && <CarastaLogo size={52} />}
          <Typography variant="h4" sx={{ fontWeight: 800, color: brand.ink, mt: 0.5 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: brand.muted, maxWidth: 340 }}>
              {subtitle}
            </Typography>
          )}
        </Stack>

        <Box
          sx={{
            bgcolor: "#fff",
            border: `1px solid ${brand.border}`,
            borderRadius: 3,
            p: { xs: 2.5, sm: 3.5 },
            boxShadow: "0 12px 40px -24px rgba(20,20,20,0.25)",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
