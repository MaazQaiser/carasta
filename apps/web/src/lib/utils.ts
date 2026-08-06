import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, compact = false): string {
  if (compact && amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (compact && amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export function formatMileage(mileage: number): string {
  return new Intl.NumberFormat("en-US").format(mileage) + " mi";
}

export function formatTimeRemaining(endTime: string): { label: string; urgent: boolean } {
  const ms = new Date(endTime).getTime() - Date.now();
  if (ms <= 0) return { label: "Ended", urgent: true };
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const urgent = ms < 3600000;
  if (h > 24) {
    const d = Math.floor(h / 24);
    return { label: `${d}d ${h % 24}h`, urgent: false };
  }
  if (h > 0) return { label: `${h}h ${m}m`, urgent };
  if (m > 0) return { label: `${m}m ${s}s`, urgent: true };
  return { label: `${s}s`, urgent: true };
}

/** Full countdown units for marketplace-style timer bars */
export function getCountdownParts(endTime: string) {
  const ms = Math.max(0, new Date(endTime).getTime() - Date.now());
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return { days, hours, minutes, seconds, ended: ms <= 0 };
}

export function formatRelativeTime(dateString: string): string {
  const ms = Date.now() - new Date(dateString).getTime();
  if (ms < 60000) return "just now";
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m ago`;
  if (ms < 86400000) return `${Math.floor(ms / 3600000)}h ago`;
  if (ms < 604800000) return `${Math.floor(ms / 86400000)}d ago`;
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}
