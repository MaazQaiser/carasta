"use client";

import * as React from "react";
import { useListingBuilder } from "@/components/listing/ListingBuilderContext";
import { MobileListingShell } from "../MobileListingShell";
import { useMobileListingChrome } from "../MobileListingRuntime";
import { ShopBuilderService, type ShopBuilderRecord } from "./shop-builder-service";
import {
  applyShopBuilderSelection,
  ShopBuilderSession,
  type ShopBuilderPickerSession,
} from "./shop-builder-session";

export function MobileShopBuilderAddScreen() {
  const { navigate } = useMobileListingChrome();
  const { draft, replaceDraft } = useListingBuilder();
  const [session, setSession] = React.useState<ShopBuilderPickerSession | null>(null);
  const [ready, setReady] = React.useState(false);
  const [name, setName] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");

  React.useEffect(() => {
    const loaded = ShopBuilderSession.load();
    setSession(loaded);
    setReady(true);
    if (!loaded?.returnTo) {
      navigate("/mobile-listing/shop-builder");
    }
  }, [navigate]);

  const canSave = name.trim().length > 1 && city.trim().length > 0 && state.trim().length > 0;
  const matches = ShopBuilderService.findSimilar(name, city, state);

  const selectExisting = (shop: ShopBuilderRecord) => {
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

  const save = () => {
    if (!session || !canSave) return;
    const created = ShopBuilderService.add({ name, city, state });
    const next = applyShopBuilderSelection(
      draft,
      session.target,
      created.name,
      session.entryId
    );
    replaceDraft(next);
    const returnTo = session.returnTo;
    ShopBuilderSession.clear();
    navigate(returnTo);
  };

  if (!ready || !session) {
    return (
      <MobileListingShell stepId="shop-builder-add" hideFooter hideProgress>
        <div className="px-6 py-10 text-[14px] text-[#636366]">Loading…</div>
      </MobileListingShell>
    );
  }

  return (
    <MobileListingShell
      stepId="shop-builder-add"
      continueDisabled={!canSave}
      onContinue={save}
      hideProgress
    >
      <div className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#1c1c1e]">
            Add Shop / Builder
          </h1>
          <p className="mt-2 text-[14px] text-[#636366]">
            Add name, city, and state. Match an existing record when you can to avoid duplicates.
          </p>
        </div>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">Shop / Builder Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Rothsport Racing"
            autoFocus
            className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">City</span>
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="City"
            className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold text-[#636366]">State</span>
          <input
            value={state}
            onChange={(event) => setState(event.target.value)}
            placeholder="State"
            className="h-11 w-full rounded-lg border border-[#e5e5ea] px-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        </label>

        {matches.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#636366]">
              Possible matches — select one instead of adding a duplicate
            </p>
            {matches.map((shop) => (
              <button
                key={shop.id}
                type="button"
                onClick={() => selectExisting(shop)}
                className="w-full rounded-xl border border-[#e5e5ea] px-3 py-3 text-left hover:border-[#1b1464] hover:bg-[#f4f5fc]"
              >
                <p className="text-[14px] font-semibold text-[#1c1c1e]">{shop.name}</p>
                <p className="mt-0.5 text-[12px] text-[#636366]">
                  {[shop.city, shop.state].filter(Boolean).join(", ") || "Location not listed"}
                </p>
              </button>
            ))}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => navigate("/mobile-listing/shop-builder")}
          className="h-11 rounded-lg border border-[#e5e5ea] text-[13px] font-semibold text-[#1c1c1e]"
        >
          Back to search
        </button>
      </div>
    </MobileListingShell>
  );
}
