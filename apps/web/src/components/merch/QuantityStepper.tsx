"use client";

import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantityStepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div className={cn("inline-flex items-center gap-2 rounded-xl border px-2 py-1.5", className)}>
      <button
        type="button"
        className="h-7 w-7 rounded-full border flex items-center justify-center hover:bg-muted disabled:opacity-40"
        disabled={value <= min}
        onClick={() => onChange(clamp(value - 1))}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3" />
      </button>
      <Input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const next = parseInt(e.target.value, 10);
          if (Number.isNaN(next)) {
            onChange(min);
            return;
          }
          onChange(clamp(next));
        }}
        className="h-8 w-14 border-0 shadow-none text-center px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        className="h-7 w-7 rounded-full border flex items-center justify-center hover:bg-muted disabled:opacity-40"
        disabled={value >= max}
        onClick={() => onChange(clamp(value + 1))}
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}
