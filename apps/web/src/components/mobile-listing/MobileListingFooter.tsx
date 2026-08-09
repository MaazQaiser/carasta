"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface MobileListingFooterProps {
  onBack?: () => void;
  onContinue?: () => void;
  continueHref?: string;
  continueDisabled?: boolean;
  onSaveDraftExit?: () => void;
  backLabel?: string;
  continueLabel?: string;
  hideSaveDraftExit?: boolean;
}

export function MobileListingFooter({
  onBack,
  onContinue,
  continueHref,
  continueDisabled = false,
  onSaveDraftExit,
  backLabel = "Back",
  continueLabel = "Continue",
  hideSaveDraftExit = false,
}: MobileListingFooterProps) {
  const continueClasses = cn(
    "flex-1 h-12 rounded-2xl flex items-center justify-center text-[15px] font-semibold transition-colors",
    continueDisabled
      ? "bg-[#e5e5ea] text-[#9ca3af] cursor-not-allowed"
      : "bg-[#1b1464] text-white hover:bg-[#16104d] active:bg-[#110d3e]"
  );

  return (
    <div className="ml-footer w-full flex flex-col gap-4 pt-4 pb-6 px-6">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 h-12 rounded-2xl border-[1.5px] border-[#e5e5ea] bg-white flex items-center justify-center text-[15px] font-semibold text-[#1c1c1e] transition-colors hover:bg-[#f9f9f9]"
        >
          {backLabel}
        </button>

        {continueHref && !continueDisabled ? (
          <Link href={continueHref} className={continueClasses}>
            {continueLabel}
          </Link>
        ) : (
          <button
            type="button"
            onClick={!continueDisabled ? onContinue : undefined}
            disabled={continueDisabled}
            className={continueClasses}
          >
            {continueLabel}
          </button>
        )}
      </div>

      {hideSaveDraftExit ? null : (
        <button
          type="button"
          onClick={onSaveDraftExit}
          className="w-full text-center text-[13px] font-medium text-[#636366] underline underline-offset-2"
        >
          Save Draft &amp; Exit
        </button>
      )}
    </div>
  );
}
