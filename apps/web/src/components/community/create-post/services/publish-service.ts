import type { Post, User } from "@carasta/types";
import { postService } from "@carasta/mock-data/services";
import { categoryToPostType } from "../config";
import type { CreatePostDraft } from "../types";
import { hasPublishableContent } from "../types";

export type PublishValidationIssue = {
  field: "content" | "caption";
  message: string;
};

export const CreatePostPublishService = {
  validate(draft: CreatePostDraft): PublishValidationIssue[] {
    const issues: PublishValidationIssue[] = [];
    if (!hasPublishableContent(draft)) {
      issues.push({
        field: "content",
        message: "Add post text, a photo, a video, or an attached listing to publish.",
      });
    }
    return issues;
  },

  extractHashtags(caption: string): string[] {
    return [...(caption.match(/#(\w+)/g) ?? [])].map((h) => h.slice(1));
  },

  async publish(draft: CreatePostDraft, author: User): Promise<Post> {
    const issues = this.validate(draft);
    if (issues.length) {
      throw new Error(issues[0]!.message);
    }

    const images = draft.photos
      .filter((p) => p.previewUrl)
      .map((p, i) => ({
        id: p.id || `img-${i}`,
        url: p.previewUrl!,
        alt: p.name || "post image",
        width: 800,
        height: 600,
        isPrimary: i === 0,
      }));

    const firstVideo = draft.videos.find((v) => v.previewUrl);

    return postService.createPost({
      author,
      caption: draft.caption.trim() || undefined,
      images,
      videoUrl: firstVideo?.previewUrl,
      thumbnailUrl: images[0]?.url ?? firstVideo?.previewUrl,
      category: draft.category,
      type: categoryToPostType(draft.category, Boolean(firstVideo)),
      linkedVehicle: draft.linkedVehicle ?? undefined,
      taggedUsers: draft.taggedUsers.length ? draft.taggedUsers : undefined,
      location: draft.location.trim() || undefined,
      hashtags: this.extractHashtags(draft.caption),
    });
  },
};
