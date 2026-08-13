import { redirect } from "next/navigation";

/** Post-submit share hub removed — share after approval from the live auction page. */
export default function MobileShareIndexPage() {
  redirect("/profile?tab=listings");
}
