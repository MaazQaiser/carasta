"use client";

import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { brand } from "@/theme/carastaTheme";

export type SsoProvider = "google" | "apple" | "facebook";

interface SsoButtonsProps {
  onSuccess: (provider: SsoProvider, isNewUser: boolean) => void;
  onError?: (message: string) => void;
  /** When true, SSO is treated as a new-user signup path */
  treatAsNewUser?: boolean;
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden fill={brand.ink}>
      <path d="M16.365 1.43c0 1.14-.42 2.21-1.18 3.03-.8.87-2.12 1.54-3.22 1.45-.14-1.1.4-2.25 1.14-3.07.8-.88 2.2-1.52 3.26-1.41zM20.9 17.4c-.55 1.27-.81 1.84-1.52 2.96-1 1.56-2.4 3.5-4.14 3.52-1.55.02-1.95-1.01-4.06-1-2.1.01-2.55 1.03-4.1 1.01-1.74-.02-3.07-1.77-4.07-3.33C1.3 17.7-.4 12.8 1.66 9.4c1.03-1.68 2.67-2.74 4.52-2.77 1.68-.03 3.26 1.13 4.06 1.13.8 0 2.7-1.4 4.55-1.19.77.03 2.94.31 4.33 2.34-3.7 2.03-3.1 7.32.78 8.49z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.41 18.63.04 12 .04S0 5.41 0 12.07c0 6 4.39 10.98 10.13 11.89v-8.41H7.08v-3.48h3.05V9.41c0-3.02 1.8-4.7 4.56-4.7 1.32 0 2.7.24 2.7.24v2.97h-1.52c-1.5 0-1.97.93-1.97 1.89v2.27h3.35l-.54 3.48h-2.81v8.41C19.61 23.05 24 18.07 24 12.07z"
      />
    </svg>
  );
}

const PROVIDERS: { id: SsoProvider; label: string; icon: React.ReactNode }[] = [
  { id: "google", label: "Continue with Google", icon: <GoogleIcon /> },
  { id: "apple", label: "Continue with Apple", icon: <AppleIcon /> },
  { id: "facebook", label: "Continue with Facebook", icon: <FacebookIcon /> },
];

export function SsoButtons({ onSuccess, onError, treatAsNewUser = false }: SsoButtonsProps) {
  const [loading, setLoading] = useState<SsoProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async (provider: SsoProvider) => {
    setError(null);
    setLoading(provider);
    try {
      await new Promise((r) => setTimeout(r, 900));
      // Mock: occasional failure if user double-clicks rapidly is skipped;
      // treat Welcome SSO as new user, Login SSO as existing.
      onSuccess(provider, treatAsNewUser);
    } catch {
      const msg = "Sign-in failed. Please try again.";
      setError(msg);
      onError?.(msg);
      window.setTimeout(() => setError(null), 3500);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Stack spacing={1.25} sx={{ alignItems: "center" }}>
      <Stack direction="row" spacing={1.5} sx={{ justifyContent: "center" }}>
        {PROVIDERS.map(({ id, label, icon }) => (
          <Tooltip key={id} title={label}>
            <span>
              <IconButton
                aria-label={label}
                onClick={() => handleClick(id)}
                disabled={!!loading}
                sx={{
                  width: 48,
                  height: 48,
                  border: `1px solid ${brand.border}`,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "&:hover": { bgcolor: brand.softer, borderColor: brand.ink },
                }}
              >
                {loading === id ? <CircularProgress size={18} color="inherit" /> : icon}
              </IconButton>
            </span>
          </Tooltip>
        ))}
      </Stack>
      {error && (
        <Typography variant="caption" sx={{ color: brand.primary, fontWeight: 600 }}>
          {error}
        </Typography>
      )}
    </Stack>
  );
}
