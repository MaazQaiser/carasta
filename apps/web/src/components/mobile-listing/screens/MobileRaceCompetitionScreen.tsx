"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

/** Legacy route — competition profile now lives on Race Summary. */
export function MobileRaceCompetitionScreen() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/mobile-listing/race/summary");
  }, [router]);

  return (
    <div className="px-6 py-10 text-[14px] text-[#636366]">
      Opening Competition Profile…
    </div>
  );
}
