"use client";

import * as React from "react";
import { Plus, Search } from "lucide-react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { MobileListingShell } from "../MobileListingShell";
import { useMobileListingChrome } from "../MobileListingRuntime";
import { ShopBuilderService, type ShopBuilderRecord } from "./shop-builder-service";
import {
  applyShopBuilderSelection,
  ShopBuilderSession,
  type ShopBuilderPickerSession,
} from "./shop-builder-session";

export function MobileShopBuilderScreen() {
  const { navigate } = useMobileListingChrome();
  const { draft, replaceDraft } = useListingBuilder();
  const [query, setQuery] = React.useState("");
  const [session, setSession] = React.useState<ShopBuilderPickerSession | null>(null);
  const [ready, setReady] = React.useState(false);
  const [results, setResults] = React.useState<ShopBuilderRecord[]>([]);

  React.useEffect(() => {
    const loaded = ShopBuilderSession.load();
    setSession(loaded);
    setReady(true);
    if (!loaded?.returnTo) {
      navigate("/mobile-listing/type");
      return;
    }
    setResults(ShopBuilderService.list());
  }, [navigate]);

  React.useEffect(() => {
    if (!ready || !session) return;
    setResults(ShopBuilderService.search(query));
  }, [query, ready, session]);

  const selectShop = (shop: ShopBuilderRecord) => {
    if (!session) return;
    const next = applyShopBuilderSelection(
      draft,
      session.target,
      shop.name,
      session.entryId
    );
    replaceDraft(next);
    const returnTo = session.returnTo;
    ShopBuilderSession.clear();
    navigate(returnTo);
  };

  if (!ready || !session) {
    return (
      <MobileListingShell stepId="shop-builder" hideFooter hideProgress>
        <div className="px-6 py-10 text-[14px] text-[#636366]">Loading…</div>
      </MobileListingShell>
    );
  }

  return (
    <MobileListingShell stepId="shop-builder" hideFooter hideProgress>
      <div className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#1c1c1e]">
            {session.label || "Shop / Builder / Company"}
          </h1>
          <p className="mt-2 text-[14px] text-[#636366]">
            Search existing shops or add a new Shop / Builder / Company.
          </p>
        </div>

        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#636366]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, city, or type"
            autoFocus
            className="h-11 w-full rounded-lg border border-[#e5e5ea] pl-10 pr-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>

        <button
          type="button"
          onClick={() => navigate("/mobile-listing/shop-builder/add")}
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-dashed border-[#1b1464] text-[13px] font-semibold text-[#1b1464]"
        >
          <Plus className="h-4 w-4" />
          Add new Shop / Builder / Company
        </button>

        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#636366]">
            {results.length} result{results.length === 1 ? "" : "s"}
          </p>
          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#d1d1d6] px-4 py-8 text-center text-[13px] text-[#636366]">
              No matches. Add a new Shop / Builder / Company to continue.
            </div>
          ) : (
            results.map((shop) => (
              <button
                key={shop.id}
                type="button"
                onClick={() => selectShop(shop)}
                className="w-full rounded-xl border border-[#e5e5ea] px-3 py-3 text-left transition-colors hover:border-[#1b1464] hover:bg-[#f4f5fc]"
              >
                <p className="text-[14px] font-semibold text-[#1c1c1e]">{shop.name}</p>
                <p className="mt-0.5 text-[12px] text-[#636366]">
                  {shop.type}
                  {shop.city || shop.state
                    ? ` · ${[shop.city, shop.state].filter(Boolean).join(", ")}`
                    : ""}
                  {shop.custom ? " · Added by you" : ""}
                </p>
              </button>
            ))
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            const returnTo = session.returnTo;
            ShopBuilderSession.clear();
            navigate(returnTo);
          }}
          className="h-11 rounded-lg border border-[#e5e5ea] text-[13px] font-semibold text-[#1c1c1e]"
        >
          Cancel
        </button>
      </div>
    </MobileListingShell>
  );
}
