import type { ListingDraft, ModificationEntry } from "@/components/listing/types";

export type ShopBuilderTarget =
  | "entry.shopBuilder"
  | "entry.workPerformedBy"
  | "restoration.shop"
  | "race.identity.builder"
  | "race.safety.rollCageBuilder"
  | "race.shopBuilder";

export type ShopBuilderPickerSession = {
  returnTo: string;
  target: ShopBuilderTarget;
  entryId?: string;
  label?: string;
};

const SESSION_KEY = "carasta.mobile.shopBuilder.picker";

function canUseStorage() {
  return typeof window !== "undefined";
}

export const ShopBuilderSession = {
  start(session: ShopBuilderPickerSession) {
    if (!canUseStorage()) return;
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  load(): ShopBuilderPickerSession | null {
    if (!canUseStorage()) return null;
    try {
      const raw = window.sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as ShopBuilderPickerSession;
    } catch {
      return null;
    }
  },

  clear() {
    if (!canUseStorage()) return;
    window.sessionStorage.removeItem(SESSION_KEY);
  },
};

export function applyShopBuilderSelection(
  draft: ListingDraft,
  target: ShopBuilderTarget,
  name: string,
  entryId?: string
): ListingDraft {
  const ws = draft.modificationWorkspace;

  if (target === "entry.shopBuilder" || target === "entry.workPerformedBy") {
    if (!entryId) return draft;
    const field = target === "entry.shopBuilder" ? "shopBuilder" : "workPerformedBy";
    return {
      ...draft,
      modificationWorkspace: {
        ...ws,
        entries: ws.entries.map((entry) =>
          entry.id === entryId ? { ...entry, [field]: name } : entry
        ),
        editingEntryId: entryId,
      },
    };
  }

  if (target === "restoration.shop") {
    return {
      ...draft,
      modificationWorkspace: {
        ...ws,
        restoration: {
          ...ws.restoration,
          shopBuilder: name,
          factoryCorrect: {
            ...ws.restoration.factoryCorrect,
            restorationShop: name,
            builder: name,
          },
        },
      },
    };
  }

  if (target === "race.shopBuilder") {
    return {
      ...draft,
      modificationWorkspace: {
        ...ws,
        race: {
          ...ws.race,
          shopBuilder: name,
          identity: {
            ...ws.race.identity,
            builder: name,
          },
        },
      },
    };
  }

  if (target === "race.identity.builder") {
    return {
      ...draft,
      modificationWorkspace: {
        ...ws,
        race: {
          ...ws.race,
          identity: {
            ...ws.race.identity,
            builder: name,
          },
        },
      },
    };
  }

  if (target === "race.safety.rollCageBuilder") {
    return {
      ...draft,
      modificationWorkspace: {
        ...ws,
        race: {
          ...ws.race,
          safety: {
            ...ws.race.safety,
            rollCageBuilder: name,
          },
        },
      },
    };
  }

  return draft;
}

export function persistModificationEntry(
  draft: ListingDraft,
  entry: ModificationEntry
): ListingDraft {
  const ws = draft.modificationWorkspace;
  const exists = ws.entries.some((item) => item.id === entry.id);
  return {
    ...draft,
    modificationWorkspace: {
      ...ws,
      entries: exists
        ? ws.entries.map((item) => (item.id === entry.id ? { ...entry } : item))
        : [...ws.entries, entry],
      editingEntryId: entry.id,
    },
  };
}
