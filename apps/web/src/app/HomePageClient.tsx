"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Grid2 from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import type { Auction, AuctionSortField, Post, Vehicle } from "@carasta/types";
import { AuctionCard } from "@/components/auction/AuctionCard";
import { HomeCarmunityFeed } from "@/components/community/HomeCarmunityFeed";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { formatPrice, formatRelativeTime, truncate } from "@/lib/utils";
import { brand } from "@/theme/carastaTheme";
import { mergePublishedAuctions, sortAuctions } from "@/lib/marketplace-listings";
import { pickHomepageUpcoming } from "@/lib/homepage-upcoming";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";

const HERO_FALLBACK = {
  href: "/auctions",
  image:
    "https://images.unsplash.com/photo-1750957823101-87ec89cf6862?w=1400&auto=format&fit=crop",
  title: "1963 Jaguar E-Type Series 1",
  specs: "Matching numbers • 3.8L Inline-6 • 4-Speed",
  bid: 155000,
  timeLeft: "72h",
} as const;

function transmissionLabel(transmission: Vehicle["spec"]["transmission"]): string {
  if (transmission === "manual") return "4-Speed";
  if (transmission === "automatic") return "Automatic";
  if (transmission === "semi-automatic") return "Semi-Auto";
  return transmission.toUpperCase();
}

function heroSpecLine(vehicle: Vehicle): string {
  const matching = vehicle.features?.find((feature) => /matching/i.test(feature));
  return [matching, vehicle.spec.engineSize, transmissionLabel(vehicle.spec.transmission)]
    .filter(Boolean)
    .join(" • ");
}

function compactHoursLeft(endTime: string): string {
  const ms = new Date(endTime).getTime() - Date.now();
  if (ms <= 0) return "0h";
  const hours = Math.round(ms / 3600000);
  if (hours < 1) return `${Math.max(1, Math.round(ms / 60000))}m`;
  return `${hours}h`;
}

function TimeLeftBadge({ label }: { label: string }) {
  return (
    <Box
      sx={{
        position: "relative",
        width: { xs: 76, md: 88 },
        height: { xs: 76, md: 88 },
        flexShrink: 0,
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 88 88"
        sx={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <circle cx="44" cy="44" r="41" fill="#fff" stroke="rgba(20,20,20,0.22)" strokeWidth="1.5" />
        <circle
          cx="44"
          cy="44"
          r="41"
          fill="none"
          stroke={brand.primary}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="92 166"
          transform="rotate(105 44 44)"
        />
      </Box>
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 1,
          textAlign: "center",
        }}
      >
        <Typography
          fontWeight={800}
          sx={{ fontSize: { xs: 18, md: 22 }, lineHeight: 1, color: brand.ink, letterSpacing: "-0.03em" }}
        >
          {label}
        </Typography>
        <Typography sx={{ mt: 0.35, fontSize: 10, fontWeight: 500, color: brand.inkSoft, lineHeight: 1 }}>
          Time left
        </Typography>
      </Box>
    </Box>
  );
}

interface Props {
  featuredAuctions: Auction[];
  endingSoon: Auction[];
  upcomingAuctions: Auction[];
  communityHighlights: Post[];
  carmunityPosts: Post[];
}

/** White rounded section card inset on gray-50 page canvas */
function SectionCard({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: object;
}) {
  return (
    <Box
      sx={{
        mx: "18px",
        mb: "18px",
        bgcolor: "#fff",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 8px 28px -22px rgba(20,20,20,0.22)",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function SectionInner({ children, sx }: { children: React.ReactNode; sx?: object }) {
  return (
    <Box sx={{ px: { xs: 2.5, md: 4, lg: 5 }, py: { xs: 4, md: 6 }, ...sx }}>
      {children}
    </Box>
  );
}

function SectionHeader({
  eyebrow,
  title,
  href,
  cta = "View all",
}: {
  eyebrow: string;
  title: string;
  href?: string;
  cta?: string;
}) {
  return (
    <Stack
      direction="row"
      sx={{ justifyContent: "space-between", alignItems: "flex-end", mb: { xs: 3, md: 4 }, gap: 2 }}
    >
      <Box>
        <Typography
          sx={{
            color: brand.primary,
            fontWeight: 700,
            fontSize: 12.5,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            mb: 1,
          }}
        >
          {eyebrow}
        </Typography>
        <Typography variant="h4" sx={{ fontSize: { xs: "1.6rem", md: "2rem" } }}>
          {title}
        </Typography>
      </Box>
      {href && (
        <Button
          component={Link}
          href={href}
          endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{ color: brand.ink, flexShrink: 0, "&:hover": { color: brand.primary, bgcolor: "transparent" } }}
        >
          {cta}
        </Button>
      )}
    </Stack>
  );
}

function HeroCommunityCard({ posts }: { posts: Post[] }) {
  const highlights = posts.filter((post) => post.images[0]).slice(0, 2);
  if (highlights.length === 0) return null;

  return (
    <Box
      sx={{
        width: { xs: "100%", md: 260, lg: 280 },
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignSelf: "stretch",
        bgcolor: "#fff",
        borderRadius: "20px",
        p: 2,
        boxShadow: "0 18px 40px -18px rgba(20,20,20,0.35)",
      }}
    >
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.75 }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.02em",
            color: brand.ink,
          }}
        >
          From the community
        </Typography>
        <Stack
          component={Link}
          href="/carmunity"
          direction="row"
          spacing={0.25}
          sx={{
            alignItems: "center",
            fontSize: 12,
            fontWeight: 700,
            color: brand.ink,
            textDecoration: "none",
            "&:hover": { color: brand.primary },
          }}
        >
          View all
          <ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />
        </Stack>
      </Stack>

      <Stack spacing={2}>
        {highlights.map((post) => {
          const image = post.images[0]!;
          return (
            <Box
              key={post.id}
              component={Link}
              href="/carmunity"
              sx={{ display: "block", color: "inherit", textDecoration: "none" }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                <Avatar src={post.author.avatar?.url} alt={post.author.displayName} sx={{ width: 28, height: 28 }} />
                <Stack direction="row" spacing={0.75} sx={{ alignItems: "baseline", minWidth: 0, flex: 1 }}>
                  <Typography noWrap sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
                    {post.author.displayName}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: brand.muted, flexShrink: 0 }}>
                    {formatRelativeTime(post.createdAt)}
                  </Typography>
                </Stack>
                <MoreHorizIcon sx={{ fontSize: 16, color: brand.muted, flexShrink: 0 }} />
              </Stack>
              <Box
                sx={{
                  height: 96,
                  borderRadius: "12px",
                  overflow: "hidden",
                  bgcolor: brand.soft,
                  mb: 1,
                }}
              >
                <Box
                  component="img"
                  src={image.url}
                  alt={image.alt}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              {post.caption ? (
                <Typography sx={{ fontSize: 13, lineHeight: 1.4, color: brand.ink, mb: 0.75 }}>
                  {truncate(post.caption, 72)}
                </Typography>
              ) : null}
              <Stack direction="row" spacing={1.75} sx={{ color: brand.muted }}>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                  <FavoriteBorderIcon sx={{ fontSize: 16 }} />
                  <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{post.likes.toLocaleString()}</Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                  <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
                  <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{post.commentCount.toLocaleString()}</Typography>
                </Stack>
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

function AuctionGrid({ auctions, columns = 4 }: { auctions: Auction[]; columns?: 3 | 4 }) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2.5,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: `repeat(${columns}, minmax(0, 1fr))`,
        },
      }}
    >
      {auctions.map((auction) => (
        <Box key={auction.id} sx={{ minWidth: 0 }}>
          <AuctionCard auction={auction} />
        </Box>
      ))}
    </Box>
  );
}

export function HomePageClient({
  featuredAuctions,
  endingSoon,
  upcomingAuctions,
  communityHighlights,
  carmunityPosts,
}: Props) {
  const [contact, setContact] = useState({ first: "", last: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [featured, setFeatured] = useState(featuredAuctions);
  const [soon, setSoon] = useState(endingSoon);
  const [upcoming, setUpcoming] = useState(upcomingAuctions);
  const [latestPage, setLatestPage] = useState(0);
  const [auctionQuery, setAuctionQuery] = useState("");
  const [auctionSort, setAuctionSort] = useState<AuctionSortField>("ending-soon");

  useEffect(() => {
    setFeatured(mergePublishedAuctions(featuredAuctions, { sort: "newest" }));
    setSoon(
      mergePublishedAuctions(endingSoon, {
        filters: { status: ["live", "ending-soon"] },
        sort: "ending-soon",
      })
    );
    setUpcoming(pickHomepageUpcoming(upcomingAuctions));
  }, [featuredAuctions, endingSoon, upcomingAuctions]);

  const endingSoonList = soon.slice(0, 4);
  const upcomingList = upcoming.slice(0, 3);
  const latestPool = (() => {
    const first = endingSoonList;
    const seen = new Set(first.map((auction) => auction.id));
    const upcomingFill = upcomingAuctions.filter((auction) => !seen.has(auction.id)).slice(0, 4);
    upcomingFill.forEach((auction) => seen.add(auction.id));
    const liveFill = featured.filter((auction) => !seen.has(auction.id)).slice(0, Math.max(0, 4 - upcomingFill.length));
    return [...first, ...upcomingFill, ...liveFill];
  })();
  const queriedLatest = latestPool.filter((auction) => {
    const q = auctionQuery.trim().toLowerCase();
    if (!q) return true;
    const { vehicle } = auction;
    return [vehicle.title, vehicle.spec.make, vehicle.spec.model, String(vehicle.spec.year)]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });
  const sortedLatest = sortAuctions(queriedLatest, auctionSort);
  const LATEST_PAGE_SIZE = 4;
  const latestVisible = sortedLatest.slice(
    latestPage * LATEST_PAGE_SIZE,
    latestPage * LATEST_PAGE_SIZE + LATEST_PAGE_SIZE
  );
  const canPrevLatest = latestPage > 0;
  const canNextLatest = (latestPage + 1) * LATEST_PAGE_SIZE < sortedLatest.length;
  const heroAuction =
    featured.find((auction) => auction.vehicle.id === "v-002") ??
    featured.find((auction) => /jaguar/i.test(auction.vehicle.title)) ??
    featured[0];
  const hero = heroAuction
    ? {
        href: `/vehicles/${heroAuction.vehicle.id}`,
        image: heroAuction.vehicle.images[0]?.url ?? HERO_FALLBACK.image,
        title: heroAuction.vehicle.title.replace(/\s+\d+\.\d+\s+Coupe$/i, ""),
        specs: heroSpecLine(heroAuction.vehicle) || HERO_FALLBACK.specs,
        bid: heroAuction.currentBid,
        timeLeft: compactHoursLeft(heroAuction.endTime),
      }
    : HERO_FALLBACK;

  return (
    <Box sx={{ bgcolor: brand.canvas, pb: "18px" }}>
      {/* Hero section card */}
      <SectionCard>
        <SectionInner sx={{ py: { xs: 4, md: 7 } }}>
          <Grid2 container spacing={{ xs: 4, md: 4 }} sx={{ alignItems: "center" }}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography
                variant="h1"
                component="h1"
                sx={{ fontSize: { xs: "2.4rem", md: "2.65rem", lg: "3.2rem" }, mb: 2.5, lineHeight: 1.08 }}
              >
                Built by{" "}
                <Box component="span" sx={{ color: brand.primary }}>
                  enthusiasts
                </Box>
                {" For "}
                <Box component="span" sx={{ color: brand.primary }}>
                  enthusiasts
                </Box>
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: "1rem", lineHeight: 1.65, mb: 4, maxWidth: 520 }}>
                Discover, buy, and sell enthusiast vehicles, then connect with the cars, owners, and stories you love through our growing Carmunity.
              </Typography>
              <Stack spacing={1.25} sx={{ width: "100%", maxWidth: 360 }}>
                <Button
                  component={Link}
                  href="/auctions"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    width: "100%",
                    borderRadius: 999,
                    bgcolor: brand.ink,
                    color: "#fff",
                    px: 2.5,
                    py: 1.15,
                    whiteSpace: "nowrap",
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#000", boxShadow: "none" },
                  }}
                >
                  Browse auctions
                </Button>
                <Button
                  component={Link}
                  href="/carmunity"
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    width: "100%",
                    borderRadius: 999,
                    bgcolor: "transparent",
                    color: brand.ink,
                    border: `1.5px solid ${brand.ink}`,
                    px: 2.5,
                    py: 1.15,
                    whiteSpace: "nowrap",
                    boxShadow: "none",
                    "&:hover": { bgcolor: brand.ink, color: "#fff", borderColor: brand.ink },
                  }}
                >
                  Explore the Carmunity
                </Button>
              </Stack>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 8 }}>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "stretch",
                  gap: 2,
                }}
              >
                {/* Vertical social strip */}
                <Stack
                  spacing={0}
                  sx={{
                    position: "absolute",
                    left: { xs: 8, md: -20 },
                    top: { xs: "38%", md: "50%" },
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    display: { xs: "none", sm: "flex" },
                    bgcolor: "#fff",
                    borderRadius: 999,
                    py: 1.25,
                    px: 0.75,
                    boxShadow: "0 12px 28px -14px rgba(20,20,20,0.35)",
                    gap: 0.75,
                  }}
                >
                  {[FacebookRoundedIcon, InstagramIcon, LinkedInIcon, XIcon].map((Icon, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        color: brand.ink,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "default",
                        "&:hover": { color: brand.primary },
                      }}
                    >
                      <Icon sx={{ fontSize: 16 }} />
                    </Box>
                  ))}
                </Stack>

                <Box
                  sx={{
                    position: "relative",
                    flex: 1,
                    minWidth: 0,
                    minHeight: { xs: 300, md: 440 },
                    height: { xs: 300, md: "auto" },
                    alignSelf: "stretch",
                    borderRadius: "20px",
                    overflow: "hidden",
                    bgcolor: brand.soft,
                    boxShadow: "0 18px 40px -22px rgba(0,0,0,0.45)",
                  }}
                >
                  <Box
                    component="img"
                    src={hero.image}
                    alt={hero.title}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.08) 38%, rgba(0,0,0,0.12) 58%, rgba(0,0,0,0.62) 100%)",
                    }}
                  />

                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 1,
                      p: { xs: 2.25, md: 3 },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
                      <Box sx={{ minWidth: 0, pr: 1 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: brand.primary, flexShrink: 0 }} />
                          <Typography
                            sx={{
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: { xs: 11, md: 12 },
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                            }}
                          >
                            Featured Auction
                          </Typography>
                        </Stack>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: { xs: "1.35rem", md: "1.85rem" },
                            lineHeight: 1.15,
                            letterSpacing: "-0.03em",
                          }}
                        >
                          {hero.title}
                        </Typography>
                        {hero.specs ? (
                          <Typography sx={{ mt: 0.75, color: "rgba(255,255,255,0.92)", fontSize: { xs: 13, md: 14.5 }, fontWeight: 500 }}>
                            {hero.specs}
                          </Typography>
                        ) : null}
                      </Box>
                      <TimeLeftBadge label={hero.timeLeft} />
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ alignItems: "flex-end", justifyContent: "space-between" }}
                    >
                      <Box>
                        <Typography sx={{ color: "rgba(255,255,255,0.82)", fontSize: 13, fontWeight: 500, mb: 0.35 }}>
                          Current Bid
                        </Typography>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: { xs: "1.55rem", md: "1.85rem" },
                            letterSpacing: "-0.03em",
                            lineHeight: 1,
                          }}
                        >
                          {formatPrice(hero.bid)}
                        </Typography>
                      </Box>
                      <Button
                        component={Link}
                        href={hero.href}
                        endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
                        sx={{
                          flexShrink: 0,
                          borderRadius: 999,
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.92)",
                          px: { xs: 2, md: 2.5 },
                          py: 0.9,
                          textTransform: "none",
                          fontWeight: 600,
                          fontSize: { xs: 13, md: 14 },
                          bgcolor: "transparent",
                          "&:hover": {
                            bgcolor: "rgba(255,255,255,0.12)",
                            borderColor: "#fff",
                          },
                        }}
                      >
                        View Auction
                      </Button>
                    </Stack>
                  </Box>
                </Box>
                <HeroCommunityCard posts={communityHighlights} />
              </Box>
            </Grid2>
          </Grid2>
        </SectionInner>
      </SectionCard>

      {/* Value props */}
      <SectionCard>
        <SectionInner sx={{ py: { xs: 3, md: 4 } }}>
          <Grid2 container spacing={0}>
            {[
              {
                icon: <GppGoodOutlinedIcon />,
                title: "Built for Enthusiasts",
                desc: "A better, verified way to buy and sell great cars courtesy of KeySavvy transactions",
              },
              {
                icon: <GavelRoundedIcon />,
                title: "Better Auctions",
                desc: "Detailed listings, straightforward bidding, and cars worth getting excited about.",
              },
              {
                icon: <Diversity3OutlinedIcon />,
                title: "More Than Auctions",
                desc: "Follow cars, share your garage, and connect with fellow enthusiasts.",
              },
            ].map((v, i) => (
              <Grid2
                key={v.title}
                size={{ xs: 12, md: 4 }}
                sx={{
                  px: { md: 3 },
                  py: { xs: 2, md: 0 },
                  borderLeft: { md: i === 0 ? "none" : `1px solid ${brand.border}` },
                }}
              >
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                  <Box sx={{ color: brand.primary, display: "flex" }}>{v.icon}</Box>
                  <Box>
                    <Typography fontWeight={700} sx={{ color: brand.primary }}>
                      {v.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {v.desc}
                    </Typography>
                  </Box>
                </Stack>
              </Grid2>
            ))}
          </Grid2>
        </SectionInner>
      </SectionCard>

      {/* Latest Auctions */}
      <SectionCard>
        <SectionInner>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "flex-end", mb: { xs: 3, md: 4 }, gap: 2 }}
          >
            <Box>
              <Typography
                sx={{
                  color: brand.primary,
                  fontWeight: 700,
                  fontSize: 12.5,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  mb: 1,
                }}
              >
                Live now
              </Typography>
              <Typography variant="h4" sx={{ fontSize: { xs: "1.6rem", md: "2rem" } }}>
                Latest auctions
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexShrink: 0 }}>
              <Button
                component={Link}
                href="/auctions"
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
                sx={{ color: brand.ink, "&:hover": { color: brand.primary, bgcolor: "transparent" } }}
              >
                View all
              </Button>
              <IconButton
                aria-label="Previous auctions"
                onClick={() => setLatestPage((page) => Math.max(0, page - 1))}
                disabled={!canPrevLatest}
                sx={{
                  width: 36,
                  height: 36,
                  border: `1px solid ${brand.border}`,
                  bgcolor: "#fff",
                  "&.Mui-disabled": { opacity: 0.35 },
                }}
              >
                <ChevronLeftRoundedIcon />
              </IconButton>
              <IconButton
                aria-label="Show 4 more auctions"
                onClick={() => setLatestPage((page) => page + 1)}
                disabled={!canNextLatest}
                sx={{
                  width: 36,
                  height: 36,
                  border: `1px solid ${brand.border}`,
                  bgcolor: "#fff",
                  "&.Mui-disabled": { opacity: 0.35 },
                }}
              >
                <ChevronRightRoundedIcon />
              </IconButton>
            </Stack>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mb: 3, alignItems: { sm: "center" } }}
          >
            <TextField
              value={auctionQuery}
              onChange={(event) => {
                setAuctionQuery(event.target.value);
                setLatestPage(0);
              }}
              placeholder="Search auctions"
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ fontSize: 18, color: brand.muted }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: { sm: 360 },
                "& .MuiOutlinedInput-root": { borderRadius: 999, bgcolor: "#fff" },
              }}
            />
            <TextField
              select
              size="small"
              value={auctionSort}
              onChange={(event) => {
                setAuctionSort(event.target.value as AuctionSortField);
                setLatestPage(0);
              }}
              sx={{
                minWidth: 180,
                "& .MuiOutlinedInput-root": { borderRadius: 999, bgcolor: "#fff" },
              }}
            >
              <MenuItem value="ending-soon">Ending soon</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="highest-bid">Highest bid</MenuItem>
              <MenuItem value="lowest-price">Lowest price</MenuItem>
            </TextField>
          </Stack>
          <AuctionGrid auctions={latestVisible} />
        </SectionInner>
      </SectionCard>

      {/* Ending soon */}
      <SectionCard>
        <SectionInner>
          <SectionHeader eyebrow="Ending soon" title="Ending soon" href="/auctions?status=ending-soon" cta="View all auctions" />
          <AuctionGrid auctions={endingSoonList} />
        </SectionInner>
      </SectionCard>

      {/* Upcoming auctions */}
      <SectionCard>
        <SectionInner>
          <SectionHeader eyebrow="Coming up" title="Upcoming auctions" href="/auctions?status=upcoming" cta="View all" />
          <AuctionGrid auctions={upcomingList} columns={3} />
        </SectionInner>
      </SectionCard>

      {/* Carmunity feed */}
      <SectionCard>
        <SectionInner>
          <HomeCarmunityFeed posts={carmunityPosts} />
        </SectionInner>
      </SectionCard>

      {/* FAQ */}
      <SectionCard>
        <SectionInner>
          <SectionHeader eyebrow="Support" title="Frequently asked questions" href="/faq" cta="View all FAQs" />
          <FaqAccordion />
        </SectionInner>
      </SectionCard>

      {/* Contact */}
      <SectionCard>
        <SectionInner>
          <Grid2 container spacing={{ xs: 4, md: 8 }} sx={{ alignItems: "center" }}>
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Typography
                sx={{ color: brand.primary, fontWeight: 700, fontSize: 12.5, letterSpacing: "0.14em", textTransform: "uppercase", mb: 1 }}
              >
                Get in touch
              </Typography>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.9rem", md: "2.4rem" }, mb: 2 }}>
                Questions about buying or selling?
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 380 }}>
                Our team is here to help you through your first auction or your fiftieth. Drop us a note and we&apos;ll get back within a day.
              </Typography>
              <Typography fontWeight={600}>Info@carasta.com</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: "8px",
                  border: `1px solid ${brand.border}`,
                  bgcolor: brand.softer,
                }}
              >
                {sent ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="h6" fontWeight={800} gutterBottom>
                      Thanks — message sent.
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      We&apos;ll be in touch shortly.
                    </Typography>
                    <Button variant="outlined" onClick={() => setSent(false)} sx={{ borderRadius: 999 }}>
                      Send another
                    </Button>
                  </Box>
                ) : (
                  <Box component="form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                    <Grid2 container spacing={2}>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="First name" required value={contact.first} onChange={(e) => setContact({ ...contact, first: e.target.value })} />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Last name" required value={contact.last} onChange={(e) => setContact({ ...contact, last: e.target.value })} />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth type="email" label="Email" required value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Subject" value={contact.subject} onChange={(e) => setContact({ ...contact, subject: e.target.value })} />
                      </Grid2>
                      <Grid2 size={12}>
                        <TextField fullWidth label="Message" multiline rows={4} required value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} />
                      </Grid2>
                      <Grid2 size={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="secondary"
                          size="large"
                          endIcon={<ArrowForwardRoundedIcon />}
                          sx={{ borderRadius: 999, bgcolor: brand.primary, "&:hover": { bgcolor: brand.primaryDark } }}
                        >
                          Send message
                        </Button>
                      </Grid2>
                    </Grid2>
                  </Box>
                )}
              </Box>
            </Grid2>
          </Grid2>
        </SectionInner>
      </SectionCard>
    </Box>
  );
}
