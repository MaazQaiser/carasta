import type { BuyerListingDemo, BuyerListingType, BuyerMediaItem } from "./types";

const img = (id: string, alt: string): BuyerMediaItem => ({
  id: `${id}-${alt.replace(/\s+/g, "-").toLowerCase()}`,
  url: `https://images.unsplash.com/photo-${id}?w=1400&auto=format&fit=crop`,
  alt,
  kind: "image",
});

export const BUYER_LISTING_DEMOS: Record<BuyerListingType, BuyerListingDemo> = {
  stock: {
    type: "stock",
    id: "buyer-stock",
    title: "2022 Porsche 911 Carrera S",
    subtitle: "Stock / Lightly Modified · Coupe",
    priceLabel: "$142,500",
    location: "Austin, TX",
    sellerBadge: "Verified Seller",
    badges: [
      { label: "Clean Title", tone: "success" },
      { label: "One Owner", tone: "brand" },
      { label: "Service History", tone: "neutral" },
    ],
    gallery: [
      img("1503376780353-7e6692767b70", "Front three-quarter"),
      img("1492144534655-ae79c964c9d7", "Side profile"),
      img("1549317661-bd32c8ce0db2", "Interior"),
      img("1552519507-da3b142c6e3d", "Engine bay"),
      img("1494905998402-395d579af36f", "Rear detail"),
    ],
    quickSpecs: [
      { label: "Year", value: "2022" },
      { label: "Mileage", value: "8,420 mi" },
      { label: "Transmission", value: "PDK" },
      { label: "Drivetrain", value: "RWD" },
      { label: "Exterior", value: "GT Silver" },
      { label: "Interior", value: "Black Leather" },
    ],
    overview:
      "A low-mileage Carrera S with factory equipment largely intact. Documented dealer service, clean Carfax, and only light aesthetic updates. Ideal for buyers seeking a near-stock modern 911.",
    story:
      "Purchased new and maintained exclusively at the selling dealer. Weekend use only, stored in a climate-controlled garage.",
    documents: [
      { id: "d1", title: "Window Sticker", subtitle: "Factory options PDF", type: "PDF" },
      { id: "d2", title: "Service Records", subtitle: "Dealer history", type: "PDF" },
      { id: "d3", title: "Carfax Report", subtitle: "Clean history", type: "PDF" },
      { id: "d4", title: "Inspection Photos", subtitle: "12 images", type: "Photo" },
    ],
    seller: {
      name: "Alex Rivera",
      location: "Austin, TX",
      role: "Private Seller",
      rating: "4.9",
      listings: 3,
      verified: true,
    },
    primaryCta: "Contact Seller",
    secondaryCta: "Make Offer",
    content: {
      features: [
        "Sport Chrono Package",
        "Sport Exhaust",
        "PASM",
        "14-way Sport Seats",
        "BOSE Surround Sound",
        "Front Axle Lift",
      ],
      condition: {
        overall: "Excellent",
        accident: "No accidents reported",
        title: "Clean title",
        notes: "Minor curb wear on outer rear wheel; otherwise showroom presentation.",
      },
      ownership: [
        {
          id: "o1",
          title: "Current owner",
          date: "2022 – Present",
          detail: "Purchased new from Porsche Austin.",
        },
      ],
      service: [
        {
          id: "s1",
          title: "Annual service",
          date: "Mar 2025",
          detail: "Oil, filters, inspection — Porsche Austin.",
        },
        {
          id: "s2",
          title: "Brake fluid flush",
          date: "Sep 2024",
          detail: "Completed at 6,800 miles.",
        },
      ],
      specifications: [
        { label: "Engine", value: "3.0L Twin-Turbo Flat-6" },
        { label: "Horsepower", value: "443 hp" },
        { label: "0–60", value: "3.5 s" },
        { label: "VIN", value: "WP0AB2A99NS123456" },
      ],
    },
  },

  classic: {
    type: "classic",
    id: "buyer-classic",
    title: "1969 Ford Mustang Boss 429",
    subtitle: "Classic Collector · Fastback",
    priceLabel: "$165,000",
    location: "Detroit, MI",
    sellerBadge: "Collector Seller",
    badges: [
      { label: "Original Engine", tone: "success" },
      { label: "Matching Numbers", tone: "brand" },
      { label: "Factory Correct", tone: "brand" },
      { label: "Documented History", tone: "neutral" },
    ],
    gallery: [
      img("1572011440385-cf32f4fc7d02", "Boss 429 front"),
      img("1584345274849-e9596d6ea12d", "Side profile"),
      img("1494905998402-395d579af36f", "Interior"),
      img("1549317661-bd32c8ce0db2", "429 engine"),
      img("1503376780353-7e6692767b70", "Rear"),
    ],
    quickSpecs: [
      { label: "Year", value: "1969" },
      { label: "Engine", value: "429 V8" },
      { label: "Transmission", value: "4-Speed" },
      { label: "Mileage", value: "52,400 mi" },
      { label: "Color", value: "Candyapple Red" },
      { label: "Production", value: "Boss 429" },
    ],
    overview:
      "Numbers-matching Boss 429 finished in Candyapple Red with a documented Marti Report and rotisserie restoration. One of the most sought-after muscle cars of the era.",
    story:
      "Fifteen years chasing the right car. Frame-off restoration by a certified shop, correct down to the hose clamps. Ready for the next caretaker.",
    documents: [
      { id: "c1", title: "Marti Report", type: "PDF", subtitle: "Factory build verification" },
      { id: "c2", title: "Restoration Invoice Pack", type: "PDF", subtitle: "Full binder scan" },
      { id: "c3", title: "Awards Photos", type: "Photo", subtitle: "Concours ribbons" },
      { id: "c4", title: "Ownership File", type: "Doc", subtitle: "Title chain notes" },
    ],
    seller: {
      name: "Morgan Blake",
      location: "Detroit, MI",
      role: "Private Collector",
      rating: "5.0",
      listings: 1,
      verified: true,
    },
    primaryCta: "Contact Seller",
    secondaryCta: "Request Documents",
    content: {
      heritage:
        "Ford’s homologation special for NASCAR — the Boss 429 married a semi-hemi big-block to a reinforced Mustang platform. This example retains original engine stamping and transmission codes.",
      production: [
        { label: "Build date", value: "April 1969" },
        { label: "Plant", value: "Kar Kraft" },
        { label: "Paint", value: "Candyapple Red" },
        { label: "Interior", value: "Black Deluxe" },
      ],
      factorySpecs: [
        { label: "Engine", value: "429 cid Boss V8" },
        { label: "Horsepower", value: "375 hp (rated)" },
        { label: "Transmission", value: "Toploader 4-speed" },
        { label: "Axle", value: "3.91 Traction-Lok" },
      ],
      originality: [
        { label: "Engine", value: "Original / Matching" },
        { label: "Transmission", value: "Matching" },
        { label: "Body panels", value: "Original" },
        { label: "Interior", value: "Restored correct" },
      ],
      restorationSummary:
        "Rotisserie restoration completed 2019. Correct finishes, Magnum 500 wheels, and period hardware throughout.",
      matchingNumbers: ["Engine", "Transmission", "Body", "Interior trim tags"],
      ownershipTimeline: [
        {
          id: "t1",
          title: "First owner — Midwest",
          date: "1969 – 1984",
          detail: "Locally driven and stored.",
        },
        {
          id: "t2",
          title: "Collector ownership",
          date: "1984 – 2016",
          detail: "Long-term storage before restoration.",
        },
        {
          id: "t3",
          title: "Current owner",
          date: "2016 – Present",
          detail: "Commissioned full restoration; shown regionally.",
        },
      ],
      awards: ["Regional Mustang Club Best in Class", "Concours Invitation — 2022"],
    },
  },

  modified: {
    type: "modified",
    id: "buyer-modified",
    title: "2018 Nissan GT-R Premium",
    subtitle: "Modified / Performance · Coupe",
    priceLabel: "Current bid $98,500",
    location: "Los Angeles, CA",
    sellerBadge: "Verified Seller",
    badges: [
      { label: "Modified", tone: "brand" },
      { label: "Dyno Proven", tone: "success" },
      { label: "Track Ready", tone: "neutral" },
    ],
    gallery: [
      img("1552519507-da3b142c6e3d", "GT-R front"),
      img("1494905998402-395d579af36f", "Side profile"),
      img("1549317661-bd32c8ce0db2", "Engine bay"),
      img("1503376780353-7e6692767b70", "Rear"),
      img("1492144534655-ae79c964c9d7", "Interior"),
    ],
    quickSpecs: [
      { label: "Year", value: "2018" },
      { label: "Engine", value: "3.8L Twin-Turbo V6" },
      { label: "Transmission", value: "6-Speed DCT" },
      { label: "Drivetrain", value: "AWD" },
      { label: "Mileage", value: "24,100 mi" },
      { label: "Color", value: "Gun Metallic" },
    ],
    overview:
      "Built for street and track with supporting mods, documented dyno sheets, and a clean California title. Power delivery is calibrated and the car remains daily-drivable.",
    story:
      "Built over three seasons with receipts for every major part. Street-legal, track-proven, and ready for the next owner.",
    documents: [
      { id: "m1", title: "Dyno Sheet", type: "PDF", subtitle: "Latest pull" },
      { id: "m2", title: "Parts Receipts", type: "PDF", subtitle: "Major components" },
      { id: "m3", title: "Alignment Spec", type: "PDF", subtitle: "Track setup" },
    ],
    seller: {
      name: "Pacific Motorsport",
      location: "Los Angeles, CA",
      role: "Performance Builder",
      rating: "4.9",
      listings: 18,
      verified: true,
      organization: "Pacific Motorsport",
    },
    primaryCta: "Place Bid",
    secondaryCta: "Make an Offer",
    content: {
      buildSummary:
        "Stage 2+ street/track build with supporting fuel, cooling, and chassis upgrades. Tuned for reliability with documented power figures.",
      currentSpecs: [
        { label: "Engine", value: "3.8L Twin-Turbo V6 (built)" },
        { label: "Transmission", value: "6-Speed DCT" },
        { label: "Drivetrain", value: "AWD" },
        { label: "Horsepower", value: "742 whp · Dyno proven" },
        { label: "Torque", value: "698 wtq · Dyno proven" },
        { label: "Fuel", value: "E85 capable" },
        { label: "Tuning", value: "Ecutek" },
      ],
      categories: [
        {
          id: "cat-power",
          title: "Powertrain",
          summary: "3 items",
          entries: [
            {
              id: "p1",
              title: "Turbo upgrade",
              detail: "Larger twins with supporting oil lines.",
              meta: "AMS · Shop install · 2023",
            },
            {
              id: "p2",
              title: "Fuel system",
              detail: "High-flow pumps and injectors for E85.",
              meta: "Injector Dynamics",
            },
            {
              id: "p3",
              title: "Intercooler",
              detail: "Front-mount cooler with denser core.",
              meta: "AMS",
            },
          ],
        },
        {
          id: "cat-chassis",
          title: "Chassis & Brakes",
          summary: "2 items",
          entries: [
            {
              id: "c1",
              title: "Coilover kit",
              detail: "Track-oriented springs and dampers.",
              meta: "KW Clubsport",
            },
            {
              id: "c2",
              title: "Brake package",
              detail: "Two-piece rotors and performance pads.",
              meta: "Brembo",
            },
          ],
        },
      ],
      dyno: [
        { label: "HP Status", value: "Dyno proven" },
        { label: "Torque Status", value: "Dyno proven" },
      ],
      builder: "Pacific Motorsport",
    },
  },

  restored: {
    type: "restored",
    id: "buyer-restored",
    title: "1963 Jaguar E-Type Series 1 3.8",
    subtitle: "Restored / Restomod · Coupe",
    priceLabel: "$210,000",
    location: "Greenwich, CT",
    sellerBadge: "Restoration Specialist",
    badges: [
      { label: "Restored", tone: "brand" },
      { label: "Matching Numbers", tone: "success" },
      { label: "Factory Correct", tone: "brand" },
      { label: "Documented", tone: "neutral" },
    ],
    gallery: [
      img("1750957823101-87ec89cf6862", "E-Type front"),
      img("1611766424498-57b8418ed48d", "Coupe profile"),
      img("1492144534655-ae79c964c9d7", "Interior"),
      img("1549317661-bd32c8ce0db2", "Engine bay"),
      img("1503376780353-7e6692767b70", "Rear three-quarter"),
    ],
    quickSpecs: [
      { label: "Build Type", value: "Factory Correct" },
      { label: "Mileage Status", value: "Believed actual" },
      { label: "Level", value: "Concours" },
      { label: "Status", value: "Complete" },
      { label: "Color", value: "Opalescent Silver Blue" },
      { label: "Interior", value: "Dark Blue" },
    ],
    overview:
      "Early flat-floor Series 1 E-Type restored to concours standard with matching numbers, correct external bonnet latches, and a complete history file.",
    story:
      "Restored under specialist supervision with a compiled build book. Driven sparingly since completion and kept in climate-controlled storage.",
    documents: [
      { id: "r1", title: "Build Book", type: "PDF", subtitle: "Full restoration dossier" },
      { id: "r2", title: "Invoices", type: "PDF", subtitle: "Shop & parts" },
      { id: "r3", title: "Process Photos", type: "Photo", subtitle: "84 images" },
      { id: "r4", title: "Factory Documents", type: "Doc", subtitle: "Heritage certificate" },
    ],
    seller: {
      name: "Heritage Motor Co.",
      location: "Greenwich, CT",
      role: "Dealer",
      rating: "4.8",
      listings: 12,
      verified: true,
      organization: "Heritage Motor Co.",
    },
    primaryCta: "Contact Seller",
    secondaryCta: "Request Build Book",
    content: {
      buildType: "Factory Correct Restoration",
      mileageStatus: "Showing 61,200 miles — believed accurate",
      restorationProfile: [
        { label: "Restoration Level", value: "Concours" },
        { label: "Completion", value: "Complete" },
        { label: "Shop", value: "Classic Works CT" },
        { label: "Builder", value: "James Alden" },
      ],
      matchingNumbers: [
        { label: "Engine", value: "Yes" },
        { label: "Transmission", value: "Yes" },
        { label: "Body", value: "Yes" },
        { label: "Chassis", value: "Yes" },
      ],
      authenticity: [
        { label: "Factory Correct Paint", value: "Yes" },
        { label: "Factory Correct Interior", value: "Yes" },
        { label: "Original Wheels", value: "Yes" },
        { label: "Original Equipment", value: "Yes" },
      ],
      builder: "James Alden",
      shop: "Classic Works CT",
      timeline: [
        {
          id: "rt1",
          title: "Disassembly & media",
          date: "2019",
          detail: "Full strip and panel assessment.",
        },
        {
          id: "rt2",
          title: "Body & paint",
          date: "2020",
          detail: "Metalwork and Opalescent Silver Blue finish.",
        },
        {
          id: "rt3",
          title: "Mechanical rebuild",
          date: "2021",
          detail: "Engine, gearbox, and suspension refreshed.",
        },
        {
          id: "rt4",
          title: "Final assembly",
          date: "2022",
          detail: "Trim, electrics, and road sorting.",
        },
      ],
      categories: [
        {
          id: "engine",
          title: "Engine",
          summary: "1 entry",
          entries: [
            {
              id: "e1",
              title: "3.8 rebuild",
              detail: "Numbers-matching engine rebuilt to factory specification.",
              meta: "Professional Shop · 2021",
              photos: [img("1549317661-bd32c8ce0db2", "Engine rebuild")],
            },
          ],
        },
        {
          id: "transmission",
          title: "Transmission",
          summary: "1 entry",
          entries: [
            {
              id: "t1",
              title: "Moss gearbox refresh",
              detail: "Synchros and bearings replaced; correct finishes.",
              meta: "Professional Shop · 2021",
            },
          ],
        },
        {
          id: "suspension",
          title: "Suspension",
          summary: "1 entry",
          entries: [
            {
              id: "s1",
              title: "Chassis bushings & dampers",
              detail: "Period-correct bushings with sorted geometry.",
              meta: "Self · Shop assist · 2021",
            },
          ],
        },
        {
          id: "interior",
          title: "Interior",
          summary: "1 entry",
          entries: [
            {
              id: "i1",
              title: "Dark Blue retrim",
              detail: "Correct leather and carpets to factory pattern.",
              meta: "Trim specialist · 2022",
              photos: [img("1492144534655-ae79c964c9d7", "Interior")],
            },
          ],
        },
        {
          id: "exterior",
          title: "Exterior",
          summary: "1 entry",
          entries: [
            {
              id: "x1",
              title: "Panel alignment",
              detail: "Door and bonnet gaps corrected before paint.",
              meta: "Classic Works CT · 2020",
            },
          ],
        },
        {
          id: "paint",
          title: "Paint",
          summary: "1 entry",
          entries: [
            {
              id: "p1",
              title: "Opalescent Silver Blue",
              detail: "Factory-correct color with show-quality finish.",
              meta: "Classic Works CT · 2020",
              photos: [img("1750957823101-87ec89cf6862", "Paint finish")],
            },
          ],
        },
        {
          id: "wheels",
          title: "Wheels",
          summary: "1 entry",
          entries: [
            {
              id: "w1",
              title: "Wire wheels restored",
              detail: "Original wires refurbished and balanced.",
              meta: "Specialty shop · 2021",
            },
          ],
        },
        {
          id: "electrical",
          title: "Electrical",
          summary: "1 entry",
          entries: [
            {
              id: "el1",
              title: "Harness inspection",
              detail: "Original-style loom checked and repaired as needed.",
              meta: "Classic Works CT · 2022",
            },
          ],
        },
      ],
    },
  },

  race: {
    type: "race",
    id: "buyer-race",
    title: "2020 BMW M3 Competition",
    subtitle: "Race / Track Car · GT3-prepared",
    priceLabel: "$98,500",
    location: "Sonoma, CA",
    sellerBadge: "Race Team",
    badges: [
      { label: "GT3", tone: "brand" },
      { label: "SCCA", tone: "neutral" },
      { label: "Purpose Built", tone: "brand" },
      { label: "Road Racing", tone: "success" },
      { label: "Race Proven", tone: "success" },
    ],
    gallery: [
      img("1568605117036-5fe5e7bab0b7", "Track front"),
      img("1492144534655-ae79c964c9d7", "Cockpit"),
      img("1503376780353-7e6692767b70", "Aero package"),
      img("1549317661-bd32c8ce0db2", "Engine bay"),
      img("1552519507-da3b142c6e3d", "Pit lane"),
      {
        id: "race-video-1",
        url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1400&auto=format&fit=crop",
        alt: "Onboard highlight",
        kind: "video",
      },
    ],
    quickSpecs: [
      { label: "Year", value: "2020" },
      { label: "Builder", value: "Summit Motorsport" },
      { label: "Primary Use", value: "Road Racing" },
    ],
    overview:
      "Purpose-built M3 Competition campaign car with current logbook, fresh tech, and a documented regional / national program. Sold race-ready with supporting documentation.",
    documents: [
      { id: "rc1", title: "Build Sheet", type: "PDF", subtitle: "Full specification" },
      { id: "rc2", title: "Tech Inspection", type: "PDF", subtitle: "Current season" },
      { id: "rc3", title: "Logbook", type: "PDF", subtitle: "Scan + photos" },
      { id: "rc4", title: "Safety Certification", type: "PDF", subtitle: "Cage & harness" },
      { id: "rc5", title: "Dyno Sheet", type: "PDF", subtitle: "Latest pull" },
    ],
    seller: {
      name: "Summit Motorsport",
      location: "Sonoma, CA",
      role: "Race Team",
      rating: "4.9",
      listings: 4,
      verified: true,
      organization: "Summit Motorsport",
    },
    primaryCta: "Contact Seller",
    secondaryCta: "Request Documentation",
    content: {
      raceHistory: [
        { label: "Championships", value: "1 regional title" },
        { label: "Events", value: "22" },
        { label: "Podiums", value: "9" },
        { label: "Wins", value: "4" },
      ],
      timeline: [
        {
          id: "rh1",
          title: "SCCA Majors — Sonoma",
          date: "Jun 2025",
          detail: "P2 · Clean weekend.",
        },
        {
          id: "rh2",
          title: "NASA Championships",
          date: "Sep 2024",
          detail: "P1 · Class win.",
        },
        {
          id: "rh3",
          title: "Regional opener",
          date: "Mar 2024",
          detail: "P3 · Setup validation.",
        },
      ],
      competitionProfile: [
        { label: "Primary Use", value: "Road Racing" },
      ],
      biography: {
        competitionHistory:
          "Campaign history across SCCA Majors and NASA events with consistent top finishes.",
        vehicleHistory:
          "Converted from street Competition package in 2023; continuous development since.",
        preparationNotes:
          "Track alignment, aero balance, and cooling package optimized for Sonoma and Road America.",
      },
      safetyChecklist: [
        { label: "Roll Cage", value: "Installed" },
        { label: "Fire System", value: "Installed" },
        { label: "Window Net", value: "Installed" },
        { label: "Fuel Cell", value: "Installed" },
        { label: "Kill Switch", value: "Installed" },
        { label: "Tow Hooks", value: "Installed" },
        { label: "Battery Cutoff", value: "Installed" },
      ],
      certifications: [
        { label: "Certification", value: "FIA / SCCA cage" },
        { label: "Organization", value: "SCCA" },
        { label: "Number", value: "SC-44821" },
        { label: "Expiration", value: "Dec 2027" },
      ],
      modifications: [
        {
          id: "engine",
          title: "Engine",
          summary: "1 mod",
          entries: [
            {
              id: "me1",
              title: "Competition ECU & cooling",
              detail: "Track calibration with upgraded heat exchangers.",
              meta: "Summit Motorsport · 2023",
            },
          ],
        },
        {
          id: "transmission",
          title: "Transmission",
          summary: "1 mod",
          entries: [
            {
              id: "mt1",
              title: "Motorsport DCT prep",
              detail: "Fluid, cooler, and shift calibration for endurance sessions.",
              meta: "Professional Shop · 2023",
            },
          ],
        },
        {
          id: "suspension",
          title: "Suspension",
          summary: "1 mod",
          entries: [
            {
              id: "ms1",
              title: "Coilover package",
              detail: "2-way dampers with solid mounts and race alignment.",
              meta: "Summit Motorsport · 2023",
            },
          ],
        },
        {
          id: "brakes",
          title: "Brakes",
          summary: "1 mod",
          entries: [
            {
              id: "mb1",
              title: "Competition brake package",
              detail: "Two-piece rotors, race pads, stainless lines.",
              meta: "Professional Shop · 2023",
            },
          ],
        },
        {
          id: "electronics",
          title: "Electronics",
          summary: "1 mod",
          entries: [
            {
              id: "mel1",
              title: "Data & radio",
              detail: "AiM logging and team radio install.",
              meta: "Summit Motorsport · 2024",
            },
          ],
        },
        {
          id: "aero",
          title: "Aerodynamics",
          summary: "1 mod",
          entries: [
            {
              id: "ma1",
              title: "Wing & splitter",
              detail: "Adjustable rear wing with front splitter and canards.",
              meta: "Summit Motorsport · 2024",
            },
          ],
        },
        {
          id: "interior",
          title: "Interior",
          summary: "1 mod",
          entries: [
            {
              id: "mi1",
              title: "Race seats & harnesses",
              detail: "FIA seats, 6-point harnesses, and stripped cabin.",
              meta: "Professional Shop · 2023",
            },
          ],
        },
      ],
      team: {
        raceTeam: "Summit Motorsport",
        builder: "Summit Motorsport",
        dealer: "BMW of Sonoma (original delivery)",
      },
    },
  },
};

export function getBuyerListing(type: string | undefined): BuyerListingDemo | null {
  if (!type) return null;
  if (type in BUYER_LISTING_DEMOS) {
    return BUYER_LISTING_DEMOS[type as BuyerListingType];
  }
  return null;
}

export const BUYER_LISTING_INDEX: {
  type: BuyerListingType;
  label: string;
  description: string;
}[] = [
  {
    type: "stock",
    label: "Standard Vehicle",
    description: "Flow 1 — Stock / lightly modified buyer detail",
  },
  {
    type: "modified",
    label: "Modified / Performance",
    description: "Flow 2 — Build summary, mods, and dyno data",
  },
  {
    type: "classic",
    label: "Classic Collector",
    description: "Heritage sample — originality and documentation",
  },
  {
    type: "restored",
    label: "Restoration Listing",
    description: "Flow 3 — Authenticity checklist and restoration categories",
  },
  {
    type: "race",
    label: "Race / Competition",
    description: "Flow 4 — Competition profile, safety, and race mods",
  },
];
