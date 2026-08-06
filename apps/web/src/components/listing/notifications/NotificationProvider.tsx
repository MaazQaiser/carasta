"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastTone = "default" | "success" | "error" | "warning";

export interface ListingToast {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
}

interface NotificationContextValue {
  toasts: ListingToast[];
  notify: (toast: Omit<ListingToast, "id"> & { id?: string }) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = React.createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ListingToast[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const notify = React.useCallback(
    (toast: Omit<ListingToast, "id"> & { id?: string }) => {
      const id = toast.id ?? `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { ...toast, id }]);
      window.setTimeout(() => dismiss(id), 3200);
    },
    [dismiss]
  );

  return (
    <NotificationContext.Provider value={{ toasts, notify, dismiss }}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-[1400] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "rounded-2xl border bg-card px-4 py-3 shadow-sm",
              toast.tone === "success" && "border-primary/30",
              toast.tone === "error" && "border-destructive/40",
              toast.tone === "warning" && "border-orange-300"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description ? (
                  <p className="text-xs text-muted-foreground mt-0.5">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useListingNotifications() {
  const ctx = React.useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useListingNotifications must be used within NotificationProvider");
  }
  return ctx;
}
