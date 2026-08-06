"use client";

import React, { useState } from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import type { Post } from "@carasta/types";
import { formatRelativeTime } from "@/lib/utils";
import { brand } from "@/theme/carastaTheme";
import { AttachedVehicleCard } from "@/components/community/create-post/AttachedVehicleCard";

interface PostCardProps {
  post: Post;
  compact?: boolean;
}

export function PostCard({ post, compact = false }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const primaryImage = post.images[0];

  const handleLike = () => {
    setLiked((l) => !l);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  if (compact) {
    return (
      <Card sx={{ height: "100%" }}>
        {primaryImage && (
          <CardMedia component="img" image={primaryImage.url} alt={primaryImage.alt} sx={{ aspectRatio: "1", objectFit: "cover" }} />
        )}
        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Stack direction="row" spacing={1} sx={{alignItems: "center", mb: 1 }}>
            <Avatar src={post.author.avatar?.url} sx={{ width: 24, height: 24 }} />
            <Typography variant="caption" fontWeight={700} noWrap>{post.author.displayName}</Typography>
          </Stack>
          {post.caption && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {post.caption}
            </Typography>
          )}
          <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">{likeCount.toLocaleString()} likes</Typography>
            <Typography variant="caption" color="text.secondary">{post.commentCount} comments</Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const typeLabel = post.category
    ? post.category.replace(/-/g, " ")
    : post.type;

  return (
    <Card id={`post-${post.id}`}>
      <CardHeader
        avatar={
          <Avatar component={Link} href={`/profile/${post.author.username}`} src={post.author.avatar?.url}>
            {post.author.displayName.slice(0, 2).toUpperCase()}
          </Avatar>
        }
        title={
          <Typography component={Link} href={`/profile/${post.author.username}`} fontWeight={700} sx={{ color: "text.primary" }}>
            {post.author.displayName}{post.author.isVerified ? " ✓" : ""}
          </Typography>
        }
        subheader={formatRelativeTime(post.createdAt)}
        action={<Chip size="small" label={typeLabel} sx={{ textTransform: "capitalize", mr: 1, mt: 1 }} />}
      />
      {primaryImage && (
        <CardMedia component="img" image={primaryImage.url} alt={primaryImage.alt} sx={{ aspectRatio: "4/3", objectFit: "cover" }} />
      )}
      {!primaryImage && post.videoUrl ? (
        <Box sx={{ bgcolor: "grey.100", aspectRatio: "4/3" }}>
          <Box
            component="video"
            src={post.videoUrl}
            controls
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      ) : null}
      {post.caption && (
        <CardContent>
          <Typography variant="body2" sx={{ mb: 1 }}>{post.caption}</Typography>
          <Stack direction="row" gap={1} sx={{ flexWrap: "wrap" }}>
            {post.hashtags.slice(0, 4).map((tag) => (
              <Typography key={tag} component={Link} href={`/carmunity?tag=${tag}`} variant="caption" color="primary" fontWeight={600}>
                #{tag}
              </Typography>
            ))}
          </Stack>
        </CardContent>
      )}
      {post.linkedVehicle ? (
        <Box sx={{ px: 2, pb: 1.5, pt: post.caption ? 0 : 1 }}>
          <AttachedVehicleCard vehicle={post.linkedVehicle} compact />
        </Box>
      ) : null}
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          onClick={handleLike}
          sx={{ color: liked ? brand.urgent : "text.secondary" }}
        >
          {likeCount.toLocaleString()}
        </Button>
        <Button size="small" startIcon={<ChatBubbleOutlineIcon />} sx={{ color: "text.secondary" }}>
          {post.commentCount}
        </Button>
        <IconButton size="small"><ShareOutlinedIcon fontSize="small" /></IconButton>
        <Box sx={{ flex: 1 }} />
        <IconButton size="small"><BookmarkBorderIcon fontSize="small" /></IconButton>
      </CardActions>
    </Card>
  );
}
