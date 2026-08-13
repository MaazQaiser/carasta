/** Shared Auction Settings (formerly Sale Settings) copy. */

export const AUCTION_SETTINGS_COPY = {
  title: "Auction Settings",
  subtext: "Choose how you would like your auction to run.",
  buyNowLabel: "Buy It Now",
  buyNowSubtext:
    "Set a premium Buy Now price that lets a buyer purchase your vehicle immediately and end the auction early. Buy Now is only available during the first 24 hours of the auction.",
  reserveLabel: "Reserve Price",
  reserveSubtext:
    "Set the minimum price you’re willing to accept. Your reserve will be reflected on the Reserve Meter until the reserve is lifted. If bidding does not meet the reserve, the vehicle will not sell.",
  pricingNote: "Note: Only one pricing option can be active.",
  startPrompt: "When do you want your auction to start?",
  shippingAvailableLabel: "Shipping Available",
  shippingAvailableSubtext: "Willing to coordinate vehicle transport",
  localPickupLabel: "Local Pickup Required",
  localPickupSubtext: "Buyer must retrieve vehicle directly",
} as const;
