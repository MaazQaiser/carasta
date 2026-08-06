"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { CarastaLogo } from "@/components/brand/CarastaLogo";
import { useAuth } from "@/lib/context/auth-context";
import { brand } from "@/theme/carastaTheme";

const NAV_LINKS = [
  { href: "/", label: "Home", exact: true },
  { href: "/auctions", label: "Auctions" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/carmunity", label: "Carmunity" },
];

/** Circular badge diameter — half sits below the header bar */
const LOGO_SIZE = 80;
/** White pocket behind the badge (slightly larger) */
const LOGO_TAB = 94;

export function TopNav() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          px: "18px",
          pt: "18px",
          bgcolor: "transparent",
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        <Stack
          direction="row"
          sx={{
            position: "relative",
            pointerEvents: "auto",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 64,
            px: { xs: 1.5, md: 2.5 },
            py: 1,
            bgcolor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 8px 28px -18px rgba(20,20,20,0.28)",
            gap: 1.5,
            overflow: "visible",
          }}
        >
          {/* Badge: centerline on bottom edge of bar, white pocket tab behind */}
          <Box
            component={Link}
            href="/"
            aria-label="Carasta home"
            sx={{
              position: "absolute",
              left: { xs: 52, md: 28 },
              bottom: 8,
              transform: "translateY(50%)",
              width: LOGO_SIZE,
              height: LOGO_SIZE,
              zIndex: 2,
              display: "block",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: LOGO_TAB,
                height: LOGO_TAB,
                borderRadius: "50%",
                bgcolor: "#fff",
                boxShadow: "0 10px 24px -16px rgba(20,20,20,0.35)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                width: LOGO_SIZE,
                height: LOGO_SIZE,
                borderRadius: "50%",
                overflow: "hidden",
                bgcolor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CarastaLogo size={LOGO_SIZE} />
            </Box>
          </Box>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexShrink: 0 }}>
            <IconButton
              sx={{ display: { md: "none" }, ml: -0.5 }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
            {/* Layout spacer matching badge width */}
            <Box sx={{ width: LOGO_SIZE, flexShrink: 0 }} />
          </Stack>

          {/* Black pill nav — desktop */}
          <Stack
            direction="row"
            spacing={0.35}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              bgcolor: brand.ink,
              borderRadius: 999,
              px: 0.6,
              py: 0.55,
            }}
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href, link.exact);
              return (
                <Button
                  key={link.label}
                  component={Link}
                  href={link.href}
                  disableRipple
                  size="small"
                  sx={{
                    color: active ? brand.ink : "rgba(255,255,255,0.78)",
                    bgcolor: active ? "#fff" : "transparent",
                    fontWeight: active ? 700 : 500,
                    px: 2,
                    py: 0.7,
                    minWidth: 0,
                    borderRadius: 999,
                    fontSize: 13.5,
                    "&:hover": {
                      color: active ? brand.ink : "#fff",
                      bgcolor: active ? "#fff" : "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexShrink: 0 }}>
            {isAuthenticated && user ? (
              <IconButton component={Link} href="/profile" sx={{ p: 0.25 }}>
                <Avatar
                  src={user.avatar?.url}
                  sx={{ width: 36, height: 36, bgcolor: brand.primary, fontSize: 14, fontWeight: 700 }}
                >
                  {user.displayName.slice(0, 1)}
                </Avatar>
              </IconButton>
            ) : (
              <Button
                component={Link}
                href="/sign-in"
                variant="contained"
                color="secondary"
                size="small"
                sx={{
                  borderRadius: 999,
                  px: 2.5,
                  py: 1,
                  fontWeight: 700,
                  bgcolor: brand.primary,
                  "&:hover": { bgcolor: brand.primaryDark },
                }}
              >
                Log in
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>

      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 288 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", p: 2 }}>
            <CarastaLogo size={22} />
            <IconButton onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider />
          <List>
            {NAV_LINKS.map((link) => (
              <ListItemButton
                key={link.label}
                component={Link}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                selected={isActive(link.href, link.exact)}
              >
                <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            ))}
            <ListItemButton component={Link} href="/list/new" onClick={() => setMobileOpen(false)}>
              <ListItemText
                primary="List your car"
                primaryTypographyProps={{ fontWeight: 700, color: brand.primary }}
              />
            </ListItemButton>
          </List>
          {!isAuthenticated && (
            <Stack spacing={1} sx={{ p: 2 }}>
              <Button
                component={Link}
                href="/sign-up"
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => setMobileOpen(false)}
                sx={{ borderRadius: 999 }}
              >
                Sign up
              </Button>
              <Button
                component={Link}
                href="/sign-in"
                fullWidth
                variant="outlined"
                onClick={() => setMobileOpen(false)}
                sx={{ borderRadius: 999 }}
              >
                Log in
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>
    </>
  );
}
