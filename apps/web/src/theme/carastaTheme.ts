"use client";

import { createTheme, alpha } from "@mui/material/styles";

/** Carasta brand — monochrome ink/white with red accent (matches logo & auction states) */
export const brand = {
  primary: "#C10606",
  primaryDark: "#8F0404",
  primaryLight: "#E23B3B",
  ink: "#141414",
  inkSoft: "#3A3A3A",
  muted: "#6E6E6E",
  canvas: "#F9FAFB",
  soft: "#F4F4F4",
  softer: "#FAFAFA",
  border: "#E3E3E3",
  section: "#FFFFFF",
  bid: "#C10606",
  bidHover: "#8F0404",
  urgent: "#C10606",
  success: "#1F9D55",
  nav: "#141414",
} as const;

const FONT = '"Inter", var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

declare module "@mui/material/styles" {
  interface Palette {
    bid: Palette["primary"];
  }
  interface PaletteOptions {
    bid?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    bid: true;
  }
}

export const carastaTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: brand.ink,
      dark: "#000000",
      light: brand.inkSoft,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: brand.primary,
      dark: brand.primaryDark,
      light: brand.primaryLight,
      contrastText: "#FFFFFF",
    },
    bid: {
      main: brand.bid,
      dark: brand.bidHover,
      light: brand.primaryLight,
      contrastText: "#FFFFFF",
    },
    error: { main: brand.urgent },
    success: { main: brand.success },
    background: {
      default: brand.canvas,
      paper: brand.section ?? "#FFFFFF",
    },
    text: {
      primary: brand.ink,
      secondary: brand.muted,
    },
    divider: brand.border,
  },
  typography: {
    fontFamily: FONT,
    h1: { fontFamily: FONT, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.05 },
    h2: { fontFamily: FONT, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08 },
    h3: { fontFamily: FONT, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.12 },
    h4: { fontFamily: FONT, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 },
    h5: { fontFamily: FONT, fontWeight: 700, letterSpacing: "-0.015em" },
    h6: { fontFamily: FONT, fontWeight: 700, letterSpacing: "-0.01em" },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600, letterSpacing: "-0.005em" },
    body1: { lineHeight: 1.65 },
    body2: { lineHeight: 1.6 },
    overline: { fontWeight: 700, letterSpacing: "0.16em" },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "-0.005em",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: brand.canvas,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        a: {
          color: "inherit",
          textDecoration: "none",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: false },
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingInline: 22,
          fontWeight: 600,
        },
        contained: {
          color: "#FFFFFF",
        },
        containedPrimary: {
          color: "#FFFFFF",
          "&:hover": { backgroundColor: "#000000", color: "#FFFFFF" },
        },
        containedSecondary: {
          backgroundColor: brand.primary,
          color: "#FFFFFF",
          "&:hover": { backgroundColor: brand.primaryDark, color: "#FFFFFF" },
        },
        outlined: {
          borderColor: alpha(brand.ink, 0.22),
          color: brand.ink,
          "&:hover": {
            borderColor: brand.ink,
            backgroundColor: alpha(brand.ink, 0.03),
          },
        },
        sizeLarge: {
          paddingBlock: 12,
          paddingInline: 28,
          fontSize: "0.95rem",
        },
        text: {
          paddingInline: 10,
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: `1px solid ${brand.border}`,
          borderRadius: 8,
          boxShadow: "none",
          transition: "border-color 0.2s ease, box-shadow 0.25s ease, transform 0.25s ease",
          "&:hover": {
            borderColor: alpha(brand.ink, 0.18),
            boxShadow: "0 12px 30px -12px rgba(20,20,20,0.18)",
            transform: "translateY(-3px)",
          },
        },
      },
    },
    MuiAppBar: {
      defaultProps: { color: "inherit", elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: brand.ink,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, letterSpacing: "-0.005em" },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "#FFFFFF",
        },
      },
    },
  },
});
