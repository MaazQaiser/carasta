"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, Download, FileText, ImageIcon, Play } from "lucide-react";
import type {
  BuyerAccordionItem,
  BuyerBadge,
  BuyerDocumentItem,
  BuyerMediaItem,
  BuyerSellerInfo,
  BuyerSpecItem,
  BuyerTimelineItem,
} from "./types";

export function Badge({ label, tone = "neutral" }: BuyerBadge) {
  const tones = {
    brand: "bg-[#f4f5fc] text-[#1b1464] border-[#cfd2f0]",
    success: "bg-[#eef8f0] text-[#2f7d4a] border-[#c6e5cf]",
    neutral: "bg-[#f2f2f7] text-[#636366] border-[#e5e5ea]",
  };
  return (
    <span
      className={`inline-flex h-7 items-center rounded-full border px-2.5 text-[11px] font-semibold ${tones[tone]}`}
    >
      {label}
    </span>
  );
}

export function Section({
  title,
  children,
  description,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-[16px] font-bold text-[#1c1c1e]">{title}</h2>
        {description ? <p className="mt-1 text-[12px] text-[#636366]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function SpecGrid({ items }: { items: BuyerSpecItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-[#e5e5ea] bg-[#fafafa] px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7b78a3]">
            {item.label}
          </p>
          <p className="mt-1 text-[13px] font-semibold text-[#1c1c1e]">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function InfoCard({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#e5e5ea] bg-white px-3 py-3">
      {title ? <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-[#1b1464]">{title}</p> : null}
      {children}
    </div>
  );
}

export function AccordionList({ items }: { items: BuyerAccordionItem[] }) {
  const [openId, setOpenId] = React.useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-[#e5e5ea] rounded-xl border border-[#e5e5ea]">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex h-12 w-full items-center justify-between px-3 text-left"
            >
              <span className="text-[13px] font-semibold text-[#1c1c1e]">
                {item.title}
                {item.summary ? (
                  <span className="ml-2 text-[10px] font-medium text-[#7b78a3]">{item.summary}</span>
                ) : null}
              </span>
              {open ? (
                <ChevronDown className="h-4 w-4 text-[#636366]" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[#636366]" />
              )}
            </button>
            {open ? (
              <div className="space-y-3 border-t border-[#e5e5ea] bg-[#fafafa] p-3">
                {item.body ? <p className="text-[13px] leading-relaxed text-[#636366]">{item.body}</p> : null}
                {item.specs ? <SpecGrid items={item.specs} /> : null}
                {item.entries?.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg border border-[#e5e5ea] bg-white px-3 py-2.5"
                  >
                    <p className="text-[13px] font-semibold text-[#1c1c1e]">{entry.title}</p>
                    {entry.meta ? (
                      <p className="mt-0.5 text-[11px] text-[#7b78a3]">{entry.meta}</p>
                    ) : null}
                    {entry.detail ? (
                      <p className="mt-1 text-[12px] leading-relaxed text-[#636366]">{entry.detail}</p>
                    ) : null}
                    {entry.photos?.length ? (
                      <div className="mt-2 flex gap-2 overflow-x-auto">
                        {entry.photos.map((photo) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={photo.id}
                            src={photo.url}
                            alt={photo.alt}
                            className="h-20 w-28 shrink-0 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
                {item.photos?.length ? (
                  <div className="flex gap-2 overflow-x-auto">
                    {item.photos.map((photo) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt={photo.alt}
                        className="h-24 w-32 shrink-0 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function Timeline({ items }: { items: BuyerTimelineItem[] }) {
  return (
    <ol className="space-y-3">
      {items.map((item, index) => (
        <li key={item.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#1b1464]" />
            {index < items.length - 1 ? <span className="mt-1 w-px flex-1 bg-[#e5e5ea]" /> : null}
          </div>
          <div className="min-w-0 flex-1 pb-2">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[13px] font-semibold text-[#1c1c1e]">{item.title}</p>
              {item.date ? <p className="shrink-0 text-[11px] text-[#7b78a3]">{item.date}</p> : null}
            </div>
            {item.detail ? (
              <p className="mt-1 text-[12px] leading-relaxed text-[#636366]">{item.detail}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function DocumentCards({ documents }: { documents: BuyerDocumentItem[] }) {
  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <button
          key={doc.id}
          type="button"
          className="flex h-14 w-full items-center gap-3 rounded-xl border border-[#e5e5ea] bg-white px-3 text-left"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f4f5fc] text-[#1b1464]">
            {doc.type === "Photo" ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-[#1c1c1e]">{doc.title}</span>
            {doc.subtitle ? (
              <span className="block truncate text-[11px] text-[#636366]">{doc.subtitle}</span>
            ) : null}
          </span>
          <Download className="h-4 w-4 text-[#636366]" />
        </button>
      ))}
    </div>
  );
}

export function SellerCard({ seller }: { seller: BuyerSellerInfo }) {
  return (
    <div className="rounded-xl border border-[#e5e5ea] bg-white p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1b1464] text-[14px] font-bold text-white">
          {seller.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold text-[#1c1c1e]">{seller.name}</p>
          <p className="text-[12px] text-[#636366]">
            {seller.role}
            {seller.organization ? ` · ${seller.organization}` : ""}
          </p>
          <p className="text-[11px] text-[#7b78a3]">
            {seller.location} · ★ {seller.rating} · {seller.listings} listings
          </p>
        </div>
        {seller.verified ? (
          <span className="rounded-full bg-[#eef8f0] px-2 py-1 text-[10px] font-semibold text-[#2f7d4a]">
            Verified
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function GalleryHero({
  images,
  onOpen,
}: {
  images: BuyerMediaItem[];
  onOpen: (index: number) => void;
}) {
  const primary = images[0];
  const thumbs = images.slice(1, 5);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#f2f2f7]"
      >
        {primary ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={primary.url} alt={primary.alt} className="h-full w-full object-cover" />
        ) : null}
        {primary?.kind === "video" ? (
          <span className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#1b1464]">
              <Play className="h-5 w-5 fill-current" />
            </span>
          </span>
        ) : null}
        <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white">
          1 / {images.length}
        </span>
      </button>
      {thumbs.length ? (
        <div className="grid grid-cols-4 gap-2">
          {thumbs.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => onOpen(index + 1)}
              className="relative aspect-square overflow-hidden rounded-lg bg-[#f2f2f7]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
              {image.kind === "video" ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="h-4 w-4 fill-white text-white" />
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Checklist({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between rounded-lg border border-[#e5e5ea] bg-white px-3 py-2.5"
        >
          <span className="text-[13px] font-semibold text-[#1c1c1e]">{item.label}</span>
          <span
            className={`text-[12px] font-semibold ${
              item.value === "Installed" || item.value === "Yes"
                ? "text-[#2f7d4a]"
                : "text-[#636366]"
            }`}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function KeyValueList({ items }: { items: BuyerSpecItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#e5e5ea]">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={`flex items-center justify-between gap-3 px-3 py-2.5 ${
            index < items.length - 1 ? "border-b border-[#e5e5ea]" : ""
          }`}
        >
          <span className="text-[12px] text-[#636366]">{item.label}</span>
          <span className="text-right text-[13px] font-semibold text-[#1c1c1e]">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
