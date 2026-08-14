"use client";

import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { createListingMediaItems } from "../MediaUploadZone";
import type {
  ListingMediaItem,
  RestorationDocumentation,
  RestorationDocumentationGroupId,
} from "../types";
import {
  FLOW3_DOCUMENTATION_COPY,
  FLOW3_DOCUMENTATION_GROUPS,
} from "./restored-restomod";
import { countRestorationDocuments } from "./options";

export function RestorationDocumentationList({
  documentation,
  onAdd,
  onRemove,
}: {
  documentation: RestorationDocumentation;
  onAdd: (key: RestorationDocumentationGroupId, items: ListingMediaItem[]) => void;
  onRemove: (key: RestorationDocumentationGroupId, id: string) => void;
}) {
  const [expanded, setExpanded] = React.useState<RestorationDocumentationGroupId | null>(null);
  const total = countRestorationDocuments(documentation);

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e] sm:text-lg sm:font-semibold">
          {FLOW3_DOCUMENTATION_COPY.title}
        </h2>
        <p className="mt-2 text-[14px] text-[#636366] sm:mt-1 sm:text-sm sm:text-muted-foreground">
          {FLOW3_DOCUMENTATION_COPY.subtext}
        </p>
      </div>

      <div className="rounded-xl bg-[#f4f5fc] px-4 py-3 text-[13px] font-medium text-[#1b1464]">
        {FLOW3_DOCUMENTATION_COPY.totalBanner(total)}
      </div>

      <div className="flex flex-col gap-2">
        {FLOW3_DOCUMENTATION_GROUPS.map((group) => {
          const items = documentation[group.id] ?? [];
          const open = expanded === group.id;
          return (
            <DocumentationGroupRow
              key={group.id}
              label={group.label}
              accept={group.accept}
              hint={group.image ? FLOW3_DOCUMENTATION_COPY.historicalHint : undefined}
              items={items}
              open={open}
              onToggle={() => setExpanded(open ? null : group.id)}
              onAdd={(next) => onAdd(group.id, next)}
              onRemove={(id) => onRemove(group.id, id)}
            />
          );
        })}
      </div>
    </div>
  );
}

function DocumentationGroupRow({
  label,
  accept,
  hint,
  items,
  open,
  onToggle,
  onAdd,
  onRemove,
}: {
  label: string;
  accept: string;
  hint?: string;
  items: ListingMediaItem[];
  open: boolean;
  onToggle: () => void;
  onAdd: (items: ListingMediaItem[]) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const count = items.length;
  const countLabel = count === 1 ? "1 file" : `${count} files`;

  return (
    <div className="overflow-hidden rounded-xl border border-[#e5e5ea] bg-white">
      <div className="flex h-12 items-center gap-2 px-3">
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#1c1c1e]">
            {label}
          </span>
          {count > 0 ? (
            <span className="shrink-0 rounded-full bg-[#1b1464] px-2 py-0.5 text-[10px] font-bold text-white">
              {countLabel}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="shrink-0 rounded-lg px-2.5 py-1 text-[12px] font-semibold text-[#1b1464]"
        >
          {FLOW3_DOCUMENTATION_COPY.add}
        </button>
        <button
          type="button"
          onClick={onToggle}
          className="shrink-0 text-[#636366]"
          aria-label={open ? `Collapse ${label}` : `Expand ${label}`}
        >
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(event) => {
            const next = createListingMediaItems(event.target.files);
            if (next.length) onAdd(next);
            event.target.value = "";
          }}
        />
      </div>
      {open ? (
        <div className="space-y-2 border-t border-[#e5e5ea] bg-[#fafafa] p-3">
          {hint ? <p className="text-[11px] text-[#636366]">{hint}</p> : null}
          {items.length === 0 ? (
            <p className="text-[12px] text-[#636366]">{FLOW3_DOCUMENTATION_COPY.emptyGroup}</p>
          ) : (
            <ul className="space-y-1">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-[12px]"
                >
                  <span className="truncate text-[#1c1c1e]">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="ml-2 shrink-0 font-semibold text-[#d34a4a]"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
