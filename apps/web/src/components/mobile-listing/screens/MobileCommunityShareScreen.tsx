"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import {
  defaultShareCaption,
  SubmissionSession,
} from "@/components/listing/services/submission-session";
import { MobileListingShell } from "../MobileListingShell";

export function MobileCommunityShareScreen() {
  const router = useRouter();
  const { draft } = useListingBuilder();
  const vehicleLabel =
    [draft.details.year, draft.details.make, draft.details.model].filter(Boolean).join(" ") ||
    "vehicle";
  const [caption, setCaption] = React.useState("");
  const [tagPeople, setTagPeople] = React.useState("");
  const [tagShops, setTagShops] = React.useState("");
  const [location, setLocation] = React.useState(draft.saleSettings.shippingLocation || "");

  React.useEffect(() => {
    const session = SubmissionSession.load();
    setCaption(session?.shareCaption?.trim() || defaultShareCaption(vehicleLabel));
  }, [vehicleLabel]);

  const photos = draft.vehiclePhotos.slice(0, 6);

  const publish = () => {
    SubmissionSession.patch({
      shareCaption: caption,
      destination: "Carasta Community",
      sharedAt: new Date().toISOString(),
    });
    router.push("/mobile-listing/share/confirmation");
  };

  return (
    <MobileListingShell
      stepId="share-community"
      onContinue={publish}
      continueDisabled={!caption.trim()}
    >
      <div className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#1c1c1e]">Carasta Community Share</h1>
          <p className="mt-2 text-[14px] text-[#636366]">
            Compose a Carmunity post for your listing.
          </p>
        </div>

        <label className="block text-[12px] font-semibold text-[#636366]">
          Caption
          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="What's happening in your garage?"
            className="mt-1 min-h-28 w-full rounded-lg border border-[#e5e5ea] p-3 text-[13px] text-[#1c1c1e] outline-none focus:border-[#1b1464]"
          />
        </label>

        <label className="block text-[12px] font-semibold text-[#636366]">
          Tag People
          <input
            value={tagPeople}
            onChange={(event) => setTagPeople(event.target.value)}
            placeholder="@username"
            className="mt-1 h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>

        <label className="block text-[12px] font-semibold text-[#636366]">
          Tag Shops
          <input
            value={tagShops}
            onChange={(event) => setTagShops(event.target.value)}
            placeholder="@shop"
            className="mt-1 h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>

        <label className="block text-[12px] font-semibold text-[#636366]">
          Location
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="City, State"
            className="mt-1 h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>

        {photos.length > 0 ? (
          <div>
            <p className="text-[12px] font-semibold text-[#636366]">Photos</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square overflow-hidden rounded-lg bg-[#f4f5fc]"
                  style={
                    photo.previewUrl
                      ? {
                          backgroundImage: `url(${photo.previewUrl})`,
                          backgroundSize: "cover",
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </MobileListingShell>
  );
}
