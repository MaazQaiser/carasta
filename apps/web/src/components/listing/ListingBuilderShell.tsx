"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ListingLayout } from "./ListingLayout";
import { ListingProgress } from "./ListingProgress";
import { ListingSummary } from "./ListingSummary";
import { ListingFooter } from "./ListingFooter";
import { LISTING_STEPS } from "./config";
import { ListingBuilderProvider, useListingBuilder } from "./ListingBuilderContext";
import { NotificationProvider, useListingNotifications } from "./notifications/NotificationProvider";
import { DraftRecovery } from "./DraftRecovery";
import { useAutosave } from "./hooks/useAutosave";
import { useCompletion } from "./hooks/useCompletion";
import { useUnsavedChanges } from "./hooks/useUnsavedChanges";
import { useListingKeyboardShortcuts } from "./hooks/useListingKeyboardShortcuts";
import {
  DraftService,
  isMeaningfulDraft,
  type PersistedListingDraft,
} from "./services/draft-service";

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
  const { completion, validation } = useCompletion(draft);

  const [pendingRecovery, setPendingRecovery] = React.useState<PersistedListingDraft | null>(null);
  const [recoveryChecked, setRecoveryChecked] = React.useState(false);
  const lastToastStatus = React.useRef<string>("idle");

  React.useEffect(() => {
    const saved = DraftService.load();
    if (saved && isMeaningfulDraft(saved.draft) && !isMeaningfulDraft(draft)) {
      setPendingRecovery(saved);
    }
    setRecoveryChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { status, lastSavedAt, saveNow } = useAutosave(draft, {
    enabled: recoveryChecked && !pendingRecovery,
    debounceMs: 1500,
    lastPath: pathname,
    activity,
    onSaved: () => {
      markClean();
      if (lastToastStatus.current !== "saved") {
        // Avoid toast spam — only notify on explicit save shortcut or status transition handled below.
      }
      lastToastStatus.current = "saved";
    },
  });

  React.useEffect(() => {
    if (status === "failed" && lastToastStatus.current !== "failed") {
      notify({ title: "Draft save failed", tone: "error" });
      lastToastStatus.current = "failed";
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

  const isTypeSpecificSpecsWorkspace =
    pathname.startsWith("/listing/specifications") &&
    (draft.listingTypeId === "stock-lightly-modified" ||
      draft.listingTypeId === "modified-performance" ||
      draft.listingTypeId === "restored-restomod-custom" ||
      draft.listingTypeId === "race-track-car");

  const isPostSubmitFlow =
    pathname.startsWith("/listing/submitted") || pathname.startsWith("/listing/share");

  const handleResume = () => {
    if (!pendingRecovery) return;
    replaceDraft(pendingRecovery.draft);
    setActivity(
      pendingRecovery.activity.length
        ? pendingRecovery.activity
        : [
            {
              id: "resumed",
              type: "system",
              label: "Draft resumed",
              at: new Date().toISOString(),
            },
          ]
    );
    markClean();
    setPendingRecovery(null);
    notify({ title: "Draft resumed", tone: "success" });
    if (pendingRecovery.lastPath) {
      router.push(pendingRecovery.lastPath);
    }
  };

  const handleStartNew = () => {
    DraftService.clear();
    resetDraft();
    markClean();
    setPendingRecovery(null);
    notify({ title: "Started new listing", tone: "default" });
    router.push("/listing/type");
  };

  return (
    <ListingLayout
      titleActions={
        !isPostSubmitFlow && pendingRecovery ? (
          <>
            <Button type="button" size="sm" onClick={handleResume}>
              Resume Draft
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={handleStartNew}>
              Start New Listing
            </Button>
          </>
        ) : undefined
      }
      progress={
        isPostSubmitFlow ? undefined : (
          <ListingProgress
            steps={LISTING_STEPS}
            completionPercent={completion.overallPercent}
          />
        )
      }
      summary={
        isTypeSpecificSpecsWorkspace || isPostSubmitFlow ? undefined : (
          <ListingSummary validation={validation} />
        )
      }
      footer={
        isTypeSpecificSpecsWorkspace || isPostSubmitFlow ? undefined : (
          <ListingFooter inset />
        )
      }
      header={
        isPostSubmitFlow ? undefined : pendingRecovery ? (
          <div className="mb-4 sm:mb-6">
            <DraftRecovery saved={pendingRecovery} />
          </div>
        ) : undefined
      }
    >
      {children}
    </ListingLayout>
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
