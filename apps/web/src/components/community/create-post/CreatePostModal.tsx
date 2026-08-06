"use client";

import * as React from "react";
import {
  Car,
  CheckCircle2,
  Loader2,
  MapPin,
  Send,
  Users,
} from "lucide-react";
import type { Post, PostCategory, User, Vehicle } from "@carasta/types";
import { userService, vehicleService } from "@carasta/mock-data/services";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MediaUploadZone } from "@/components/listing/MediaUploadZone";
import { PostCard } from "@/components/community/PostCard";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/context/auth-context";
import {
  CREATE_POST_CHAR_LIMIT,
  CREATE_POST_PLACEHOLDER,
  POST_CATEGORIES,
  categoryToPostType,
} from "./config";
import {
  createEmptyDraft,
  hasPublishableContent,
  isDraftMeaningful,
  type CreatePostDraft,
  type CreatePostMediaItem,
  type CreatePostStep,
} from "./types";
import { CreatePostDraftService } from "./services/draft-service";
import { CreatePostMediaUploadService } from "./services/media-upload-service";
import { CreatePostPublishService } from "./services/publish-service";
import { AttachedVehicleCard } from "./AttachedVehicleCard";
import { DiscardDraftDialog } from "./DiscardDraftDialog";
import { TagSearchInput, type TagSearchOption } from "./TagSearchInput";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublished?: (post: Post) => void;
}

function reorderMedia(
  items: CreatePostMediaItem[],
  from: number,
  to: number
): CreatePostMediaItem[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  if (!moved) return items;
  next.splice(to, 0, moved);
  return next;
}

export function CreatePostModal({ open, onOpenChange, onPublished }: CreatePostModalProps) {
  const { user } = useAuth();
  const [step, setStep] = React.useState<CreatePostStep>("compose");
  const [draft, setDraft] = React.useState<CreatePostDraft>(createEmptyDraft);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [discardOpen, setDiscardOpen] = React.useState(false);
  const [publishedPost, setPublishedPost] = React.useState<Post | null>(null);
  const [publishProgress, setPublishProgress] = React.useState(0);

  const [memberQuery, setMemberQuery] = React.useState("");
  const [memberOptions, setMemberOptions] = React.useState<User[]>([]);
  const [memberLoading, setMemberLoading] = React.useState(false);

  const [vehicleQuery, setVehicleQuery] = React.useState("");
  const [vehicleOptions, setVehicleOptions] = React.useState<Vehicle[]>([]);
  const [vehicleLoading, setVehicleLoading] = React.useState(false);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const resetComposer = React.useCallback(() => {
    setDraft(createEmptyDraft());
    setStep("compose");
    setValidationError(null);
    setPublishedPost(null);
    setPublishProgress(0);
    setMemberQuery("");
    setVehicleQuery("");
    setMemberOptions([]);
    setVehicleOptions([]);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const saved = CreatePostDraftService.load();
    if (saved?.draft) {
      setDraft({
        ...createEmptyDraft(),
        ...saved.draft,
        photos: saved.draft.photos ?? [],
        videos: saved.draft.videos ?? [],
        taggedUsers: saved.draft.taggedUsers ?? [],
        linkedVehicle: saved.draft.linkedVehicle ?? null,
      });
    } else {
      setDraft(createEmptyDraft());
    }
    setStep("compose");
    setValidationError(null);
    setPublishedPost(null);
    setPublishProgress(0);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, [open]);

  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.max(140, el.scrollHeight)}px`;
  }, [draft.caption, open, step]);

  React.useEffect(() => {
    if (!memberQuery.trim()) {
      setMemberOptions([]);
      return;
    }
    const t = setTimeout(() => {
      setMemberLoading(true);
      userService
        .searchUsers(memberQuery)
        .then(setMemberOptions)
        .finally(() => setMemberLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [memberQuery]);

  React.useEffect(() => {
    if (!vehicleQuery.trim()) {
      setVehicleOptions([]);
      return;
    }
    const t = setTimeout(() => {
      setVehicleLoading(true);
      vehicleService
        .search(vehicleQuery)
        .then(setVehicleOptions)
        .finally(() => setVehicleLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [vehicleQuery]);

  const patchDraft = (partial: Partial<CreatePostDraft>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
    setValidationError(null);
  };

  const requestClose = () => {
    if (step === "publishing") return;
    if (step === "success") {
      resetComposer();
      onOpenChange(false);
      return;
    }
    if (isDraftMeaningful(draft)) {
      setDiscardOpen(true);
      return;
    }
    resetComposer();
    onOpenChange(false);
  };

  const handleSaveDraft = () => {
    CreatePostDraftService.save(draft);
    setDiscardOpen(false);
    resetComposer();
    onOpenChange(false);
  };

  const handleDiscard = () => {
    CreatePostDraftService.clear();
    CreatePostMediaUploadService.revoke([...draft.photos, ...draft.videos]);
    setDiscardOpen(false);
    resetComposer();
    onOpenChange(false);
  };

  const goPreview = () => {
    const issues = CreatePostPublishService.validate(draft);
    if (issues.length) {
      setValidationError(issues[0]!.message);
      return;
    }
    setValidationError(null);
    setStep("preview");
  };

  const buildPreviewPost = (): Post | null => {
    if (!user) return null;
    const images = draft.photos
      .filter((p) => p.previewUrl)
      .map((p, i) => ({
        id: p.id,
        url: p.previewUrl!,
        alt: p.name,
        width: 800,
        height: 600,
        isPrimary: i === 0,
      }));
    const firstVideo = draft.videos.find((v) => v.previewUrl);
    return {
      id: "preview",
      author: user,
      type: categoryToPostType(draft.category, Boolean(firstVideo)),
      category: draft.category,
      caption: draft.caption.trim() || undefined,
      images,
      videoUrl: firstVideo?.previewUrl,
      thumbnailUrl: images[0]?.url,
      linkedVehicle: draft.linkedVehicle ?? undefined,
      taggedUsers: draft.taggedUsers,
      location: draft.location.trim() || undefined,
      hashtags: CreatePostPublishService.extractHashtags(draft.caption),
      likes: 0,
      comments: [],
      commentCount: 0,
      shares: 0,
      views: 0,
      createdAt: new Date().toISOString(),
    };
  };

  const handlePublish = async () => {
    if (!user) return;
    const issues = CreatePostPublishService.validate(draft);
    if (issues.length) {
      setValidationError(issues[0]!.message);
      setStep("compose");
      return;
    }

    setStep("publishing");
    setPublishProgress(12);
    const ticks = [35, 58, 82];
    for (const tick of ticks) {
      await new Promise((r) => setTimeout(r, 220));
      setPublishProgress(tick);
    }

    try {
      const post = await CreatePostPublishService.publish(draft, user);
      setPublishProgress(100);
      CreatePostDraftService.clear();
      setPublishedPost(post);
      onPublished?.(post);
      setStep("success");
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : "Failed to publish.");
      setStep("compose");
    }
  };

  const previewPost = buildPreviewPost();
  const charCount = draft.caption.length;
  const overLimit = charCount > CREATE_POST_CHAR_LIMIT;
  const canContinue = hasPublishableContent(draft) && !overLimit;

  if (!user) return null;

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) requestClose();
          else onOpenChange(true);
        }}
      >
        <DialogContent
          className={cn(
            "max-h-[90vh] overflow-y-auto gap-0 p-0 sm:rounded-2xl",
            step === "preview" || step === "success" ? "max-w-xl" : "max-w-2xl"
          )}
          onPointerDownOutside={(e) => {
            if (step === "publishing") e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (step === "publishing") e.preventDefault();
            else {
              e.preventDefault();
              requestClose();
            }
          }}
        >
          {step === "compose" ? (
            <>
              <DialogHeader className="px-6 pt-6 pb-3 border-b text-left">
                <DialogTitle>Create Post</DialogTitle>
                <DialogDescription>
                  Share with Carmunity — text, media, tags, or an auction listing.
                </DialogDescription>
              </DialogHeader>

              <div className="px-6 py-5 space-y-5">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={user.avatar?.url} />
                    <AvatarFallback>{user.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <textarea
                      ref={textareaRef}
                      className="w-full rounded-xl border bg-muted/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary overflow-hidden"
                      placeholder={CREATE_POST_PLACEHOLDER}
                      value={draft.caption}
                      maxLength={CREATE_POST_CHAR_LIMIT + 40}
                      onChange={(e) => patchDraft({ caption: e.target.value })}
                    />
                    <div className="mt-1.5 flex justify-end">
                      <span
                        className={cn(
                          "text-xs tabular-nums",
                          overLimit ? "text-destructive font-medium" : "text-muted-foreground"
                        )}
                      >
                        {charCount}/{CREATE_POST_CHAR_LIMIT}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {POST_CATEGORIES.map((cat) => {
                      const active = draft.category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => patchDraft({ category: cat.id as PostCategory })}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                            active
                              ? "bg-primary text-primary-foreground border-primary"
                              : "text-muted-foreground border-border hover:border-primary/50"
                          )}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <MediaUploadZone
                  title="Upload Photos"
                  description="Add photos of your build, restoration, or story."
                  accept="image/*"
                  variant="image"
                  compact
                  items={CreatePostMediaUploadService.toListingItems(draft.photos)}
                  onAdd={(items) => {
                    const mapped: CreatePostMediaItem[] = items.map((item) => ({
                      ...item,
                      kind: "image" as const,
                      progress: 12,
                    }));
                    setDraft((prev) => ({ ...prev, photos: [...prev.photos, ...mapped] }));
                    void CreatePostMediaUploadService.simulateUpload(mapped, (progressed) => {
                      setDraft((prev) => {
                        const map = new Map(progressed.map((p) => [p.id, p]));
                        return {
                          ...prev,
                          photos: prev.photos.map((item) => map.get(item.id) ?? item),
                        };
                      });
                    });
                  }}
                  onRemove={(id) =>
                    setDraft((prev) => ({
                      ...prev,
                      photos: prev.photos.filter((p) => p.id !== id),
                    }))
                  }
                  onReorder={(from, to) =>
                    setDraft((prev) => ({
                      ...prev,
                      photos: reorderMedia(prev.photos, from, to),
                    }))
                  }
                />

                <MediaUploadZone
                  title="Upload Videos"
                  description="Short clips of drives, auctions, or shop progress."
                  accept="video/*"
                  variant="video"
                  compact
                  items={CreatePostMediaUploadService.toListingItems(draft.videos)}
                  onAdd={(items) => {
                    const mapped: CreatePostMediaItem[] = items.map((item) => ({
                      ...item,
                      kind: "video" as const,
                      progress: 12,
                    }));
                    setDraft((prev) => ({ ...prev, videos: [...prev.videos, ...mapped] }));
                    void CreatePostMediaUploadService.simulateUpload(mapped, (progressed) => {
                      setDraft((prev) => {
                        const map = new Map(progressed.map((p) => [p.id, p]));
                        return {
                          ...prev,
                          videos: prev.videos.map((item) => map.get(item.id) ?? item),
                        };
                      });
                    });
                  }}
                  onRemove={(id) =>
                    setDraft((prev) => ({
                      ...prev,
                      videos: prev.videos.filter((v) => v.id !== id),
                    }))
                  }
                  onReorder={(from, to) =>
                    setDraft((prev) => ({
                      ...prev,
                      videos: reorderMedia(prev.videos, from, to),
                    }))
                  }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TagSearchInput
                    id="tag-members"
                    label="Tag Members"
                    placeholder="Search members…"
                    icon={<Users className="h-4 w-4" />}
                    value={memberQuery}
                    onQueryChange={setMemberQuery}
                    loading={memberLoading}
                    multi
                    selected={draft.taggedUsers.map((u) => ({
                      id: u.id,
                      label: u.displayName,
                      sublabel: `@${u.username}`,
                      imageUrl: u.avatar?.url,
                    }))}
                    options={memberOptions.map((u) => ({
                      id: u.id,
                      label: u.displayName,
                      sublabel: `@${u.username}`,
                      imageUrl: u.avatar?.url,
                    }))}
                    onSelect={(option: TagSearchOption) => {
                      const found = memberOptions.find((u) => u.id === option.id);
                      if (!found) return;
                      setDraft((prev) =>
                        prev.taggedUsers.some((u) => u.id === found.id)
                          ? prev
                          : { ...prev, taggedUsers: [...prev.taggedUsers, found] }
                      );
                    }}
                    onRemoveSelected={(id) =>
                      setDraft((prev) => ({
                        ...prev,
                        taggedUsers: prev.taggedUsers.filter((u) => u.id !== id),
                      }))
                    }
                  />

                  <TagSearchInput
                    id="tag-vehicle"
                    label="Tag Vehicle"
                    placeholder="Search auction listings…"
                    icon={<Car className="h-4 w-4" />}
                    value={vehicleQuery}
                    onQueryChange={setVehicleQuery}
                    loading={vehicleLoading}
                    selected={
                      draft.linkedVehicle
                        ? [
                            {
                              id: draft.linkedVehicle.id,
                              label: draft.linkedVehicle.title,
                              sublabel: draft.linkedVehicle.status,
                              imageUrl: draft.linkedVehicle.images[0]?.url,
                            },
                          ]
                        : []
                    }
                    options={vehicleOptions.map((v) => ({
                      id: v.id,
                      label: v.title,
                      sublabel: v.status,
                      imageUrl: v.images[0]?.url,
                    }))}
                    onSelect={(option) => {
                      const found = vehicleOptions.find((v) => v.id === option.id);
                      if (!found) return;
                      patchDraft({ linkedVehicle: found });
                      setVehicleQuery("");
                    }}
                    onRemoveSelected={() => patchDraft({ linkedVehicle: null })}
                  />
                </div>

                <div>
                  <label htmlFor="post-location" className="text-sm font-medium mb-1.5 block">
                    Tag Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="post-location"
                      className="flex h-9 w-full rounded-lg border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="City, State"
                      value={draft.location}
                      onChange={(e) => patchDraft({ location: e.target.value })}
                    />
                  </div>
                </div>

                {draft.linkedVehicle ? (
                  <div>
                    <p className="text-sm font-medium mb-2">Attached Listing</p>
                    <AttachedVehicleCard
                      vehicle={draft.linkedVehicle}
                      onRemove={() => patchDraft({ linkedVehicle: null })}
                    />
                  </div>
                ) : null}

                {validationError ? (
                  <p className="text-sm text-destructive" role="alert">
                    {validationError}
                  </p>
                ) : null}
              </div>

              <DialogFooter className="px-6 py-4 border-t gap-2 sm:justify-between">
                <Button type="button" variant="ghost" onClick={requestClose}>
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      CreatePostDraftService.save(draft);
                      resetComposer();
                      onOpenChange(false);
                    }}
                    disabled={!isDraftMeaningful(draft)}
                  >
                    Save Draft
                  </Button>
                  <Button
                    type="button"
                    variant="bid"
                    className="gap-1.5"
                    disabled={!canContinue}
                    onClick={goPreview}
                  >
                    Preview
                  </Button>
                </div>
              </DialogFooter>
            </>
          ) : null}

          {step === "preview" && previewPost ? (
            <>
              <DialogHeader className="px-6 pt-6 pb-3 border-b text-left">
                <DialogTitle>Preview</DialogTitle>
                <DialogDescription>
                  This is how your post will appear in the Carmunity feed.
                </DialogDescription>
              </DialogHeader>
              <div className="px-6 py-5">
                <PostCard post={previewPost} />
                {draft.location.trim() ? (
                  <p className="mt-3 text-xs text-muted-foreground inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {draft.location.trim()}
                  </p>
                ) : null}
                {draft.taggedUsers.length > 0 ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    With {draft.taggedUsers.map((u) => `@${u.username}`).join(", ")}
                  </p>
                ) : null}
              </div>
              <DialogFooter className="px-6 py-4 border-t gap-2">
                <Button type="button" variant="outline" onClick={() => setStep("compose")}>
                  Back
                </Button>
                <Button type="button" variant="secondary" onClick={() => setStep("compose")}>
                  Edit
                </Button>
                <Button type="button" variant="bid" className="gap-1.5" onClick={() => void handlePublish()}>
                  <Send className="h-4 w-4" />
                  Publish
                </Button>
              </DialogFooter>
            </>
          ) : null}

          {step === "publishing" ? (
            <div className="px-6 py-16 flex flex-col items-center text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <DialogTitle className="text-lg">Publishing…</DialogTitle>
              <DialogDescription className="mt-2">
                Sharing your post with Carmunity.
              </DialogDescription>
              <div className="mt-6 w-full max-w-xs h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${publishProgress}%` }}
                />
              </div>
            </div>
          ) : null}

          {step === "success" && publishedPost ? (
            <>
              <div className="px-6 py-12 flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <DialogTitle className="text-lg">Your post has been published.</DialogTitle>
                <DialogDescription className="mt-2">
                  It&apos;s now live on the Carmunity feed.
                </DialogDescription>
              </div>
              <DialogFooter className="px-6 py-4 border-t gap-2 sm:justify-center">
                <Button
                  type="button"
                  variant="bid"
                  onClick={() => {
                    onOpenChange(false);
                    resetComposer();
                    requestAnimationFrame(() => {
                      document
                        .getElementById(`post-${publishedPost.id}`)
                        ?.scrollIntoView({ behavior: "smooth", block: "center" });
                    });
                  }}
                >
                  View Post
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetComposer();
                    onOpenChange(false);
                  }}
                >
                  Back to Feed
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <DiscardDraftDialog
        open={discardOpen}
        onSaveDraft={handleSaveDraft}
        onDiscard={handleDiscard}
        onContinue={() => setDiscardOpen(false)}
      />
    </>
  );
}
