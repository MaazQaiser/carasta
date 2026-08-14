import {
  Cog,
  Gauge,
  Disc3,
  CircleStop,
  CircleDot,
  Wind,
  Armchair,
  Speaker,
  Shield,
  MoreHorizontal,
} from "lucide-react";
import type { SpecsCategoryDefinition } from "./types";

/**
 * Canonical modification categories shared across Stock, Modified,
 * and Race modification entry screens. Restoration uses its own list.
 */
export const SHARED_MODIFICATION_CATEGORIES: SpecsCategoryDefinition[] = [
  {
    id: "engine-performance",
    label: "Engine & Performance",
    description: "Engine, induction, exhaust, and tuning",
    icon: Cog,
  },
  {
    id: "transmission-drivetrain",
    label: "Transmission & Drivetrain",
    description: "Gearbox, differential, axles, and driveline",
    icon: Gauge,
  },
  {
    id: "suspension-handling",
    label: "Suspension & Handling",
    description: "Suspension, steering, and chassis dynamics",
    icon: Disc3,
  },
  {
    id: "brakes",
    label: "Brakes",
    description: "Brake system and cooling",
    icon: CircleStop,
  },
  {
    id: "wheels-tires",
    label: "Wheels & Tires",
    description: "Wheels, tires, and fitment",
    icon: CircleDot,
  },
  {
    id: "exterior-aero",
    label: "Exterior & Aero",
    description: "Bodywork, aero, and exterior changes",
    icon: Wind,
  },
  {
    id: "interior",
    label: "Interior",
    description: "Cabin, seats, and interior trim",
    icon: Armchair,
  },
  {
    id: "electronics-audio",
    label: "Electronics & Audio",
    description: "Electronics, gauges, and audio",
    icon: Speaker,
  },
  {
    id: "safety-equipment",
    label: "Safety Equipment",
    description: "Safety systems and equipment",
    icon: Shield,
  },
  {
    id: "other",
    label: "Other",
    description: "Anything that doesn’t fit above",
    icon: MoreHorizontal,
  },
];

export const SHARED_MODIFICATION_CATEGORY_IDS = SHARED_MODIFICATION_CATEGORIES.map(
  (category) => category.id
);

/** Previous per-flow category ids mapped onto the shared list. */
const LEGACY_MODIFICATION_CATEGORY_IDS: Record<string, string> = {
  powertrain: "engine-performance",
  drivetrain: "transmission-drivetrain",
  "chassis-handling": "suspension-handling",
  "engine-powertrain": "engine-performance",
  "suspension-steering": "suspension-handling",
  "suspension-steering-brakes": "suspension-handling",
  "build-restoration": "exterior-aero",
  "exterior-body-paint": "exterior-aero",
  "aerodynamics-bodywork": "exterior-aero",
  "electrical-audio": "electronics-audio",
  "data-electronics": "electronics-audio",
  "cockpit-controls": "interior",
  safety: "safety-equipment",
  "factory-equipment": "other",
  "original-factory-equipment": "other",
  "chassis-structure": "other",
  "fuel-system": "other",
  "cooling-system": "other",
  "spares-support": "other",
  "setup-information": "other",
  "competition-classification": "other",
};

export function normalizeModificationCategoryId(id: string | null | undefined): string {
  if (!id) return SHARED_MODIFICATION_CATEGORIES[0]?.id ?? "engine-performance";
  if (SHARED_MODIFICATION_CATEGORY_IDS.includes(id)) return id;
  return LEGACY_MODIFICATION_CATEGORY_IDS[id] ?? "other";
}

export function getSharedModificationCategoryLabel(id: string | null | undefined): string {
  if (!id) return "";
  const normalized = normalizeModificationCategoryId(id);
  return SHARED_MODIFICATION_CATEGORIES.find((category) => category.id === normalized)?.label ?? id;
}

export function normalizeModificationEntries<T extends { categoryId: string }>(entries: T[]): T[] {
  return entries.map((entry) => ({
    ...entry,
    categoryId: normalizeModificationCategoryId(entry.categoryId),
  }));
}
