import { redirect } from "next/navigation";

/** Post-submit share hub removed — share after approval from the listing page. */
export default function ListingSharePage() {
  redirect("/profile?tab=auctions");
}
