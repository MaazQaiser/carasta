import type { Metadata } from "next";
import { GetStartedClient } from "./GetStartedClient";

export const metadata: Metadata = { title: "Get Started" };

export default function GetStartedPage() {
  return <GetStartedClient />;
}
