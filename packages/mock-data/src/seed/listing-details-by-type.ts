import type {
  MarketplaceListingType,
  Vehicle,
  VehicleListingDetails,
  VehicleModificationEntry,
  VehiclePerformanceSummary,
  VehicleRaceSummary,
  VehicleRestorationSummary,
  VehicleSpec,
} from "@carasta/types";

function fuelLabel(fuel: VehicleSpec["fuelType"]) {
  return fuel.charAt(0).toUpperCase() + fuel.slice(1);
}

function driveLabel(drive: VehicleSpec["driveType"]) {
  return drive.toUpperCase();
}

function transmissionLabel(t: VehicleSpec["transmission"]) {
  return t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function performanceFromSpec(
  vehicle: Pick<Vehicle, "spec" | "features" | "description">
): VehiclePerformanceSummary {
  const { spec } = vehicle;
  return {
    currentEngine: spec.engineSize || `${spec.year} ${spec.make} factory engine`,
    transmission: transmissionLabel(spec.transmission),
    drivetrain: driveLabel(spec.driveType),
    horsepower: spec.horsepower ? String(spec.horsepower) : undefined,
    horsepowerStatus: spec.horsepower ? "Factory / Estimated" : undefined,
    torque: spec.torque ? String(spec.torque) : undefined,
    torqueStatus: spec.torque ? "Factory / Estimated" : undefined,
    fuelType: fuelLabel(spec.fuelType),
    tuningPlatform: "Stock calibration",
    buildSummary:
      vehicle.features.slice(0, 3).join(" · ") ||
      vehicle.description.slice(0, 160),
  };
}

function stockDetails(vehicle: Vehicle): VehicleListingDetails {
  const mods: VehicleModificationEntry[] = vehicle.features.slice(0, 3).map((feature, i) => ({
    id: `mock-stock-mod-${vehicle.id}-${i}`,
    categoryId: i === 0 ? "wheels-tires" : i === 1 ? "electronics" : "exterior",
    categoryLabel: i === 0 ? "Wheels & Tires" : i === 1 ? "Electronics & Audio" : "Exterior",
    title: feature,
    typeOfWork: "Upgrade",
    workPerformedBy: "Professional Shop",
    description: `Light update retained for street manners: ${feature}.`,
  }));

  return {
    factorySpecsNotes: `Factory specification presentation for the ${vehicle.spec.year} ${vehicle.spec.make} ${vehicle.spec.model}${
      vehicle.spec.trim ? ` ${vehicle.spec.trim}` : ""
    }. Core powertrain and chassis remain as delivered.`,
    lightModifications: mods.map((m) => m.title),
    modifications: mods,
    conditionHistory: {
      overallCondition: vehicle.condition,
      vehicleHistory: "Collector ownership with routine maintenance.",
      accidentHistory: "No accidents reported.",
      titleStatus: "Clean title",
      ownershipHistory: "Documented recent ownership chain.",
      serviceRecords: "Service receipts available on request.",
      generalNotes: "Garage kept; driven sparingly.",
    },
  };
}

function modifiedDetails(vehicle: Vehicle): VehicleListingDetails {
  const mods: VehicleModificationEntry[] = [
    {
      id: `mock-mod-${vehicle.id}-1`,
      categoryId: "powertrain",
      categoryLabel: "Powertrain",
      title: vehicle.spec.engineSize
        ? `${vehicle.spec.engineSize} performance package`
        : "Performance engine package",
      typeOfWork: "Upgrade",
      partsBrand: vehicle.spec.make,
      workPerformedBy: "Professional Shop",
      installationDate: "2022-06",
      specifications: vehicle.spec.horsepower
        ? `Approx. ${vehicle.spec.horsepower} hp`
        : undefined,
      description: "Documented performance work with supporting invoices.",
    },
    {
      id: `mock-mod-${vehicle.id}-2`,
      categoryId: "chassis-handling",
      categoryLabel: "Chassis & Handling",
      title: "Suspension & brake refresh",
      typeOfWork: "Upgrade",
      workPerformedBy: "Current Owner + Shop",
      installationDate: "2023-03",
      description: "Springs, bushings, and brake consumables updated for spirited street use.",
    },
    ...(vehicle.features[0]
      ? [
          {
            id: `mock-mod-${vehicle.id}-3`,
            categoryId: "other",
            categoryLabel: "Other",
            title: vehicle.features[0],
            typeOfWork: "Custom",
            workPerformedBy: "Professional Shop",
          } satisfies VehicleModificationEntry,
        ]
      : []),
  ];

  return {
    performanceSummary: performanceFromSpec(vehicle),
    modifications: mods,
    conditionHistory: {
      overallCondition: vehicle.condition,
      vehicleHistory: "Performance-oriented ownership with logged upgrades.",
      accidentHistory: "No structural damage reported.",
      titleStatus: "Clean title",
      serviceRecords: "Dyno / install invoices available.",
      generalNotes: "Built for street performance; not a dedicated race car.",
    },
  };
}

function restoredDetails(vehicle: Vehicle): VehicleListingDetails {
  const restoration: VehicleRestorationSummary = {
    buildType: "Factory Correct Restoration",
    mileageStatus: `Showing ${vehicle.spec.mileage.toLocaleString()} miles — believed accurate`,
    identityType: vehicle.spec.vin ? "VIN" : "Chassis",
    identityValue: vehicle.spec.vin || `${vehicle.spec.year}-${vehicle.spec.model}`,
    factoryCorrect: {
      "Numbers-Matching Engine": vehicle.spec.engineSize ? "Yes" : "See documentation",
      "Numbers-Matching Transmission": "Yes",
      "Factory Correct Paint": `Yes — ${vehicle.spec.exteriorColor}`,
      "Factory Correct Interior": `Yes — ${vehicle.spec.interiorColor}`,
      "Restoration Shop": "Specialist restoration house",
      "Completion Status": "Complete",
    },
    provenance: {
      "Previous Owners": "Documented prior ownership",
      "Historical Story":
        vehicle.story?.slice(0, 180) ||
        vehicle.description.slice(0, 180),
      Awards: "Shown at regional marque events",
      "Auction History": "Private collection before current listing",
    },
  };

  return {
    restoration,
    modifications: [
      {
        id: `mock-rest-${vehicle.id}-1`,
        categoryId: "build-restoration",
        categoryLabel: "Build & Restoration",
        title: "Body & paint restoration",
        typeOfWork: "Restoration",
        workPerformedBy: "Professional Shop",
        installationDate: "2021-09",
        description: `Finish work in ${vehicle.spec.exteriorColor} to factory-correct presentation.`,
      },
      {
        id: `mock-rest-${vehicle.id}-2`,
        categoryId: "engine-performance",
        categoryLabel: "Engine & Performance",
        title: vehicle.spec.engineSize
          ? `${vehicle.spec.engineSize} rebuild`
          : "Drivetrain rebuild",
        typeOfWork: "Rebuild",
        workPerformedBy: "Professional Shop",
        installationDate: "2021-11",
      },
    ],
    conditionHistory: {
      overallCondition: vehicle.condition,
      vehicleHistory: "Fully documented restoration file.",
      accidentHistory: "No accidents reported post-restoration.",
      titleStatus: "Clean title",
      ownershipHistory: "Restored under current or prior collector ownership.",
      serviceRecords: "Restoration invoices and post-restore service log available.",
      generalNotes: "Driven sparingly since completion; climate-controlled storage.",
    },
  };
}

function raceDetails(vehicle: Vehicle): VehicleListingDetails {
  const race: VehicleRaceSummary = {
    competition: {
      "Primary Discipline": "Club Racing / Time Attack",
      "Sanctioning Body": "SCCA / NASA",
      Series: "Regional",
      "Competition Class": vehicle.spec.trim || "GT",
      "Competition Level": "Regional",
      "Current Eligibility": "Eligible",
      "Logbook Status": "Current",
      "Technical Inspection": "Passed — current season",
      "Competition History Summary": `Campaign history for ${vehicle.spec.year} ${vehicle.spec.make} ${vehicle.spec.model}.`,
      "Notable Results": "Consistent top-10 regional finisher",
    },
    safety: {
      "Roll Cage Type": "Welded multi-point",
      "Roll Cage Builder": "Specialty race fabricator",
      "Certification Organization": "SCCA",
      "Seat Manufacturer": "Sparco",
      "Harness Manufacturer": "Schroth",
      "Harness Certification": "FIA current",
      "Fire Suppression System": "Yes",
      "Fuel Cell": "Competition fuel cell",
      "Battery Cutoff": "Yes",
      "Safety Notes": "Safety package refreshed for the current season.",
    },
    setup: {
      "Suspension Setup": "Coilover — track bias",
      Alignment: "Negative camber front / street-track compromise",
      "Brake Bias": "Adjustable",
      "Tire Pressures": "Hot pressures logged per session",
      "Gear Ratios": transmissionLabel(vehicle.spec.transmission),
      "Driver Notes": "Stable mid-corner; prefers warmer tires.",
    },
    history: [
      {
        id: `rh-${vehicle.id}-1`,
        event: "Regional Club Race",
        track: "Home circuit",
        date: "2024-06-15",
        result: "Finished",
        className: vehicle.spec.trim || "GT",
        position: "4th",
        notes: "Clean weekend; no mechanical issues.",
      },
    ],
  };

  return {
    race,
    modifications: [
      {
        id: `mock-race-${vehicle.id}-1`,
        categoryId: "safety",
        categoryLabel: "Safety Equipment",
        title: "Full cage and harness install",
        typeOfWork: "Safety",
        workPerformedBy: "Professional Shop",
        installationDate: "2023-04",
      },
      {
        id: `mock-race-${vehicle.id}-2`,
        categoryId: "brakes",
        categoryLabel: "Brakes",
        title: "Competition brake package",
        typeOfWork: "Upgrade",
        workPerformedBy: "Professional Shop",
        installationDate: "2023-08",
      },
    ],
    conditionHistory: {
      overallCondition: vehicle.condition,
      vehicleHistory: "Purpose-built / track-prepared with logged sessions.",
      accidentHistory: "No unrepaired damage reported.",
      titleStatus: "See listing documents",
      serviceRecords: "Session logs and tech sheets available.",
      generalNotes: "Sold race-ready; support equipment negotiable separately.",
    },
  };
}

/** Generate Listing Builder–shaped detail payload for a vehicle type. */
export function buildMockListingDetailsForType(
  vehicle: Vehicle,
  listingType: MarketplaceListingType
): VehicleListingDetails {
  const base: VehicleListingDetails = {
    sellerLocation: `${vehicle.location.city}, ${vehicle.location.state}`,
    shipping: vehicle.reservePrice ? "Domestic Shipping" : "Pickup Only",
    buyNowPrice: vehicle.estimatedValue,
    media: {
      vehiclePhotos: vehicle.images.map((image) => ({
        id: image.id,
        url: image.url,
        alt: image.alt,
        name: image.alt,
      })),
    },
  };

  const typed =
    listingType === "modified-performance"
      ? modifiedDetails(vehicle)
      : listingType === "restored-restomod-custom"
        ? restoredDetails(vehicle)
        : listingType === "race-track-car"
          ? raceDetails(vehicle)
          : stockDetails(vehicle);

  return { ...base, ...typed };
}

/** Prefer explicit seed fields; fill gaps from type-aware mock generator. */
export function mergeListingDetails(
  generated: VehicleListingDetails,
  explicit?: VehicleListingDetails
): VehicleListingDetails {
  if (!explicit) return generated;

  return {
    ...generated,
    ...explicit,
    performanceSummary: explicit.performanceSummary ?? generated.performanceSummary,
    restoration: explicit.restoration ?? generated.restoration,
    race: explicit.race
      ? {
          competition: {
            ...generated.race?.competition,
            ...explicit.race.competition,
          },
          safety: { ...generated.race?.safety, ...explicit.race.safety },
          setup: { ...generated.race?.setup, ...explicit.race.setup },
          history: explicit.race.history?.length
            ? explicit.race.history
            : generated.race?.history,
        }
      : generated.race,
    modifications:
      explicit.modifications && explicit.modifications.length > 0
        ? explicit.modifications
        : generated.modifications,
    lightModifications:
      explicit.lightModifications && explicit.lightModifications.length > 0
        ? explicit.lightModifications
        : generated.lightModifications,
    factorySpecsNotes: explicit.factorySpecsNotes ?? generated.factorySpecsNotes,
    conditionHistory: {
      ...generated.conditionHistory,
      ...explicit.conditionHistory,
    },
    media: {
      ...generated.media,
      ...explicit.media,
      vehiclePhotos:
        explicit.media?.vehiclePhotos?.length
          ? explicit.media.vehiclePhotos
          : generated.media?.vehiclePhotos,
    },
  };
}
