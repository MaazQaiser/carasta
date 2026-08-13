"use client";

import { Loader2 } from "lucide-react";

/** Figma submission loading state — brief transition after Submit to Carasta. */
export function SubmissionLoadingOverlay({ open }: { open: boolean }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-6"
      role="alertdialog"
      aria-modal="true"
      aria-busy="true"
      aria-labelledby="submission-loading-title"
      aria-describedby="submission-loading-desc"
    >
      <div className="w-full max-w-xs rounded-2xl bg-white px-6 py-8 text-center shadow-xl">
        <Loader2
          className="mx-auto h-10 w-10 animate-spin text-[#1b1464]"
          aria-hidden
        />
        <p
          id="submission-loading-title"
          className="mt-4 text-[17px] font-extrabold text-[#1c1c1e]"
        >
          Submitting Listing
        </p>
        <p
          id="submission-loading-desc"
          className="mt-1.5 text-[13px] text-[#636366]"
        >
          This may take a moment…
        </p>
      </div>
    </div>
  );
}
