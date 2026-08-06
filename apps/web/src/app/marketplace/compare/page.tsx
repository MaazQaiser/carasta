import type { Metadata } from "next";
import { CompareClient } from "./CompareClient";

export const metadata: Metadata = { title: "Compare Vehicles" };

export default function ComparePage() {
  return <CompareClient />;
}
