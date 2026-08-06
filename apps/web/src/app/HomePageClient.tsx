"use client";

import React, { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import type { Auction, Post } from "@carasta/types";
import { AuctionCard } from "@/components/auction/AuctionCard";
import { formatPrice } from "@/lib/utils";
import { brand } from "@/theme/carastaTheme";

interface Props {
  featuredAuctions: Auction[];
  endingSoon: Auction[];
  upcomingAuctions: Auction[];
  brands: { name: string; count: number; imageUrl: string }[];
  communityHighlights: Post[];
}

/** White rounded section card inset on gray-50 page canvas */
function SectionCard({
  children,
  sx,
  dark,
}: {
  children: React.ReactNode;
  sx?: object;
  dark?: boolean;
}) {
  return (
    <Box
      sx={{
        mx: "18px",
        mb: "18px",
        bgcolor: dark ? brand.ink : "#fff",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: dark ? "none" : "0 8px 28px -22px rgba(20,20,20,0.22)",
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

function CompactListing({ auction }: { auction: Auction }) {
  const img = auction.vehicle.images[0];
  return (
    <Stack
      direction="row"
      spacing={2}
      component={Link}
      href={`/vehicles/${auction.vehicle.id}`}
      sx={{
        alignItems: "center",
        p: 1.25,
        border: `1px solid ${brand.border}`,
        borderRadius: "8px",
        bgcolor: brand.softer,
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": { borderColor: "rgba(20,20,20,0.18)", boxShadow: "0 10px 24px -14px rgba(20,20,20,0.25)" },
      }}
    >
      <Box sx={{ width: 96, height: 68, borderRadius: "8px", overflow: "hidden", flexShrink: 0, bgcolor: brand.soft }}>
        {img && <Box component="img" src={img.url} alt={img.alt} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography fontWeight={700} noWrap sx={{ letterSpacing: "-0.01em" }}>
          {auction.vehicle.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {auction.vehicle.location.city}, {auction.vehicle.location.state}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.2 }}>
          Current bid
        </Typography>
        <Typography fontWeight={800} sx={{ letterSpacing: "-0.01em" }}>
          {formatPrice(auction.currentBid)}
        </Typography>
      </Box>
    </Stack>
  );
}

export function HomePageClient({
  featuredAuctions,
  endingSoon,
  brands,
  communityHighlights,
}: Props) {
  const [contact, setContact] = useState({ first: "", last: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const latest = featuredAuctions.slice(0, 6);
  const brandLeft = brands.slice(0, 2);
  const sideListings = endingSoon.slice(0, 4);

  return (
    <Box sx={{ bgcolor: brand.canvas, pb: "18px" }}>
      {/* Hero section card */}
      <SectionCard>
        <SectionInner sx={{ py: { xs: 4, md: 7 } }}>
          <Grid2 container spacing={{ xs: 4, md: 5 }} sx={{ alignItems: "center" }}>
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Typography
                variant="h1"
                component="h1"
                sx={{ fontSize: { xs: "2.4rem", md: "3.4rem" }, mb: 2.5, lineHeight: 1.08 }}
              >
                Explore quality{" "}
                <Box component="span" sx={{ color: brand.primary }}>
                  cars
                </Box>{" "}
                you can trust.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", mb: 4, maxWidth: 440 }}>
                <Typography color="text.secondary" sx={{ fontSize: "1rem", lineHeight: 1.65, flex: 1 }}>
                  A curated marketplace for vintage &amp; collector cars — transparent auctions, documented histories, verified sellers.
                </Typography>
                <Box
                  sx={{
                    flexShrink: 0,
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: brand.primary,
                    color: "#fff",
                    display: { xs: "none", sm: "flex" },
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 0.25,
                  }}
                >
                  <NorthEastRoundedIcon sx={{ fontSize: 18 }} />
                </Box>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  component={Link}
                  href="/auctions"
                  variant="contained"
                  color="secondary"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ borderRadius: 999, bgcolor: brand.ink, color: "#fff", "&:hover": { bgcolor: "#000" } }}
                >
                  Browse auctions
                </Button>
              </Stack>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 7 }}>
              <Box sx={{ position: "relative", pr: { xs: 0, md: 2 }, pb: { xs: 0, md: 2 } }}>
                {/* Vertical social strip */}
                <Stack
                  spacing={0}
                  sx={{
                    position: "absolute",
                    left: { xs: 8, md: -8 },
                    top: "50%",
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
                    height: { xs: 280, md: 420 },
                    borderRadius: "8px",
                    overflow: "hidden",
                    bgcolor: brand.soft,
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1750957823101-87ec89cf6862?w=1400&auto=format&fit=crop"
                    alt="Featured classic car"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />

                  <Box
                    sx={{
                      position: "absolute",
                      top: { xs: 14, md: 22 },
                      right: { xs: 14, md: 22 },
                      width: { xs: 72, md: 82 },
                      height: { xs: 72, md: 82 },
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.96)",
                      border: `3px solid ${brand.primary}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 12px 26px -14px rgba(0,0,0,0.45)",
                    }}
                  >
                    <Typography fontWeight={800} sx={{ fontSize: { xs: 15, md: 17 }, lineHeight: 1 }}>
                      72h
                    </Typography>
                    <Typography sx={{ fontSize: 9, color: brand.muted, fontWeight: 700 }}>
                      Time left
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    position: { xs: "static", md: "absolute" },
                    right: { md: -4 },
                    bottom: { md: -4 },
                    mt: { xs: 2, md: 0 },
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    bgcolor: "#fff",
                    borderRadius: "8px",
                    p: 1.25,
                    pr: 2.5,
                    boxShadow: "0 18px 40px -20px rgba(0,0,0,0.4)",
                    border: `1px solid ${brand.border}`,
                    maxWidth: 320,
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&auto=format&fit=crop"
                    alt="Classic car detail"
                    sx={{ width: 56, height: 56, borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                  />
                  <Box>
                    <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mb: 0.25 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: brand.primary }} />
                      <Typography variant="caption" color="text.secondary">
                        Featured · ending soon
                      </Typography>
                    </Stack>
                    <Typography fontWeight={800} sx={{ letterSpacing: "-0.01em", fontSize: 14 }}>
                      1963 Jaguar E-Type Series 1
                    </Typography>
                    <Typography fontWeight={800} sx={{ color: brand.primary }}>
                      {formatPrice(155000)}
                    </Typography>
                  </Box>
                </Box>
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
              { icon: <VerifiedRoundedIcon />, title: "Documented histories", desc: "Matching numbers, build sheets, provenance." },
              { icon: <GavelRoundedIcon />, title: "Transparent bidding", desc: "Live bids, no hidden reserves." },
              { icon: <LocalShippingOutlinedIcon />, title: "Enclosed transport", desc: "White-glove classic car delivery." },
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
                    <Typography fontWeight={700}>{v.title}</Typography>
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
          <SectionHeader eyebrow="Live now" title="Latest auctions" href="/auctions" />
          <Grid2 container spacing={3}>
            {latest.map((auction) => (
              <Grid2 key={auction.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <AuctionCard auction={auction} />
              </Grid2>
            ))}
          </Grid2>
        </SectionInner>
      </SectionCard>

      {/* Category banners */}
      <SectionCard>
        <SectionInner>
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, mb: 4, textAlign: { xs: "left", md: "center" } }}
          >
            Experience the{" "}
            <Box component="span" sx={{ color: brand.primary }}>
              future
            </Box>{" "}
            of performance
          </Typography>
          <Grid2 container spacing={3}>
            {[
              {
                title: "American muscle",
                sub: "Big-block legends",
                href: "/marketplace?make=Chevrolet",
                image: "https://images.unsplash.com/photo-1584345274849-e9596d6ea12d?w=1000&auto=format&fit=crop",
              },
              {
                title: "European classics",
                sub: "Timeless grand tourers",
                href: "/marketplace?make=Jaguar",
                image: "https://images.unsplash.com/photo-1655207297101-74aadf311205?w=1000&auto=format&fit=crop",
              },
            ].map((banner) => (
              <Grid2 key={banner.title} size={{ xs: 12, md: 6 }}>
                <Box
                  component={Link}
                  href={banner.href}
                  sx={{
                    position: "relative",
                    display: "block",
                    height: { xs: 220, md: 280 },
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundImage: `url(${banner.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transition: "transform 0.4s ease",
                    "&:hover": { transform: "scale(1.01)" },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(90deg, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.15) 75%)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      p: { xs: 3, md: 4 },
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Typography sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 600, mb: 0.5 }}>
                      {banner.sub}
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#fff", fontWeight: 800, mb: 2 }}>
                      {banner.title}
                    </Typography>
                    <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", color: "#fff" }}>
                      <Typography sx={{ fontWeight: 700 }}>Explore</Typography>
                      <NorthEastRoundedIcon sx={{ fontSize: 18 }} />
                    </Stack>
                  </Box>
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </SectionInner>
      </SectionCard>

      {/* Ending soon */}
      <SectionCard>
        <SectionInner>
          <SectionHeader eyebrow="Closing today" title="Ending soon" href="/auctions?status=ending-soon" />
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Stack spacing={2}>
                {brandLeft.map((b) => (
                  <Box
                    key={b.name}
                    component={Link}
                    href={`/marketplace?make=${encodeURIComponent(b.name)}`}
                    sx={{
                      position: "relative",
                      height: 168,
                      borderRadius: "8px",
                      overflow: "hidden",
                      display: "block",
                      backgroundImage: `url(${b.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.72))",
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", zIndex: 1, p: 2.5, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                      <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800 }}>
                        {b.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.82)" }}>
                        {b.count} vehicles available
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Stack spacing={1.5}>
                {sideListings.map((auction) => (
                  <CompactListing key={auction.id} auction={auction} />
                ))}
              </Stack>
            </Grid2>
          </Grid2>
        </SectionInner>
      </SectionCard>

      {/* Brands */}
      <SectionCard>
        <SectionInner>
          <SectionHeader eyebrow="Browse" title="Shop by brand" href="/marketplace/brands" cta="All brands" />
          <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
            {brands.map((b) => (
              <Stack
                key={b.name}
                direction="row"
                spacing={1.25}
                component={Link}
                href={`/marketplace?make=${encodeURIComponent(b.name)}`}
                sx={{
                  alignItems: "center",
                  px: 2,
                  py: 1.25,
                  borderRadius: 999,
                  border: `1px solid ${brand.border}`,
                  transition: "0.2s",
                  "&:hover": { borderColor: brand.ink, bgcolor: brand.softer },
                }}
              >
                <Box component="img" src={b.imageUrl} alt={b.name} sx={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
                <Typography variant="body2" fontWeight={700}>
                  {b.name}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </SectionInner>
      </SectionCard>

      {/* Community */}
      <SectionCard>
        <SectionInner>
          <SectionHeader eyebrow="From the community" title="Latest stories" href="/community" cta="Visit community" />
          <Grid2 container spacing={3}>
            {communityHighlights.slice(0, 3).map((post) => (
              <Grid2 key={post.id} size={{ xs: 12, md: 4 }}>
                <Box
                  component={Link}
                  href="/community"
                  sx={{
                    display: "block",
                    bgcolor: brand.softer,
                    borderRadius: "8px",
                    border: `1px solid ${brand.border}`,
                    overflow: "hidden",
                    height: "100%",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    "&:hover": { borderColor: "rgba(20,20,20,0.18)", boxShadow: "0 12px 30px -16px rgba(20,20,20,0.28)" },
                  }}
                >
                  <Box sx={{ height: 180, bgcolor: brand.soft }}>
                    {post.images[0] && (
                      <Box
                        component="img"
                        src={post.images[0].url}
                        alt={post.images[0].alt}
                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                  </Box>
                  <Box sx={{ p: 2.5 }}>
                    <Typography fontWeight={700} sx={{ mb: 1, lineHeight: 1.4, letterSpacing: "-0.01em" }}>
                      {(post.caption ?? "Community update").slice(0, 72)}
                      {(post.caption?.length ?? 0) > 72 ? "…" : ""}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      By {post.author.displayName}
                    </Typography>
                  </Box>
                </Box>
              </Grid2>
            ))}
          </Grid2>
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
              <Stack spacing={1.5}>
                <Typography fontWeight={600}>hello@carasta.com</Typography>
                <Typography fontWeight={600}>+1 (800) 555-0199</Typography>
              </Stack>
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

      {/* Sell CTA */}
      <SectionCard dark>
        <SectionInner>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{ alignItems: { md: "center" }, justifyContent: "space-between" }}
          >
            <Box>
              <Typography variant="h4" sx={{ color: "#fff", mb: 1 }}>
                Have a classic to sell?
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.7)", maxWidth: 480 }}>
                Reach thousands of serious collectors. List in minutes, sell with confidence.
              </Typography>
            </Box>
            <Button
              component={Link}
              href="/list/new"
              variant="contained"
              color="secondary"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                flexShrink: 0,
                borderRadius: 999,
                bgcolor: brand.primary,
                "&:hover": { bgcolor: brand.primaryDark },
              }}
            >
              Start selling
            </Button>
          </Stack>
        </SectionInner>
      </SectionCard>
    </Box>
  );
}
