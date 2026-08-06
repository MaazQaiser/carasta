"use client";

import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { brand } from "@/theme/carastaTheme";

export function AuthDivider({ label = "or continue with" }: { label?: string }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", my: 2.5 }}>
      <Divider sx={{ flex: 1 }} />
      <Typography variant="caption" sx={{ color: brand.muted, fontWeight: 600, whiteSpace: "nowrap" }}>
        {label}
      </Typography>
      <Divider sx={{ flex: 1 }} />
    </Stack>
  );
}
