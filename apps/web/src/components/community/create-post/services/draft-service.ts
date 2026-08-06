import type { CreatePostDraft, CreatePostMediaItem } from "../types";
import { createEmptyDraft, isDraftMeaningful } from "../types";
import { CREATE_POST_STORAGE_KEY } from "../config";

export interface PersistedPostDraft {
  version: 1;
  savedAt: string;
  draft: CreatePostDraft;
}

function stripPreviewUrls(items: CreatePostMediaItem[]): CreatePostMediaItem[] {
  return items.map(({ previewUrl: _previewUrl, ...rest }) => ({
    ...rest,
    progress: rest.progress ?? 100,
  }));
}

function sanitize(draft: CreatePostDraft): CreatePostDraft {
  return {
    ...draft,
    photos: stripPreviewUrls(draft.photos),
    videos: stripPreviewUrls(draft.videos),
  };
}

export const CreatePostDraftService = {
  storageKey: CREATE_POST_STORAGE_KEY,

  load(): PersistedPostDraft | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(CREATE_POST_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PersistedPostDraft;
      if (!parsed?.version || !parsed.draft) return null;
      return parsed;
    } catch {
      return null;
    }
  },

  save(draft: CreatePostDraft): PersistedPostDraft | null {
    if (!isDraftMeaningful(draft)) {
      this.clear();
      return null;
    }
    const envelope: PersistedPostDraft = {
      version: 1,
      savedAt: new Date().toISOString(),
      draft: sanitize(draft),
    };
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CREATE_POST_STORAGE_KEY, JSON.stringify(envelope));
    }
    return envelope;
  },

  clear() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CREATE_POST_STORAGE_KEY);
    }
  },

  hasDraft(): boolean {
    const saved = this.load();
    return Boolean(saved && isDraftMeaningful(saved.draft));
  },

  createEmptyDraft,
};
