"use client";

import React from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import type { Post } from "@carasta/types";
import { PostCard } from "@/components/community/PostCard";
import { brand } from "@/theme/carastaTheme";

export function HomeCarmunityFeed({ posts }: { posts: Post[] }) {
  const visiblePosts = posts.slice(0, 6);

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{ justifyContent: "space-between", alignItems: { sm: "flex-end" }, mb: { xs: 3, md: 4 }, gap: 2 }}
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
            Carmunity
          </Typography>
          <Typography variant="h4" sx={{ fontSize: { xs: "1.6rem", md: "2rem" } }}>
            The feed
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 520 }}>
            Builds, clubs, and posts from owners — the same tools you get inside Carmunity.
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/carmunity"
          endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{ color: brand.ink, flexShrink: 0, "&:hover": { color: brand.primary, bgcolor: "transparent" } }}
        >
          Explore Carmunity
        </Button>
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        sx={{
          overflowX: "auto",
          pb: 1.5,
          scrollSnapType: "x mandatory",
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": { bgcolor: brand.border, borderRadius: 999 },
        }}
      >
        {visiblePosts.map((post) => (
          <Box
            key={post.id}
            sx={{
              width: { xs: 280, sm: 320 },
              flexShrink: 0,
              scrollSnapAlign: "start",
              "& > *": { height: "100%" },
            }}
          >
            <PostCard post={post} compact />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
