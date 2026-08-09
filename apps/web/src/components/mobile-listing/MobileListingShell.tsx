"use client";

import * as React from "react";
import {
  useMobileListingChrome,
  type MobileListingChromeConfig,
} from "./MobileListingRuntime";

interface MobileListingShellProps {
  children: React.ReactNode;
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
}

/**
 * Registers chrome config with the persistent runtime and renders page content only.
 * Header/footer/autosave stay mounted across navigations for faster transitions.
 */
export function MobileListingShell({
  children,
  stepId,
  onContinue,
  onBack,
  continueHref,
  continueDisabled = false,
  hideFooter = false,
  hideProgress = false,
  hideSaveDraftExit = false,
  backLabel,
  continueLabel,
}: MobileListingShellProps) {
  const { setChrome } = useMobileListingChrome();
  const onContinueRef = React.useRef(onContinue);
  const onBackRef = React.useRef(onBack);
  onContinueRef.current = onContinue;
  onBackRef.current = onBack;

  React.useLayoutEffect(() => {
    const config: MobileListingChromeConfig = {
      stepId,
      continueHref,
      continueDisabled,
      hideFooter,
      hideProgress,
      hideSaveDraftExit,
      backLabel,
      continueLabel,
      onContinue: () => onContinueRef.current?.(),
      onBack: onBackRef.current ? () => onBackRef.current?.() : undefined,
    };
    setChrome(config);
  }, [
    stepId,
    continueHref,
    continueDisabled,
    hideFooter,
    hideProgress,
    hideSaveDraftExit,
    backLabel,
    continueLabel,
    setChrome,
    onBack,
  ]);

  return <>{children}</>;
}
