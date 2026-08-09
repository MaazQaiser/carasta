import { redirect } from "next/navigation";

/** Legacy path — mirrors mobile `/condition`. */
export default function ListingHistoryRedirectPage() {
  redirect("/listing/condition");
}
