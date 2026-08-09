import {
  Frame,
  Cog,
  Gauge,
  Disc3,
  CircleStop,
  CircleDot,
  Wind,
  Joystick,
  Cpu,
  Fuel,
  Thermometer,
  Shield,
  Wrench,
  SlidersHorizontal,
  MoreHorizontal,
} from "lucide-react";
import type { ModificationWorkspaceState, SpecsFlowConfig } from "./types";
import {
  createEmptyPerformanceSummary,
  createEmptyRaceState,
  createEmptyRestorationState,
  RACE_ENTRY_FORM_CONFIG,
} from "./options";

/** Race / Track Car specifications & competition config. */
export const RACE_TRACK_SPECS_CONFIG: SpecsFlowConfig = {
  id: "race-track-car",
  label: "Race / Track Car",
  description:
    "Build a motorsport-ready competition sheet covering safety, setup, documentation, and race history.",
  showPerformanceSummary: false,
  entryForm: RACE_ENTRY_FORM_CONFIG,
  categories: [
    {
      id: "chassis-structure",
      label: "Chassis & Structure",
      description: "Tub, chassis, and structural work",
      icon: Frame,
    },
    {
      id: "engine-powertrain",
      label: "Engine & Powertrain",
      description: "Engine, induction, and power delivery",
      icon: Cog,
    },
    {
      id: "transmission-drivetrain",
      label: "Transmission & Drivetrain",
      description: "Gearbox, differential, and driveline",
      icon: Gauge,
    },
    {
      id: "suspension-steering",
      label: "Suspension & Steering",
      description: "Geometry, dampers, and steering",
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
      description: "Competition wheels and tire packages",
      icon: CircleDot,
    },
    {
      id: "aerodynamics-bodywork",
      label: "Aerodynamics & Bodywork",
      description: "Aero devices, panels, and bodywork",
      icon: Wind,
    },
    {
      id: "cockpit-controls",
      label: "Cockpit & Controls",
      description: "Driver interface and controls",
      icon: Joystick,
    },
    {
      id: "data-electronics",
      label: "Data & Electronics",
      description: "ECU, logging, and electronics",
      icon: Cpu,
    },
    {
      id: "fuel-system",
      label: "Fuel System",
      description: "Fuel cell, pumps, and plumbing",
      icon: Fuel,
    },
    {
      id: "cooling-system",
      label: "Cooling System",
      description: "Radiators, oil coolers, and ducting",
      icon: Thermometer,
    },
    {
      id: "safety-equipment",
      label: "Safety Equipment",
      description: "Cage, harnesses, and safety systems",
      icon: Shield,
    },
    {
      id: "spares-support",
      label: "Spares & Support Equipment",
      description: "Spares package and support gear",
      icon: Wrench,
    },
    {
      id: "setup-information",
      label: "Setup Information",
      description: "Baseline and event setup notes",
      icon: SlidersHorizontal,
    },
    {
      id: "other",
      label: "Other",
      description: "Anything that doesn’t fit above",
      icon: MoreHorizontal,
    },
  ],
};

export function createRaceTrackWorkspace(): ModificationWorkspaceState {
  const firstCategoryId =
    RACE_TRACK_SPECS_CONFIG.categories[0]?.id ?? "chassis-structure";
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
