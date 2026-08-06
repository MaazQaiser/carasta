import * as React from "react";
import { cn } from "@/lib/utils";

export interface ListingContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main content container for a listing step.
 * Matches existing card surfaces used across the app.
 */
export function ListingContent({ children, className }: ListingContentProps) {
  return (
    <div className={cn("rounded-2xl border bg-card p-4 sm:p-6", className)}>
      {children}
    </div>
  );
}
