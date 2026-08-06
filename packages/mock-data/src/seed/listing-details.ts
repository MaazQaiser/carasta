import type { VehicleListingDetails } from "@carasta/types";

const media = (id: string, photoId: string, name: string, alt: string) => ({
  id,
  url: `https://images.unsplash.com/photo-${photoId}?w=1200&auto=format&fit=crop`,
  alt,
  name,
});

/** Listing Builder detail payloads keyed by vehicle id. */
export const LISTING_DETAILS_BY_ID: Record<string, VehicleListingDetails> = {
  "v-001": {
    buyNowPrice: 175000,
    shipping: "Domestic Shipping",
    sellerLocation: "Detroit, MI",
    factorySpecsNotes: undefined,
    restoration: {
      buildType: "Factory Correct Restoration",
      mileageStatus: "Showing 52,400 miles — believed accurate",
      identityType: "VIN",
      identityValue: "9F02Z195780",
      factoryCorrect: {
        "Numbers-Matching Engine": "Yes",
        "Numbers-Matching Transmission": "Yes",
        "Factory Correct Paint": "Yes — Candyapple Red",
        "Factory Correct Interior": "Yes — Black",
        "Restoration Shop": "Certified Mustang Specialist",
        "Completion Status": "Complete",
      },
      provenance: {
        "Previous Owners": "3 documented owners",
        "Historical Story": "Rotisserie restoration with Marti Report and original drivetrain retained.",
        Awards: "MCA Gold — regional show 2022",
        "Auction History": "Private collection; first public listing since restoration",
      },
    },
    modifications: [
      {
        id: "mod-v001-1",
        categoryId: "chassis-handling",
        categoryLabel: "Chassis & Handling",
        title: "Correct Magnum 500 wheels refinished",
        typeOfWork: "Cosmetic / Corrective",
        partsBrand: "Ford",
        workPerformedBy: "Professional Shop",
        installationDate: "2021-06",
        description: "Period-correct Magnum 500s refinished to factory specification.",
      },
    ],
    conditionHistory: {
      vehicleHistory: "Fully documented with Marti Report and ownership chain.",
      accidentHistory: "No accidents reported.",
      titleStatus: "Clean title — Michigan",
      ownershipHistory: "3 previous owners; current seller 15 years.",
      serviceRecords: "Full restoration invoices and post-restoration service log available.",
      overallCondition: "Excellent — show-quality presentation",
      generalNotes: "Driven sparingly since restoration; stored in climate-controlled garage.",
    },
    media: {
      vehiclePhotos: [
        media("vp-001-a", "1572011440385-cf32f4fc7d02", "Front three-quarter", "Boss 429 front"),
        media("vp-001-b", "1584345274849-e9596d6ea12d", "Side profile", "Boss 429 side"),
      ],
      modificationPhotos: [
        media("mp-001-a", "1492144534655-ae79c964c9d7", "Engine bay", "Boss 429 engine bay"),
      ],
      receipts: [
        media("rc-001-a", "1558618666-fcd25c85f82e", "Restoration invoice packet", "Receipts"),
      ],
      invoices: [
        media("inv-001-a", "1454165804606-c3d57bc86b40", "Paint & body invoice", "Invoice"),
      ],
      supportingDocuments: [
        media("doc-001-a", "1568667256549-094344460e0e", "Marti Report", "Marti Report"),
      ],
      videos: [
        media("vid-001-a", "1494976388531-d1058494cdd8", "Walkaround video", "Walkaround"),
      ],
    },
  },
  "v-003": {
    shipping: "Pickup Only",
    sellerLocation: "Dallas, TX",
    performanceSummary: {
      currentEngine: "7.4L LS6 V8 — cowl induction",
      transmission: "Muncie M22 4-speed",
      drivetrain: "RWD / 12-bolt",
      horsepower: "450",
      horsepowerStatus: "Factory Rated",
      torque: "500",
      torqueStatus: "Factory Rated",
      fuelType: "Gasoline",
      tuningPlatform: "Stock carburetion",
      buildSummary: "Documented LS6 Chevelle restored to factory specification with period-correct performance hardware.",
    },
    modifications: [
      {
        id: "mod-v003-1",
        categoryId: "powertrain",
        categoryLabel: "Powertrain",
        title: "Cowl induction hood & air cleaner",
        typeOfWork: "Factory Performance",
        partsBrand: "Chevrolet",
        workPerformedBy: "Professional Shop",
        installationDate: "2019-08",
        specifications: "Correct LS6 cowl induction setup",
      },
      {
        id: "mod-v003-2",
        categoryId: "drivetrain",
        categoryLabel: "Drivetrain",
        title: "Muncie M22 close-ratio rebuild",
        typeOfWork: "Rebuild",
        partsBrand: "GM",
        workPerformedBy: "Professional Shop",
        shopBuilder: "Midwest Transmission Specialists",
        installationDate: "2020-02",
      },
      {
        id: "mod-v003-3",
        categoryId: "chassis-handling",
        categoryLabel: "Chassis & Handling",
        title: "Factory SS suspension refreshed",
        typeOfWork: "Restoration",
        workPerformedBy: "Current Owner + Shop",
        installationDate: "2020-05",
        description: "Springs, bushings, and shocks replaced with correct SS-spec components.",
      },
    ],
    conditionHistory: {
      vehicleHistory: "Build sheet and Protect-O-Plate documented.",
      accidentHistory: "No known accidents.",
      titleStatus: "Clean title — Texas",
      ownershipHistory: "Purchased from original family in 2018.",
      serviceRecords: "Restoration invoices and dyno sheets on file.",
      overallCondition: "Excellent",
      generalNotes: "Numbers-matching drivetrain retained throughout restoration.",
    },
    media: {
      vehiclePhotos: [
        media("vp-003-a", "1552519507-da3b142c6e3d", "Chevelle front", "Chevelle SS front"),
      ],
      modificationPhotos: [
        media("mp-003-a", "1503376780353-7e6692767b70", "Engine bay", "LS6 engine"),
      ],
      supportingDocuments: [
        media("doc-003-a", "1568667256549-094344460e0e", "Build sheet", "Build sheet"),
      ],
    },
  },
  "v-004": {
    shipping: "Domestic Shipping",
    sellerLocation: "Austin, TX",
    factorySpecsNotes: "Factory-correct presentation with only light cosmetic updates.",
    lightModifications: [
      "Period-correct radio upgrade (original retained)",
      "New correct-spec radial tires",
      "Fresh undercarriage detailing",
    ],
    conditionHistory: {
      vehicleHistory: "Well-maintained collector ownership.",
      accidentHistory: "None reported.",
      titleStatus: "Clean title",
      ownershipHistory: "2 previous owners",
      serviceRecords: "Annual service receipts available",
      overallCondition: "Excellent / like-new presentation",
      generalNotes: "Garage kept; never raced.",
    },
    media: {
      vehiclePhotos: [
        media("vp-004-a", "1542362567-b07e54358753", "Vehicle photo", "Stock vehicle"),
      ],
      receipts: [
        media("rc-004-a", "1558618666-fcd25c85f82e", "Tire receipt", "Receipt"),
      ],
    },
  },
  "v-007": {
    shipping: "Pickup Only",
    sellerLocation: "Los Angeles, CA",
    race: {
      competition: {
        "Primary Discipline": "Time Attack",
        "Sanctioning Body": "NASA",
        Series: "Super Touring",
        "Competition Class": "ST2",
        "Competition Level": "Regional / National",
        "Current Eligibility": "Eligible",
        "Logbook Status": "Current",
        "Technical Inspection": "Passed — current season",
        "Competition History Summary": "Consistent top-5 regional finisher; multiple podium results.",
        "Notable Results": "2nd overall — Willow Springs 2024 Round 3",
      },
      safety: {
        "Roll Cage Type": "Custom multi-point",
        "Roll Cage Builder": "Kirk Racing",
        "Certification Organization": "NASA",
        "Seat Manufacturer": "Sparco",
        "Harness Manufacturer": "Schroth",
        "Harness Certification": "FIA current",
        "Fire Suppression System": "SPA Design",
        "Fuel Cell": "ATLfuel cell — FIA",
        "Battery Cutoff": "Yes",
        "Safety Notes": "Full safety package refreshed for 2024 season.",
      },
      setup: {
        "Suspension Setup": "Coilover — track bias",
        Alignment: "Aggressive negative camber front",
        "Brake Bias": "Adjustable — mid setting",
        "Tire Pressures": "Hot pressures logged per session",
        "Gear Ratios": "Close-ratio competition set",
        "Driver Notes": "Stable mid-corner; prefers warmer tires.",
      },
      history: [
        {
          id: "rh-007-1",
          event: "NASA SoCal Round 3",
          track: "Willow Springs",
          date: "2024-05-12",
          result: "Podium",
          className: "ST2",
          position: "2nd",
          fastestLap: "1:28.4",
          notes: "Clean race; tire wear managed well.",
        },
        {
          id: "rh-007-2",
          event: "Buttonwillow Challenge",
          track: "Buttonwillow Raceway",
          date: "2024-03-02",
          result: "Finished",
          className: "ST2",
          position: "4th",
        },
      ],
    },
    modifications: [
      {
        id: "mod-v007-1",
        categoryId: "safety",
        categoryLabel: "Safety",
        title: "Full cage and FIA harness install",
        typeOfWork: "Safety",
        workPerformedBy: "Professional Shop",
        shopBuilder: "Kirk Racing",
        installationDate: "2023-11",
      },
    ],
    conditionHistory: {
      vehicleHistory: "Purpose-built track car with logged competition history.",
      accidentHistory: "Minor track contact 2022 — repaired and re-inspected.",
      titleStatus: "Race / off-highway as applicable",
      ownershipHistory: "Current team owner since 2021",
      serviceRecords: "Session logs and tech sheets available",
      overallCondition: "Race-ready",
      generalNotes: "Sold as race package; trailer available separately.",
    },
    media: {
      vehiclePhotos: [
        media("vp-007-a", "1568605117036-5fe5e7bab0b7", "Track car", "Race car"),
      ],
      modificationPhotos: [
        media("mp-007-a", "1486262715619-67b85e0b08d3", "Cage detail", "Roll cage"),
      ],
      supportingDocuments: [
        media("doc-007-a", "1568667256549-094344460e0e", "Logbook scan", "Logbook"),
      ],
      videos: [
        media("vid-007-a", "1494976388531-d1058494cdd8", "Onboard lap", "Onboard"),
      ],
    },
  },
  "v-011": {
    shipping: "Domestic Shipping",
    sellerLocation: "Charlotte, NC",
    race: {
      competition: {
        "Primary Discipline": "Club Racing",
        "Sanctioning Body": "SCCA",
        "Competition Class": "GT",
        "Current Eligibility": "Eligible",
      },
      safety: {
        "Roll Cage Type": "Welded multi-point",
        "Fire Suppression System": "Yes",
        "Battery Cutoff": "Yes",
      },
      history: [
        {
          id: "rh-011-1",
          event: "SCCA Regional",
          track: "VIR",
          date: "2023-09-16",
          result: "Finished",
          position: "6th",
        },
      ],
    },
    conditionHistory: {
      vehicleHistory: "Club race history with SCCA.",
      accidentHistory: "None reported under current ownership.",
      titleStatus: "Clean title",
      overallCondition: "Good — track focused",
      generalNotes: "Ready for next season with fresh safety certs.",
    },
  },
};
