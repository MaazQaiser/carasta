import type { PostCategory, User, Vehicle } from "@carasta/types";
import type { ListingMediaItem } from "@/components/listing/types";

export type CreatePostStep = "compose" | "preview" | "publishing" | "success";

export interface CreatePostMediaItem extends ListingMediaItem {
  kind: "image" | "video";
}

export interface CreatePostDraft {
  caption: string;
  category: PostCategory;
  photos: CreatePostMediaItem[];
  videos: CreatePostMediaItem[];
  taggedUsers: User[];
  taggedVehicleQuery: string;
  location: string;
  linkedVehicle: Vehicle | null;
}

export function createEmptyDraft(): CreatePostDraft {
  return {
    caption: "",
    category: "general",
    photos: [],
    videos: [],
    taggedUsers: [],
    taggedVehicleQuery: "",
    location: "",
    linkedVehicle: null,
  };
}

export function isDraftMeaningful(draft: CreatePostDraft): boolean {
  return Boolean(
    draft.caption.trim() ||
      draft.photos.length > 0 ||
      draft.videos.length > 0 ||
      draft.linkedVehicle ||
      draft.taggedUsers.length > 0 ||
      draft.location.trim() ||
      draft.category !== "general"
  );
}

export function hasPublishableContent(draft: CreatePostDraft): boolean {
  return Boolean(
    draft.caption.trim() ||
      draft.photos.length > 0 ||
      draft.videos.length > 0 ||
      draft.linkedVehicle
  );
}
