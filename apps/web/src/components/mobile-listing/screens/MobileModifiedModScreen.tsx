"use client";

import { MobileStandardModificationFormScreen } from "./MobileStandardModificationFormScreen";

export function MobileModifiedModScreen() {
  return (
    <MobileStandardModificationFormScreen
      listingTypeId="modified-performance"
      stepId="modified-mod-add"
      returnPath="/mobile-listing/modified/specifications"
      addPath="/mobile-listing/modified/modifications/add"
      title="Add Modification"
      subtitle="Document a change with category, work details, and supporting media."
    />
  );
}
