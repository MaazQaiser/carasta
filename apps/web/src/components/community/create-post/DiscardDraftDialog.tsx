"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DiscardDraftDialogProps {
  open: boolean;
  onSaveDraft: () => void;
  onDiscard: () => void;
  onContinue: () => void;
}

export function DiscardDraftDialog({
  open,
  onSaveDraft,
  onDiscard,
  onContinue,
}: DiscardDraftDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onContinue()}>
      <DialogContent className="max-w-md sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle>Save this draft?</DialogTitle>
          <DialogDescription>
            You have unsaved content. Save a draft to continue later, discard it, or keep editing.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="outline" onClick={onDiscard}>
            Discard
          </Button>
          <Button type="button" variant="secondary" onClick={onContinue}>
            Continue Editing
          </Button>
          <Button type="button" variant="bid" onClick={onSaveDraft}>
            Save Draft
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
