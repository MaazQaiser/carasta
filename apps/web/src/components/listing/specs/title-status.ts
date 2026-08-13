/** Title status multi-select rules for Condition & History (all listing flows). */

export const TITLE_STATUS_OPTIONS = ["Clean", "Salvage", "Rebuilt", "Lien", "Unknown"] as const;

export type TitleStatusOption = (typeof TITLE_STATUS_OPTIONS)[number];

/** Mutually exclusive primary title states. */
const PRIMARY = new Set<TitleStatusOption>(["Clean", "Salvage", "Rebuilt"]);

export const TITLE_STATUS_RULES_COPY =
  "Select Clean, Salvage, or Rebuilt (one only). Lien can be paired with any of those. Unknown cannot be combined.";

export function parseTitleStatuses(value: string | undefined | null): TitleStatusOption[] {
  if (!value?.trim()) return [];
  const parts = value
    .split(/[,·|/]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const allowed = new Set<string>(TITLE_STATUS_OPTIONS);
  const next: TitleStatusOption[] = [];
  for (const part of parts) {
    if (allowed.has(part) && !next.includes(part as TitleStatusOption)) {
      next.push(part as TitleStatusOption);
    }
  }
  return normalizeTitleStatuses(next);
}

export function formatTitleStatuses(values: TitleStatusOption[]): string {
  return normalizeTitleStatuses(values).join(", ");
}

/**
 * Allowed sets:
 * - Unknown alone
 * - Clean | Salvage | Rebuilt alone
 * - Lien alone
 * - Clean + Lien | Salvage + Lien | Rebuilt + Lien
 */
export function normalizeTitleStatuses(values: TitleStatusOption[]): TitleStatusOption[] {
  if (values.includes("Unknown")) return ["Unknown"];
  const primary = values.find((value) => PRIMARY.has(value));
  const hasLien = values.includes("Lien");
  const next: TitleStatusOption[] = [];
  if (primary) next.push(primary);
  if (hasLien) next.push("Lien");
  return next;
}

/** Toggle one option while enforcing mutual exclusivity + Lien pairing only. */
export function toggleTitleStatus(
  current: TitleStatusOption[],
  option: TitleStatusOption
): TitleStatusOption[] {
  if (option === "Unknown") {
    return current.includes("Unknown") ? [] : ["Unknown"];
  }

  let next = current.filter((value) => value !== "Unknown");

  if (option === "Lien") {
    if (next.includes("Lien")) {
      return next.filter((value) => value !== "Lien");
    }
    // Lien may stand alone or pair with one primary.
    return normalizeTitleStatuses([...next, "Lien"]);
  }

  // Primary statuses: Clean / Salvage / Rebuilt — mutually exclusive.
  if (next.includes(option)) {
    return next.filter((value) => value !== option);
  }

  const keepLien = next.includes("Lien");
  next = [option];
  if (keepLien) next.push("Lien");
  return next;
}

export function isTitleStatusSelected(
  current: TitleStatusOption[],
  option: TitleStatusOption
): boolean {
  return current.includes(option);
}

export function isTitleStatusComplete(value: string | undefined | null): boolean {
  return parseTitleStatuses(value).length > 0;
}
