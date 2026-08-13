import { redirect } from "next/navigation";

/** Post-submit share hub removed — share after approval from the live auction page. */
export default function ListingSharePage() {
  redirect("/profile?tab=listings");
}
