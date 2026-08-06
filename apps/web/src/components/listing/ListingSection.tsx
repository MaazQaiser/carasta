import * as React from "react";
import { cn } from "@/lib/utils";

export interface ListingSectionProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Generic section block inside a listing step.
 * Use for grouping fields later — no form logic here.
 */
export function ListingSection({
  title,
  description,
  children,
  className,
}: ListingSectionProps) {
  return (
    <section className={cn("space-y-3", className)}>
      {(title || description) && (
        <div>
          {title ? <h3 className="text-sm font-semibold">{title}</h3> : null}
          {description ? (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          ) : null}
        </div>
      )}
      {children ?? (
        <div className="rounded-xl border border-dashed bg-muted/20 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">Content placeholder</p>
        </div>
      )}
    </section>
  );
}
