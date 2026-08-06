"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { SsoButtons, type SsoProvider } from "@/components/auth/SsoButtons";
import { SsoRoleModal, type AccountType } from "@/components/auth/SsoRoleModal";
import { useAuth } from "@/lib/context/auth-context";
import { brand } from "@/theme/carastaTheme";

export function WelcomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, returnTo, setReturnTo } = useAuth();
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [ssoError, setSsoError] = useState<string | null>(null);

  useEffect(() => {
    const redirect = searchParams.get("redirect");
    if (redirect) setReturnTo(redirect);
  }, [searchParams, setReturnTo]);

  const goHome = () => {
    const redirect = returnTo || "/";
    setReturnTo(null);
    router.push(redirect);
  };

  const handleSso = (_provider: SsoProvider, isNewUser: boolean) => {
    if (isNewUser) {
      setRoleModalOpen(true);
      return;
    }
    signIn("user-me");
    goHome();
  };

  const handleRoleSelect = (type: AccountType) => {
    setRoleModalOpen(false);
    signIn("user-me");
    router.push(`/sign-up/flow?type=${type}&from=sso`);
  };

  const flowHref = (type: AccountType) => {
    const redirect = searchParams.get("redirect");
    const base = `/sign-up/flow?type=${type}`;
    return redirect ? `${base}&redirect=${encodeURIComponent(redirect)}` : base;
  };

  return (
    <>
      <AuthShell
        title="Welcome to Carasta"
        subtitle="Create a new account to bid, list, and join the Carmunity."
      >
        <Stack spacing={1.75}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<StorefrontOutlinedIcon />}
            onClick={() => router.push(flowHref("dealership"))}
            sx={{ py: 1.5, fontWeight: 700, justifyContent: "flex-start" }}
          >
            Signup as a dealership
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<PersonOutlineIcon />}
            onClick={() => router.push(flowHref("individual"))}
            sx={{
              py: 1.5,
              fontWeight: 700,
              justifyContent: "flex-start",
              bgcolor: brand.ink,
              "&:hover": { bgcolor: "#000" },
            }}
          >
            Signup as an individual
          </Button>

          <AuthDivider />

          <SsoButtons
            treatAsNewUser
            onSuccess={handleSso}
            onError={(msg) => {
              setSsoError(msg);
              window.setTimeout(() => setSsoError(null), 3500);
            }}
          />

          <Typography variant="caption" sx={{ color: brand.muted, textAlign: "center", display: "block" }}>
            New? We&apos;ll ask your account type after sign-in.
          </Typography>

          {ssoError && (
            <Typography variant="caption" sx={{ color: brand.primary, fontWeight: 600, textAlign: "center" }}>
              {ssoError}
            </Typography>
          )}

          <AuthDivider label="OR" />

          <Button
            component={Link}
            href="/sign-in"
            fullWidth
            variant="outlined"
            size="large"
            sx={{ py: 1.25, fontWeight: 700 }}
          >
            Log in to your account
          </Button>
        </Stack>
      </AuthShell>

      <SsoRoleModal open={roleModalOpen} onSelect={handleRoleSelect} />
    </>
  );
}
