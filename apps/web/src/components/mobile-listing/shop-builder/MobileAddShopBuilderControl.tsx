"use client";

import { Plus } from "lucide-react";
import { MobileShopBuilderField } from "./MobileShopBuilderField";

export function MobileAddShopBuilderControl({
  value,
  onPress,
  busy = false,
}: {
  value: string;
  onPress: () => void;
  busy?: boolean;
}) {
  if (value.trim()) {
    return (
      <MobileShopBuilderField
        label="Shop / Builder"
        value={value}
        placeholder="Add Shop / Builder"
        onPress={onPress}
        busy={busy}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={onPress}
      disabled={busy}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#1b1464] text-[13px] font-semibold text-[#1b1464] disabled:opacity-70"
    >
      <Plus className="h-4 w-4" />
      {busy ? "Opening…" : "Add Shop / Builder"}
    </button>
  );
}
