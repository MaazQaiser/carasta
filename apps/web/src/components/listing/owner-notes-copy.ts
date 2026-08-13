/** Shared Owner's Notes copy — free-form seller context only (not structured fields). */

export const OWNER_NOTES_COPY = {
  title: "Owner's Notes",
  subtext: "Share any important details buyers should know before bidding.",
  /** Non-stock / modified / restored / race — may mention modifications. */
  placeholderDefault:
    "Describe your ownership experience, any unique details about the vehicle, maintenance history highlights, modifications, or anything a potential buyer should know...",
  /** Stock with no modifications — do not mention modifications. */
  placeholderStock:
    "Describe your ownership experience, any unique details about the vehicle, maintenance history highlights, or anything a potential buyer should know...",
  maxLength: 2000,
} as const;

export function isStockWithoutModifications(draft: {
  listingTypeId: string | null;
  modificationWorkspace: { hasModifications: boolean | null };
}): boolean {
  return (
    draft.listingTypeId === "stock-lightly-modified" &&
    draft.modificationWorkspace.hasModifications === false
  );
}

export function ownerNotesPlaceholder(draft: {
  listingTypeId: string | null;
  modificationWorkspace: { hasModifications: boolean | null };
}): string {
  return isStockWithoutModifications(draft)
    ? OWNER_NOTES_COPY.placeholderStock
    : OWNER_NOTES_COPY.placeholderDefault;
}
