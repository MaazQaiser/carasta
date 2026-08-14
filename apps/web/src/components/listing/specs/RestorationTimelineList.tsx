"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { createListingMediaItems } from "../MediaUploadZone";
import type { RestorationTimelineEvent } from "../types";
import { createEmptyRestorationTimelineEvent } from "./options";
import {
  FLOW3_TIMELINE_COPY,
  RESTORATION_TIMELINE_DATE_PRECISION_OPTIONS,
  RESTORATION_TIMELINE_EVENT_TYPES,
  restorationTimelineEventHeading,
  sortRestorationTimelineEvents,
} from "./restored-restomod";

export function RestorationTimelineList({
  events,
  onChange,
  showHeading = true,
}: {
  events: RestorationTimelineEvent[];
  onChange: (events: RestorationTimelineEvent[]) => void;
  showHeading?: boolean;
}) {
  const [draft, setDraft] = React.useState<RestorationTimelineEvent | null>(null);
  const sorted = sortRestorationTimelineEvents(events);

  const saveDraft = () => {
    if (!draft || !draft.title.trim()) return;
    const exists = events.some((event) => event.id === draft.id);
    onChange(exists ? events.map((event) => (event.id === draft.id ? draft : event)) : [...events, draft]);
    setDraft(null);
  };

  return (
    <div className="space-y-5">
      {showHeading ? (
        <div>
          <h2 className="text-[28px] font-extrabold leading-[1.2] text-[#1c1c1e] sm:text-lg sm:font-semibold">
            {FLOW3_TIMELINE_COPY.title}
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-[#636366] sm:mt-1 sm:text-sm sm:text-muted-foreground">
            {FLOW3_TIMELINE_COPY.subtext}
          </p>
        </div>
      ) : null}

      {sorted.length > 0 ? (
        <ol className="relative ml-1.5 border-l-2 border-[#1b1464] pl-5">
          {sorted.map((event) => (
            <li key={event.id} className="relative pb-6 last:pb-0">
              <span className="absolute -left-[23px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#1b1464]" />
              <button type="button" onClick={() => setDraft({ ...event })} className="w-full text-left">
                <p className="text-[15px] font-bold leading-snug text-[#1c1c1e]">
                  {restorationTimelineEventHeading(event)}
                </p>
                {event.description.trim() ? (
                  <p className="mt-1 text-[13px] leading-relaxed text-[#636366]">
                    {event.description}
                  </p>
                ) : null}
              </button>
            </li>
          ))}
        </ol>
      ) : null}

      {draft ? (
        <TimelineEventForm
          event={draft}
          onChange={setDraft}
          onSave={saveDraft}
          onCancel={() => setDraft(null)}
          onDelete={() => {
            onChange(events.filter((event) => event.id !== draft.id));
            setDraft(null);
          }}
          canDelete={events.some((event) => event.id === draft.id)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setDraft(createEmptyRestorationTimelineEvent())}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#f4f5fc] text-[14px] font-semibold text-[#1b1464]"
        >
          {FLOW3_TIMELINE_COPY.addEvent}
        </button>
      )}
    </div>
  );
}

function TimelineEventForm({
  event,
  onChange,
  onSave,
  onCancel,
  onDelete,
  canDelete,
}: {
  event: RestorationTimelineEvent;
  onChange: (event: RestorationTimelineEvent) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const photoInputRef = React.useRef<HTMLInputElement>(null);
  const exact = event.datePrecision === "Exact Date";

  const patch = (partial: Partial<RestorationTimelineEvent>) =>
    onChange({ ...event, ...partial });

  return (
    <div className="space-y-3 rounded-xl border border-[#e5e5ea] bg-white p-3">
      <label className="block space-y-1.5">
        <span className="text-[12px] font-semibold text-[#1c1c1e]">Event Title</span>
        <input
          value={event.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="e.g. Original Purchase"
          className="h-11 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-[13px] outline-none focus:border-[#1b1464]"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-[12px] font-semibold text-[#1c1c1e]">Date / Year</span>
        {exact ? (
          <input
            type="date"
            value={event.exactDate}
            onChange={(e) => {
              const exactDate = e.target.value;
              patch({
                exactDate,
                dateYear: exactDate.slice(0, 4),
              });
            }}
            className="h-11 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        ) : (
          <input
            inputMode="numeric"
            value={event.dateYear}
            onChange={(e) => patch({ dateYear: e.target.value.replace(/\D/g, "").slice(0, 4) })}
            placeholder="e.g. 1967"
            className="h-11 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-[13px] outline-none focus:border-[#1b1464]"
          />
        )}
      </label>

      <TimelineSelect
        label="Date Precision"
        value={event.datePrecision}
        placeholder="Select precision"
        options={RESTORATION_TIMELINE_DATE_PRECISION_OPTIONS}
        onChange={(datePrecision) =>
          patch({
            datePrecision: datePrecision as RestorationTimelineEvent["datePrecision"],
            exactDate: datePrecision === "Exact Date" ? event.exactDate : "",
          })
        }
      />

      <TimelineSelect
        label="Event Type"
        value={event.eventType}
        placeholder="Select event type"
        options={RESTORATION_TIMELINE_EVENT_TYPES}
        onChange={(eventType) => patch({ eventType })}
      />

      <label className="block space-y-1.5">
        <span className="text-[12px] font-semibold text-[#1c1c1e]">Description</span>
        <textarea
          value={event.description}
          onChange={(e) => patch({ description: e.target.value })}
          placeholder="Short summary of this event"
          className="min-h-24 w-full resize-none rounded-lg border border-[#d1d5db] p-3 text-[13px] outline-none focus:border-[#1b1464]"
        />
      </label>

      <div className="space-y-1.5">
        <span className="text-[12px] font-semibold text-[#1c1c1e]">Photos (optional)</span>
        <button
          type="button"
          onClick={() => photoInputRef.current?.click()}
          className="flex h-11 w-full items-center justify-center rounded-lg border border-dashed border-[#1b1464] text-[13px] font-semibold text-[#1b1464]"
        >
          Add photos
        </button>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const next = createListingMediaItems(e.target.files);
            if (next.length) patch({ photos: [...event.photos, ...next] });
            e.target.value = "";
          }}
        />
        {event.photos.length > 0 ? (
          <ul className="space-y-1">
            {event.photos.map((photo) => (
              <li
                key={photo.id}
                className="flex items-center justify-between rounded-lg bg-[#f4f5fc] px-3 py-2 text-[12px]"
              >
                <span className="truncate">{photo.name}</span>
                <button
                  type="button"
                  onClick={() =>
                    patch({ photos: event.photos.filter((item) => item.id !== photo.id) })
                  }
                  className="ml-2 font-semibold text-[#d34a4a]"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 flex-1 rounded-xl border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#1c1c1e]"
        >
          {FLOW3_TIMELINE_COPY.cancel}
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!event.title.trim()}
          className="h-11 flex-1 rounded-xl bg-[#1b1464] text-[13px] font-semibold text-white disabled:bg-[#e5e5ea] disabled:text-[#9ca3af]"
        >
          {FLOW3_TIMELINE_COPY.saveEvent}
        </button>
      </div>
      {canDelete ? (
        <button
          type="button"
          onClick={onDelete}
          className="h-10 w-full text-[12px] font-semibold text-[#d34a4a]"
        >
          {FLOW3_TIMELINE_COPY.deleteEvent}
        </button>
      ) : null}
    </div>
  );
}

function TimelineSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="block space-y-1.5">
      <span className="text-[12px] font-semibold text-[#1c1c1e]">{label}</span>
      <div
        className={
          open
            ? "overflow-hidden rounded-xl border-2 border-[#1b1464] bg-white"
            : "overflow-hidden rounded-lg border border-[#d1d5db] bg-white"
        }
      >
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="relative flex h-11 w-full items-center bg-white text-left"
        >
          <span className={value ? "px-3 text-[13px] text-[#1c1c1e]" : "px-3 text-[13px] text-[#9ca3af]"}>
            {value || placeholder}
          </span>
          <ChevronDown
            className={[
              "pointer-events-none absolute right-3 h-4 w-4 transition-transform",
              open ? "rotate-180 text-[#1b1464]" : "text-[#1b1464]",
            ].join(" ")}
          />
        </button>
        {open ? (
          <div>
            {options.map((option) => {
              const selected = option === value;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={[
                    "flex w-full items-center justify-between border-t border-[#eeeeee] px-3 py-3 text-left text-[13px]",
                    selected
                      ? "bg-[#f4f5fc] font-medium text-[#1b1464]"
                      : "bg-white text-[#1c1c1e]",
                  ].join(" ")}
                >
                  {option}
                  {selected ? <Check className="h-4 w-4 shrink-0 text-[#1b1464]" /> : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
