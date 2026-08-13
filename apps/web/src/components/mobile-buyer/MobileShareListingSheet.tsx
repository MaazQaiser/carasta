"use client";

import * as React from "react";
import {
  Facebook,
  Instagram,
  Link2,
  Mail,
  MessageCircle,
  Twitter,
  type LucideIcon,
} from "lucide-react";
import {
  defaultShareCaption,
  SubmissionSession,
} from "@/components/listing/services/submission-session";
import { MobileOptionSheet } from "@/components/mobile-listing/MobileOptionSheet";

const DESTINATIONS: {
  id: string;
  label: string;
  Icon: LucideIcon;
  tone: string;
}[] = [
  {
    id: "Instagram",
    label: "Instagram",
    Icon: Instagram,
    tone: "bg-[#fce7f3] text-[#c026a5]",
  },
  {
    id: "Facebook",
    label: "Facebook",
    Icon: Facebook,
    tone: "bg-[#e8f0fe] text-[#1877f2]",
  },
  {
    id: "X / Twitter",
    label: "X / Twitter",
    Icon: Twitter,
    tone: "bg-[#f4f4f5] text-[#0f1419]",
  },
  {
    id: "Copy Link",
    label: "Copy Link",
    Icon: Link2,
    tone: "bg-[#eef2ff] text-[#1b1464]",
  },
  {
    id: "WhatsApp",
    label: "WhatsApp",
    Icon: MessageCircle,
    tone: "bg-[#e7f8ef] text-[#128c7e]",
  },
  {
    id: "Email",
    label: "Email",
    Icon: Mail,
    tone: "bg-[#fff4e5] text-[#c2410c]",
  },
];

/**
 * External share sheet used after auction approval (one-time auto-open)
 * and from the live listing share button.
 */
export function MobileShareListingSheet({
  open,
  onClose,
  vehicleLabel,
  shareUrl,
}: {
  open: boolean;
  onClose: () => void;
  vehicleLabel: string;
  shareUrl?: string;
}) {
  const [caption, setCaption] = React.useState("");
  const [selected, setSelected] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const session = SubmissionSession.load();
    setCaption(session?.shareCaption?.trim() || defaultShareCaption(vehicleLabel));
    setSelected(null);
  }, [open, vehicleLabel]);

  const resolveUrl = () => {
    if (shareUrl) return shareUrl;
    if (typeof window !== "undefined") return window.location.href;
    return "";
  };

  const chooseDestination = (destination: string) => {
    setSelected(destination);
    SubmissionSession.patch({
      shareCaption: caption,
      destination,
      sharedAt: new Date().toISOString(),
    });
    const url = resolveUrl();
    if (destination === "Copy Link" && typeof navigator !== "undefined") {
      void navigator.clipboard?.writeText(url);
    } else if (destination === "Email" && typeof window !== "undefined") {
      window.location.href = `mailto:?subject=${encodeURIComponent(vehicleLabel)}&body=${encodeURIComponent(`${caption}\n\n${url}`)}`;
    } else if (destination === "WhatsApp" && typeof window !== "undefined") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${caption} ${url}`)}`,
        "_blank",
        "noopener,noreferrer"
      );
    } else if (typeof navigator !== "undefined" && navigator.share) {
      void navigator.share({ title: vehicleLabel, text: caption, url });
    }
  };

  return (
    <MobileOptionSheet open={open} title="Share Your Listing" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-[14px] text-[#636366]">
          Edit your caption, then choose where to share. You can dismiss this anytime — sharing
          stays available from the share icon on the auction page.
        </p>

        <div className="rounded-lg border border-[#e5e5ea] p-3 text-[12px] font-semibold text-[#1c1c1e]">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[#636366]">
            Listing Information
          </span>
          <span className="mt-1 block">{vehicleLabel}</span>
          <span className="mt-1 block font-normal text-[#636366]">
            Share to Instagram, Facebook, X, and more
          </span>
        </div>

        <label className="block text-[12px] font-semibold text-[#636366]">
          Edit Caption
          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            className="mt-1 min-h-28 w-full rounded-lg border border-[#e5e5ea] p-3 text-[13px] text-[#1c1c1e] outline-none focus:border-[#1b1464]"
          />
        </label>

        <div className="grid grid-cols-3 gap-3">
          {DESTINATIONS.map(({ id, label, Icon, tone }) => (
            <button
              key={id}
              type="button"
              onClick={() => chooseDestination(id)}
              className={`flex flex-col items-center gap-2 rounded-lg border px-2 py-3 text-[11px] font-medium ${
                selected === id
                  ? "border-[#1b1464] bg-[#f4f5fc] text-[#1b1464]"
                  : "border-[#e5e5ea] text-[#1c1c1e]"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full ${tone}`}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </MobileOptionSheet>
  );
}
