"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldLabel, textareaClassName } from "../fields";
import { MediaUploadZone } from "../MediaUploadZone";
import type { ListingMediaItem } from "../types";
import type { EntryFormConfig, EntryMediaKey, ModificationEntry } from "./types";
import { DEFAULT_ENTRY_FORM_CONFIG, ORIGINAL_PARTS_OPTIONS, WORK_PERFORMED_BY_OPTIONS } from "./options";

export function ModificationEntryForm({
  entry,
  onSave,
  onCancel,
  formConfig = DEFAULT_ENTRY_FORM_CONFIG,
}: {
  entry: ModificationEntry;
  onSave: (entry: ModificationEntry) => void;
  onCancel: () => void;
  formConfig?: EntryFormConfig;
}) {
  const [form, setForm] = React.useState<ModificationEntry>(entry);
  const config = { ...DEFAULT_ENTRY_FORM_CONFIG, ...formConfig };
  const documentSlots = config.documentSlots ?? DEFAULT_ENTRY_FORM_CONFIG.documentSlots ?? [];
  const dateStatusOptions = config.dateStatusOptions ?? DEFAULT_ENTRY_FORM_CONFIG.dateStatusOptions ?? [];

  React.useEffect(() => {
    setForm(entry);
  }, [entry]);

  const patch = (partial: Partial<ModificationEntry>) =>
    setForm((prev) => ({ ...prev, ...partial }));

  const addMedia = (key: EntryMediaKey, items: ListingMediaItem[]) =>
    patch({ [key]: [...form[key], ...items] });

  const removeMedia = (key: EntryMediaKey, id: string) =>
    patch({ [key]: form[key].filter((item) => item.id !== id) });

  return (
    <div className="rounded-2xl border bg-muted/20 p-3 sm:p-5 space-y-4 sm:space-y-5 min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="sm:col-span-2">
          <FieldLabel htmlFor={`title-${form.id}`}>
            {config.entryTitleLabel ?? "Entry Title"}
          </FieldLabel>
          <Input
            id={`title-${form.id}`}
            value={form.title}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="e.g. Body & paint restoration"
          />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel htmlFor={`desc-${form.id}`}>
            {config.descriptionLabel ?? "Description"}
          </FieldLabel>
          <textarea
            id={`desc-${form.id}`}
            className={textareaClassName}
            value={form.description}
            onChange={(e) => patch({ description: e.target.value })}
            placeholder={
              config.descriptionPlaceholder ??
              "What was done and why it matters to the build..."
            }
          />
        </div>
        <div className={config.typeOfWorkMultiline ? "sm:col-span-2" : undefined}>
          <FieldLabel htmlFor={`work-type-${form.id}`}>
            {config.typeOfWorkLabel}
          </FieldLabel>
          {config.typeOfWorkOptions?.length ? (
            <Select
              value={form.typeOfWork || undefined}
              onValueChange={(v) => patch({ typeOfWork: v })}
            >
              <SelectTrigger id={`work-type-${form.id}`}>
                <SelectValue placeholder={config.typeOfWorkPlaceholder ?? "Select type of work"} />
              </SelectTrigger>
              <SelectContent>
                {config.typeOfWorkOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : config.typeOfWorkMultiline ? (
            <textarea
              id={`work-type-${form.id}`}
              className={textareaClassName}
              value={form.typeOfWork}
              onChange={(e) => patch({ typeOfWork: e.target.value })}
              placeholder={config.typeOfWorkPlaceholder}
            />
          ) : (
            <Input
              id={`work-type-${form.id}`}
              value={form.typeOfWork}
              onChange={(e) => patch({ typeOfWork: e.target.value })}
              placeholder={config.typeOfWorkPlaceholder}
            />
          )}
        </div>
        <div>
          <FieldLabel htmlFor={`parts-${form.id}`}>
            {config.partsBrandLabel ?? "Parts / Brand"}
          </FieldLabel>
          <Input
            id={`parts-${form.id}`}
            value={form.partsBrand}
            onChange={(e) => patch({ partsBrand: e.target.value })}
            placeholder="e.g. Period-correct trim / aftermarket part"
          />
        </div>
        {!config.hideManufacturer ? (
          <div>
            <FieldLabel htmlFor={`mfr-${form.id}`}>
              {config.manufacturerLabel ?? "Manufacturer"}
            </FieldLabel>
            <Input
              id={`mfr-${form.id}`}
              value={form.manufacturer}
              onChange={(e) => patch({ manufacturer: e.target.value })}
              placeholder="e.g. OEM / aftermarket maker"
            />
          </div>
        ) : null}
        <div>
          <FieldLabel htmlFor={`mileage-${form.id}`}>Mileage at Installation</FieldLabel>
          <Input
            id={`mileage-${form.id}`}
            value={form.mileage}
            onChange={(e) => patch({ mileage: e.target.value })}
            placeholder="e.g. 62,000 mi"
          />
        </div>
        {!config.hideSpecifications ? (
          <div className="sm:col-span-2">
            <FieldLabel htmlFor={`specs-${form.id}`}>Specifications</FieldLabel>
            <textarea
              id={`specs-${form.id}`}
              className={textareaClassName}
              value={form.specifications}
              onChange={(e) => patch({ specifications: e.target.value })}
              placeholder="Materials, finishes, part numbers, measurements..."
            />
          </div>
        ) : null}
        <div>
          <FieldLabel htmlFor={`work-by-${form.id}`}>
            {config.workPerformedByLabel ?? "Work Performed By"}
          </FieldLabel>
          {config.workPerformedByAsText ? (
            <Input
              id={`work-by-${form.id}`}
              value={form.workPerformedBy}
              onChange={(e) => patch({ workPerformedBy: e.target.value })}
              placeholder="e.g. Chassis builder name"
            />
          ) : (
            <Select
              value={form.workPerformedBy || undefined}
              onValueChange={(v) => patch({ workPerformedBy: v })}
            >
              <SelectTrigger id={`work-by-${form.id}`}>
                <SelectValue placeholder="Select who performed the work" />
              </SelectTrigger>
              <SelectContent>
                {(config.workPerformedByOptions ?? WORK_PERFORMED_BY_OPTIONS).map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div>
          <FieldLabel htmlFor={`shop-${form.id}`}>
            {config.shopBuilderLabel ?? "Shop / Builder"}
          </FieldLabel>
          <Input
            id={`shop-${form.id}`}
            value={form.shopBuilder}
            onChange={(e) => patch({ shopBuilder: e.target.value })}
            placeholder="e.g. Heritage Restoration Co."
          />
        </div>
        {config.gateDatePickerOnExact ? (
          <>
            <div>
              <FieldLabel>Installation Date</FieldLabel>
              <Select
                value={form.dateStatus || undefined}
                onValueChange={(v) =>
                  patch({
                    dateStatus: v,
                    installationDate: v === "Exact Date" ? form.installationDate : "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date status" />
                </SelectTrigger>
                <SelectContent>
                  {dateStatusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {form.dateStatus === "Exact Date" && (
              <div>
                <FieldLabel htmlFor={`date-${form.id}`}>Exact Date</FieldLabel>
                <Input
                  id={`date-${form.id}`}
                  type="date"
                  value={form.installationDate}
                  onChange={(e) => patch({ installationDate: e.target.value })}
                />
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <FieldLabel htmlFor={`date-${form.id}`}>{config.installationDateLabel}</FieldLabel>
              <Input
                id={`date-${form.id}`}
                type="date"
                value={form.installationDate}
                onChange={(e) => patch({ installationDate: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>Date Status</FieldLabel>
              <Select
                value={form.dateStatus || undefined}
                onValueChange={(v) => patch({ dateStatus: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date status" />
                </SelectTrigger>
                <SelectContent>
                  {dateStatusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        {config.showOriginalPartsIncluded !== false ? (
          <div>
            <FieldLabel>Original Parts Included</FieldLabel>
            <Select
              value={form.originalPartsIncluded || undefined}
              onValueChange={(v) => patch({ originalPartsIncluded: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                {ORIGINAL_PARTS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>

      <div className="space-y-5 pt-2">
        {documentSlots.map((slot) => (
          <MediaUploadZone
            key={slot.key}
            title={slot.title}
            description={slot.description}
            accept={slot.accept}
            variant={slot.variant}
            compact
            items={form[slot.key]}
            onAdd={(items) => addMedia(slot.key, items)}
            onRemove={(id) => removeMedia(slot.key, id)}
          />
        ))}
        <div>
          <FieldLabel htmlFor={`notes-${form.id}`}>
            {config.notesLabel ?? "Additional Notes"}
          </FieldLabel>
          <textarea
            id={`notes-${form.id}`}
            className={textareaClassName}
            value={form.additionalNotes}
            onChange={(e) => patch({ additionalNotes: e.target.value })}
            placeholder={
              config.notesPlaceholder ?? "Anything else buyers should know about this entry..."
            }
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        <Button type="button" onClick={() => onSave({ ...form, completed: true })}>
          {config.saveButtonLabel ?? "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
