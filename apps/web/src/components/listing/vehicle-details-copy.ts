/** Shared Vehicle Details beginning-screen copy (web + mobile). */
export const VEHICLE_DETAILS_COPY = {
  title: "Vehicle Details",
  subtext: "Confirm and complete your vehicle information.",
  vinImportedBadge: "VIN Imported",
  primaryColor: "Exterior Color",
  secondaryColor: "Secondary Color",
  primaryColorPlaceholder: "Select exterior color",
  secondaryColorPlaceholder: "Select secondary color (optional)",
  mileagePlaceholder: "Enter mileage",
} as const;

export const EXTERIOR_COLOR_OPTIONS = [
  "Silver",
  "Black",
  "White",
  "British Racing Green",
  "Guards Red",
  "Miami Blue",
  "Other (Custom)",
] as const;

export const INTERIOR_COLOR_OPTIONS = [
  "Black Leather",
  "Tan Leather",
  "Red Leather",
  "Alcantara",
  "Other (Custom)",
] as const;
