"use client";

import Link from "next/link";
import type { OrderTotals } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface OrderSummaryCardProps {
  totals: OrderTotals;
  primaryLabel: string;
  onPrimary?: () => void;
  primaryHref?: string;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
  secondaryHref?: string;
  onSecondary?: () => void;
  footerNote?: string;
  /** When true, shipping row shows checkout placeholder copy. */
  shippingAtCheckout?: boolean;
  /** Label for final total row. */
  totalLabel?: string;
  taxLabel?: string;
  children?: React.ReactNode;
  className?: string;
  hideActions?: boolean;
}

export function OrderSummaryCard({
  totals,
  primaryLabel,
  onPrimary,
  primaryHref,
  primaryDisabled,
  secondaryLabel,
  secondaryHref,
  onSecondary,
  footerNote,
  shippingAtCheckout = false,
  totalLabel = "Grand Total",
  taxLabel = "Estimated Tax",
  children,
  className,
  hideActions = false,
}: OrderSummaryCardProps) {
  return (
    <aside
      className={
        className ??
        "rounded-2xl border bg-card p-5 h-fit lg:sticky lg:top-28 space-y-4"
      }
    >
      <h2 className="font-semibold">Order summary</h2>
      <div className="space-y-2 text-sm">
        <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
        <Row
          label="Shipping"
          value={
            shippingAtCheckout
              ? "Calculated at checkout"
              : totals.shipping === 0
                ? "Free"
                : formatPrice(totals.shipping)
          }
        />
        <Row label={taxLabel} value={formatPrice(totals.tax)} />
        {totals.discount > 0 ? (
          <Row label="Discount" value={`−${formatPrice(totals.discount)}`} muted />
        ) : (
          <Row label="Discount" value={formatPrice(0)} />
        )}
      </div>
      <div className="border-t pt-3 flex justify-between font-semibold">
        <span>{totalLabel}</span>
        <span>
          {formatPrice(
            shippingAtCheckout
              ? Math.max(0, totals.subtotal - totals.discount + totals.tax)
              : totals.total
          )}
        </span>
      </div>
      {children}
      {!hideActions ? (
        <>
          {primaryHref ? (
            <Button variant="bid" size="lg" className="w-full" disabled={primaryDisabled} asChild>
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
          ) : (
            <Button
              variant="bid"
              size="lg"
              className="w-full"
              disabled={primaryDisabled}
              onClick={onPrimary}
              type="button"
            >
              {primaryLabel}
            </Button>
          )}
          {secondaryLabel ? (
            secondaryHref ? (
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                type="button"
                onClick={onSecondary}
              >
                {secondaryLabel}
              </Button>
            )
          ) : null}
        </>
      ) : null}
      {footerNote ? (
        <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
          {footerNote}
        </p>
      ) : null}
    </aside>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={muted ? "text-green-700 font-medium text-right" : "font-medium text-right"}>
        {value}
      </span>
    </div>
  );
}
