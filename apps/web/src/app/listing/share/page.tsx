import { redirect } from "next/navigation";

/** Share hub skipped — mobile goes straight to external share. */
export default function ListingSharePage() {
  redirect("/listing/share/external");
}
