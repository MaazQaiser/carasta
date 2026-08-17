import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/faq/FaqAccordion";

export const metadata: Metadata = { title: "FAQ — Carasta" };

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-8">
        Bidding, selling, fees, and what happens after the auction. Can&apos;t find the answer?{" "}
        <Link href="/support" className="text-primary font-medium hover:underline">
          Contact support
        </Link>
        .
      </p>

      <FaqAccordion />

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">Still need help?</p>
        <Link href="/support" className="text-primary font-semibold hover:underline">
          Visit the Support Center
        </Link>
      </div>
    </div>
  );
}
