"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/**
 * Bottom sheet for mobile listing / buyer flows.
 * Portals to document.body so it is not clipped by `.ml-phone-frame { overflow: hidden }`.
 */
export function MobileOptionSheet({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 flex max-h-[85svh] w-full max-w-[440px] flex-col rounded-t-[28px] bg-white shadow-xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#e5e5ea] px-5 py-4">
          <h2 className="text-[17px] font-bold text-[#1c1c1e]">{title}</h2>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#636366]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          {children}
        </div>
        {footer ? (
          <div className="shrink-0 border-t border-[#e5e5ea] bg-white px-5 py-4">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}

/** Simple option list used by select-style fields. */
export function MobileOptionList({
  options,
  value,
  onSelect,
}: {
  options: readonly string[] | { value: string; label: string }[];
  value?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="divide-y divide-[#f0f0f2]">
      {options.map((option) => {
        const optionValue = typeof option === "string" ? option : option.value;
        const label = typeof option === "string" ? option : option.label;
        const selected = optionValue === value;
        return (
          <button
            key={optionValue}
            type="button"
            className="flex w-full items-center justify-between py-3.5 text-left text-[14px] text-[#1c1c1e]"
            onClick={() => onSelect(optionValue)}
          >
            {label}
            {selected ? <span className="font-semibold text-[#1b1464]">✓</span> : null}
          </button>
        );
      })}
    </div>
  );
}

/** Trigger + bottom-sheet select (native &lt;select&gt; often fails inside the phone frame). */
export function MobileSelectField({
  label,
  value,
  options,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  options: readonly string[] | { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const display =
    typeof options[0] === "string" || options.length === 0
      ? value
      : (options as { value: string; label: string }[]).find((o) => o.value === value)?.label ||
        value;

  return (
    <>
      <div className="block space-y-1.5">
        <span className="text-[12px] font-semibold text-[#636366]">{label}</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative flex h-11 w-full items-center rounded-lg border border-[#e5e5ea] bg-white px-3 text-left transition-colors hover:border-[#c7c7cc]"
        >
          <span className={display ? "text-[13px] text-[#1c1c1e]" : "text-[13px] text-[#9ca3af]"}>
            {display || placeholder || `Select ${label.toLowerCase()}`}
          </span>
          <span className="pointer-events-none absolute right-3 text-[12px] text-[#636366]">▾</span>
        </button>
      </div>
      <MobileOptionSheet open={open} title={label} onClose={() => setOpen(false)}>
        <MobileOptionList
          options={options}
          value={value}
          onSelect={(next) => {
            onChange(next);
            setOpen(false);
          }}
        />
      </MobileOptionSheet>
    </>
  );
}
