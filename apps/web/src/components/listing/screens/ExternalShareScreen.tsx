"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FieldHint, FieldLabel, textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import {
  defaultShareCaption,
  SubmissionSession,
} from "../services/submission-session";
import { useListingNotifications } from "../notifications/NotificationProvider";
import {
  CopyLinkIcon,
  FacebookBrandIcon,
  GmailBrandIcon,
  InstagramBrandIcon,
  XBrandIcon,
} from "@/components/share/ShareBrandIcons";

const DESTINATIONS = [
  { id: "Instagram", label: "Instagram", Icon: InstagramBrandIcon },
  { id: "Facebook", label: "Facebook", Icon: FacebookBrandIcon },
  { id: "X", label: "X", Icon: XBrandIcon },
  { id: "Email", label: "Email", Icon: GmailBrandIcon },
  { id: "Copy Link", label: "Copy Link", Icon: CopyLinkIcon },
] as const;

export function ExternalShareScreen() {
  const router = useRouter();
  const { draft } = useListingBuilder();
  const { notify } = useListingNotifications();
  const vehicleLabel =
    [draft.details.year, draft.details.make, draft.details.model].filter(Boolean).join(" ") ||
    "vehicle";

  const [caption, setCaption] = React.useState("");

  React.useEffect(() => {
    const session = SubmissionSession.load();
    setCaption(session?.shareCaption?.trim() || defaultShareCaption(vehicleLabel));
  }, [vehicleLabel]);

  const shareTo = (destination: string) => {
    const sharedAt = new Date().toISOString();
    SubmissionSession.patch({
      shareCaption: caption,
      destination,
      sharedAt,
    });
    if (destination === "Copy Link") {
      const link = `${window.location.origin}/profile?tab=auctions`;
      void navigator.clipboard?.writeText(link);
      notify({ title: "Link copied", tone: "success" });
    }
    router.push("/listing/share/community");
  };

  return (
    <ListingStep
      title="External Share"
      description="Edit the AI-generated caption, then choose a destination. Continue to community share next."
    >
      <div className="space-y-6 max-w-2xl">
        <ListingSection title="AI Generated Caption">
          <div>
            <FieldLabel htmlFor="share-caption">Editable caption</FieldLabel>
            <textarea
              id="share-caption"
              className={`${textareaClassName} min-h-28`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <FieldHint>Edit before sharing — the caption is saved with this share.</FieldHint>
          </div>
        </ListingSection>

        <ListingSection title="Share destinations">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DESTINATIONS.map(({ id, label, Icon }) => (
              <Button
                key={id}
                type="button"
                variant="outline"
                className="justify-start h-auto py-3"
                onClick={() => shareTo(id)}
                disabled={!caption.trim()}
              >
                <span className="[&>svg]:h-6 [&>svg]:w-6">
                  <Icon />
                </span>
                {label}
              </Button>
            ))}
          </div>
        </ListingSection>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => {
              SubmissionSession.patch({ shareCaption: caption });
              router.push("/listing/share/community");
            }}
          >
            Continue to Community Share
          </Button>
        </div>
      </div>
    </ListingStep>
  );
}
