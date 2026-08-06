import type { ProductVariant } from "@carasta/types";

export function parseVariantDetails(variant?: ProductVariant): {
  size?: string;
  color?: string;
  style?: string;
  label?: string;
} {
  if (!variant) return {};

  if (variant.name === "Options" || variant.value.includes("·")) {
    const map: Record<string, string> = {};
    for (const part of variant.value.split("·")) {
      const [key, ...rest] = part.split(":");
      if (!key || !rest.length) continue;
      map[key.trim()] = rest.join(":").trim();
    }
    return {
      size: map.Size,
      color: map.Color,
      style: map.Style,
      label: variant.value,
    };
  }

  if (variant.name === "Size") return { size: variant.value, label: variant.value };
  if (variant.name === "Color") return { color: variant.value, label: variant.value };
  if (variant.name === "Style") return { style: variant.value, label: variant.value };

  return { label: `${variant.name}: ${variant.value}` };
}
