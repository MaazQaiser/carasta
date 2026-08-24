"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { CarastaLogo } from "@/components/brand/CarastaLogo";
import { brand } from "@/theme/carastaTheme";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Auctions",
    links: [
      { label: "Browse cars", href: "/auctions" },
      { label: "List your car", href: "/listing" },
      { label: "Shop", href: "/shop" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Carmunity", href: "/carmunity" },
      { label: "Contact", href: "/support" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "/support" },
      { label: "FAQ", href: "/faq" },
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (pathname.startsWith("/mobile-listing")) {
    return null;
  }

  return (
    <Box component="footer" sx={{ display: { xs: "none", sm: "block" }, bgcolor: brand.ink, color: "#fff" }}>
      <Container maxWidth="xl" sx={{ pt: 8, pb: 4 }}>
        <Grid2 container spacing={{ xs: 4, md: 6 }}>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <CarastaLogo inverted size={26} />
            <Typography variant="body2" sx={{ mt: 2.5, color: "rgba(255,255,255,0.6)", maxWidth: 300, mb: 3 }}>
              A curated auctions platform for enthusiast vehicles — transparent bidding, verified sellers, and a community that knows cars.
            </Typography>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Get auction alerts
            </Typography>
            {subscribed ? (
              <Typography variant="body2" sx={{ color: brand.primaryLight, fontWeight: 600 }}>
                You&apos;re on the list — thanks!
              </Typography>
            ) : (
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setSubscribed(true);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  maxWidth: 340,
                  pl: 2,
                  pr: 0.5,
                  py: 0.5,
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.18)",
                  "&:focus-within": { borderColor: "rgba(255,255,255,0.4)" },
                }}
              >
                <InputBase
                  fullWidth
                  type="email"
                  required
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ color: "#fff", fontSize: 14, "&::placeholder": { color: "rgba(255,255,255,0.5)" } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    borderRadius: 999,
                    minWidth: 0,
                    px: 2,
                    py: 0.75,
                    bgcolor: brand.primary,
                    "&:hover": { bgcolor: brand.primaryDark },
                  }}
                >
                  <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
                </Button>
              </Box>
            )}
          </Grid2>

          {COLUMNS.map((col) => (
            <Grid2 key={col.title} size={{ xs: 6, md: 8 / 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                {col.title}
              </Typography>
              <Stack spacing={1.25}>
                {col.links.map((link) => (
                  <Typography
                    key={link.label}
                    component={Link}
                    href={link.href}
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.6)", "&:hover": { color: "#fff" } }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Stack>
            </Grid2>
          ))}
        </Grid2>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}
        >
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)" }}>
            © {new Date().getFullYear()} Carasta® LLC. All rights reserved.
          </Typography>
          <Typography
            component={Link}
            href="https://play.google.com/store/apps/details?id=com.hidden_cherry_45273"
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.45)", "&:hover": { color: "#fff" } }}
          >
            Get the Carasta app
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
