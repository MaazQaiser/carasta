"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "cart", label: "Shopping Cart", href: "/shop/cart" },
  { id: "checkout", label: "Checkout", href: "/shop/checkout" },
  { id: "confirmation", label: "Order Confirmation", href: undefined },
] as const;

interface CheckoutProgressProps {
  current: "cart" | "checkout" | "confirmation";
}

export function CheckoutProgress({ current }: CheckoutProgressProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <ol className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 mb-8">
      {STEPS.map((step, index) => {
        const complete = index < currentIndex;
        const active = index === currentIndex;
        const content = (
          <span className="inline-flex items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold border",
                complete && "bg-primary text-primary-foreground border-primary",
                active && "bg-primary text-primary-foreground border-primary",
                !complete && !active && "bg-muted text-muted-foreground border-border"
              )}
            >
              {complete ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <span
              className={cn(
                "text-sm",
                active || complete ? "font-semibold text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </span>
        );

        return (
          <li key={step.id} className="flex items-center">
            {step.href && (complete || step.id === "cart") ? (
              <Link href={step.href} className="hover:opacity-80 transition-opacity">
                {content}
              </Link>
            ) : (
              content
            )}
            {index < STEPS.length - 1 ? (
              <span
                className={cn(
                  "hidden sm:block mx-3 h-px w-10 lg:w-16",
                  index < currentIndex ? "bg-primary" : "bg-border"
                )}
                aria-hidden
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
