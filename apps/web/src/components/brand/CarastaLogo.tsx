"use client";

interface CarastaLogoProps {
  /** Rendered logo height in px */
  size?: number;
  /** White wordmark for dark backgrounds; defaults to red circular mark on light */
  inverted?: boolean;
  /** Circular CARASTA badge (gear-shifter mark) */
  badge?: boolean;
  /** Kept for API compatibility */
  showWordmark?: boolean;
}

/**
 * Official Carasta logo.
 * Default: red-R circular mark (`CarastaLogo-RedR.png`).
 * Badge: circular wordmark (`carasta-badge.png`).
 * Inverted: white wordmark for dark surfaces (footer).
 *
 * Height is set via inline styles so it wins over Tailwind's unlayered
 * preflight (`img { height: auto }`).
 */
export function CarastaLogo({ size = 32, inverted = false, badge = false }: CarastaLogoProps) {
  const src = inverted
    ? "/brand/carasta-wordmark-white.png"
    : badge
      ? "/brand/carasta-badge.png"
      : "/brand/CarastaLogo-RedR.png";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Carasta"
      style={{
        height: size,
        width: badge ? size : "auto",
        display: "block",
        userSelect: "none",
      }}
    />
  );
}
