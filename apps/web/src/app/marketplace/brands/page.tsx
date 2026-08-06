import type { Metadata } from "next";
import Link from "next/link";
import { vehicleService } from "@carasta/mock-data/services";

export const metadata: Metadata = { title: "Browse by Brand" };

export default async function BrandsPage() {
  const brands = await vehicleService.getPopularBrands();
  return (
    <div className="mx-auto max-w-screen-xl px-4 lg:px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">Browse by Brand</h1>
      <p className="text-muted-foreground mb-8">Find vehicles from your favourite manufacturers</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.map((brand) => (
          <Link key={brand.name} href={`/marketplace?make=${encodeURIComponent(brand.name)}`}>
            <div className="group flex items-center gap-4 p-4 rounded-2xl border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="h-14 w-14 rounded-full overflow-hidden bg-muted shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={brand.imageUrl} alt={brand.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-semibold">{brand.name}</p>
                <p className="text-sm text-muted-foreground">{brand.count} vehicle{brand.count !== 1 ? "s" : ""}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
