"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { carastaTheme } from "./carastaTheme";

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // NOTE: `enableCssLayer` is intentionally OFF.
  // Next's CSS pipeline emits Tailwind preflight *unlayered*, so putting MUI in
  // `@layer mui` made rules like `a { color: inherit }` beat contained-button
  // contrast text — hero CTAs rendered black-on-black. With layers off, MUI
  // class specificity wins over Tailwind's element selectors as expected.
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={carastaTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
