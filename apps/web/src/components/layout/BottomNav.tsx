"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import { brand } from "@/theme/carastaTheme";

const ITEMS = [
  { href: "/", label: "Home", icon: <HomeOutlinedIcon /> },
  { href: "/auctions", label: "Auction", icon: <GavelOutlinedIcon /> },
  { href: "/list", label: "List", icon: <SellOutlinedIcon /> },
  { href: "/shop", label: "Shop", icon: <StorefrontOutlinedIcon /> },
  { href: "/carmunity", label: "Carmunity", icon: <GroupsOutlinedIcon /> },
];

export function BottomNav() {
  const pathname = usePathname();
  const value = ITEMS.findIndex((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        display: { xs: "block", sm: "none" },
        borderRadius: 0,
        borderTop: `1px solid ${brand.border}`,
      }}
    >
      <BottomNavigation
        showLabels
        value={value === -1 ? false : value}
        sx={{
          height: 64,
          "& .Mui-selected": { color: `${brand.primary} !important` },
        }}
      >
        {ITEMS.map((item) => (
          <BottomNavigationAction
            key={item.href}
            component={Link}
            href={item.href}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
