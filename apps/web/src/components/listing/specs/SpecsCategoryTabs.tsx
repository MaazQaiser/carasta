"use client";

import { cn } from "@/lib/utils";
import type { SpecsCategoryDefinition } from "./types";

/**
 * Category / section tabs.
 * `vertical` is responsive: horizontal scroll on small screens, vertical list from md up.
 */
export function SpecsCategoryTabs({
  categories,
  activeCategoryId,
  entryCounts,
  onSelect,
  className,
  ariaLabel = "Specification sections",
  orientation = "horizontal",
}: {
  categories: SpecsCategoryDefinition[];
  activeCategoryId: string;
  entryCounts?: Record<string, number>;
  onSelect: (categoryId: string) => void;
  className?: string;
  ariaLabel?: string;
  orientation?: "horizontal" | "vertical";
}) {
  const vertical = orientation === "vertical";

  return (
    <div className={cn("rounded-2xl border bg-card p-1.5 sm:p-2 min-w-0", className)}>
      <nav
        aria-label={ariaLabel}
        className={cn(
          "scrollbar-hide",
          vertical
            ? "-mx-0.5 overflow-x-auto md:mx-0 md:overflow-x-visible md:overflow-y-auto md:max-h-[min(28rem,70vh)]"
            : "-mx-0.5 overflow-x-auto"
        )}
      >
        <div
          className={cn(
            "gap-1",
            vertical
              ? "flex min-w-max px-0.5 snap-x snap-mandatory md:min-w-0 md:flex-col md:px-0 md:snap-none"
              : "flex min-w-max px-0.5 snap-x snap-mandatory"
          )}
          role="tablist"
          aria-orientation={vertical ? "vertical" : "horizontal"}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            const active = category.id === activeCategoryId;
            const count = entryCounts?.[category.id];

            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelect(category.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors snap-start",
                  vertical
                    ? "whitespace-nowrap md:w-full md:justify-between md:whitespace-normal md:text-left"
                    : "whitespace-nowrap",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                <span className="inline-flex items-center gap-1.5 min-w-0">
                  {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" /> : null}
                  <span className={cn(vertical && "md:truncate")}>{category.label}</span>
                </span>
                {typeof count === "number" ? (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums shrink-0",
                      active ? "bg-primary-foreground/20" : "bg-muted"
                    )}
                  >
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
