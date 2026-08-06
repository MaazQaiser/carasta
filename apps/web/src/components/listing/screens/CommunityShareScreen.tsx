"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, FieldLabel, textareaClassName } from "../fields";
import { ListingStep } from "../ListingStep";
import { ListingSection } from "../ListingSection";
import { useListingBuilder } from "../ListingBuilderContext";
import {
  defaultShareCaption,
  SubmissionSession,
} from "../services/submission-session";

export function CommunityShareScreen() {
  const router = useRouter();
  const { draft } = useListingBuilder();
  const vehicleLabel =
    [draft.details.year, draft.details.make, draft.details.model].filter(Boolean).join(" ") ||
    "vehicle";

  const [caption, setCaption] = React.useState("");
  const [tagPeople, setTagPeople] = React.useState("");
  const [tagShops, setTagShops] = React.useState("");
  const [location, setLocation] = React.useState(draft.saleSettings.shippingLocation || "");

  React.useEffect(() => {
    const session = SubmissionSession.load();
    setCaption(session?.shareCaption?.trim() || defaultShareCaption(vehicleLabel));
  }, [vehicleLabel]);

  const photos = draft.vehiclePhotos.slice(0, 8);

  const publish = () => {
    const sharedAt = new Date().toISOString();
    SubmissionSession.patch({
      shareCaption: caption,
      destination: "Carasta Community",
      sharedAt,
    });
    router.push("/listing/share/confirmation");
  };

  return (
    <ListingStep
      title="Carasta Community Share"
      description="Compose a Carmunity post for your listing — caption, tags, location, and photos."
    >
      <div className="space-y-6 max-w-2xl">
        <ListingSection title="Caption">
          <textarea
            className={`${textareaClassName} min-h-28`}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What's happening in your garage?"
          />
        </ListingSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="tag-people">Tag People</FieldLabel>
            <Input
              id="tag-people"
              value={tagPeople}
              onChange={(e) => setTagPeople(e.target.value)}
              placeholder="@username"
            />
          </div>
          <div>
            <FieldLabel htmlFor="tag-shops">Tag Shops</FieldLabel>
            <Input
              id="tag-shops"
              value={tagShops}
              onChange={(e) => setTagShops(e.target.value)}
              placeholder="@shop"
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="share-location">Location</FieldLabel>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="share-location"
              className="pl-9"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State"
            />
          </div>
        </div>

        <ListingSection title="Photos">
          {photos.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {photos.map((photo) => (
                <div key={photo.id} className="aspect-[4/3] rounded-lg overflow-hidden bg-muted border">
                  {photo.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo.previewUrl}
                      alt={photo.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No listing photos yet — you can still publish with a caption.
            </p>
          )}
          <FieldHint>Photos are pulled from your listing media.</FieldHint>
        </ListingSection>

        <Button type="button" size="lg" onClick={publish} disabled={!caption.trim()}>
          <Send className="h-4 w-4" />
          Publish
        </Button>
      </div>
    </ListingStep>
  );
}
