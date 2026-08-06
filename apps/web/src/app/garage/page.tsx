import type { Metadata } from "next";
import { garageService } from "@carasta/mock-data/services";
import { GarageClient } from "./GarageClient";

export const metadata: Metadata = { title: "My Garage" };

export default async function GaragePage() {
  const [entries, stats, drafts] = await Promise.all([
    garageService.getGarage(),
    garageService.getStats(),
    garageService.getDrafts(),
  ]);

  return <GarageClient entries={entries} stats={stats} drafts={drafts} />;
}
