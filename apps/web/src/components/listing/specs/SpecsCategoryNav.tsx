"use client";

import { cn } from "@/lib/utils";
import type { SpecsCategoryDefinition } from "./types";

export function SpecsCategoryNav({
  categories,
  activeCategoryId,
  entryCounts,
  onSelect,
  className,
}: {
  categories: SpecsCategoryDefinition[];
  activeCategoryId: string;
  entryCounts: Record<string, number>;
  onSelect: (categoryId: string) => void;
  className?: string;
}) {
  return (
    <nav
      aria-label="Modification categories"
      className={cn(
        "rounded-2xl border bg-card p-3 space-y-1 sticky top-20",
        className
      )}
    >
      <h3 className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Categories
      </h3>
      {categories.map((category) => {
        const Icon = category.icon;
        const active = category.id === activeCategoryId;
        const count = entryCounts[category.id] ?? 0;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={cn(
              "w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            {Icon ? <Icon className="h-4 w-4 shrink-0 opacity-80" /> : null}
            <span className="flex-1 min-w-0 truncate font-medium">{category.label}</span>
            <span
              className={cn(
                "text-[11px] font-semibold tabular-nums rounded-full px-1.5 py-0.5",
                active ? "bg-primary-foreground/20" : "bg-muted"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
