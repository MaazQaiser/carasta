import { redirect } from "next/navigation";

/** Legacy race competition path — redirects to summary (mobile-aligned). */
export default function ListingRaceCompetitionRedirectPage() {
  redirect("/listing/race/summary");
}
