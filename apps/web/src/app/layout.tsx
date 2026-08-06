import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeRegistry } from "@/theme/ThemeRegistry";
import { TopNav } from "@/components/layout/TopNav";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/context/auth-context";
import { WatchlistProvider } from "@/lib/context/watchlist-context";
import { CompareProvider } from "@/lib/context/compare-context";
import { CartProvider } from "@/lib/context/cart-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Carasta — Bid, Win & Connect",
    template: "%s | Carasta",
  },
  description:
    "Cars. Community. Culture. Bid on enthusiast vehicles, build your garage, and connect with car enthusiasts nationwide.",
  keywords: [
    "car auctions",
    "Carasta",
    "automotive auctions",
    "live vehicle auctions",
    "car community",
    "carmunity",
  ],
  openGraph: {
    type: "website",
    siteName: "Carasta",
    title: "Carasta — Bid, Win & Connect",
    description: "Cars. Community. Culture. Bid on enthusiast vehicles and join the Carmunity.",
    images: [{ url: "/brand/carasta-logo.png" }],
  },
  twitter: {
    card: "summary",
    site: "@carastaapp",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/brand/carasta-logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <ThemeRegistry>
          <AuthProvider>
            <WatchlistProvider>
              <CompareProvider>
                <CartProvider>
                  <TopNav />
                  <main className="site-main">
                    {children}
                  </main>
                  <Footer />
                  <BottomNav />
                </CartProvider>
              </CompareProvider>
            </WatchlistProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
