# Carasta Brand Guidelines (Web)

Aligned with the mobile app — [Carasta on Google Play](https://play.google.com/store/apps/details?id=com.hidden_cherry_45273) (“Bid, Win & Connect”) and [carasta.com](https://www.carasta.com).

## Taglines
- **Bid, Win & Connect**
- **Cars. Community. Culture**
- Community referred to as **Carmunity**

## Logo
- Circular gear-shift mark with **CARASTA** wordmark
- Asset: `/public/brand/carasta-logo.png`
- Component: `CarastaLogo` (`src/components/brand/CarastaLogo.tsx`)

## Color tokens (`src/theme/carastaTheme.ts`)
| Token | Hex | Use |
|-------|-----|-----|
| `primary` | `#1E1E8C` | App chrome, CTAs, links accent |
| `primaryDark` | `#141464` | Footer, hero gradient start |
| `primaryLight` | `#3D3DB0` | Hero gradient end |
| `bid` | `#E8A317` | Bid / primary conversion CTA |
| `urgent` | `#D32F2F` | Countdown / live / outbid |
| `success` | `#2E7D32` | Sold / success states |
| `canvas` | `#F4F5F9` | Page background |
| `ink` | `#1C1C1C` | Body text |

## Typography
- **Body:** Inter
- **Headings / wordmark:** Montserrat (bold, tracked)

## UI system
- **Material UI (MUI) v6** is the primary component library
- Theme provider: `ThemeRegistry` wraps the App Router
- Cards: white, 16px radius, light border + soft shadow (matches mobile listing cards)
