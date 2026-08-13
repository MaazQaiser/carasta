"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { DraftService, isMeaningfulDraft } from "@/components/listing/services/draft-service";
import { useAutosave } from "@/components/listing/hooks/useAutosave";
import { MobileListingHeader } from "./MobileListingHeader";
import { MobileStepProgress } from "./MobileStepProgress";
import { MobileListingFooter } from "./MobileListingFooter";
import { getMobileStep, MOBILE_SHARED_BACK_HREF } from "./config";
import { ShopBuilderSession } from "./shop-builder/shop-builder-session";

export type MobileListingChromeConfig = {
  stepId: string;
  onContinue?: () => void;
  onBack?: () => void;
  continueHref?: string;
  continueDisabled?: boolean;
  hideFooter?: boolean;
  hideProgress?: boolean;
  hideSaveDraftExit?: boolean;
  backLabel?: string;
  continueLabel?: string;
};

const NESTED_FLOW_STEP_IDS = new Set([
  "stock-mod-add",
  "modified-mod-add",
  "restored-mod-add",
  "race-mod-add",
  "shop-builder",
  "shop-builder-add",
]);

type ChromeContextValue = {
  setChrome: (config: MobileListingChromeConfig) => void;
  navigate: (href: string) => void;
};

const ChromeContext = React.createContext<ChromeContextValue | null>(null);

const DEFAULT_CHROME: MobileListingChromeConfig = {
  stepId: "type",
  continueDisabled: true,
  hideFooter: false,
};

export function useMobileListingChrome() {
  const ctx = React.useContext(ChromeContext);
  if (!ctx) {
    throw new Error("useMobileListingChrome must be used within MobileListingRuntime");
  }
  return ctx;
}

function resolveBackHref(stepId: string, listingTypeId: string | null | undefined) {
  if (stepId === "shop-builder-add") return "/mobile-listing/shop-builder";
  if (stepId === "shop-builder") {
    const session = ShopBuilderSession.load();
    ShopBuilderSession.clear();
    return session?.returnTo || "/mobile-listing/type";
  }
  if (stepId === "condition" && listingTypeId === "stock-lightly-modified") {
    return "/mobile-listing/stock/specifications";
  }
  if (stepId === "condition" && listingTypeId === "modified-performance") {
    return "/mobile-listing/modified/specifications";
  }
  if (stepId === "condition" && listingTypeId === "restored-restomod-custom") {
    return "/mobile-listing/restored/specifications";
  }
  if (stepId === "condition" && listingTypeId === "race-track-car") {
    return "/mobile-listing/race/specifications";
  }
  return MOBILE_SHARED_BACK_HREF[stepId] || null;
}

function prefetchForPath(
  router: ReturnType<typeof useRouter>,
  pathname: string,
  listingTypeId: string | null | undefined
) {
  const candidates = new Set<string>();

  if (pathname.includes("/type")) candidates.add("/mobile-listing/identify");
  if (pathname.includes("/identify")) {
    candidates.add("/mobile-listing/details");
    candidates.add("/mobile-listing/identify/manual");
  }
  if (pathname.includes("/details")) {
    if (listingTypeId === "stock-lightly-modified") {
      candidates.add("/mobile-listing/stock/specifications");
    } else if (listingTypeId === "modified-performance") {
      candidates.add("/mobile-listing/modified/specifications");
    } else if (listingTypeId === "restored-restomod-custom") {
      candidates.add("/mobile-listing/restored/specifications");
    } else if (listingTypeId === "race-track-car") {
      candidates.add("/mobile-listing/race/summary");
    } else {
      candidates.add("/mobile-listing/specifications");
    }
  }
  if (pathname.includes("/race/summary")) candidates.add("/mobile-listing/race/biography");
  if (pathname.includes("/race/biography")) candidates.add("/mobile-listing/race/specifications");
  if (pathname.includes("/specifications")) candidates.add("/mobile-listing/condition");
  if (pathname.includes("/condition")) candidates.add("/mobile-listing/photos");
  if (pathname.includes("/photos")) candidates.add("/mobile-listing/notes");
  if (pathname.includes("/notes")) candidates.add("/mobile-listing/ai");
  if (pathname.includes("/ai")) candidates.add("/mobile-listing/settings");
  if (pathname.includes("/settings")) candidates.add("/mobile-listing/preview");
  if (pathname.includes("/buyer-preview")) candidates.add("/mobile-listing/review");
  else if (pathname.includes("/preview")) candidates.add("/mobile-listing/buyer-preview");
  if (pathname.includes("/review")) candidates.add("/mobile-listing/submitted");
  if (pathname.includes("/submitted")) candidates.add("/mobile-listing/share/external");
  if (pathname.includes("/share/external")) candidates.add("/mobile-listing/share/community");
  if (pathname.includes("/share/community")) candidates.add("/mobile-listing/share/confirmation");
  candidates.add("/mobile-listing/shop-builder");

  for (const href of candidates) {
    router.prefetch(href);
  }
}

/** Persistent phone chrome + autosave. Survives route changes so navigation stays snappy. */
export function MobileListingRuntime({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { draft, activity, markClean, isDirty, replaceDraft, setActivity } = useListingBuilder();

  const [chrome, setChrome] = React.useState<MobileListingChromeConfig>(DEFAULT_CHROME);
  const [isReady, setIsReady] = React.useState(false);
  const [saveExitOpen, setSaveExitOpen] = React.useState(false);
  const initialized = React.useRef(false);

  React.useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const saved = DraftService.load();
    if (saved && isMeaningfulDraft(saved.draft) && !isMeaningfulDraft(draft)) {
      replaceDraft(saved.draft);
      setActivity(saved.activity ?? []);
    }
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { status, saveNow } = useAutosave(draft, {
    enabled: isReady,
    debounceMs: 2000,
    lastPath: pathname,
    activity,
    onSaved: () => markClean(),
  });

  const navigate = React.useCallback(
    (href: string) => {
      router.prefetch(href);
      React.startTransition(() => {
        router.push(href);
      });
    },
    [router]
  );

  React.useEffect(() => {
    prefetchForPath(router, pathname, draft.listingTypeId);
  }, [router, pathname, draft.listingTypeId]);

  React.useEffect(() => {
    if (chrome.continueHref) router.prefetch(chrome.continueHref);
  }, [chrome.continueHref, router]);

  const handleBack = React.useCallback(() => {
    if (chrome.onBack) {
      chrome.onBack();
      return;
    }
    const href = resolveBackHref(chrome.stepId, draft.listingTypeId);
    if (href) {
      navigate(href);
      return;
    }
    React.startTransition(() => {
      router.back();
    });
  }, [chrome, draft.listingTypeId, navigate, router]);

  const confirmSaveAndExit = React.useCallback(() => {
    if (isDirty) saveNow();
    navigate("/");
  }, [isDirty, navigate, saveNow]);

  const step = getMobileStep(chrome.stepId);
  const showProgress =
    !chrome.hideProgress &&
    !NESTED_FLOW_STEP_IDS.has(chrome.stepId) &&
    Boolean(step);
  const ctx = React.useMemo(() => ({ setChrome, navigate }), [navigate]);

  return (
    <ChromeContext.Provider value={ctx}>
      <div className="ml-phone-frame">
        <div className="ml-shell relative w-full" data-step={chrome.stepId}>
          <MobileListingHeader onBack={handleBack} saveStatus={status} />
          {showProgress && step ? (
            <MobileStepProgress step={step.index} total={step.total} />
          ) : null}

          <div className="ml-shell-scroll">{children}</div>

          {chrome.hideFooter ? null : (
            <MobileListingFooter
              onBack={handleBack}
              onContinue={chrome.onContinue}
              continueHref={chrome.continueHref}
              continueDisabled={chrome.continueDisabled}
              backLabel={chrome.backLabel}
              continueLabel={chrome.continueLabel}
              hideSaveDraftExit={chrome.hideSaveDraftExit}
              onSaveDraftExit={() => setSaveExitOpen(true)}
            />
          )}

          {saveExitOpen ? (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
              <div className="w-full max-w-[330px] rounded-2xl bg-white p-5 text-center shadow-xl">
                <h2 className="text-[18px] font-bold text-[#1c1c1e]">Save Draft?</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-[#636366]">
                  Your progress will be saved and you can continue listing later.
                </p>
                <button
                  type="button"
                  onClick={confirmSaveAndExit}
                  className="mt-5 h-11 w-full rounded-lg bg-[#1b1464] text-[13px] font-semibold text-white"
                >
                  Save &amp; Exit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSaveExitOpen(false);
                    navigate("/");
                  }}
                  className="mt-3 text-[12px] font-semibold text-[#d34a4a]"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ChromeContext.Provider>
  );
}
