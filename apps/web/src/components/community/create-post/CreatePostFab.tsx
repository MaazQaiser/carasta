"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatePostFabProps {
  onClick: () => void;
  className?: string;
}

/** Mobile floating action button for Create Post — sits above BottomNav. */
export function CreatePostFab({ onClick, className }: CreatePostFabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Create Post"
      className={cn(
        "fixed bottom-20 right-4 z-40 md:hidden",
        "inline-flex h-14 w-14 items-center justify-center rounded-full",
        "bg-bid text-bid-foreground shadow-lg",
        "hover:bg-bid-hover transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}
