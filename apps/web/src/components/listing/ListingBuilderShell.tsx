"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ListingLayout } from "./ListingLayout";
import { ListingProgress } from "./ListingProgress";
import { ListingFooter } from "./ListingFooter";
import { ListingBuilderProvider, useListingBuilder } from "./ListingBuilderContext";
import { NotificationProvider, useListingNotifications } from "./notifications/NotificationProvider";
import { useAutosave } from "./hooks/useAutosave";
import { useUnsavedChanges } from "./hooks/useUnsavedChanges";
import { useListingKeyboardShortcuts } from "./hooks/useListingKeyboardShortcuts";
import {
  DraftService,
  isMeaningfulDraft,
} from "./services/draft-service";
import {
  isNestedListingFlow,
  LISTING_PATHS,
} from "./listing-route-map";

/** Context for triggering the Save Draft & Exit dialog from the footer. */
type SaveDraftExitContextValue = { openSaveDraftExit: () => void };
const SaveDraftExitContext = React.createContext<SaveDraftExitContextValue | null>(null);

export function useSaveDraftExit() {
  const ctx = React.useContext(SaveDraftExitContext);
  if (!ctx) throw new Error("useSaveDraftExit must be used within ListingBuilderShell");
  return ctx;
}

function ListingProductionBridge({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    draft,
    activity,
    setActivity,
    addActivity,
    replaceDraft,
    resetDraft,
    isDirty,
    markClean,
    cancelEntryEdit,
  } = useListingBuilder();
  const { notify } = useListingNotifications();

  const [recoveryChecked, setRecoveryChecked] = React.useState(false);
  const [saveExitOpen, setSaveExitOpen] = React.useState(false);
  const initialized = React.useRef(false);

  React.useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const saved = DraftService.load();
    if (saved && isMeaningfulDraft(saved.draft) && !isMeaningfulDraft(draft)) {
      replaceDraft(saved.draft);
      setActivity(saved.activity ?? []);
      if (saved.lastPath && saved.lastPath !== pathname) {
        router.replace(saved.lastPath);
      }
    }
    setRecoveryChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { status, saveNow } = useAutosave(draft, {
    enabled: recoveryChecked,
    debounceMs: 1500,
    lastPath: pathname,
    activity,
    onSaved: () => markClean(),
  });

  React.useEffect(() => {
    if (status === "failed") {
      notify({ title: "Draft save failed", tone: "error" });
    }
  }, [notify, status]);

  useUnsavedChanges(isDirty && status !== "saved");

  useListingKeyboardShortcuts({
    onSave: () => {
      const envelope = saveNow();
      if (envelope) {
        markClean();
        addActivity("Draft saved", "save");
        notify({ title: "Draft Saved", tone: "success" });
      } else {
        notify({ title: "Draft save failed", tone: "error" });
      }
    },
    onEscape: () => cancelEntryEdit(),
  });

  const isNestedFlow = isNestedListingFlow(pathname);
  const isPostSubmitFlow =
    pathname.startsWith(LISTING_PATHS.submitted) ||
    pathname.startsWith(LISTING_PATHS.share);
  // Per plan: hide progress only on nested mod-add/shop-builder, not on submitted/share.
  const hideProgress = isNestedFlow;

  const handleSaveAndExit = React.useCallback(() => {
    if (isDirty) saveNow();
    setSaveExitOpen(false);
    router.push("/");
  }, [isDirty, saveNow, router]);

  const handleDiscardAndExit = React.useCallback(() => {
    DraftService.clear();
    resetDraft();
    setSaveExitOpen(false);
    router.push("/");
  }, [resetDraft, router]);

  const saveDraftExitCtx = React.useMemo<SaveDraftExitContextValue>(
    () => ({ openSaveDraftExit: () => setSaveExitOpen(true) }),
    []
  );

  return (
    <SaveDraftExitContext.Provider value={saveDraftExitCtx}>
      <ListingLayout
        progress={hideProgress ? undefined : <ListingProgress />}
        footer={hideProgress || isPostSubmitFlow ? undefined : <ListingFooter inset />}
      >
        {children}
      </ListingLayout>

      {saveExitOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-[330px] rounded-2xl bg-white p-5 text-center shadow-xl">
            <h2 className="text-[18px] font-bold text-foreground">Save Draft?</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Your progress will be saved and you can continue listing later.
            </p>
            <button
              type="button"
              onClick={handleSaveAndExit}
              className="mt-5 h-11 w-full rounded-lg bg-primary text-[13px] font-semibold text-primary-foreground"
            >
              Save &amp; Exit
            </button>
            <button
              type="button"
              onClick={handleDiscardAndExit}
              className="mt-3 text-[12px] font-semibold text-destructive"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={() => setSaveExitOpen(false)}
              className="mt-3 block w-full text-[12px] text-muted-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </SaveDraftExitContext.Provider>
  );
}

export function ListingBuilderShell({ children }: { children: React.ReactNode }) {
  return (
    <ListingBuilderProvider>
      <NotificationProvider>
        <ListingProductionBridge>{children}</ListingProductionBridge>
      </NotificationProvider>
    </ListingBuilderProvider>
  );
}
