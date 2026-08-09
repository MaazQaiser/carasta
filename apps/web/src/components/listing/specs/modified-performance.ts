import {
  Cog,
  Gauge,
  Disc3,
  CircleDot,
  Wind,
  Armchair,
  Speaker,
  Shield,
  Factory,
  MoreHorizontal,
} from "lucide-react";
import type { SpecsFlowConfig, ModificationWorkspaceState } from "./types";
import { createEmptyPerformanceSummary, createEmptyRestorationState, createEmptyRaceState } from "./options";

/** Modified / Performance specifications & modifications config. */
export const MODIFIED_PERFORMANCE_SPECS_CONFIG: SpecsFlowConfig = {
  id: "modified-performance",
  label: "Modified / Performance",
  description:
    "Document performance specifications and every modification on this build.",
  showPerformanceSummary: true,
  categories: [
    {
      id: "powertrain",
      label: "Powertrain",
      description: "Engine, forced induction, exhaust, tuning",
      icon: Cog,
    },
    {
      id: "drivetrain",
      label: "Drivetrain",
      description: "Transmission, differential, axles, clutch",
      icon: Gauge,
    },
    {
      id: "chassis-handling",
      label: "Chassis / Handling",
      description: "Suspension, brakes, chassis reinforcement",
      icon: Disc3,
    },
    {
      id: "wheels-tires",
      label: "Wheels & Tires",
      description: "Wheels, tires, and fitment",
      icon: CircleDot,
    },
    {
      id: "exterior-aero",
      label: "Exterior / Aero",
      description: "Bodywork, aero, lighting",
      icon: Wind,
    },
    {
      id: "interior",
      label: "Interior",
      description: "Seats, cages, cabin upgrades",
      icon: Armchair,
    },
    {
      id: "electronics-audio",
      label: "Electronics / Audio",
      description: "ECU, gauges, audio, wiring",
      icon: Speaker,
    },
    {
      id: "safety",
      label: "Safety",
      description: "Harnesses, fire suppression, safety gear",
      icon: Shield,
    },
    {
      id: "factory-equipment",
      label: "Factory Equipment",
      description: "OEM packages and retained factory options",
      icon: Factory,
    },
    {
      id: "other",
      label: "Other",
      description: "Anything that doesn’t fit above",
      icon: MoreHorizontal,
    },
  ],
};

export function createModifiedPerformanceWorkspace(): ModificationWorkspaceState {
  const firstCategoryId = MODIFIED_PERFORMANCE_SPECS_CONFIG.categories[0]?.id ?? "powertrain";
  return {
    performanceSummary: createEmptyPerformanceSummary(),
    restoration: createEmptyRestorationState(),
    race: createEmptyRaceState(),
    entries: [],
    activeCategoryId: firstCategoryId,
    expandedEntryIds: [],
    editingEntryId: null,
    hasModifications: null,
    reviewedFactoryCategoryIds: [],
    factorySpecOverrides: {},
  };
}
