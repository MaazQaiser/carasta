"use client";

import React, { useState } from "react";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { AuthShell } from "@/components/auth/AuthShell";
import { brand } from "@/theme/carastaTheme";

export function ForgotUsernameClient() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthShell
      title="Forgot username"
      subtitle="Enter your email and we'll send the username linked to your account."
    >
      {sent ? (
        <Stack spacing={2}>
          <Alert severity="success">
            If an account exists for <strong>{email}</strong>, your username is on its way.
          </Alert>
          <Button component={Link} href="/sign-in" fullWidth variant="contained" color="secondary">
            Back to Login
          </Button>
        </Stack>
      ) : (
        <Stack component="form" spacing={2} onSubmit={onSubmit} noValidate>
          <TextField
            fullWidth
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
            helperText={error}
            autoComplete="email"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Recover username"}
          </Button>
          <Typography variant="body2" sx={{ textAlign: "center", color: brand.muted }}>
            <Typography
              component={Link}
              href="/sign-in"
              variant="body2"
              sx={{ color: brand.primary, fontWeight: 700, display: "inline" }}
            >
              Back to Login
            </Typography>
          </Typography>
        </Stack>
      )}
    </AuthShell>
  );
}
