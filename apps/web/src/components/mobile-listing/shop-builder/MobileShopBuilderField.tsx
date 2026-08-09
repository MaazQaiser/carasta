"use client";

import { ChevronRight, Loader2 } from "lucide-react";

export function MobileShopBuilderField({
  label = "Shop / Builder / Company",
  value,
  placeholder = "Search or add a shop",
  onPress,
  busy = false,
}: {
  label?: string;
  value: string;
  placeholder?: string;
  onPress: () => void;
  busy?: boolean;
}) {
  return (
    <div className="block space-y-1.5">
      <span className="text-[12px] font-semibold text-[#636366]">{label}</span>
      <button
        type="button"
        onClick={onPress}
        disabled={busy}
        className="relative flex h-11 w-full items-center rounded-lg border border-[#e5e5ea] bg-white px-3 text-left text-[13px] outline-none transition-colors hover:border-[#c7c7cc] focus:border-[#1b1464] disabled:opacity-70"
      >
        <span className={value ? "pr-8 text-[#1c1c1e]" : "pr-8 text-[#9ca3af]"}>
          {busy ? "Opening…" : value || placeholder}
        </span>
        {busy ? (
          <Loader2 className="pointer-events-none absolute right-3 h-4 w-4 animate-spin text-[#636366]" />
        ) : (
          <ChevronRight className="pointer-events-none absolute right-3 h-4 w-4 text-[#636366]" />
        )}
      </button>
    </div>
  );
}
