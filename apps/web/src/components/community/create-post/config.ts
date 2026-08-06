import type { PostCategory, PostType } from "@carasta/types";

export const CREATE_POST_PLACEHOLDER =
  "Share your build, restoration, auction or automotive story...";

export const CREATE_POST_CHAR_LIMIT = 280;

export const CREATE_POST_STORAGE_KEY = "carasta.carmunity.post-draft.v1";

export interface PostCategoryOption {
  id: PostCategory;
  label: string;
  postType: PostType;
}

export const POST_CATEGORIES: PostCategoryOption[] = [
  { id: "general", label: "General Post", postType: "photo" },
  { id: "build-update", label: "Build Update", postType: "build" },
  { id: "restoration", label: "Restoration", postType: "build" },
  { id: "marketplace-share", label: "Auctions Share", postType: "photo" },
  { id: "auction-share", label: "Auction Share", postType: "photo" },
  { id: "event", label: "Event", postType: "story" },
];

export function categoryLabel(id?: PostCategory): string {
  return POST_CATEGORIES.find((c) => c.id === id)?.label ?? "General Post";
}

export function categoryToPostType(
  category: PostCategory | undefined,
  hasVideo: boolean
): PostType {
  if (hasVideo) return "video";
  return POST_CATEGORIES.find((c) => c.id === category)?.postType ?? "photo";
}
