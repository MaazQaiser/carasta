"use client";

import { Input } from "@/components/ui/input";
import { FieldHint, FieldLabel } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import type { ListingVehicleDetails } from "../types";
import { getIssuesForStep } from "../services/validation-service";

const DETAIL_FIELDS: {
  key: keyof ListingVehicleDetails;
  label: string;
  placeholder: string;
}[] = [
  { key: "year", label: "Year", placeholder: "e.g. 2019" },
  { key: "make", label: "Make", placeholder: "e.g. Porsche" },
  { key: "model", label: "Model", placeholder: "e.g. 911" },
  { key: "trim", label: "Trim", placeholder: "e.g. Carrera S" },
  { key: "mileage", label: "Mileage", placeholder: "e.g. 24500" },
  { key: "exteriorColor", label: "Exterior Color", placeholder: "e.g. Guards Red" },
  { key: "interiorColor", label: "Interior Color", placeholder: "e.g. Black" },
  { key: "engine", label: "Engine", placeholder: "e.g. 3.0L Twin-Turbo Flat-6" },
  { key: "transmission", label: "Transmission", placeholder: "e.g. PDK" },
  { key: "drivetrain", label: "Drivetrain", placeholder: "e.g. RWD" },
  { key: "vin", label: "VIN", placeholder: "Vehicle VIN" },
];

export function VehicleDetailsScreen() {
  const { draft, updateDetails } = useListingBuilder();
  const issues = getIssuesForStep(draft, "details");

  return (
    <ListingStep
      title="Vehicle Details"
      description="Edit core vehicle information. These fields can be filled automatically after VIN decoding later."
    >
      <ListingSection title="Core details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DETAIL_FIELDS.map((field) => {
            const fieldIssue = issues.find((issue) => issue.field === field.key);
            return (
              <div key={field.key} className={field.key === "vin" ? "sm:col-span-2" : undefined}>
                <FieldLabel htmlFor={`detail-${field.key}`}>{field.label}</FieldLabel>
                <Input
                  id={`detail-${field.key}`}
                  value={draft.details[field.key]}
                  onChange={(e) =>
                    updateDetails({
                      [field.key]:
                        field.key === "vin" ? e.target.value.toUpperCase() : e.target.value,
                    })
                  }
                  placeholder={field.placeholder}
                  className={
                    field.key === "vin"
                      ? "font-mono tracking-wide uppercase"
                      : fieldIssue
                        ? "border-destructive"
                        : undefined
                  }
                  aria-invalid={Boolean(fieldIssue)}
                />
                {fieldIssue ? (
                  <p className="text-xs text-destructive mt-1.5">{fieldIssue.message}</p>
                ) : null}
              </div>
            );
          })}
        </div>
        <FieldHint>
          Empty for now is fine. Values stay in the listing draft as you move between steps.
        </FieldHint>
      </ListingSection>
    </ListingStep>
  );
}
