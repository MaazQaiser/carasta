"use client";

import { MobileStandardModificationFormScreen } from "./MobileStandardModificationFormScreen";

export function MobileStockLightModScreen() {
  return (
    <MobileStandardModificationFormScreen
      listingTypeId="stock-lightly-modified"
      stepId="stock-mod-add"
      returnPath="/mobile-listing/stock/specifications"
      addPath="/mobile-listing/stock/modifications/add"
      title="Light Modification"
      subtitle="Add modifications by category with details and documents"
    />
  );
}
