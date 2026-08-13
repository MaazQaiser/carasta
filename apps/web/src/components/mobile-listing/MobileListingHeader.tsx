"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MobileListingHeaderProps {
  onBack?: () => void;
  saveStatus: "idle" | "saving" | "saved" | "failed";
}

export function MobileListingHeader({ onBack, saveStatus }: MobileListingHeaderProps) {
  return (
    <div className="ml-header flex h-14 items-center justify-between px-4 shrink-0 w-full">
      <div className="flex items-center w-20">
        <button
          type="button"
          onClick={onBack}
          disabled={!onBack}
          aria-label="Back"
          className="flex items-center justify-center w-8 h-8 -ml-1 rounded-full hover:bg-black/5 transition-colors disabled:pointer-events-none disabled:opacity-40"
        >
          <Image
            src="/mobile-listing/chevron-left.svg"
            alt=""
            width={12}
            height={20}
            className="block"
          />
        </button>
      </div>

      <p className="font-bold text-[17px] text-[#1c1c1e] text-center leading-normal">
        Carasta Listing
      </p>

      <div className="flex items-center gap-1 justify-end w-20">
        <span
          className={cn(
            "w-[6px] h-[6px] rounded-[3px] transition-colors",
            saveStatus === "saved" ? "bg-[#9acd7e]" : "bg-[#e5e5ea]"
          )}
        />
        <span className="text-[13px] font-medium text-[#636366] leading-normal">
          {saveStatus === "saving"
            ? "Saving..."
            : saveStatus === "failed"
              ? "Error"
              : "Saved ✓"}
        </span>
      </div>
    </div>
  );
}
