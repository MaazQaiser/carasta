import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@carasta/types", "@carasta/mock-data"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.squarespace-cdn.com" },
      { protocol: "https", hostname: "static1.squarespace.com" },
      { protocol: "https", hostname: "play-lh.googleusercontent.com" },
    ],
  },
  typedRoutes: false,
  async redirects() {
    return [
      // Deep-link aliases from handoff
      { source: "/auctionDetails/:id", destination: "/auctions/:id", permanent: false },
      { source: "/postDetails/:id", destination: "/carmunity/posts/:id", permanent: false },
      // Legacy routes
      { source: "/merch/:path*", destination: "/shop/:path*", permanent: true },
      { source: "/community/:path*", destination: "/carmunity/:path*", permanent: false },
      { source: "/sell/listings", destination: "/list", permanent: false },
      // Buyer detail demos (avoid nesting under seller /mobile-listing)
      {
        source: "/mobile-listing/m/listings",
        destination: "/m/listings",
        permanent: false,
      },
      {
        source: "/mobile-listing/m/listings/:path*",
        destination: "/m/listings/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
