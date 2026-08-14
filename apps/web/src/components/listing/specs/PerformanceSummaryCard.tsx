"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldHint, FieldLabel, textareaClassName } from "../fields";
import type { PerformanceSummary } from "./types";
import { HORSEPOWER_STATUS_OPTIONS, TORQUE_STATUS_OPTIONS } from "./options";

export function PerformanceSummaryCard({
  value,
  onChange,
}: {
  value: PerformanceSummary;
  onChange: (patch: Partial<PerformanceSummary>) => void;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 space-y-5">
      <div>
        <h3 className="font-semibold text-base">Performance Summary</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          High-level build output for this Modified / Performance listing. Unsupported or
          unverified figures remain seller-reported.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel htmlFor="current-engine">Current Engine</FieldLabel>
          <Input
            id="current-engine"
            value={value.currentEngine}
            onChange={(e) => onChange({ currentEngine: e.target.value })}
            placeholder="e.g. 2.5L Turbo Flat-4"
          />
        </div>
        <div>
          <FieldLabel htmlFor="perf-transmission">Transmission</FieldLabel>
          <Input
            id="perf-transmission"
            value={value.transmission}
            onChange={(e) => onChange({ transmission: e.target.value })}
            placeholder="e.g. 6-speed manual"
          />
        </div>
        <div>
          <FieldLabel htmlFor="perf-drivetrain">Drivetrain</FieldLabel>
          <Input
            id="perf-drivetrain"
            value={value.drivetrain}
            onChange={(e) => onChange({ drivetrain: e.target.value })}
            placeholder="e.g. AWD"
          />
        </div>
        <div>
          <FieldLabel htmlFor="fuel-type">Fuel Type</FieldLabel>
          <Input
            id="fuel-type"
            value={value.fuelType}
            onChange={(e) => onChange({ fuelType: e.target.value })}
            placeholder="e.g. 91 octane / E85"
          />
        </div>
        <div>
          <FieldLabel htmlFor="horsepower">Horsepower</FieldLabel>
          <Input
            id="horsepower"
            value={value.horsepower}
            onChange={(e) => onChange({ horsepower: e.target.value })}
            placeholder="e.g. 420"
          />
        </div>
        <div>
          <FieldLabel>Horsepower Status</FieldLabel>
          <Select
            value={value.horsepowerStatus || undefined}
            onValueChange={(v) => onChange({ horsepowerStatus: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {HORSEPOWER_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <FieldLabel htmlFor="torque">Torque</FieldLabel>
          <Input
            id="torque"
            value={value.torque}
            onChange={(e) => onChange({ torque: e.target.value })}
            placeholder="e.g. 380 lb-ft"
          />
        </div>
        <div>
          <FieldLabel>Torque Status</FieldLabel>
          <Select
            value={value.torqueStatus || undefined}
            onValueChange={(v) => onChange({ torqueStatus: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {TORQUE_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <FieldLabel htmlFor="tuning-platform">Tuning Platform</FieldLabel>
          <Input
            id="tuning-platform"
            value={value.tuningPlatform}
            onChange={(e) => onChange({ tuningPlatform: e.target.value })}
            placeholder="e.g. Cobb Accessport / custom ECU"
          />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel htmlFor="build-summary">Build Summary</FieldLabel>
          <textarea
            id="build-summary"
            className={textareaClassName}
            value={value.buildSummary}
            onChange={(e) => onChange({ buildSummary: e.target.value })}
            placeholder="Short overview of the build goals, stage, and standout modifications..."
          />
          <FieldHint>Shown in listing preview as a high-level build snapshot.</FieldHint>
        </div>
      </div>
    </div>
  );
}
