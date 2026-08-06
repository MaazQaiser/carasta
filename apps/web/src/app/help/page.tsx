import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, Gavel, Car, Shield, CreditCard, MessageSquare, ChevronRight } from "lucide-react";

export const metadata: Metadata = { title: "Help Center" };

const SECTIONS = [
  {
    icon: Gavel,
    title: "How Auctions Work",
    description: "Learn about bidding, reserves, and auction types.",
    href: "/help/auctions",
    articles: ["Placing your first bid", "Understanding reserve prices", "Auto-bidding explained", "What happens when you win"],
  },
  {
    icon: Car,
    title: "Selling Your Vehicle",
    description: "Everything you need to know about listing and selling.",
    href: "/help/selling",
    articles: ["Creating a listing", "Setting your reserve", "Preparing your vehicle", "Auction best practices"],
  },
  {
    icon: Shield,
    title: "Buyer Protection",
    description: "How Carasta protects every purchase.",
    href: "/help/buyer-protection",
    articles: ["Money-back guarantee", "Dispute resolution", "Inspection reports", "Escrow payments"],
  },
  {
    icon: CreditCard,
    title: "Payments & Fees",
    description: "Fees, payment methods, and financing options.",
    href: "/help/payments",
    articles: ["Listing fees", "Success fees", "Payment methods accepted", "Financing partners"],
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 lg:px-6 py-16">
      <div className="text-center mb-12">
        <HelpCircle className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-3">Help Center</h1>
        <p className="text-muted-foreground text-lg">Everything you need to know about buying and selling on Carasta</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {SECTIONS.map(({ icon: Icon, title, description, href, articles }) => (
          <div key={title} className="rounded-2xl border bg-card p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="font-semibold">{title}</h2>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {articles.map((article) => (
                <li key={article}>
                  <Link href={href} className="flex items-center justify-between text-sm py-1.5 hover:text-primary transition-colors group">
                    <span>{article}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-muted/50 p-8 text-center">
        <MessageSquare className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
        <h3 className="font-semibold mb-2">Still need help?</h3>
        <p className="text-sm text-muted-foreground mb-4">Our support team is available 7 days a week.</p>
        <Link href="/help/contact">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Contact Support
          </button>
        </Link>
      </div>
    </div>
  );
}
