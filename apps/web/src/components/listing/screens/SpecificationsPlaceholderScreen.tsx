import { FileText } from "lucide-react";
import { ListingStep } from "../ListingStep";

/** Shared placeholder — type-specific specs land in a later pass. */
export function SpecificationsPlaceholderScreen() {
  return (
    <ListingStep
      title="Specifications & Modifications"
      description="This section changes depending on the selected vehicle type."
    >
      <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-16 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-base">Specifications & Modifications</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          This section changes depending on the selected vehicle type. Stock, modified,
          restored, and race flows will each provide their own fields here.
        </p>
      </div>
    </ListingStep>
  );
}
