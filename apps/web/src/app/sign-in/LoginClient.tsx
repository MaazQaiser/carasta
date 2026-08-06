"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { PasswordField } from "@/components/auth/PasswordField";
import { SsoButtons, type SsoProvider } from "@/components/auth/SsoButtons";
import { useAuth } from "@/lib/context/auth-context";
import { brand } from "@/theme/carastaTheme";

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, returnTo, setReturnTo } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; severity: "success" | "error" } | null>(null);

  const redirectAfterAuth = () => {
    const redirect = searchParams.get("redirect") || returnTo || "/";
    setReturnTo(null);
    router.push(redirect);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    if (!username.trim()) {
      setUsernameError("Please enter your username");
      valid = false;
    } else {
      setUsernameError("");
    }
    if (!password) {
      setPasswordError("Please enter your password");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (!valid) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      // Mock auth: any non-empty credentials succeed except explicit "fail"
      if (username.trim().toLowerCase() === "fail" || password === "fail") {
        setToast({ message: "Invalid credentials", severity: "error" });
        return;
      }
      signIn("user-me");
      setToast({ message: "Login Successful", severity: "success" });
      window.setTimeout(redirectAfterAuth, 600);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    router.push(searchParams.get("redirect") || returnTo || "/");
  };

  const handleSso = (_provider: SsoProvider, _isNew: boolean) => {
    signIn("user-me");
    setToast({ message: "Login Successful", severity: "success" });
    window.setTimeout(redirectAfterAuth, 400);
  };

  return (
    <>
      <AuthShell title="Login" subtitle="Welcome back! Please login to continue.">
        <Stack component="form" spacing={2} onSubmit={handleLogin} noValidate>
          <TextField
            fullWidth
            label="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!usernameError}
            helperText={usernameError}
            disabled={loading}
            autoComplete="username"
            placeholder="username or you@email.com"
          />
          <PasswordField
            value={password}
            onChange={setPassword}
            error={!!passwordError}
            helperText={passwordError}
            disabled={loading}
          />

          <Stack direction="row" sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: 1, mt: -0.5 }}>
            <Typography
              component={Link}
              href="/forgot-username"
              variant="caption"
              sx={{ color: brand.primary, fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
            >
              Forgot Username?
            </Typography>
            <Typography
              component={Link}
              href="/forgot-password"
              variant="caption"
              sx={{ color: brand.primary, fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
            >
              Forgot/Reset Password?
            </Typography>
          </Stack>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            disabled={loading}
            sx={{ mt: 1, py: 1.35, fontWeight: 700 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Login"}
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center", color: brand.muted }}>
            Don&apos;t have an account?{" "}
            <Typography
              component={Link}
              href="/sign-up"
              variant="body2"
              sx={{ color: brand.primary, fontWeight: 700, display: "inline" }}
            >
              Sign up
            </Typography>
          </Typography>

          <AuthDivider />
          <SsoButtons onSuccess={handleSso} />

          <Button
            fullWidth
            variant="text"
            sx={{ color: brand.muted, fontSize: 13 }}
            onClick={handleContinueAsGuest}
          >
            Continue as Guest
          </Button>
        </Stack>
      </AuthShell>

      <Snackbar
        open={!!toast}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast?.severity ?? "info"} onClose={() => setToast(null)} variant="filled">
          {toast?.message}
        </Alert>
      </Snackbar>
    </>
  );
}
