"use client";

import {
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  ImageIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EntryFormConfig, ModificationEntry } from "./types";
import { countEntryDocuments, countEntryPhotos } from "./options";
import { ModificationEntryForm } from "./ModificationEntryForm";

export function ModificationEntryCard({
  entry,
  expanded,
  editing,
  onToggle,
  onEdit,
  onDuplicate,
  onDelete,
  onSave,
  onCancelEdit,
  formConfig,
}: {
  entry: ModificationEntry;
  expanded: boolean;
  editing: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSave: (entry: ModificationEntry) => void;
  onCancelEdit: () => void;
  formConfig?: EntryFormConfig;
}) {
  const photoCount = countEntryPhotos(entry);
  const docCount = countEntryDocuments(entry);
  const receiptAdded = entry.receipt.length > 0;

  if (editing) {
    return (
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b bg-muted/30 flex items-center justify-between gap-3">
          <p className="font-semibold text-sm">
            {entry.completed ? "Edit entry" : "New entry"}
          </p>
          <Badge variant="secondary">Inline editor</Badge>
        </div>
        <div className="p-4">
          <ModificationEntryForm
            entry={entry}
            onSave={onSave}
            onCancel={onCancelEdit}
            formConfig={formConfig}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card overflow-hidden min-w-0">
      <div className="px-3 sm:px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={onToggle}
          className="mt-0.5 text-muted-foreground hover:text-foreground shrink-0"
          aria-label={expanded ? "Collapse entry" : "Expand entry"}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-sm truncate">
              {entry.title.trim() || "Untitled modification"}
            </h4>
            {entry.completed ? (
              <Badge variant="secondary">Completed</Badge>
            ) : (
              <Badge variant="outline">Draft</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {entry.shopBuilder
              ? `Installed by ${entry.shopBuilder}`
              : entry.workPerformedBy || "Installer not set"}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <ImageIcon className="h-3.5 w-3.5" />
              {photoCount} Photo{photoCount === 1 ? "" : "s"}
            </span>
            <span className="inline-flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              {receiptAdded ? "Receipt Added" : `${docCount} Document${docCount === 1 ? "" : "s"}`}
            </span>
          </div>
          {(entry.photos.length > 0 || receiptAdded) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {entry.photos.slice(0, 4).map((photo) =>
                photo.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={photo.id}
                    src={photo.previewUrl}
                    alt=""
                    className="h-10 w-10 rounded-lg object-cover border"
                  />
                ) : (
                  <div
                    key={photo.id}
                    className="h-10 w-10 rounded-lg border bg-muted flex items-center justify-center"
                  >
                    <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                )
              )}
              {receiptAdded && (
                <div className="h-10 w-10 rounded-lg border bg-muted flex items-center justify-center">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              )}
            </div>
          )}
        </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
          <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onDuplicate} title="Duplicate">
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            title="Delete"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "border-t px-4 py-4 space-y-3 bg-muted/10",
          expanded ? "block" : "hidden"
        )}
      >
        {entry.description ? (
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {entry.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">No description yet.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <Meta label="Completed during" value={entry.completedDuring} />
          <Meta label="Type of work" value={entry.typeOfWork} />
          <Meta label="Parts / brand" value={entry.partsBrand} />
          <Meta label="Manufacturer" value={entry.manufacturer} />
          <Meta label="Work performed by" value={entry.workPerformedBy} />
          <Meta label="Installation date" value={entry.installationDate} />
          <Meta label="Date status" value={entry.dateStatus} />
          <Meta label="Mileage" value={entry.mileage} />
          <Meta label="Original parts" value={entry.originalPartsIncluded} />
        </div>
        {entry.specifications ? (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Specifications
            </p>
            <p className="text-sm whitespace-pre-wrap">{entry.specifications}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border bg-card px-3 py-2">
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium mt-0.5">{value?.trim() ? value : "—"}</p>
    </div>
  );
}
