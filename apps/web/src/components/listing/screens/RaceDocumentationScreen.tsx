"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import { createListingMediaItems } from "../MediaUploadZone";
import { mergeUniqueMedia } from "../listing-media-library";
import { RaceDocumentationFields } from "../specs/RaceDocumentationFields";
import { FLOW4_DOCUMENTATION_COPY } from "../specs/race-track";
import { LISTING_PATHS } from "../listing-route-map";

/** Phase 1 Race / Track Documentation — type multi-select + shared document uploads. */
export function RaceDocumentationScreen() {
  const router = useRouter();
  const { draft, updateWorkspace, addMediaItems, removeMediaItem, syncCarriedForwardMedia } =
    useListingBuilder();
  const race = draft.modificationWorkspace.race;

  React.useEffect(() => {
    if (draft.listingTypeId && draft.listingTypeId !== "race-track-car") {
      router.replace(LISTING_PATHS.specifications);
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
    <ListingStep title={FLOW4_DOCUMENTATION_COPY.title}>
      <ListingSection>
        <RaceDocumentationFields
          race={race}
          onPatch={patchRace}
          onAddFiles={addUploads}
          onRemoveUpload={removeUpload}
          onSetUploadDate={setUploadDate}
        />
      </ListingSection>
    </ListingStep>
  );
}
