import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

export const metadata: Metadata = { title: "FAQ — Carasta" };

const FAQS = [
  {
    q: "How do Carasta auctions work?",
    a: "Carasta auctions are 7-day online auctions for verified collector vehicles. Bidders compete in real time, and the highest bidder at closing wins — subject to the seller's reserve price being met.",
  },
  {
    q: "What is a reserve price?",
    a: "A reserve price is the minimum amount a seller will accept. If bidding doesn't reach the reserve, the vehicle will not sell. The auction page shows whether the reserve has been met.",
  },
  {
    q: "What is Buy it Now?",
    a: "Some listings include a Buy it Now price. Clicking 'Buy it Now' immediately ends the auction and purchases the vehicle at that fixed price.",
  },
  {
    q: "How do I register to bid?",
    a: "Create a free account, verify your email, and add a payment method. Once approved, you can bid on any live auction.",
  },
  {
    q: "What happens after I win an auction?",
    a: "You'll receive a notification with payment instructions. Payment must be completed within 48 hours. After payment, we coordinate vehicle pickup or delivery.",
  },
  {
    q: "Does Carasta offer shipping?",
    a: "Yes — we work with enclosed transport providers nationwide. Shipping costs are calculated at checkout based on origin and destination.",
  },
  {
    q: "What is Carmunity?",
    a: "Carmunity is Carasta's social community — share builds, photos, and stories with fellow automotive enthusiasts. Follow creators, join clubs, and discover new vehicles.",
  },
  {
    q: "How do I list a vehicle for auction?",
    a: "Go to List → New Listing. Complete the VIN lookup, upload photos, set your reserve and Buy it Now prices, agree to the seller terms, and submit for review.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-8">
        Can&apos;t find the answer?{" "}
        <Link href="/support" className="text-primary font-medium hover:underline">Contact support</Link>.
      </p>

      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <details key={i} className="group rounded-xl border bg-card overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-medium text-sm select-none">
              {faq.q}
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">Still need help?</p>
        <Link href="/support" className="text-primary font-semibold hover:underline">Visit the Support Center</Link>
      </div>
    </div>
  );
}
