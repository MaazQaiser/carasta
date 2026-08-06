"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface TagSearchOption {
  id: string;
  label: string;
  sublabel?: string;
  imageUrl?: string;
}

interface TagSearchInputProps {
  id?: string;
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
  value: string;
  onQueryChange: (value: string) => void;
  options: TagSearchOption[];
  loading?: boolean;
  selected?: TagSearchOption[];
  onSelect: (option: TagSearchOption) => void;
  onRemoveSelected?: (id: string) => void;
  multi?: boolean;
  className?: string;
}

/**
 * Searchable tag input reused for members / vehicles / location suggestions.
 */
export function TagSearchInput({
  id,
  label,
  placeholder,
  icon,
  value,
  onQueryChange,
  options,
  loading,
  selected = [],
  onSelect,
  onRemoveSelected,
  multi = false,
  className,
}: TagSearchInputProps) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selectedIds = new Set(selected.map((s) => s.id));
  const visible = options.filter((o) => !selectedIds.has(o.id)).slice(0, 6);

  return (
    <div ref={rootRef} className={cn("relative space-y-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium block">
        {label}
      </label>
      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 mb-1">
          {selected.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2.5 py-1 text-xs"
            >
              {s.label}
              {onRemoveSelected ? (
                <button
                  type="button"
                  onClick={() => onRemoveSelected(s.id)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={`Remove ${s.label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon ?? <Search className="h-4 w-4" />}
        </span>
        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          className="pl-9"
          onChange={(e) => {
            onQueryChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
        />
      </div>
      {open && value.trim().length > 0 ? (
        <div className="absolute left-0 right-0 z-20 mt-1 rounded-xl border bg-background shadow-lg overflow-hidden">
          {loading ? (
            <p className="px-4 py-3 text-xs text-muted-foreground">Searching…</p>
          ) : visible.length === 0 ? (
            <p className="px-4 py-3 text-xs text-muted-foreground">No matches</p>
          ) : (
            visible.map((option) => (
              <button
                key={option.id}
                type="button"
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted text-left"
                onClick={() => {
                  onSelect(option);
                  if (!multi) {
                    onQueryChange("");
                    setOpen(false);
                  } else {
                    onQueryChange("");
                  }
                }}
              >
                {option.imageUrl !== undefined ? (
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={option.imageUrl} />
                    <AvatarFallback className="text-[10px]">
                      {option.label.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : null}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{option.label}</p>
                  {option.sublabel ? (
                    <p className="text-xs text-muted-foreground truncate">{option.sublabel}</p>
                  ) : null}
                </div>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
