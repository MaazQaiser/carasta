"use client";

import * as React from "react";
import { MobileOptionSheet } from "@/components/mobile-listing/MobileOptionSheet";

/** Buyer bottom sheet — portals above the phone frame so it always opens. */
export function MobileBuyerSheet({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <MobileOptionSheet open={open} title={title} onClose={onClose} footer={footer}>
      {children}
    </MobileOptionSheet>
  );
}
