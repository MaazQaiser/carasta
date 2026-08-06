import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-bold mb-2">Product not found</h1>
      <p className="text-sm text-muted-foreground mb-6">
        This item isn&apos;t in the Merch Store anymore.
      </p>
      <Button variant="bid" asChild>
        <Link href="/shop">Back to Merch Store</Link>
      </Button>
    </div>
  );
}
