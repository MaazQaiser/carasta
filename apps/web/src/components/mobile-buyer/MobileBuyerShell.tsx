"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function MobileBuyerShell({
  children,
  title = "Listing",
  stickyPrimary,
  stickySecondary,
  onPrimary,
  onSecondary,
  hideSticky,
}: {
  children: React.ReactNode;
  title?: string;
  stickyPrimary?: string;
  stickySecondary?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  hideSticky?: boolean;
}) {
  const router = useRouter();

  return (
    <div className="ml-phone-frame">
      <div className="ml-shell">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-[#e5e5ea] px-4">
          <button
            type="button"
            aria-label="Back"
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#1c1c1e]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <p className="text-[14px] font-semibold text-[#1c1c1e]">{title}</p>
          <span className="w-9" />
        </header>

        <div className="ml-shell-scroll">{children}</div>

        {!hideSticky && stickyPrimary ? (
          <div className="shrink-0 border-t border-[#e5e5ea] bg-white px-4 pb-5 pt-3">
            <div className="grid grid-cols-2 gap-3">
              {stickySecondary ? (
                <button
                  type="button"
                  onClick={onSecondary}
                  className="h-11 rounded-lg border border-[#1b1464] text-[13px] font-semibold text-[#1b1464]"
                >
                  {stickySecondary}
                </button>
              ) : null}
              <button
                type="button"
                onClick={onPrimary}
                className={`h-11 rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white ${
                  stickySecondary ? "" : "col-span-2"
                }`}
              >
                {stickyPrimary}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
