"use client";

import * as React from "react";

export function useListingKeyboardShortcuts(options: {
  onSave: () => void;
  onEscape?: () => void;
}) {
  const onSaveRef = React.useRef(options.onSave);
  const onEscapeRef = React.useRef(options.onEscape);
  onSaveRef.current = options.onSave;
  onEscapeRef.current = options.onEscape;

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "s") {
        event.preventDefault();
        onSaveRef.current();
      }
      if (event.key === "Escape") {
        onEscapeRef.current?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
