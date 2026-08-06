import type { ListingMediaItem } from "@/components/listing/types";
import type { CreatePostMediaItem } from "../types";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Simulates progressive media upload for Create Post previews.
 * Reuses ListingMediaItem shape from the shared upload zone.
 */
export const CreatePostMediaUploadService = {
  fromFiles(files: FileList | File[] | null, kind: "image" | "video"): CreatePostMediaItem[] {
    if (!files) return [];
    const list = Array.from(files as FileList | File[]);
    return list
      .filter((file) =>
        kind === "image" ? file.type.startsWith("image/") : file.type.startsWith("video/")
      )
      .map((file, index) => ({
        id: `${kind}-${file.name}-${file.lastModified}-${index}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        previewUrl: URL.createObjectURL(file),
        progress: 8,
        kind,
      }));
  },

  /** Animate progress placeholders from 8 → 100 for newly added items. */
  async simulateUpload(
    items: CreatePostMediaItem[],
    onProgress: (items: CreatePostMediaItem[]) => void
  ): Promise<CreatePostMediaItem[]> {
    const working = items.map((item) => ({ ...item }));
    const pending = working.filter((i) => (i.progress ?? 100) < 100);
    if (!pending.length) return working;

    const steps = [28, 52, 76, 100];
    for (const step of steps) {
      await delay(180);
      for (const item of working) {
        if ((item.progress ?? 100) < 100) {
          item.progress = Math.min(step, 100);
        }
      }
      onProgress(working.map((i) => ({ ...i })));
    }
    return working.map((i) => ({ ...i, progress: 100 }));
  },

  toListingItems(items: CreatePostMediaItem[]): ListingMediaItem[] {
    return items.map(({ id, name, previewUrl, progress }) => ({
      id,
      name,
      previewUrl,
      progress,
    }));
  },

  revoke(items: CreatePostMediaItem[]) {
    for (const item of items) {
      if (item.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(item.previewUrl);
      }
    }
  },
};
