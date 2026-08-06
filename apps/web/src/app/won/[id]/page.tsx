import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Trophy, Package, MapPin, Phone, Truck, CreditCard, ChevronLeft } from "lucide-react";
import { auctionService } from "@carasta/mock-data/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatMileage } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const auction = await auctionService.getAuction(id);
  if (!auction) return { title: "Won Auction" };
  return { title: `Won: ${auction.vehicle.title}` };
}

export default async function WonAuctionDetailPage({ params }: Props) {
  const { id } = await params;
  const auction = await auctionService.getAuction(id);
  if (!auction) notFound();

  const vehicle = auction.vehicle;
  const img = vehicle.images[0];

  return (
    <div className="mx-auto max-w-screen-xl px-4 lg:px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/won" className="hover:text-foreground">Won Auctions</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate">{vehicle.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — vehicle info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl overflow-hidden border bg-card">
            {img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img.url} alt={vehicle.title} className="w-full aspect-video object-cover" />
            )}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-2xl font-bold">{vehicle.title}</h1>
                <Badge className="bg-yellow-500 text-white border-0 gap-1 shrink-0">
                  <Trophy className="h-3 w-3" /> Won
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-1 mt-1 text-sm">
                <MapPin className="h-4 w-4" />
                {vehicle.location.city}, {vehicle.location.state}
              </p>
            </div>
          </div>

          {/* Key specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              ["Mileage", formatMileage(vehicle.spec.mileage)],
              ["Year", String(vehicle.spec.year)],
              ["Make", vehicle.spec.make],
              ["Model", vehicle.spec.model],
              ["Transmission", vehicle.spec.transmission],
              ["Fuel", vehicle.spec.fuelType],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border bg-card p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold capitalize mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Next steps */}
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h2 className="font-semibold text-lg">Next Steps</h2>
            {[
              { icon: CreditCard, title: "Complete Payment", desc: "Finalize your purchase within 48 hours.", href: "/payments", cta: "Go to Payments" },
              { icon: Truck, title: "Arrange Delivery", desc: "Choose enclosed transport or self-pickup.", href: "/help", cta: "Contact Support" },
              { icon: Package, title: "Vehicle Handover", desc: "Receive your vehicle documentation and keys.", href: "/help", cta: "View Guide" },
            ].map(({ icon: Icon, title, desc, href, cta }) => (
              <div key={title} className="flex items-start gap-4 p-4 rounded-xl border">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <Link href={href}>
                  <Button variant="outline" size="sm" className="text-xs">{cta}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right — auction summary */}
        <div className="space-y-4">
          <div className="sticky top-20 rounded-2xl border bg-card p-5 space-y-4">
            <h2 className="font-semibold">Auction Summary</h2>
            <div>
              <p className="text-sm text-muted-foreground">Final Price</p>
              <p className="text-3xl font-bold">{formatPrice(auction.finalPrice ?? auction.currentBid)}</p>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ["Hammer price", formatPrice(auction.currentBid)],
                ["Buyer premium (est.)", formatPrice(Math.round(auction.currentBid * 0.05))],
                ["Total bids", String(auction.bidCount)],
                ["Auction ID", auction.id],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
            <Link href="/payments">
              <Button variant="bid" size="lg" className="w-full">Complete Payment</Button>
            </Link>
            <p className="text-xs text-center text-muted-foreground">
              Need help? <Link href="/help" className="text-primary hover:underline">Contact support</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/won">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ChevronLeft className="h-4 w-4" /> Back to Won Auctions
          </Button>
        </Link>
      </div>
    </div>
  );
}
