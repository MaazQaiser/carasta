import type { ListingDraft, ListingMediaItem } from "./types";

export const LISTING_MEDIA_LIMITS = {
  /** Combined General Photos + Modification Photos maximum (current-condition listing photos). */
  maxPhotos: 200,
  /** Recommended minimum general photos to continue. */
  minPhotos: 20,
  maxVideos: 5,
  /** Max length guidance (seconds) for seller-facing copy. */
  maxVideoSeconds: 60,
  /** Videos are optional — 0 required to continue. */
  minVideos: 0,
} as const;

export const LISTING_MEDIA_COPY = {
  screenTitle: "Photos, Videos & Documents",
  photosTab: "Photos",
  videosTab: "Videos",
  documentsTab: "Documents",
  photosHelper:
    "Add clear, high-quality photos that show the vehicle accurately. Professional-quality photos can help your listing stand out to buyers.",
  racePhotosHelper:
    "Recommended (not required as separate uploads): exterior, cockpit, engine bay, undercarriage, roll cage, seats and harnesses, fire system and other safety equipment, suspension, brakes, wheels and tires, race-specific equipment, VIN or chassis plate, damage or repairs, and spares included with the sale.",
  videosHelper:
    "Videos are optional. Add up to 5 videos, each up to 1 minute long. Walkarounds, cold starts, engine-running clips, interior functions, and driving footage can help buyers better understand the vehicle.",
  documentsHelper:
    "Upload photos or PDFs of documents associated with this vehicle.",
  raceDocumentsHelper:
    "Race / track documents you added earlier appear here automatically. You don’t need to upload the same file twice.",
  generalPhotosTitle: "General Photos",
  generalPhotosHelper:
    "Current photos of the vehicle as it sits today — front/rear 3/4, sides, wheels, engine bay, interior, trunk, undercarriage, and any flaws.",
  modificationPhotosTitle: "Modification Photos",
  modificationPhotosHelper:
    "Photos connected to modifications, upgrades, or build entries. Earlier modification uploads carry forward automatically.",
  buildHistoryTitle: "Build History",
  buildHistoryHelper:
    "Historical build and restoration photos from earlier in this listing. They stay in your shared media library and do not replace current-condition General Photos.",
  coverBadge: "COVER",
  addCamera: "Camera",
  addCameraHint: "Take a photo",
  addGallery: "Gallery",
  addGalleryHint: "Choose from library",
  addFiles: "Files",
  addFilesHint: "Upload from files",
} as const;

export function listingPhotosHelper(draft: ListingDraft): string {
  if (draft.listingTypeId === "race-track-car") {
    return `${LISTING_MEDIA_COPY.photosHelper} ${LISTING_MEDIA_COPY.racePhotosHelper}`;
  }
  return LISTING_MEDIA_COPY.photosHelper;
}

export function listingDocumentsHelper(draft: ListingDraft): string {
  if (draft.listingTypeId === "race-track-car") {
    return `${LISTING_MEDIA_COPY.documentsHelper} ${LISTING_MEDIA_COPY.raceDocumentsHelper}`;
  }
  return LISTING_MEDIA_COPY.documentsHelper;
}

export function dedupeMediaItems(items: ListingMediaItem[]): ListingMediaItem[] {
  const seenIds = new Set<string>();
  const seenKeys = new Set<string>();
  const next: ListingMediaItem[] = [];
  for (const item of items) {
    if (!item?.id || seenIds.has(item.id)) continue;
    if (item.sourceKey && seenKeys.has(item.sourceKey)) continue;
    seenIds.add(item.id);
    if (item.sourceKey) seenKeys.add(item.sourceKey);
    next.push(item);
  }
  return next;
}

export function mergeUniqueMedia(
  existing: ListingMediaItem[],
  incoming: ListingMediaItem[]
): ListingMediaItem[] {
  return dedupeMediaItems([...existing, ...incoming]);
}

/**
 * Current-condition modification photos from modification/build entries.
 * Does not include historical restoration/build-history media.
 */
export function collectCarriedModificationPhotos(draft: ListingDraft): ListingMediaItem[] {
  const fromEntries = draft.modificationWorkspace.entries.flatMap((entry) => entry.photos ?? []);
  // Race documentation photos are current race-vehicle media tied to the adaptive flow.
  const fromRace =
    draft.listingTypeId === "race-track-car"
      ? (draft.modificationWorkspace.race.documentation.photos ?? [])
      : [];
  return dedupeMediaItems([...fromEntries, ...fromRace]);
}

/**
 * Historical build/restoration photos — shared library access only.
 * Must not replace or count as current-condition listing photos.
 */
export function collectBuildHistoryMedia(draft: ListingDraft): ListingMediaItem[] {
  const resto = draft.modificationWorkspace.restoration.documentation;
  return dedupeMediaItems([...(resto.historicalBuildPhotos ?? [])]);
}

/** Whether the Modification Photos group should appear for this listing. */
export function showModificationPhotosSection(draft: ListingDraft): boolean {
  if (
    draft.listingTypeId === "stock-lightly-modified" &&
    draft.modificationWorkspace.hasModifications === false
  ) {
    return false;
  }
  if (draft.listingTypeId === "race-track-car") {
    return (
      draft.modificationPhotos.length > 0 || collectCarriedModificationPhotos(draft).length > 0
    );
  }
  return (
    draft.listingTypeId === "modified-performance" ||
    draft.listingTypeId === "restored-restomod-custom" ||
    draft.modificationWorkspace.hasModifications === true ||
    draft.modificationPhotos.length > 0 ||
    collectCarriedModificationPhotos(draft).length > 0
  );
}

/** @deprecated Prefer showModificationPhotosSection */
export function hideModificationPhotosSection(draft: ListingDraft): boolean {
  return !showModificationPhotosSection(draft);
}

/** Whether build-history media should be surfaced (read-only library access). */
export function showBuildHistorySection(draft: ListingDraft): boolean {
  return collectBuildHistoryMedia(draft).length > 0;
}

/** Videos already attached earlier in adaptive flows (e.g. race documentation). */
export function collectCarriedVideos(draft: ListingDraft): ListingMediaItem[] {
  return dedupeMediaItems(draft.modificationWorkspace.race.documentation.videos ?? []);
}

/** Documents already attached earlier in adaptive flows. */
export function collectCarriedDocuments(draft: ListingDraft): ListingMediaItem[] {
  const fromEntries = draft.modificationWorkspace.entries.flatMap((entry) => [
    ...(entry.receipt ?? []),
    ...(entry.dynoSheet ?? []),
    ...(entry.installationInvoice ?? []),
    ...(entry.warranty ?? []),
    ...(entry.supportingDocuments ?? []),
  ]);
  const resto = draft.modificationWorkspace.restoration.documentation;
  const fromRestoration = [
    ...(resto.buildBook ?? []),
    ...(resto.receiptsAndInvoices ?? []),
    ...(resto.factoryDocuments ?? []),
    ...(resto.certificates ?? []),
    ...(resto.magazineFeatures ?? []),
    ...(resto.awards ?? []),
    ...(resto.judgingSheets ?? []),
    ...(resto.other ?? []),
  ];
  const race = draft.modificationWorkspace.race.documentation;
  const fromRace = [
    ...(race.logbook ?? []),
    ...(race.inspectionReports ?? []),
    ...(race.certificationDocuments ?? []),
    ...(race.dynoSheets ?? []),
    ...(race.raceResults ?? []),
    ...(race.setupSheets ?? []),
    ...(race.dataLogs ?? []),
    ...(race.technicalReports ?? []),
    ...(draft.modificationWorkspace.race.documentationUploads ?? []),
  ];
  return dedupeMediaItems([...fromEntries, ...fromRestoration, ...fromRace]);
}

/** Current-condition listing photos only (excludes build-history media). */
export function totalListingPhotos(draft: ListingDraft): number {
  return (
    draft.vehiclePhotos.length +
    mergeUniqueMedia(draft.modificationPhotos, collectCarriedModificationPhotos(draft)).length
  );
}
