"use client";

interface MobileStepProgressProps {
  step: number;
  total: number;
}

export function MobileStepProgress({ step, total }: MobileStepProgressProps) {
  const pct = Math.min((step / total) * 100, 100);

  return (
    <div className="flex flex-col gap-2 px-6 py-3 shrink-0 w-full">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#636366]">
        Step {step} of {total}
      </p>
      <div className="relative h-1 w-full rounded-full bg-[#e5e5ea] overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-[#1b1464] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
