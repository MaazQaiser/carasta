import type { Metadata } from "next";
import { SellWizardClient } from "./SellWizardClient";

export const metadata: Metadata = { title: "Sell Your Vehicle" };

export default function SellPage() {
  return <SellWizardClient />;
}
