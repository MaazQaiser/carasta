"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { createListingMediaItems } from "@/components/listing/MediaUploadZone";
import { mergeUniqueMedia } from "@/components/listing/listing-media-library";
import { RaceDocumentationFields } from "@/components/listing/specs/RaceDocumentationFields";
import {
  FLOW4_DOCUMENTATION_COPY,
  isRaceDocumentationComplete,
} from "@/components/listing/specs/race-track";
import { MobileListingShell } from "../MobileListingShell";

export function MobileRaceDocumentationScreen() {
  const router = useRouter();
  const { draft, updateWorkspace, addMediaItems, removeMediaItem, syncCarriedForwardMedia } =
    useListingBuilder();
  const race = draft.modificationWorkspace.race;

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "race-track-car") {
      router.replace("/mobile-listing/specifications");
    }
  }, [draft.listingTypeId, router]);

  React.useEffect(() => {
    syncCarriedForwardMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- carry into shared Documents once
  }, []);

  const patchRace = (patch: Partial<typeof race>) => {
    updateWorkspace({
      race: { ...race, ...patch },
    });
  };

  const addUploads = (files: FileList | null) => {
    const items = createListingMediaItems(files);
    if (!items.length) return;
    patchRace({
      documentationUploads: mergeUniqueMedia(race.documentationUploads ?? [], items),
    });
    addMediaItems("documents", items);
  };

  const removeUpload = (id: string) => {
    patchRace({
      documentationUploads: (race.documentationUploads ?? []).filter((item) => item.id !== id),
    });
    removeMediaItem("documents", id);
  };

  const setUploadDate = (id: string, documentDate: string) => {
    patchRace({
      documentationUploads: (race.documentationUploads ?? []).map((item) =>
        item.id === id ? { ...item, documentDate } : item
      ),
    });
  };

  return (
    <MobileListingShell
      stepId="race-documentation"
      continueDisabled={!isRaceDocumentationComplete(race)}
      continueHref="/mobile-listing/race/spares"
    >
      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <h1 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e]">
          {FLOW4_DOCUMENTATION_COPY.title}
        </h1>
        <RaceDocumentationFields
          variant="mobile"
          race={race}
          onPatch={patchRace}
          onAddFiles={addUploads}
          onRemoveUpload={removeUpload}
          onSetUploadDate={setUploadDate}
        />
      </div>
    </MobileListingShell>
  );
}
