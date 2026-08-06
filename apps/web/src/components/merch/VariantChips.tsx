"use client";

import type { ProductVariant } from "@carasta/types";
import { cn } from "@/lib/utils";

interface VariantChipsProps {
  variants: ProductVariant[];
  /** Selected variant id per group name, e.g. { Size: "mv-m", Color: "mv-blk" } */
  selectedByGroup: Record<string, string>;
  onSelect: (variant: ProductVariant) => void;
  className?: string;
}

/** Groups variants by name (Size / Color / Style) into chip rows. */
export function VariantChips({
  variants,
  selectedByGroup,
  onSelect,
  className,
}: VariantChipsProps) {
  const groups = variants.reduce<Record<string, ProductVariant[]>>((acc, v) => {
    const key = v.name || "Option";
    (acc[key] ??= []).push(v);
    return acc;
  }, {});

  return (
    <div className={cn("space-y-4", className)}>
      {Object.entries(groups).map(([name, options]) => (
        <div key={name}>
          <p className="text-sm font-medium mb-2">
            {name}
            {selectedByGroup[name] ? (
              <span className="text-muted-foreground font-normal">
                {" "}
                · {options.find((o) => o.id === selectedByGroup[name])?.value}
              </span>
            ) : null}
          </p>
          <div className="flex flex-wrap gap-2">
            {options.map((v) => {
              const active = selectedByGroup[name] === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={!v.inStock}
                  onClick={() => onSelect(v)}
                  className={cn(
                    "px-3.5 py-2 rounded-full text-sm font-medium border transition-colors",
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50",
                    !v.inStock &&
                      "opacity-40 line-through cursor-not-allowed hover:border-border"
                  )}
                >
                  {v.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function initialVariantSelection(variants: ProductVariant[]): Record<string, string> {
  const selected: Record<string, string> = {};
  for (const v of variants) {
    const group = v.name || "Option";
    if (selected[group]) continue;
    const firstInStock = variants.find((x) => (x.name || "Option") === group && x.inStock);
    if (firstInStock) selected[group] = firstInStock.id;
  }
  return selected;
}

/** Primary cart variant = first selected group option (prefer Size, then any). */
export function resolvePrimaryVariant(
  variants: ProductVariant[],
  selectedByGroup: Record<string, string>
): ProductVariant | undefined {
  const preferred =
    selectedByGroup.Size ||
    selectedByGroup.Color ||
    selectedByGroup.Style ||
    Object.values(selectedByGroup)[0];
  return variants.find((v) => v.id === preferred);
}
