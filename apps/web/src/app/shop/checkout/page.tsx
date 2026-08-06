import type { Metadata } from "next";
import { CheckoutClient } from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Carasta Merch Store order.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
