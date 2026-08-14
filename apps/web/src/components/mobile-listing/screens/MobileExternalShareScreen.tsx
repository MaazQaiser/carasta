"use client";

import * as React from "react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import {
  defaultShareCaption,
  SubmissionSession,
} from "@/components/listing/services/submission-session";
import { SHARE_DESTINATIONS } from "@/components/share/ShareBrandIcons";
import { MobileListingShell } from "../MobileListingShell";

export function MobileExternalShareScreen() {
  const { draft } = useListingBuilder();
  const vehicleLabel =
    [draft.details.year, draft.details.make, draft.details.model].filter(Boolean).join(" ") ||
    "vehicle";
  const [caption, setCaption] = React.useState("");
  const [selected, setSelected] = React.useState<string | null>(null);

  React.useEffect(() => {
    const session = SubmissionSession.load();
    setCaption(session?.shareCaption?.trim() || defaultShareCaption(vehicleLabel));
  }, [vehicleLabel]);

  const chooseDestination = (destination: string) => {
    setSelected(destination);
    SubmissionSession.patch({
      shareCaption: caption,
      destination,
      sharedAt: new Date().toISOString(),
    });
    if (destination === "Copy Link" && typeof window !== "undefined") {
      void navigator.clipboard?.writeText(`${window.location.origin}/profile?tab=listings`);
    }
  };

  return (
    <MobileListingShell
      stepId="share-external"
      continueHref="/mobile-listing/share/community"
      continueDisabled={false}
    >
      <div className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#1c1c1e]">External Share</h1>
          <p className="mt-2 text-[14px] text-[#636366]">
            Edit your caption, then choose where to share outside Carasta.
          </p>
        </div>

        <div className="rounded-lg border border-[#e5e5ea] p-3 text-[12px] font-semibold text-[#1c1c1e]">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[#636366]">
            Listing Information
          </span>
          <span className="mt-1 block">{vehicleLabel}</span>
          <span className="mt-1 block font-normal text-[#636366]">
            Share to Instagram, Facebook, X, and more
          </span>
        </div>

        <label className="block text-[12px] font-semibold text-[#636366]">
          Edit Caption
          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            className="mt-1 min-h-28 w-full rounded-lg border border-[#e5e5ea] p-3 text-[13px] text-[#1c1c1e] outline-none focus:border-[#1b1464]"
          />
        </label>

        <div className="grid grid-cols-3 gap-3">
          {SHARE_DESTINATIONS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => chooseDestination(id)}
              className={`flex flex-col items-center gap-2 rounded-lg border px-2 py-3 text-[11px] font-medium ${
                selected === id
                  ? "border-[#1b1464] bg-[#f4f5fc] text-[#1b1464]"
                  : "border-[#e5e5ea] text-[#1c1c1e]"
              }`}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>
      </div>
    </MobileListingShell>
  );
}
