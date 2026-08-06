# Carasta Web Platform — Web Advantages

This document captures every feature that differentiates the Carasta **web** experience from a mobile-only interface.

## Multi-Column Layouts
- **Home:** side-by-side "Ending Soon" + "Upcoming" sections on desktop (single-column stack on mobile)
- **Auctions / Marketplace:** persistent left filter rail on `lg+` screens; drawer on mobile
- **Live Auction:** three-panel layout — gallery | bid panel | chat — all visible simultaneously on desktop
- **Vehicle Detail:** two-column (gallery/tabs + sticky auction panel) on desktop

## Compare Feature
`/marketplace/compare` — a **web-only** capability:
- Add up to 4 vehicles from card checkboxes
- Side-by-side spec table with 18 comparison rows
- Best-value highlighting (price, mileage)
- Floating compare bar with count
- Shareable URL with `compareList` query params

## Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `/` | Open global search |
| `⌘K` / `Ctrl+K` | Open global search |
| `Esc` | Close dialogs / search |
| `←` / `→` | Navigate gallery images on vehicle detail |

## Richer Information Density
- 3–4 column auction/vehicle grids on desktop vs 1 column on mobile web
- List view toggle (rows instead of cards) for faster scanning
- Inline bid-history table visible on vehicle detail sidebar without scrolling

## Seller Analytics Dashboard (`/sell/listings`)
- 7-day bid activity chart (views, bids, watchers via Recharts `ComposedChart`)
- Per-listing stats panel
- Admin-level auction monitor table

## Bid History Chart
`/auctions/[id]/live` — Recharts `AreaChart` showing real-time bid progression with simulated incoming bids every ~4 seconds

## Photo Gallery with Thumbnails
- Fullscreen button on vehicle detail gallery
- Thumbnail strip for multi-image navigation

## SEO / Open Graph
- `generateMetadata` on `/vehicles/[id]` and `/auctions/[id]/live`
- Root layout sets site-wide OG tags and Twitter card
- Static routes pre-rendered at build time; dynamic routes SSR'd

## Performance
- All heavy components are `"use client"` only where needed; server components for data fetching
- Image domains configured in `next.config.ts` for `next/image` optimization
- Route-level loading skeletons (animated `pulse` placeholders)
- Virtualized long bid history with `max-h + overflow-y-auto` scroll areas

## Accessibility
- All interactive buttons have `aria-label` attributes
- Focus management with `focus-visible:ring` on all interactive elements
- `sr-only` labels on icon-only buttons
- Keyboard-navigable modal (radix Dialog)
- Color contrast: primary text on white/dark backgrounds passes WCAG AA

## Global Search
- Opens via `/` or `⌘K` from anywhere in the app
- Grouped results (vehicles, users, quick links)
- Debounced vehicle search with 250ms delay
- Fallback "Search all results" link to `/search`
