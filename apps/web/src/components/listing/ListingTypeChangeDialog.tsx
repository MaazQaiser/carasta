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

interface ListingTypeChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  fromLabel?: string;
  toLabel?: string;
}

/**
 * Warns before clearing adaptive category answers when the seller changes vehicle type.
 * Shared VIN / details / media stay intact.
 */
export function ListingTypeChangeDialog({
  open,
  onOpenChange,
  onConfirm,
  fromLabel,
  toLabel,
}: ListingTypeChangeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change vehicle type?</DialogTitle>
          <DialogDescription className="text-left space-y-2">
            <span className="block">
              {fromLabel && toLabel
                ? `You’re switching from ${fromLabel} to ${toLabel}.`
                : "You’re switching to a different vehicle type."}
            </span>
            <span className="block">
              Shared details like VIN, vehicle information, photos, and sale settings will be kept.
              Answers that only apply to the previous type will be cleared.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Keep current type
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Change type
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
