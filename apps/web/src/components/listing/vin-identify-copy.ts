/** Shared Vehicle Information / VIN beginning-screen copy (web + mobile). */
export const VIN_IDENTIFY_COPY = {
  title: "Vehicle Information",
  subtext:
    "Start by identifying your vehicle. This helps us pre-fill critical details instantly.",
  scan: {
    title: "Scan VIN Barcode",
    description: "Use your camera to scan the door jamb or windshield",
  },
  manual: {
    title: "Enter VIN Manually",
    description: "Type the 17-character vehicle code directly",
  },
  withoutVin: {
    title: "Continue Without VIN",
    description:
      "For classics before 1981, race cars, kit cars, customs, and other vehicles without a standard 17-character VIN",
  },
  found: {
    banner: "Vehicle Found. Auto-populated from decode.",
    importedBadge: "VIN imported",
  },
  failure: {
    banner:
      "Vehicle couldn't be decoded. Please enter your vehicle details manually or try a different VIN.",
    tryAgain: "Try Again",
    continueManually: "Continue Manually",
  },
} as const;
