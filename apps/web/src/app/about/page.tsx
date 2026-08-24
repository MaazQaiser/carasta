import type { Metadata } from "next";
import Link from "next/link";
import { Gavel, Users, ShoppingBag, Car, HelpCircle, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auctionService } from "@carasta/mock-data/services";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "About Carasta" };

export default async function AboutPage() {
  const result = await auctionService.getAuctions({ pageSize: 100 });
  const liveCount = result.data.filter((a) => a.status === "live").length;

  return (
    <div className="mx-auto max-w-screen-xl px-4 lg:px-6">
      {/* Hero */}
      <div className="py-16 lg:py-24 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
          Where enthusiasts buy and sell classic cars
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Carasta is a curated auctions platform for vintage and collector vehicles — transparent bidding, documented histories, verified sellers, and a community that truly knows cars.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/auctions">
            <Button variant="bid" size="lg">Browse Auctions</Button>
          </Link>
          <Link href="/listing">
            <Button variant="outline" size="lg">Sell Your Car</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {[
          { icon: Gavel, label: "Live Auctions", value: String(liveCount) },
          { icon: Car, label: "Vehicles Sold", value: "8,000+" },
          { icon: Users, label: "Active Members", value: "45,000+" },
          { icon: ShoppingBag, label: "Avg. Seller Rating", value: "4.9 ★" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border bg-card p-6 text-center">
            <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="rounded-3xl bg-primary text-primary-foreground p-8 lg:p-12 mb-16 text-center">
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
          To make buying and selling collector cars as transparent, safe, and enjoyable as the vehicles themselves. Every listing is reviewed, every seller is verified, and every buyer is protected.
        </p>
      </div>

      {/* How it works */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Browse & Discover", body: "Explore curated listings with detailed photos, videos, build sheets, and verified histories." },
            { step: "02", title: "Bid with Confidence", body: "Place bids on live auctions. Watch the countdown, track competing bids, and get outbid alerts instantly." },
            { step: "03", title: "Win & Receive", body: "Win your auction, complete payment, and we coordinate delivery — white-glove enclosed transport available nationwide." },
          ].map(({ step, title, body }) => (
            <div key={step} className="text-center p-6">
              <div className="text-4xl font-black text-primary/20 mb-3">{step}</div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <div className="rounded-2xl border bg-card p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Get in Touch</h2>
          <p className="text-muted-foreground text-sm">Our team is here to help — whether you&apos;re buying, selling, or just curious.</p>
          <p className="text-sm mt-2 font-medium">hello@carasta.com</p>
        </div>
        <Link href="/support">
          <Button variant="bid" className="gap-1.5 shrink-0">
            <Mail className="h-4 w-4" /> Contact Support <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
