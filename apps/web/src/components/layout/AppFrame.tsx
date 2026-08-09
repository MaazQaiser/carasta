"use client";

import { usePathname } from "next/navigation";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobileListing =
    pathname.startsWith("/mobile-listing") || pathname.startsWith("/m/");

  if (isMobileListing) {
    return <main className="mobile-listing-route">{children}</main>;
  }

  return (
    <>
      <TopNav />
      <main className="site-main">{children}</main>
      <Footer />
      <BottomNav />
    </>
  );
}
